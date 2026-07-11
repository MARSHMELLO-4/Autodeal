package com.autodeal.ShreeGaneshAutodeal.dto;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record VehicleSummaryResponse(
		Long id,
		String title,
		String brand,
		String modelName,
		Integer manufactureYear,
		Integer kilometersDriven,
		FuelType fuelType,
		BigDecimal price,
		VehicleStatus status,
		CategoryResponse category,
		String thumbnailUrl,
		String location,
		Instant updatedAt) {
}
