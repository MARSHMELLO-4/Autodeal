package com.autodeal.ShreeGaneshAutodeal.dto;

import java.io.Serializable;

public record VehicleImageResponse(
		Long id,
		String imageUrl,
		String altText,
		Integer displayOrder) implements Serializable {
}
