package com.autodeal.ShreeGaneshAutodeal.web;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.autodeal.ShreeGaneshAutodeal.domain.DocumentType;
import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
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
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

	@Mock
	private CategoryService categoryService;

	@Mock
	private VehicleService vehicleService;

	@InjectMocks
	private AdminController adminController;

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(adminController)
				.setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
				.setControllerAdvice(new GlobalExceptionHandler())
				.build();
	}

	@Nested
	@DisplayName("Category Endpoints")
	class CategoryEndpoints {

		@Test
		@DisplayName("GET /api/admin/categories should return all categories")
		void shouldReturnAllCategories() throws Exception {
			CategoryResponse cat = new CategoryResponse(
					1L, "Cruiser", "cruiser", "Cruiser bikes", Instant.now(), Instant.now());
			when(categoryService.findAll()).thenReturn(List.of(cat));

			mockMvc.perform(get("/api/admin/categories"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(jsonPath("$[0].name", is("Cruiser")));
		}

		@Test
		@DisplayName("POST /api/admin/categories should create category")
		void shouldCreateCategory() throws Exception {
			CategoryResponse response = new CategoryResponse(
					2L, "Sports", "sports", "Fast bikes", Instant.now(), Instant.now());

			when(categoryService.create(any(CategoryRequest.class))).thenReturn(response);

			String requestJson = """
					{
						"name": "Sports",
						"slug": "sports",
						"description": "Fast bikes"
					}
					""";

			mockMvc.perform(post("/api/admin/categories")
							.contentType(MediaType.APPLICATION_JSON)
							.content(requestJson))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.id", is(2)))
					.andExpect(jsonPath("$.name", is("Sports")));
		}

		@Test
		@DisplayName("PUT /api/admin/categories/{id} should update category")
		void shouldUpdateCategory() throws Exception {
			CategoryResponse response = new CategoryResponse(
					2L, "Sports Modified", "sports", "Updated desc", Instant.now(), Instant.now());

			when(categoryService.update(eq(2L), any(CategoryRequest.class))).thenReturn(response);

			String requestJson = """
					{
						"name": "Sports Modified",
						"slug": "sports",
						"description": "Updated desc"
					}
					""";

			mockMvc.perform(put("/api/admin/categories/2")
							.contentType(MediaType.APPLICATION_JSON)
							.content(requestJson))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.name", is("Sports Modified")));
		}

		@Test
		@DisplayName("DELETE /api/admin/categories/{id} should delete category")
		void shouldDeleteCategory() throws Exception {
			mockMvc.perform(delete("/api/admin/categories/2"))
					.andExpect(status().isNoContent());

			verify(categoryService).delete(2L);
		}
	}

	@Nested
	@DisplayName("Vehicle Endpoints")
	class VehicleEndpoints {

		@Test
		@DisplayName("GET /api/admin/vehicles should return paginated vehicles")
		void shouldReturnPaginatedVehicles() throws Exception {
			CategoryResponse cat = new CategoryResponse(1L, "Bikes", "bikes", null, null, null);
			VehicleSummaryResponse summary = new VehicleSummaryResponse(
					10L, "Royal Enfield Bullet", "Royal Enfield", "Bullet 350",
					2021, 15000, FuelType.PETROL, new BigDecimal("150000"),
					VehicleStatus.AVAILABLE, cat, "https://example.com/bullet.jpg", "Delhi", Instant.now());

			when(vehicleService.search(any(), any(), any(), any(), any(), any()))
					.thenReturn(new PageImpl<>(List.of(summary), PageRequest.of(0, 40), 1));

			mockMvc.perform(get("/api/admin/vehicles"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(jsonPath("$.content[0].title", is("Royal Enfield Bullet")));
		}

		@Test
		@DisplayName("POST /api/admin/vehicles should create vehicle")
		void shouldCreateVehicle() throws Exception {
			CategoryResponse cat = new CategoryResponse(1L, "Bikes", "bikes", null, null, null);
			VehicleDetailResponse response = new VehicleDetailResponse(
					15L, "Yamaha MT-15", "MH12XY1234", "Yamaha", "MT-15", "V2",
					2023, 2023, 8000, FuelType.PETROL, 1, "Metallic Black",
					new BigDecimal("160000"), "Great condition", VehicleStatus.AVAILABLE,
					cat, "https://example.com/mt15.jpg", "Pune", List.of(), List.of(), List.of(),
					Instant.now(), Instant.now());

			when(vehicleService.create(any(VehicleRequest.class))).thenReturn(response);

			String requestJson = """
					{
						"title": "Yamaha MT-15",
						"registrationNumber": "MH12XY1234",
						"brand": "Yamaha",
						"modelName": "MT-15",
						"variantName": "V2",
						"manufactureYear": 2023,
						"registrationYear": 2023,
						"kilometersDriven": 8000,
						"fuelType": "PETROL",
						"ownerSerial": 1,
						"color": "Metallic Black",
						"price": 160000,
						"description": "Great condition",
						"status": "AVAILABLE",
						"categoryId": 1,
						"thumbnailUrl": "https://example.com/mt15.jpg",
						"location": "Pune",
						"images": []
					}
					""";

			mockMvc.perform(post("/api/admin/vehicles")
							.contentType(MediaType.APPLICATION_JSON)
							.content(requestJson))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.id", is(15)))
					.andExpect(jsonPath("$.title", is("Yamaha MT-15")));
		}

		@Test
		@DisplayName("GET /api/admin/vehicles/{id} should return admin vehicle detail")
		void shouldReturnAdminVehicleDetail() throws Exception {
			CategoryResponse cat = new CategoryResponse(1L, "Bikes", "bikes", null, null, null);
			VehicleDetailResponse response = new VehicleDetailResponse(
					15L, "Yamaha MT-15", "MH12XY1234", "Yamaha", "MT-15", "V2",
					2023, 2023, 8000, FuelType.PETROL, 1, "Metallic Black",
					new BigDecimal("160000"), "Great condition", VehicleStatus.AVAILABLE,
					cat, "https://example.com/mt15.jpg", "Pune", List.of(), List.of(), List.of(),
					Instant.now(), Instant.now());

			when(vehicleService.getAdminDetail(15L)).thenReturn(response);

			mockMvc.perform(get("/api/admin/vehicles/15"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.id", is(15)))
					.andExpect(jsonPath("$.title", is("Yamaha MT-15")));
		}

		@Test
		@DisplayName("PUT /api/admin/vehicles/{id} should update vehicle")
		void shouldUpdateVehicle() throws Exception {
			CategoryResponse cat = new CategoryResponse(1L, "Bikes", "bikes", null, null, null);
			VehicleDetailResponse response = new VehicleDetailResponse(
					15L, "Yamaha MT-15 Updated", "MH12XY1234", "Yamaha", "MT-15", "V2",
					2023, 2023, 9000, FuelType.PETROL, 1, "Metallic Black",
					new BigDecimal("155000"), "Updated condition", VehicleStatus.AVAILABLE,
					cat, "https://example.com/mt15.jpg", "Pune", List.of(), List.of(), List.of(),
					Instant.now(), Instant.now());

			when(vehicleService.update(eq(15L), any(VehicleRequest.class))).thenReturn(response);

			String requestJson = """
					{
						"title": "Yamaha MT-15 Updated",
						"registrationNumber": "MH12XY1234",
						"brand": "Yamaha",
						"modelName": "MT-15",
						"variantName": "V2",
						"manufactureYear": 2023,
						"registrationYear": 2023,
						"kilometersDriven": 9000,
						"fuelType": "PETROL",
						"ownerSerial": 1,
						"color": "Metallic Black",
						"price": 155000,
						"description": "Updated condition",
						"status": "AVAILABLE",
						"categoryId": 1,
						"thumbnailUrl": "https://example.com/mt15.jpg",
						"location": "Pune",
						"images": []
					}
					""";

			mockMvc.perform(put("/api/admin/vehicles/15")
							.contentType(MediaType.APPLICATION_JSON)
							.content(requestJson))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.title", is("Yamaha MT-15 Updated")));
		}

		@Test
		@DisplayName("DELETE /api/admin/vehicles/{id} should delete vehicle")
		void shouldDeleteVehicle() throws Exception {
			mockMvc.perform(delete("/api/admin/vehicles/15"))
					.andExpect(status().isNoContent());

			verify(vehicleService).delete(15L);
		}
	}

	@Nested
	@DisplayName("Media and Document Endpoints")
	class MediaAndDocumentEndpoints {

		@Test
		@DisplayName("POST /api/admin/vehicles/{id}/documents should upload document")
		void shouldUploadDocument() throws Exception {
			MockMultipartFile file = new MockMultipartFile(
					"file", "rc.pdf", "application/pdf", "PDF_DATA".getBytes());

			VehicleDocumentResponse response = new VehicleDocumentResponse(
					1L, 15L, DocumentType.RC, "RC Document", "https://supabase.co/rc.pdf",
					"vehicles/15/documents/rc.pdf", "application/pdf", 1024L, Instant.now());

			when(vehicleService.uploadDocument(eq(15L), eq(DocumentType.RC), eq("RC Title"), any()))
					.thenReturn(response);

			mockMvc.perform(multipart("/api/admin/vehicles/15/documents")
							.file(file)
							.param("type", "RC")
							.param("title", "RC Title"))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.id", is(1)))
					.andExpect(jsonPath("$.type", is("RC")));
		}

		@Test
		@DisplayName("POST /api/admin/vehicles/{id}/images should upload vehicle photos")
		void shouldUploadImages() throws Exception {
			MockMultipartFile file1 = new MockMultipartFile(
					"files", "photo1.jpg", "image/jpeg", "IMG1".getBytes());
			MockMultipartFile file2 = new MockMultipartFile(
					"files", "photo2.jpg", "image/jpeg", "IMG2".getBytes());

			VehicleImageResponse img1 = new VehicleImageResponse(1L, "https://supabase.co/1.jpg", "Front", 0);
			VehicleImageResponse img2 = new VehicleImageResponse(2L, "https://supabase.co/2.jpg", "Back", 1);

			when(vehicleService.uploadImages(eq(15L), any(), eq(0), eq("Bike Photos")))
					.thenReturn(List.of(img1, img2));

			mockMvc.perform(multipart("/api/admin/vehicles/15/images")
							.file(file1)
							.file(file2)
							.param("startOrder", "0")
							.param("altText", "Bike Photos"))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$", hasSize(2)))
					.andExpect(jsonPath("$[0].imageUrl", is("https://supabase.co/1.jpg")));
		}

		@Test
		@DisplayName("GET /api/admin/vehicles/{id}/images should return images")
		void shouldReturnImages() throws Exception {
			VehicleImageResponse img = new VehicleImageResponse(1L, "https://supabase.co/1.jpg", "Front", 0);
			when(vehicleService.getVehicleImages(15L)).thenReturn(List.of(img));

			mockMvc.perform(get("/api/admin/vehicles/15/images"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(jsonPath("$[0].id", is(1)));
		}

		@Test
		@DisplayName("GET /api/admin/vehicles/{id}/documents should return documents")
		void shouldReturnDocuments() throws Exception {
			VehicleDocumentResponse doc = new VehicleDocumentResponse(
					1L, 15L, DocumentType.INSURANCE, "Insurance Policy", "https://supabase.co/ins.pdf",
					"vehicles/15/documents/ins.pdf", "application/pdf", 2048L, Instant.now());
			when(vehicleService.getDocuments(15L)).thenReturn(List.of(doc));

			mockMvc.perform(get("/api/admin/vehicles/15/documents"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(jsonPath("$[0].title", is("Insurance Policy")));
		}

		@Test
		@DisplayName("DELETE /api/admin/documents/{id} should delete document")
		void shouldDeleteDocument() throws Exception {
			mockMvc.perform(delete("/api/admin/documents/1"))
					.andExpect(status().isNoContent());

			verify(vehicleService).deleteDocument(1L);
		}
	}

	@Nested
	@DisplayName("Sales Endpoints")
	class SalesEndpoints {

		@Test
		@DisplayName("POST /api/admin/vehicles/{id}/sales should mark vehicle as sold")
		void shouldMarkSold() throws Exception {
			SaleRecordResponse response = new SaleRecordResponse(
					1L, 15L, "Yamaha MT-15", new BigDecimal("150000"),
					LocalDate.of(2026, 8, 20), "Amit Kumar", "9876500000",
					"Full payment", Instant.now());

			when(vehicleService.markSold(eq(15L), any(SaleRecordRequest.class))).thenReturn(response);

			String requestJson = """
					{
						"salePrice": 150000,
						"saleDate": "2026-08-20",
						"buyerName": "Amit Kumar",
						"buyerPhone": "9876500000",
						"notes": "Full payment"
					}
					""";

			mockMvc.perform(post("/api/admin/vehicles/15/sales")
							.contentType(MediaType.APPLICATION_JSON)
							.content(requestJson))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.id", is(1)))
					.andExpect(jsonPath("$.buyerName", is("Amit Kumar")));
		}

		@Test
		@DisplayName("GET /api/admin/sales/report should return sales report")
		void shouldReturnSalesReport() throws Exception {
			SalesReportResponse report = new SalesReportResponse(
					new BigDecimal("500000"), 3, 10, 2, 3,
					new BigDecimal("166666.67"), List.of());

			when(vehicleService.salesReport(LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 31)))
					.thenReturn(report);

			mockMvc.perform(get("/api/admin/sales/report")
							.param("from", "2026-08-01")
							.param("to", "2026-08-31"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.totalRevenue", is(500000)))
					.andExpect(jsonPath("$.totalVehiclesSold", is(3)));
		}
	}
}
