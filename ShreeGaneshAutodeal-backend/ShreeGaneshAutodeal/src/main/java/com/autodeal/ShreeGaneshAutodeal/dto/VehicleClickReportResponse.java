package com.autodeal.ShreeGaneshAutodeal.dto;

import java.time.Instant;
import java.util.List;

public record VehicleClickReportResponse(
		Long scopeVehicleId,
		long totalClicks,
		long uniqueVisitors,
		List<RegionClickResponse> regions,
		List<VehicleClickSummaryResponse> topVehicles,
		Instant generatedAt) {
}
