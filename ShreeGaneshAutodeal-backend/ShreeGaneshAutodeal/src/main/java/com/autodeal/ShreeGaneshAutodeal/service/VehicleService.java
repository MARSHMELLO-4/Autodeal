package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.domain.Category;
import com.autodeal.ShreeGaneshAutodeal.domain.DocumentType;
import com.autodeal.ShreeGaneshAutodeal.domain.SaleRecord;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleDocument;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleImage;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import com.autodeal.ShreeGaneshAutodeal.dto.SaleRecordRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.SaleRecordResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.SalesReportResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDetailResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDocumentResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleImageRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleImageResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleSummaryResponse;
import com.autodeal.ShreeGaneshAutodeal.repository.*;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class VehicleService {

	private final VehicleRepository vehicleRepository;
	private final VehicleDocumentRepository documentRepository;
	private final SaleRecordRepository saleRecordRepository;
	private final CategoryService categoryService;
	private final SupabaseStorageService storageService;
	private final VehicleImageRepository vehicleImageRepository;

	public VehicleService(VehicleRepository vehicleRepository, VehicleDocumentRepository documentRepository,
			SaleRecordRepository saleRecordRepository, CategoryService categoryService, SupabaseStorageService storageService, VehicleImageRepository vehicleImageRepository ) {
		this.vehicleRepository = vehicleRepository;
		this.documentRepository = documentRepository;
		this.saleRecordRepository = saleRecordRepository;
		this.categoryService = categoryService;
		this.storageService = storageService;
		this.vehicleImageRepository = vehicleImageRepository;
	}

	@Transactional(readOnly = true)
	public Page<VehicleSummaryResponse> search(String search, String categorySlug, VehicleStatus status,
			BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
		Pageable effectivePageable = pageable.getSort().isSorted()
				? pageable
				: PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "updatedAt"));
		return vehicleRepository.findAll(
				VehicleSpecifications.matches(search, categorySlug, status, minPrice, maxPrice),
				effectivePageable)
				.map(VehicleService::toSummary);
	}

	@Transactional(readOnly = true)
	public VehicleDetailResponse getPublicDetail(Long id) {
		return toDetail(getEntity(id), false);
	}

	@Transactional(readOnly = true)
	public VehicleDetailResponse getAdminDetail(Long id) {
		return toDetail(getEntity(id), true);
	}

	public VehicleDetailResponse create(VehicleRequest request) {
		Vehicle vehicle = new Vehicle();
		apply(vehicle, request);
		return toDetail(vehicleRepository.save(vehicle), true);
	}

	public VehicleDetailResponse update(Long id, VehicleRequest request) {
		Vehicle vehicle = getEntity(id);
		apply(vehicle, request);
		return toDetail(vehicle, true);
	}

	public void delete(Long id) {
		vehicleRepository.delete(getEntity(id));
	}

	public VehicleDocumentResponse uploadDocument(Long vehicleId, DocumentType type, String title, MultipartFile file) {
		Vehicle vehicle = getEntity(vehicleId);
		StoredDocument storedDocument = storageService.uploadVehicleDocument(vehicleId, file);
		VehicleDocument document = new VehicleDocument();
		document.setVehicle(vehicle);
		document.setType(type == null ? DocumentType.OTHER : type);
		document.setTitle(title == null || title.isBlank() ? defaultDocumentTitle(file) : title.trim());
		document.setFileUrl(storedDocument.fileUrl());
		document.setStoragePath(storedDocument.storagePath());
		document.setContentType(storedDocument.contentType());
		document.setFileSize(storedDocument.fileSize());
		return toDocumentResponse(documentRepository.save(document));
	}

	public List<VehicleImageResponse> uploadImages(Long vehicleId, List<MultipartFile> files, Integer startOrder,
			String altText) {
		System.out.println("request came till service");
		if (files == null || files.isEmpty()) {
			throw new IllegalArgumentException("At least one bike photo is required");
		}
		Vehicle vehicle = getEntity(vehicleId);
		boolean hadImages = !vehicle.getImages().isEmpty();
		int nextOrder = startOrder == null ? nextImageOrder(vehicle) : Math.max(startOrder, 0);
		List<VehicleImage> uploadedImages = new ArrayList<>();
		for (MultipartFile file : files) {
			StoredDocument storedImage = storageService.uploadVehicleImage(vehicleId, file);
			VehicleImage image = new VehicleImage();
			image.setImageUrl(storedImage.fileUrl());
			image.setAltText(CategoryService.blankToNull(altText) == null ? vehicle.getTitle() : altText.trim());
			image.setDisplayOrder(nextOrder++);
			vehicle.addImage(image);
			uploadedImages.add(image);
		}
		if (!uploadedImages.isEmpty() && (!hadImages || CategoryService.blankToNull(vehicle.getThumbnailUrl()) == null)) {
			vehicle.setThumbnailUrl(uploadedImages.get(0).getImageUrl());
		}
		vehicleRepository.saveAndFlush(vehicle);
		return uploadedImages.stream()
				.sorted(Comparator.comparing(VehicleImage::getDisplayOrder).thenComparing(VehicleImage::getId))
				.map(VehicleService::toImageResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<VehicleImageResponse> getVehicleImages(Long vehicleId) {

		if (!vehicleRepository.existsById(vehicleId)) {
			throw new EntityNotFoundException(
					"Vehicle not found: " + vehicleId);
		}

		return vehicleImageRepository
				.findByVehicleIdOrderByDisplayOrderAsc(vehicleId)
				.stream()
				.map(VehicleService::toImageResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<VehicleDocumentResponse> getDocuments(Long vehicleId) {
		if (!vehicleRepository.existsById(vehicleId)) {
			throw new EntityNotFoundException("Vehicle not found: " + vehicleId);
		}
		return documentRepository.findByVehicleIdOrderByUploadedAtDesc(vehicleId).stream()
				.map(VehicleService::toDocumentResponse)
				.toList();
	}

	public void deleteDocument(Long documentId) {
		VehicleDocument document = documentRepository.findById(documentId)
				.orElseThrow(() -> new EntityNotFoundException("Document not found: " + documentId));
		documentRepository.delete(document);
	}

	public SaleRecordResponse markSold(Long vehicleId, SaleRecordRequest request) {
		Vehicle vehicle = getEntity(vehicleId);
		if (vehicle.getStatus() == VehicleStatus.SOLD && !vehicle.getSales().isEmpty()) {
			throw new IllegalArgumentException("Vehicle is already marked as sold");
		}
		SaleRecord saleRecord = new SaleRecord();
		saleRecord.setVehicle(vehicle);
		saleRecord.setSalePrice(request.salePrice());
		saleRecord.setSaleDate(request.saleDate() == null ? LocalDate.now() : request.saleDate());
		saleRecord.setBuyerName(CategoryService.blankToNull(request.buyerName()));
		saleRecord.setBuyerPhone(CategoryService.blankToNull(request.buyerPhone()));
		saleRecord.setNotes(CategoryService.blankToNull(request.notes()));
		vehicle.setStatus(VehicleStatus.SOLD);
		vehicle.addSale(saleRecord);
		return toSaleResponse(saleRecordRepository.save(saleRecord));
	}

	@Transactional(readOnly = true)
	public SalesReportResponse salesReport(LocalDate fromDate, LocalDate toDate) {
		List<SaleRecordResponse> rows = saleRecordRepository.findReportRows(fromDate, toDate).stream()
				.map(VehicleService::toSaleResponse)
				.toList();
		BigDecimal totalRevenue = rows.stream()
				.map(SaleRecordResponse::salePrice)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal average = rows.isEmpty()
				? BigDecimal.ZERO
				: totalRevenue.divide(BigDecimal.valueOf(rows.size()), 2, RoundingMode.HALF_UP);
		return new SalesReportResponse(
				totalRevenue,
				rows.size(),
				vehicleRepository.countByStatus(VehicleStatus.AVAILABLE),
				vehicleRepository.countByStatus(VehicleStatus.RESERVED),
				vehicleRepository.countByStatus(VehicleStatus.SOLD),
				average,
				rows);
	}

	private Vehicle getEntity(Long id) {
		return vehicleRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Vehicle not found: " + id));
	}

	private void apply(Vehicle vehicle, VehicleRequest request) {
		Category category = categoryService.getEntity(request.categoryId());
		vehicle.setTitle(request.title().trim());
		vehicle.setRegistrationNumber(CategoryService.blankToNull(request.registrationNumber()));
		vehicle.setBrand(request.brand().trim());
		vehicle.setModelName(request.modelName().trim());
		vehicle.setVariantName(CategoryService.blankToNull(request.variantName()));
		vehicle.setManufactureYear(request.manufactureYear());
		vehicle.setRegistrationYear(request.registrationYear());
		vehicle.setKilometersDriven(request.kilometersDriven());
		vehicle.setFuelType(request.fuelType());
		vehicle.setOwnerSerial(request.ownerSerial());
		vehicle.setColor(CategoryService.blankToNull(request.color()));
		vehicle.setPrice(request.price());
		vehicle.setDescription(CategoryService.blankToNull(request.description()));
		vehicle.setStatus(request.status() == null ? VehicleStatus.AVAILABLE : request.status());
		vehicle.setCategory(category);
		vehicle.setLocation(CategoryService.blankToNull(request.location()));
		List<VehicleImage> images = toImages(request.images());
		vehicle.replaceImages(images);
		String fallbackThumbnail = images.stream()
				.min(Comparator.comparing(VehicleImage::getDisplayOrder))
				.map(VehicleImage::getImageUrl)
				.orElse(null);
		vehicle.setThumbnailUrl(CategoryService.blankToNull(request.thumbnailUrl()) == null
				? fallbackThumbnail
				: request.thumbnailUrl().trim());
	}

	private static List<VehicleImage> toImages(List<VehicleImageRequest> requests) {
		if (requests == null) {
			return List.of();
		}
		return requests.stream()
				.map(request -> {
					VehicleImage image = new VehicleImage();
					image.setImageUrl(request.imageUrl().trim());
					image.setAltText(CategoryService.blankToNull(request.altText()));
					image.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
					return image;
				})
				.toList();
	}

	private static int nextImageOrder(Vehicle vehicle) {
		return vehicle.getImages().stream()
				.map(VehicleImage::getDisplayOrder)
				.filter(order -> order != null)
				.max(Integer::compareTo)
				.map(order -> order + 1)
				.orElse(0);
	}

	private static VehicleSummaryResponse toSummary(Vehicle vehicle) {
		return new VehicleSummaryResponse(
				vehicle.getId(),
				vehicle.getTitle(),
				vehicle.getBrand(),
				vehicle.getModelName(),
				vehicle.getManufactureYear(),
				vehicle.getKilometersDriven(),
				vehicle.getFuelType(),
				vehicle.getPrice(),
				vehicle.getStatus(),
				CategoryService.toResponse(vehicle.getCategory()),
				vehicle.getThumbnailUrl(),
				vehicle.getLocation(),
				vehicle.getUpdatedAt());
	}

	private static VehicleDetailResponse toDetail(Vehicle vehicle, boolean includePrivateData) {
		List<VehicleDocumentResponse> documents = includePrivateData
				? vehicle.getDocuments().stream().map(VehicleService::toDocumentResponse).toList()
				: List.of();
		List<SaleRecordResponse> sales = includePrivateData
				? vehicle.getSales().stream().map(VehicleService::toSaleResponse).toList()
				: List.of();
		return new VehicleDetailResponse(
				vehicle.getId(),
				vehicle.getTitle(),
				vehicle.getRegistrationNumber(),
				vehicle.getBrand(),
				vehicle.getModelName(),
				vehicle.getVariantName(),
				vehicle.getManufactureYear(),
				vehicle.getRegistrationYear(),
				vehicle.getKilometersDriven(),
				vehicle.getFuelType(),
				vehicle.getOwnerSerial(),
				vehicle.getColor(),
				vehicle.getPrice(),
				vehicle.getDescription(),
				vehicle.getStatus(),
				CategoryService.toResponse(vehicle.getCategory()),
				vehicle.getThumbnailUrl(),
				vehicle.getLocation(),
				vehicle.getImages().stream()
						.sorted(Comparator.comparing(VehicleImage::getDisplayOrder).thenComparing(VehicleImage::getId))
						.map(VehicleService::toImageResponse)
						.toList(),
				documents,
				sales,
				vehicle.getCreatedAt(),
				vehicle.getUpdatedAt());
	}

	private static VehicleImageResponse toImageResponse(VehicleImage image) {
		return new VehicleImageResponse(image.getId(), image.getImageUrl(), image.getAltText(), image.getDisplayOrder());
	}

	private static VehicleDocumentResponse toDocumentResponse(VehicleDocument document) {
		return new VehicleDocumentResponse(
				document.getId(),
				document.getVehicle().getId(),
				document.getType(),
				document.getTitle(),
				document.getFileUrl(),
				document.getStoragePath(),
				document.getContentType(),
				document.getFileSize(),
				document.getUploadedAt());
	}

	private static SaleRecordResponse toSaleResponse(SaleRecord saleRecord) {
		return new SaleRecordResponse(
				saleRecord.getId(),
				saleRecord.getVehicle().getId(),
				saleRecord.getVehicle().getTitle(),
				saleRecord.getSalePrice(),
				saleRecord.getSaleDate(),
				saleRecord.getBuyerName(),
				saleRecord.getBuyerPhone(),
				saleRecord.getNotes(),
				saleRecord.getCreatedAt());
	}

	private static String defaultDocumentTitle(MultipartFile file) {
		return file.getOriginalFilename() == null || file.getOriginalFilename().isBlank()
				? "Vehicle document"
				: file.getOriginalFilename();
	}
}
