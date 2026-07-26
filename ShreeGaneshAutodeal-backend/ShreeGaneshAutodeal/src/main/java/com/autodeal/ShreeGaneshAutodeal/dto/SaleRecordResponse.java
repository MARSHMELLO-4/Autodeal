package com.autodeal.ShreeGaneshAutodeal.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record SaleRecordResponse(
		Long id,
		Long vehicleId,
		String vehicleTitle,
		BigDecimal salePrice,
		LocalDate saleDate,
		String buyerName,
		String buyerPhone,
		String notes,
		Instant createdAt) implements Serializable {
}
