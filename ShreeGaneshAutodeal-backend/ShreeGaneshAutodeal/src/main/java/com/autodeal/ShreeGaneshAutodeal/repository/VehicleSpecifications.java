package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import org.springframework.data.jpa.domain.Specification;

public final class VehicleSpecifications {

	private VehicleSpecifications() {
	}

	public static Specification<Vehicle> matches(String search, String categorySlug, VehicleStatus status,
			BigDecimal minPrice, BigDecimal maxPrice) {
		return Specification.allOf(
				hasSearch(search),
				hasCategory(categorySlug),
				hasStatus(status),
				hasMinPrice(minPrice),
				hasMaxPrice(maxPrice));
	}

	private static Specification<Vehicle> hasSearch(String search) {
		return (root, query, cb) -> {
			if (search == null || search.isBlank()) {
				return cb.conjunction();
			}
			String pattern = "%" + search.trim().toLowerCase() + "%";
			return cb.or(
					cb.like(cb.lower(root.get("title")), pattern),
					cb.like(cb.lower(root.get("brand")), pattern),
					cb.like(cb.lower(root.get("modelName")), pattern),
					cb.like(cb.lower(root.get("registrationNumber")), pattern),
					cb.like(cb.lower(root.get("color")), pattern));
		};
	}

	private static Specification<Vehicle> hasCategory(String categorySlug) {
		return (root, query, cb) -> {
			if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
				root.fetch("category", JoinType.LEFT);
			}
			if (categorySlug == null || categorySlug.isBlank()) {
				return cb.conjunction();
			}
			return cb.equal(root.get("category").get("slug"), categorySlug.trim());
		};
	}

	private static Specification<Vehicle> hasStatus(VehicleStatus status) {
		return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
	}

	private static Specification<Vehicle> hasMinPrice(BigDecimal minPrice) {
		return (root, query, cb) -> minPrice == null ? cb.conjunction()
				: cb.greaterThanOrEqualTo(root.get("price"), minPrice);
	}

	private static Specification<Vehicle> hasMaxPrice(BigDecimal maxPrice) {
		return (root, query, cb) -> maxPrice == null ? cb.conjunction()
				: cb.lessThanOrEqualTo(root.get("price"), maxPrice);
	}
}
