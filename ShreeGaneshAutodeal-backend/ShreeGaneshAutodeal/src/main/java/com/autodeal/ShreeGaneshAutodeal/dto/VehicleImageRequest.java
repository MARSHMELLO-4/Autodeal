package com.autodeal.ShreeGaneshAutodeal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VehicleImageRequest(
		@NotBlank @Size(max = 1400) String imageUrl,
		@Size(max = 180) String altText,
		Integer displayOrder) {
}
