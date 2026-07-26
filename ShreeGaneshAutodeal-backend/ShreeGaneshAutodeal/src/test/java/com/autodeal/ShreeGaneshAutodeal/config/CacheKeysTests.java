package com.autodeal.ShreeGaneshAutodeal.config;

import static org.assertj.core.api.Assertions.assertThat;

import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

class CacheKeysTests {

	@Test
	void vehicleSearchNormalizesFiltersAndPagination() {
		String key = CacheKeys.vehicleSearch(
				"  Activa  ",
				" Scooters ",
				VehicleStatus.AVAILABLE,
				new BigDecimal("30000.00"),
				new BigDecimal("90000.0"),
				PageRequest.of(1, 24, Sort.by(Sort.Direction.DESC, "updatedAt")));

		assertThat(key)
				.isEqualTo("search:activa:scooters:AVAILABLE:30000:90000:page-1:size-24:sort-updatedat:desc");
	}

	@Test
	void salesReportUsesStableOpenEndedDateKeys() {
		assertThat(CacheKeys.salesReport(null, null)).isEqualTo("sales:beginning:today");
	}
}
