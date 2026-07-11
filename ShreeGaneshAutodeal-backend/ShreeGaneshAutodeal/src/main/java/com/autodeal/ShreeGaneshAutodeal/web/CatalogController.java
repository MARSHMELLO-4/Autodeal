package com.autodeal.ShreeGaneshAutodeal.web;

import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDetailResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleSummaryResponse;
import com.autodeal.ShreeGaneshAutodeal.service.CategoryService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

	private final CategoryService categoryService;
	private final VehicleService vehicleService;

	public CatalogController(CategoryService categoryService, VehicleService vehicleService) {
		this.categoryService = categoryService;
		this.vehicleService = vehicleService;
	}

	@GetMapping("/categories")
	public List<CategoryResponse> categories() {
		return categoryService.findAll();
	}

	@GetMapping("/vehicles")
	public Page<VehicleSummaryResponse> vehicles(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) VehicleStatus status,
			@RequestParam(required = false) BigDecimal minPrice,
			@RequestParam(required = false) BigDecimal maxPrice,
			@PageableDefault(size = 24) Pageable pageable) {
		return vehicleService.search(search, category, status, minPrice, maxPrice, pageable);
	}

	@GetMapping("/vehicles/{id}")
	public VehicleDetailResponse vehicle(@PathVariable Long id) {
		return vehicleService.getPublicDetail(id);
	}
}
