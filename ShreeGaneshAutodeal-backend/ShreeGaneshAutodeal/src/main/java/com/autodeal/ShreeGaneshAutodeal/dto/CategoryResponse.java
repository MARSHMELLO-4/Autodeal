package com.autodeal.ShreeGaneshAutodeal.dto;

import java.io.Serializable;
import java.time.Instant;

public record CategoryResponse(
		Long id,
		String name,
		String slug,
		String description,
		Instant createdAt,
		Instant updatedAt) implements Serializable {
}
