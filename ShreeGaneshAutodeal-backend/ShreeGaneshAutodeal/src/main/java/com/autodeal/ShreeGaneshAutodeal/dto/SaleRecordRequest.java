package com.autodeal.ShreeGaneshAutodeal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SaleRecordRequest(
		@NotNull @Positive BigDecimal salePrice,
		LocalDate saleDate,
		@Size(max = 140) String buyerName,
		@Size(max = 30) String buyerPhone,
		@Size(max = 1000) String notes) {
}
