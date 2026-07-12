package com.autodeal.ShreeGaneshAutodeal.web;

import com.autodeal.ShreeGaneshAutodeal.domain.DocumentType;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.SaleRecordRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.SaleRecordResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.SalesReportResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDetailResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDocumentResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleImageResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleSummaryResponse;
import com.autodeal.ShreeGaneshAutodeal.service.CategoryService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final CategoryService categoryService;
	private final VehicleService vehicleService;

	public AdminController(CategoryService categoryService, VehicleService vehicleService) {
		this.categoryService = categoryService;
		this.vehicleService = vehicleService;
	}

	@GetMapping("/categories")
	public List<CategoryResponse> categories() {
		return categoryService.findAll();
	}

	@PostMapping("/categories")
	@ResponseStatus(HttpStatus.CREATED)
	public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
		return categoryService.create(request);
	}

	@PutMapping("/categories/{id}")
	public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
		return categoryService.update(id, request);
	}

	@DeleteMapping("/categories/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCategory(@PathVariable Long id) {
		categoryService.delete(id);
	}

	@GetMapping("/vehicles")
	public Page<VehicleSummaryResponse> vehicles(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) VehicleStatus status,
			@RequestParam(required = false) BigDecimal minPrice,
			@RequestParam(required = false) BigDecimal maxPrice,
			@PageableDefault(size = 40) Pageable pageable) {
		return vehicleService.search(search, category, status, minPrice, maxPrice, pageable);
	}

	@PostMapping("/vehicles")
	@ResponseStatus(HttpStatus.CREATED)
	public VehicleDetailResponse createVehicle(@Valid @RequestBody VehicleRequest request) {
		return vehicleService.create(request);
	}

	@GetMapping("/vehicles/{id}")
	public VehicleDetailResponse vehicle(@PathVariable Long id) {
		return vehicleService.getAdminDetail(id);
	}

	@PutMapping("/vehicles/{id}")
	public VehicleDetailResponse updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
		return vehicleService.update(id, request);
	}

	@DeleteMapping("/vehicles/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteVehicle(@PathVariable Long id) {
		vehicleService.delete(id);
	}

	@PostMapping("/vehicles/{id}/documents")
	@ResponseStatus(HttpStatus.CREATED)
	public VehicleDocumentResponse uploadVehicleDocument(
			@PathVariable Long id,
			@RequestParam(required = false) DocumentType type,
			@RequestParam(required = false) String title,
			@RequestParam MultipartFile file) {
		return vehicleService.uploadDocument(id, type, title, file);
	}

	@PostMapping("/vehicles/{id}/images")
	@ResponseStatus(HttpStatus.CREATED)
	public List<VehicleImageResponse> uploadVehicleImages(
			@PathVariable Long id,
			@RequestParam("files") List<MultipartFile> files,
			@RequestParam(required = false) Integer startOrder,
			@RequestParam(required = false) String altText) {
		System.out.println("Request came till controller");
		return vehicleService.uploadImages(id, files, startOrder, altText);
	}

	@GetMapping("/vehicles/{id}/documents")
	public List<VehicleDocumentResponse> vehicleDocuments(@PathVariable Long id) {
		return vehicleService.getDocuments(id);
	}

	@DeleteMapping("/documents/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteDocument(@PathVariable Long id) {
		vehicleService.deleteDocument(id);
	}

	@PostMapping("/vehicles/{id}/sales")
	@ResponseStatus(HttpStatus.CREATED)
	public SaleRecordResponse markSold(@PathVariable Long id, @Valid @RequestBody SaleRecordRequest request) {
		return vehicleService.markSold(id, request);
	}

	@GetMapping("/sales/report")
	public SalesReportResponse salesReport(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
		return vehicleService.salesReport(from, to);
	}
}
