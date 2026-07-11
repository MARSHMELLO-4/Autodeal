package com.autodeal.ShreeGaneshAutodeal.dto;

import java.math.BigDecimal;
import java.util.List;

public record SalesReportResponse(
		BigDecimal totalRevenue,
		long totalVehiclesSold,
		long availableVehicles,
		long reservedVehicles,
		long soldVehicles,
		BigDecimal averageSalePrice,
		List<SaleRecordResponse> sales) {
}
