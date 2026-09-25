package com.autodeal.ShreeGaneshAutodeal.web;

import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleDetailResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleSummaryResponse;
import com.autodeal.ShreeGaneshAutodeal.service.CategoryService;
import com.autodeal.ShreeGaneshAutodeal.service.NotificationService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleClickService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleSort;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;

import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

	private final CategoryService categoryService;
	private final VehicleService vehicleService;
	private final NotificationService notificationService;
	private final VehicleClickService vehicleClickService;

	public CatalogController(CategoryService categoryService, VehicleService vehicleService,
			NotificationService notificationService, VehicleClickService vehicleClickService) {
		this.categoryService = categoryService;
		this.vehicleService = vehicleService;
		this.notificationService = notificationService;
		this.vehicleClickService = vehicleClickService;
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
			@RequestParam(required = false) String sortBy,
			@PageableDefault(size = 24) Pageable pageable) {
		return vehicleService.search(
				search, category, status, minPrice, maxPrice, VehicleSort.apply(pageable, sortBy));
	}

	@GetMapping("/vehicles/{id}")
	public VehicleDetailResponse vehicle(@PathVariable Long id) {
		return vehicleService.getPublicDetail(id);
	}

	@PostMapping("/vehicles/{id}/clicks")
	public ResponseEntity<Void> trackClick(
			@PathVariable Long id,
			@RequestParam(required = false) String source,
			HttpServletRequest request) {
		vehicleClickService.recordClick(id, source, request);
		return ResponseEntity.status(HttpStatus.ACCEPTED).build();
	}

	@PostMapping("/vehicles/sendTestNotification/{id}")
	public ResponseEntity<String> sendTestNotification(@PathVariable Long id) throws MessagingException {
		notificationService.notifySubscribers(id);
		return ResponseEntity.ok("Mails sent");
	}
}
