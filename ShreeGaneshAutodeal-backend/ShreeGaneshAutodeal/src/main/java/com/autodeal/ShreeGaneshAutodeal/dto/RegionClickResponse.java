package com.autodeal.ShreeGaneshAutodeal.dto;

public record RegionClickResponse(
		String region,
		String country,
		long clickCount,
		long uniqueVisitors) {
}
