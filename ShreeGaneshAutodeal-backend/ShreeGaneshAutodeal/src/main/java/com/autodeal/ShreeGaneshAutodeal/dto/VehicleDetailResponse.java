package com.autodeal.ShreeGaneshAutodeal.dto;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record VehicleDetailResponse(
		Long id,
		String title,
		String registrationNumber,
		String brand,
		String modelName,
		String variantName,
		Integer manufactureYear,
		Integer registrationYear,
		Integer kilometersDriven,
		FuelType fuelType,
		Integer ownerSerial,
		String color,
		BigDecimal price,
		String description,
		VehicleStatus status,
		CategoryResponse category,
		String thumbnailUrl,
		String location,
		List<VehicleImageResponse> images,
		List<VehicleDocumentResponse> documents,
		List<SaleRecordResponse> sales,
		Instant createdAt,
		Instant updatedAt) {
}
