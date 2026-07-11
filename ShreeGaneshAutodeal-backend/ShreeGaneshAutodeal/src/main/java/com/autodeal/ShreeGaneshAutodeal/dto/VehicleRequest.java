package com.autodeal.ShreeGaneshAutodeal.dto;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record VehicleRequest(
		@NotBlank @Size(max = 180) String title,
		@Size(max = 30) String registrationNumber,
		@NotBlank @Size(max = 80) String brand,
		@NotBlank @Size(max = 100) String modelName,
		@Size(max = 120) String variantName,
		@NotNull @Min(1980) @Max(2100) Integer manufactureYear,
		@Min(1980) @Max(2100) Integer registrationYear,
		@NotNull @Min(0) Integer kilometersDriven,
		@NotNull FuelType fuelType,
		@Min(1) Integer ownerSerial,
		@Size(max = 60) String color,
		@NotNull @Positive BigDecimal price,
		@Size(max = 2500) String description,
		VehicleStatus status,
		@NotNull Long categoryId,
		@Size(max = 1200) String thumbnailUrl,
		@Size(max = 120) String location,
		List<@Valid VehicleImageRequest> images) {
}
