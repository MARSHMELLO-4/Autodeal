package com.autodeal.ShreeGaneshAutodeal.dto;

public record VehicleImageResponse(
		Long id,
		String imageUrl,
		String altText,
		Integer displayOrder) {
}
