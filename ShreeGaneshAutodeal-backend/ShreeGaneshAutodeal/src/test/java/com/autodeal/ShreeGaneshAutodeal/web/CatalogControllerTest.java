package com.autodeal.ShreeGaneshAutodeal.web;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDetailResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleSummaryResponse;
import com.autodeal.ShreeGaneshAutodeal.service.CategoryService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class CatalogControllerTest {

	@Mock
	private CategoryService categoryService;

	@Mock
	private VehicleService vehicleService;

	@InjectMocks
	private CatalogController catalogController;

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(catalogController)
				.setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
				.setControllerAdvice(new GlobalExceptionHandler())
				.build();
	}

	@Test
	@DisplayName("GET /api/catalog/categories should return active categories")
	void shouldReturnCategories() throws Exception {
		CategoryResponse cat = new CategoryResponse(
				1L, "Scooters", "scooters", "Automatic scooters", Instant.now(), Instant.now());
		when(categoryService.findAll()).thenReturn(List.of(cat));

		mockMvc.perform(get("/api/catalog/categories"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name", is("Scooters")));
	}

	@Test
	@DisplayName("GET /api/catalog/vehicles should return paginated vehicle catalog")
	void shouldReturnVehicles() throws Exception {
		CategoryResponse cat = new CategoryResponse(1L, "Scooters", "scooters", null, null, null);
		VehicleSummaryResponse summary = new VehicleSummaryResponse(
				10L, "TVS Jupiter", "TVS", "Jupiter 125",
				2023, 3500, FuelType.PETROL, new BigDecimal("82000"),
				VehicleStatus.AVAILABLE, cat, "https://example.com/jupiter.jpg", "Pune", Instant.now());

		when(vehicleService.search(any(), any(), any(), any(), any(), any()))
				.thenReturn(new PageImpl<>(List.of(summary), PageRequest.of(0, 24), 1));

		mockMvc.perform(get("/api/catalog/vehicles")
						.param("search", "Jupiter")
						.param("category", "scooters"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(1)))
				.andExpect(jsonPath("$.content[0].title", is("TVS Jupiter")));
	}

	@Test
	@DisplayName("GET /api/catalog/vehicles/{id} should return public vehicle details")
	void shouldReturnVehicleDetail() throws Exception {
		CategoryResponse cat = new CategoryResponse(1L, "Scooters", "scooters", null, null, null);
		VehicleDetailResponse response = new VehicleDetailResponse(
				10L, "TVS Jupiter", null, "TVS", "Jupiter 125", "Disc",
				2023, 2023, 3500, FuelType.PETROL, 1, "Grey",
				new BigDecimal("82000"), "Excellent condition", VehicleStatus.AVAILABLE,
				cat, "https://example.com/jupiter.jpg", "Pune", List.of(), List.of(), List.of(),
				Instant.now(), Instant.now());

		when(vehicleService.getPublicDetail(10L)).thenReturn(response);

		mockMvc.perform(get("/api/catalog/vehicles/10"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(10)))
				.andExpect(jsonPath("$.title", is("TVS Jupiter")))
				.andExpect(jsonPath("$.documents", hasSize(0)))
				.andExpect(jsonPath("$.sales", hasSize(0)));
	}
}
