package com.autodeal.ShreeGaneshAutodeal.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.autodeal.ShreeGaneshAutodeal.domain.Category;
import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class VehicleSpecificationsTest {

	@Autowired
	private VehicleRepository vehicleRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	private Category bikesCategory;
	private Category scootersCategory;

	@BeforeEach
	void setUp() {
		vehicleRepository.deleteAll();
		categoryRepository.deleteAll();

		bikesCategory = new Category();
		bikesCategory.setName("Motorcycles");
		bikesCategory.setSlug("motorcycles");
		bikesCategory = categoryRepository.save(bikesCategory);

		scootersCategory = new Category();
		scootersCategory.setName("Scooters");
		scootersCategory.setSlug("scooters");
		scootersCategory = categoryRepository.save(scootersCategory);

		Vehicle v1 = new Vehicle();
		v1.setTitle("Royal Enfield Classic 350");
		v1.setRegistrationNumber("MH12AB1001");
		v1.setBrand("Royal Enfield");
		v1.setModelName("Classic 350");
		v1.setManufactureYear(2022);
		v1.setKilometersDriven(15000);
		v1.setFuelType(FuelType.PETROL);
		v1.setPrice(new BigDecimal("180000.00"));
		v1.setStatus(VehicleStatus.AVAILABLE);
		v1.setCategory(bikesCategory);
		v1.setColor("Black");
		vehicleRepository.save(v1);

		Vehicle v2 = new Vehicle();
		v2.setTitle("Honda Activa 6G");
		v2.setRegistrationNumber("MH12CD2002");
		v2.setBrand("Honda");
		v2.setModelName("Activa 6G");
		v2.setManufactureYear(2023);
		v2.setKilometersDriven(5000);
		v2.setFuelType(FuelType.PETROL);
		v2.setPrice(new BigDecimal("75000.00"));
		v2.setStatus(VehicleStatus.AVAILABLE);
		v2.setCategory(scootersCategory);
		v2.setColor("White");
		vehicleRepository.save(v2);

		Vehicle v3 = new Vehicle();
		v3.setTitle("KTM Duke 390");
		v3.setRegistrationNumber("MH12EF3003");
		v3.setBrand("KTM");
		v3.setModelName("Duke 390");
		v3.setManufactureYear(2021);
		v3.setKilometersDriven(20000);
		v3.setFuelType(FuelType.PETROL);
		v3.setPrice(new BigDecimal("250000.00"));
		v3.setStatus(VehicleStatus.SOLD);
		v3.setCategory(bikesCategory);
		v3.setColor("Orange");
		vehicleRepository.save(v3);
	}

	@Test
	@DisplayName("Should filter by text search query")
	void shouldFilterBySearchQuery() {
		Specification<Vehicle> spec = VehicleSpecifications.matches(
				"Activa", null, null, null, null);

		List<Vehicle> results = vehicleRepository.findAll(spec);

		assertThat(results).hasSize(1);
		assertThat(results.get(0).getTitle()).isEqualTo("Honda Activa 6G");
	}

	@Test
	@DisplayName("Should filter by category slug")
	void shouldFilterByCategorySlug() {
		Specification<Vehicle> spec = VehicleSpecifications.matches(
				null, "motorcycles", null, null, null);

		List<Vehicle> results = vehicleRepository.findAll(spec);

		assertThat(results).hasSize(2);
	}

	@Test
	@DisplayName("Should filter by vehicle status")
	void shouldFilterByStatus() {
		Specification<Vehicle> spec = VehicleSpecifications.matches(
				null, null, VehicleStatus.SOLD, null, null);

		List<Vehicle> results = vehicleRepository.findAll(spec);

		assertThat(results).hasSize(1);
		assertThat(results.get(0).getTitle()).isEqualTo("KTM Duke 390");
	}

	@Test
	@DisplayName("Should filter by price range")
	void shouldFilterByPriceRange() {
		Specification<Vehicle> spec = VehicleSpecifications.matches(
				null, null, null, new BigDecimal("70000"), new BigDecimal("100000"));

		List<Vehicle> results = vehicleRepository.findAll(spec);

		assertThat(results).hasSize(1);
		assertThat(results.get(0).getTitle()).isEqualTo("Honda Activa 6G");
	}

	@Test
	@DisplayName("Should combine all filters correctly")
	void shouldCombineAllFilters() {
		Specification<Vehicle> spec = VehicleSpecifications.matches(
				"Classic", "motorcycles", VehicleStatus.AVAILABLE,
				new BigDecimal("150000"), new BigDecimal("200000"));

		List<Vehicle> results = vehicleRepository.findAll(spec);

		assertThat(results).hasSize(1);
		assertThat(results.get(0).getTitle()).isEqualTo("Royal Enfield Classic 350");
	}
}
