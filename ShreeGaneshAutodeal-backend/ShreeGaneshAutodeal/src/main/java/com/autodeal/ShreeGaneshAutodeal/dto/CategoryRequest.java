package com.autodeal.ShreeGaneshAutodeal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
		@NotBlank @Size(max = 120) String name,
		@Size(max = 140) String slug,
		@Size(max = 500) String description) {
}
