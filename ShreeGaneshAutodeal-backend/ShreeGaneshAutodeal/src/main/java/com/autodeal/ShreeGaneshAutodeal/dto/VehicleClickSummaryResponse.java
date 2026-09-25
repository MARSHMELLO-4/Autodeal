package com.autodeal.ShreeGaneshAutodeal.dto;

import java.time.Instant;

public record VehicleClickSummaryResponse(
		Long vehicleId,
		String vehicleTitle,
		long clickCount,
		long uniqueVisitors,
		Instant lastClickedAt) {
}
