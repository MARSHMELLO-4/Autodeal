package com.autodeal.ShreeGaneshAutodeal.config;

import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import java.math.BigDecimal;
import java.util.Locale;
import org.springframework.data.domain.Pageable;

public final class CacheKeys {

	private CacheKeys() {
	}

	public static String vehicleSearch(String search, String categorySlug, VehicleStatus status,
			BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
		return String.join(":",
				"search",
				normalize(search),
				normalize(categorySlug),
				status == null ? "any-status" : status.name(),
				normalizePrice(minPrice),
				normalizePrice(maxPrice),
				"page-" + pageable.getPageNumber(),
				"size-" + pageable.getPageSize(),
				"sort-" + pageable.getSort().toString().toLowerCase(Locale.ROOT).replace(" ", ""));
	}

	public static String salesReport(Object fromDate, Object toDate) {
		return "sales:%s:%s".formatted(fromDate == null ? "beginning" : fromDate, toDate == null ? "today" : toDate);
	}

	private static String normalize(String value) {
		return value == null || value.isBlank() ? "all" : value.trim().toLowerCase(Locale.ROOT);
	}

	private static String normalizePrice(BigDecimal value) {
		return value == null ? "any-price" : value.stripTrailingZeros().toPlainString();
	}
}
