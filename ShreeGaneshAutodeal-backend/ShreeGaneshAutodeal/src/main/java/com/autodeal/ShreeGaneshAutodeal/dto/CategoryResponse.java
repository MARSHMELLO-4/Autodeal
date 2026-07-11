package com.autodeal.ShreeGaneshAutodeal.dto;

import java.time.Instant;

public record CategoryResponse(
		Long id,
		String name,
		String slug,
		String description,
		Instant createdAt,
		Instant updatedAt) {
}
