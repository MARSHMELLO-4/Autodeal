package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.autodeal.ShreeGaneshAutodeal.domain.Category;
import com.autodeal.ShreeGaneshAutodeal.domain.DocumentType;
import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
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
import com.autodeal.ShreeGaneshAutodeal.repository.SaleRecordRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleDocumentRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleImageRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

	@Mock
	private VehicleRepository vehicleRepository;

	@Mock
	private VehicleDocumentRepository documentRepository;

	@Mock
	private SaleRecordRepository saleRecordRepository;

	@Mock
	private CategoryService categoryService;

	@Mock
	private SupabaseStorageService storageService;

	@Mock
	private VehicleImageRepository vehicleImageRepository;

	@Mock
	private LLMService llmService;

	@InjectMocks
	private VehicleService vehicleService;

	private Category testCategory;
	private Vehicle testVehicle;

	@BeforeEach
	void setUp() {
		testCategory = new Category();
		testCategory.setId(1L);
		testCategory.setName("Motorcycles");
		testCategory.setSlug("motorcycles");

		testVehicle = new Vehicle();
		testVehicle.setId(100L);
		testVehicle.setTitle("Royal Enfield Classic 350");
		testVehicle.setRegistrationNumber("MH12AB1234");
		testVehicle.setBrand("Royal Enfield");
		testVehicle.setModelName("Classic 350");
		testVehicle.setVariantName("Signals");
		testVehicle.setManufactureYear(2022);
		testVehicle.setRegistrationYear(2022);
		testVehicle.setKilometersDriven(12000);
		testVehicle.setFuelType(FuelType.PETROL);
		testVehicle.setOwnerSerial(1);
		testVehicle.setColor("Desert Sand");
		testVehicle.setPrice(new BigDecimal("185000.00"));
		testVehicle.setDescription("Well maintained Classic 350");
		testVehicle.setStatus(VehicleStatus.AVAILABLE);
		testVehicle.setCategory(testCategory);
		testVehicle.setThumbnailUrl("https://example.com/thumb.jpg");
		testVehicle.setLocation("Pune");
	}

	@Nested
	@DisplayName("search Tests")
	class SearchTests {

		@Test
		@DisplayName("Should apply default updatedAt DESC sort when pageable is unsorted")
		void shouldApplyDefaultSortWhenUnsorted() {
			Pageable unsorted = PageRequest.of(0, 10);
			Page<Vehicle> vehiclePage = new PageImpl<>(List.of(testVehicle), unsorted, 1);

			when(vehicleRepository.findAll(any(Specification.class), any(Pageable.class)))
					.thenReturn(vehiclePage);

			Page<VehicleSummaryResponse> result = vehicleService.search(
					"Classic", "motorcycles", VehicleStatus.AVAILABLE,
					new BigDecimal("100000"), new BigDecimal("200000"), unsorted);

			assertThat(result).hasSize(1);
			assertThat(result.getContent().get(0).title()).isEqualTo("Royal Enfield Classic 350");

			ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
			verify(vehicleRepository).findAll(any(Specification.class), pageableCaptor.capture());

			Pageable passedPageable = pageableCaptor.getValue();
			assertThat(passedPageable.getSort().getOrderFor("updatedAt")).isNotNull();
			assertThat(passedPageable.getSort().getOrderFor("updatedAt").getDirection())
					.isEqualTo(Sort.Direction.DESC);
		}

		@Test
		@DisplayName("Should preserve custom sort when pageable is sorted")
		void shouldPreserveCustomSort() {
			Pageable sorted = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "price"));
			Page<Vehicle> vehiclePage = new PageImpl<>(List.of(testVehicle), sorted, 1);

			when(vehicleRepository.findAll(any(Specification.class), eq(sorted)))
					.thenReturn(vehiclePage);

			Page<VehicleSummaryResponse> result = vehicleService.search(
					null, null, null, null, null, sorted);

			assertThat(result).hasSize(1);
			verify(vehicleRepository).findAll(any(Specification.class), eq(sorted));
		}
	}

	@Nested
	@DisplayName("getPublicDetail & getAdminDetail Tests")
	class DetailTests {

		@Test
		@DisplayName("getPublicDetail should exclude private documents and sales")
		void getPublicDetailShouldExcludePrivateData() {
			VehicleDocument doc = new VehicleDocument();
			doc.setId(1L);
			doc.setType(DocumentType.RC);
			doc.setTitle("RC Document");
			testVehicle.addDocument(doc);

			SaleRecord sale = new SaleRecord();
			sale.setId(1L);
			sale.setSalePrice(new BigDecimal("180000"));
			sale.setBuyerName("John Doe");
			testVehicle.addSale(sale);

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));

			VehicleDetailResponse response = vehicleService.getPublicDetail(100L);

			assertThat(response).isNotNull();
			assertThat(response.title()).isEqualTo("Royal Enfield Classic 350");
			assertThat(response.documents()).isEmpty();
			assertThat(response.sales()).isEmpty();
		}

		@Test
		@DisplayName("getAdminDetail should include documents and sales")
		void getAdminDetailShouldIncludePrivateData() {
			VehicleDocument doc = new VehicleDocument();
			doc.setId(1L);
			doc.setType(DocumentType.RC);
			doc.setTitle("RC Document");
			doc.setFileUrl("https://example.com/rc.pdf");
			testVehicle.addDocument(doc);

			SaleRecord sale = new SaleRecord();
			sale.setId(1L);
			sale.setSalePrice(new BigDecimal("180000"));
			sale.setBuyerName("John Doe");
			testVehicle.addSale(sale);

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));

			VehicleDetailResponse response = vehicleService.getAdminDetail(100L);

			assertThat(response).isNotNull();
			assertThat(response.documents()).hasSize(1);
			assertThat(response.documents().get(0).title()).isEqualTo("RC Document");
			assertThat(response.sales()).hasSize(1);
			assertThat(response.sales().get(0).buyerName()).isEqualTo("John Doe");
		}

		@Test
		@DisplayName("Should throw EntityNotFoundException when vehicle not found")
		void shouldThrowExceptionWhenNotFound() {
			when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> vehicleService.getPublicDetail(999L))
					.isInstanceOf(EntityNotFoundException.class)
					.hasMessageContaining("Vehicle not found: 999");
		}
	}

	@Nested
	@DisplayName("create Tests")
	class CreateTests {

		@Test
		@DisplayName("Should create vehicle with AI description and fallback thumbnail")
		void shouldCreateVehicleSuccessfully() {
			VehicleRequest request = new VehicleRequest(
					"Honda Activa 6G", "MH14CD5678", "Honda", "Activa 6G", "Deluxe",
					2023, 2023, 5000, FuelType.PETROL, 1, "White",
					new BigDecimal("75000"), null, VehicleStatus.AVAILABLE, 1L,
					null, "Pune",
					List.of(
							new VehicleImageRequest("https://example.com/img2.jpg", "Back", 2),
							new VehicleImageRequest("https://example.com/img1.jpg", "Front", 1)
					)
			);

			when(categoryService.getEntity(1L)).thenReturn(testCategory);
			when(llmService.generateAiDescription(request)).thenReturn("AI generated sales pitch");
			when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(inv -> {
				Vehicle v = inv.getArgument(0);
				v.setId(200L);
				return v;
			});

			VehicleDetailResponse response = vehicleService.create(request);

			assertThat(response).isNotNull();
			assertThat(response.id()).isEqualTo(200L);
			assertThat(response.title()).isEqualTo("Honda Activa 6G");
			assertThat(response.description()).isEqualTo("AI generated sales pitch");
			assertThat(response.thumbnailUrl()).isEqualTo("https://example.com/img1.jpg");
			verify(llmService).generateAiDescription(request);
			verify(vehicleRepository).save(any(Vehicle.class));
		}
	}

	@Nested
	@DisplayName("update Tests")
	class UpdateTests {

		@Test
		@DisplayName("Should update vehicle properties")
		void shouldUpdateVehicleProperties() {
			VehicleRequest request = new VehicleRequest(
					"Updated Title", "MH12AB1234", "Royal Enfield", "Classic 350", "Signals",
					2022, 2022, 15000, FuelType.PETROL, 1, "Black",
					new BigDecimal("190000"), null, VehicleStatus.RESERVED, 1L,
					"https://example.com/custom-thumb.jpg", "Mumbai", null
			);

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));
			when(categoryService.getEntity(1L)).thenReturn(testCategory);
			when(llmService.generateAiDescription(request)).thenReturn("Updated AI description");

			VehicleDetailResponse response = vehicleService.update(100L, request);

			assertThat(response.title()).isEqualTo("Updated Title");
			assertThat(response.price()).isEqualTo(new BigDecimal("190000"));
			assertThat(response.status()).isEqualTo(VehicleStatus.RESERVED);
			assertThat(response.color()).isEqualTo("Black");
			assertThat(response.thumbnailUrl()).isEqualTo("https://example.com/custom-thumb.jpg");
		}
	}

	@Nested
	@DisplayName("delete Tests")
	class DeleteTests {

		@Test
		@DisplayName("Should delete vehicle when found")
		void shouldDeleteVehicleWhenFound() {
			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));

			vehicleService.delete(100L);

			verify(vehicleRepository).delete(testVehicle);
		}
	}

	@Nested
	@DisplayName("uploadDocument Tests")
	class UploadDocumentTests {

		@Test
		@DisplayName("Should upload document and persist entity with formatted title")
		void shouldUploadDocumentSuccessfully() {
			MockMultipartFile file = new MockMultipartFile(
					"file", "rc_document.pdf", "application/pdf", "PDF_DATA".getBytes());
			StoredDocument storedDocument = new StoredDocument(
					"https://supabase.co/rc_document.pdf", "vehicles/100/documents/uuid-rc.pdf",
					"application/pdf", file.getSize());

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));
			when(storageService.uploadVehicleDocument(100L, file)).thenReturn(storedDocument);
			when(documentRepository.save(any(VehicleDocument.class))).thenAnswer(inv -> {
				VehicleDocument doc = inv.getArgument(0);
				doc.setId(10L);
				return doc;
			});

			VehicleDocumentResponse response = vehicleService.uploadDocument(
					100L, DocumentType.RC, "Custom Title", file);

			assertThat(response).isNotNull();
			assertThat(response.id()).isEqualTo(10L);
			assertThat(response.vehicleId()).isEqualTo(100L);
			assertThat(response.type()).isEqualTo(DocumentType.RC);
			assertThat(response.title()).isEqualTo("Royal Enfield Classic 350 MH12AB1234 - RC");
			assertThat(response.fileUrl()).isEqualTo("https://supabase.co/rc_document.pdf");
			verify(storageService).uploadVehicleDocument(100L, file);
		}

		@Test
		@DisplayName("Should default type to OTHER when null")
		void shouldDefaultTypeToOtherWhenNull() {
			MockMultipartFile file = new MockMultipartFile(
					"file", "misc.pdf", "application/pdf", "PDF_DATA".getBytes());
			StoredDocument storedDocument = new StoredDocument(
					"https://supabase.co/misc.pdf", "vehicles/100/documents/uuid-misc.pdf",
					"application/pdf", file.getSize());

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));
			when(storageService.uploadVehicleDocument(100L, file)).thenReturn(storedDocument);
			when(documentRepository.save(any(VehicleDocument.class))).thenAnswer(inv -> {
				VehicleDocument doc = inv.getArgument(0);
				doc.setId(11L);
				return doc;
			});

			VehicleDocumentResponse response = vehicleService.uploadDocument(100L, null, null, file);

			assertThat(response.type()).isEqualTo(DocumentType.OTHER);
			assertThat(response.title()).isEqualTo("Royal Enfield Classic 350 MH12AB1234 - OTHER");
		}
	}

	@Nested
	@DisplayName("uploadImages Tests")
	class UploadImagesTests {

		@Test
		@DisplayName("Should upload images and set thumbnail if none existed")
		void shouldUploadImagesSuccessfully() {
			testVehicle.setThumbnailUrl(null);
			MockMultipartFile file1 = new MockMultipartFile(
					"files", "photo1.jpg", "image/jpeg", "IMG_BYTES_1".getBytes());
			MockMultipartFile file2 = new MockMultipartFile(
					"files", "photo2.jpg", "image/jpeg", "IMG_BYTES_2".getBytes());

			StoredDocument stored1 = new StoredDocument(
					"https://supabase.co/p1.jpg", "vehicles/100/images/p1.jpg", "image/jpeg", 100);
			StoredDocument stored2 = new StoredDocument(
					"https://supabase.co/p2.jpg", "vehicles/100/images/p2.jpg", "image/jpeg", 100);

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));
			when(storageService.uploadVehicleImage(100L, file1)).thenReturn(stored1);
			when(storageService.uploadVehicleImage(100L, file2)).thenReturn(stored2);

			List<VehicleImageResponse> responses = vehicleService.uploadImages(
					100L, List.of(file1, file2), 0, "Photo alt");

			assertThat(responses).hasSize(2);
			assertThat(testVehicle.getThumbnailUrl()).isEqualTo("https://supabase.co/p1.jpg");
			verify(vehicleRepository).saveAndFlush(testVehicle);
		}

		@Test
		@DisplayName("Should throw IllegalArgumentException when files list is empty")
		void shouldThrowExceptionWhenFilesEmpty() {
			assertThatThrownBy(() -> vehicleService.uploadImages(100L, List.of(), 0, "alt"))
					.isInstanceOf(IllegalArgumentException.class)
					.hasMessage("At least one bike photo is required");

			assertThatThrownBy(() -> vehicleService.uploadImages(100L, null, 0, "alt"))
					.isInstanceOf(IllegalArgumentException.class)
					.hasMessage("At least one bike photo is required");
		}
	}

	@Nested
	@DisplayName("getVehicleImages & getDocuments Tests")
	class DocumentAndImageListingTests {

		@Test
		@DisplayName("getVehicleImages should return images when vehicle exists")
		void getVehicleImagesShouldReturnImages() {
			VehicleImage img = new VehicleImage();
			img.setId(1L);
			img.setImageUrl("https://example.com/img1.jpg");
			img.setAltText("Front");
			img.setDisplayOrder(0);

			when(vehicleRepository.existsById(100L)).thenReturn(true);
			when(vehicleImageRepository.findByVehicleIdOrderByDisplayOrderAsc(100L))
					.thenReturn(List.of(img));

			List<VehicleImageResponse> results = vehicleService.getVehicleImages(100L);

			assertThat(results).hasSize(1);
			assertThat(results.get(0).imageUrl()).isEqualTo("https://example.com/img1.jpg");
		}

		@Test
		@DisplayName("getVehicleImages should throw EntityNotFoundException when vehicle does not exist")
		void getVehicleImagesShouldThrowWhenVehicleNotFound() {
			when(vehicleRepository.existsById(999L)).thenReturn(false);

			assertThatThrownBy(() -> vehicleService.getVehicleImages(999L))
					.isInstanceOf(EntityNotFoundException.class)
					.hasMessageContaining("Vehicle not found: 999");
		}

		@Test
		@DisplayName("getDocuments should return documents when vehicle exists")
		void getDocumentsShouldReturnDocuments() {
			VehicleDocument doc = new VehicleDocument();
			doc.setId(1L);
			doc.setVehicle(testVehicle);
			doc.setType(DocumentType.INSURANCE);
			doc.setTitle("Insurance Policy");

			when(vehicleRepository.existsById(100L)).thenReturn(true);
			when(documentRepository.findByVehicleIdOrderByUploadedAtDesc(100L))
					.thenReturn(List.of(doc));

			List<VehicleDocumentResponse> results = vehicleService.getDocuments(100L);

			assertThat(results).hasSize(1);
			assertThat(results.get(0).title()).isEqualTo("Insurance Policy");
		}

		@Test
		@DisplayName("getDocuments should throw EntityNotFoundException when vehicle does not exist")
		void getDocumentsShouldThrowWhenVehicleNotFound() {
			when(vehicleRepository.existsById(999L)).thenReturn(false);

			assertThatThrownBy(() -> vehicleService.getDocuments(999L))
					.isInstanceOf(EntityNotFoundException.class)
					.hasMessageContaining("Vehicle not found: 999");
		}

		@Test
		@DisplayName("deleteDocument should delete when found")
		void deleteDocumentShouldDeleteWhenFound() {
			VehicleDocument doc = new VehicleDocument();
			doc.setId(5L);
			when(documentRepository.findById(5L)).thenReturn(Optional.of(doc));

			vehicleService.deleteDocument(5L);

			verify(documentRepository).delete(doc);
		}

		@Test
		@DisplayName("deleteDocument should throw when not found")
		void deleteDocumentShouldThrowWhenNotFound() {
			when(documentRepository.findById(55L)).thenReturn(Optional.empty());

			assertThatThrownBy(() -> vehicleService.deleteDocument(55L))
					.isInstanceOf(EntityNotFoundException.class)
					.hasMessageContaining("Document not found: 55");
		}
	}

	@Nested
	@DisplayName("markSold Tests")
	class MarkSoldTests {

		@Test
		@DisplayName("Should mark vehicle as sold and create sale record")
		void shouldMarkVehicleAsSold() {
			SaleRecordRequest request = new SaleRecordRequest(
					new BigDecimal("180000"), LocalDate.of(2026, 8, 20),
					"Rahul Sharma", "9876543210", "Cash payment");

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));
			when(saleRecordRepository.save(any(SaleRecord.class))).thenAnswer(inv -> {
				SaleRecord sr = inv.getArgument(0);
				sr.setId(50L);
				return sr;
			});

			SaleRecordResponse response = vehicleService.markSold(100L, request);

			assertThat(response).isNotNull();
			assertThat(response.id()).isEqualTo(50L);
			assertThat(response.salePrice()).isEqualTo(new BigDecimal("180000"));
			assertThat(response.buyerName()).isEqualTo("Rahul Sharma");
			assertThat(testVehicle.getStatus()).isEqualTo(VehicleStatus.SOLD);
			verify(saleRecordRepository).save(any(SaleRecord.class));
		}

		@Test
		@DisplayName("Should throw IllegalArgumentException when vehicle is already SOLD and has sales")
		void shouldThrowWhenVehicleAlreadySold() {
			testVehicle.setStatus(VehicleStatus.SOLD);
			SaleRecord existingSale = new SaleRecord();
			existingSale.setId(1L);
			testVehicle.addSale(existingSale);

			SaleRecordRequest request = new SaleRecordRequest(
					new BigDecimal("180000"), LocalDate.now(), "Buyer", "123", "Notes");

			when(vehicleRepository.findById(100L)).thenReturn(Optional.of(testVehicle));

			assertThatThrownBy(() -> vehicleService.markSold(100L, request))
					.isInstanceOf(IllegalArgumentException.class)
					.hasMessage("Vehicle is already marked as sold");

			verify(saleRecordRepository, never()).save(any());
		}
	}

	@Nested
	@DisplayName("salesReport Tests")
	class SalesReportTests {

		@Test
		@DisplayName("Should compute total revenue, average, and status counts")
		void shouldComputeSalesReportCorrectly() {
			SaleRecord sale1 = new SaleRecord();
			sale1.setId(1L);
			sale1.setVehicle(testVehicle);
			sale1.setSalePrice(new BigDecimal("100000.00"));
			sale1.setSaleDate(LocalDate.of(2026, 8, 1));

			SaleRecord sale2 = new SaleRecord();
			sale2.setId(2L);
			sale2.setVehicle(testVehicle);
			sale2.setSalePrice(new BigDecimal("200000.00"));
			sale2.setSaleDate(LocalDate.of(2026, 8, 15));

			LocalDate from = LocalDate.of(2026, 8, 1);
			LocalDate to = LocalDate.of(2026, 8, 31);

			when(saleRecordRepository.findReportRows(from, to)).thenReturn(List.of(sale1, sale2));
			when(vehicleRepository.countByStatus(VehicleStatus.AVAILABLE)).thenReturn(10L);
			when(vehicleRepository.countByStatus(VehicleStatus.RESERVED)).thenReturn(2L);
			when(vehicleRepository.countByStatus(VehicleStatus.SOLD)).thenReturn(5L);

			SalesReportResponse report = vehicleService.salesReport(from, to);

			assertThat(report.totalRevenue()).isEqualByComparingTo("300000.00");
			assertThat(report.totalVehiclesSold()).isEqualTo(2);
			assertThat(report.averageSalePrice()).isEqualByComparingTo("150000.00");
			assertThat(report.availableVehicles()).isEqualTo(10);
			assertThat(report.reservedVehicles()).isEqualTo(2);
			assertThat(report.soldVehicles()).isEqualTo(5);
			assertThat(report.sales()).hasSize(2);
		}

		@Test
		@DisplayName("Should return zeros when no sales found")
		void shouldReturnZerosWhenNoSales() {
			when(saleRecordRepository.findReportRows(null, null)).thenReturn(List.of());
			when(vehicleRepository.countByStatus(VehicleStatus.AVAILABLE)).thenReturn(3L);
			when(vehicleRepository.countByStatus(VehicleStatus.RESERVED)).thenReturn(0L);
			when(vehicleRepository.countByStatus(VehicleStatus.SOLD)).thenReturn(0L);

			SalesReportResponse report = vehicleService.salesReport(null, null);

			assertThat(report.totalRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
			assertThat(report.totalVehiclesSold()).isEqualTo(0);
			assertThat(report.averageSalePrice()).isEqualByComparingTo(BigDecimal.ZERO);
			assertThat(report.availableVehicles()).isEqualTo(3);
			assertThat(report.sales()).isEmpty();
		}
	}
}
