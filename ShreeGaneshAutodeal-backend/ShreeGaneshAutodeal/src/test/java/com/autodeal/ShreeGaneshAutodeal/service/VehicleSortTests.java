package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

class VehicleSortTests {

	@ParameterizedTest
	@MethodSource("sortCases")
	@DisplayName("sortBy values should map to whitelisted properties and directions")
	void shouldResolveSort(String requested, String property, Direction direction) {
		Sort.Order order = VehicleSort.resolve(requested).getOrderFor(property);

		assertThat(order).isNotNull();
		assertThat(order.getDirection()).isEqualTo(direction);
	}

	static Stream<Arguments> sortCases() {
		return Stream.of(
				Arguments.of("newest", "createdAt", Direction.DESC),
				Arguments.of("oldest", "createdAt", Direction.ASC),
				Arguments.of("priceLow", "price", Direction.ASC),
				Arguments.of("priceHigh", "price", Direction.DESC),
				Arguments.of("yearNew", "manufactureYear", Direction.DESC),
				Arguments.of("yearOld", "manufactureYear", Direction.ASC),
				Arguments.of("mileageLow", "kilometersDriven", Direction.ASC),
				Arguments.of("mileageHigh", "kilometersDriven", Direction.DESC),
				Arguments.of("titleAZ", "title", Direction.ASC),
				Arguments.of("titleZA", "title", Direction.DESC),
				Arguments.of("UPDATED_NEW", "updatedAt", Direction.DESC));
	}

	@ParameterizedTest
	@MethodSource("unknownSorts")
	@DisplayName("unknown or unsafe sortBy values should fall back to newest first")
	void shouldFallBackToNewest(String requested) {
		Sort sort = VehicleSort.resolve(requested);

		assertThat(sort.getOrderFor("createdAt")).isNotNull();
		assertThat(sort.getOrderFor("createdAt").getDirection()).isEqualTo(Direction.DESC);
	}

	static Stream<String> unknownSorts() {
		return Stream.of(
				null,
				"",
				"   ",
				"dropTable",
				"price; drop table vehicles",
				"unknown_property");
	}

	@Test
	@DisplayName("resolved sorts should always include a stable id tiebreaker")
	void shouldAppendStableTiebreaker() {
		Sort sort = VehicleSort.resolve("priceLow");

		assertThat(sort.getOrderFor("id")).isNotNull();
		assertThat(sort.getOrderFor("id").getDirection()).isEqualTo(Direction.DESC);
	}

	@Test
	@DisplayName("apply should keep pagination and the requested sort")
	void shouldKeepPagination() {
		Pageable pageable = PageRequest.of(3, 24);

		Pageable result = VehicleSort.apply(pageable, "priceHigh");

		assertThat(result.getPageNumber()).isEqualTo(3);
		assertThat(result.getPageSize()).isEqualTo(24);
		assertThat(result.getSort().getOrderFor("price")).isNotNull();
	}

	@Test
	@DisplayName("apply should use the requested sort even when the pageable already has one")
	void shouldOverrideExistingSort() {
		Pageable pageable = PageRequest.of(0, 12, Sort.by(Direction.ASC, "title"));

		Pageable result = VehicleSort.apply(pageable, "priceLow");

		assertThat(result.getSort().getOrderFor("title")).isNull();
		assertThat(result.getSort().getOrderFor("price").getDirection()).isEqualTo(Direction.ASC);
	}

	@Test
	@DisplayName("apply should default to newest when no sort is requested")
	void shouldDefaultWhenSortMissing() {
		Pageable result = VehicleSort.apply(PageRequest.of(0, 12), null);

		assertThat(result.getSort().getOrderFor("createdAt").getDirection()).isEqualTo(Direction.DESC);
	}
}
