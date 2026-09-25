package com.autodeal.ShreeGaneshAutodeal.service;

import java.util.Locale;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class VehicleSort {

	public static final String DEFAULT = "newest";

	private VehicleSort() {
	}

	public static Pageable apply(Pageable pageable, String requestedSort) {
		Sort sort = requestedSort == null || requestedSort.isBlank()
				? pageable.getSortOr(resolve(DEFAULT))
				: resolve(requestedSort);
		if (pageable.isUnpaged()) {
			return Pageable.unpaged(sort);
		}
		return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
	}

	public static Sort resolve(String requestedSort) {
		String normalized = requestedSort == null
				? DEFAULT
				: requestedSort.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
		return switch (normalized) {
			case "oldest", "dateaddedoldest", "createdatasc" -> ordered(Sort.Direction.ASC, "createdAt");
			case "pricelow", "priceasc", "priceascending" -> ordered(Sort.Direction.ASC, "price");
			case "pricehigh", "pricedesc", "pricedescending" -> ordered(Sort.Direction.DESC, "price");
			case "yearnew", "yearnewest", "yeardesc" -> ordered(Sort.Direction.DESC, "manufactureYear");
			case "yearold", "yearoldest", "yearasc" -> ordered(Sort.Direction.ASC, "manufactureYear");
			case "mileagelow", "mileageasc" -> ordered(Sort.Direction.ASC, "kilometersDriven");
			case "mileagehigh", "mileagedesc" -> ordered(Sort.Direction.DESC, "kilometersDriven");
			case "titleaz", "titleasc" -> ordered(Sort.Direction.ASC, "title");
			case "titleza", "titledesc" -> ordered(Sort.Direction.DESC, "title");
			case "updatednew", "updateddesc" -> ordered(Sort.Direction.DESC, "updatedAt");
			default -> ordered(Sort.Direction.DESC, "createdAt");
		};
	}

	private static Sort ordered(Sort.Direction direction, String property) {
		return Sort.by(direction, property).and(Sort.by(Sort.Direction.DESC, "id"));
	}
}
