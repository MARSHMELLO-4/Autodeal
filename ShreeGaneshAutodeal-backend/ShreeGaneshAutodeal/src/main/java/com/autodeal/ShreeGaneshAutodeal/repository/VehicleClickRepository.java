package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.VehicleClick;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleClickRepository extends JpaRepository<VehicleClick, Long> {

	@Query("""
			select count(c)
			from VehicleClick c
			where c.clickedAt >= :from and c.clickedAt < :to
			""")
	long countClicks(@Param("from") Instant from, @Param("to") Instant to);

	@Query("""
			select count(distinct c.ipHash)
			from VehicleClick c
			where c.clickedAt >= :from and c.clickedAt < :to
			""")
	long countUniqueVisitors(@Param("from") Instant from, @Param("to") Instant to);

	@Query("""
			select coalesce(c.region, 'Unknown') as region,
			       coalesce(c.country, 'Unknown') as country,
			       count(c) as clickCount,
			       count(distinct c.ipHash) as uniqueVisitors
			from VehicleClick c
			where c.clickedAt >= :from and c.clickedAt < :to
			group by coalesce(c.region, 'Unknown'), coalesce(c.country, 'Unknown')
			order by count(c) desc
			""")
	List<RegionClickProjection> aggregateRegions(
			@Param("from") Instant from,
			@Param("to") Instant to,
			Pageable pageable);

	@Query("""
			select coalesce(c.region, 'Unknown') as region,
			       coalesce(c.country, 'Unknown') as country,
			       count(c) as clickCount,
			       count(distinct c.ipHash) as uniqueVisitors
			from VehicleClick c
			where c.vehicle.id = :vehicleId
			  and c.clickedAt >= :from and c.clickedAt < :to
			group by coalesce(c.region, 'Unknown'), coalesce(c.country, 'Unknown')
			order by count(c) desc
			""")
	List<RegionClickProjection> aggregateRegionsForVehicle(
			@Param("vehicleId") Long vehicleId,
			@Param("from") Instant from,
			@Param("to") Instant to,
			Pageable pageable);

	@Query("""
			select c.vehicle.id as vehicleId,
			       c.vehicle.title as vehicleTitle,
			       count(c) as clickCount,
			       count(distinct c.ipHash) as uniqueVisitors,
			       max(c.clickedAt) as lastClickedAt
			from VehicleClick c
			where c.clickedAt >= :from and c.clickedAt < :to
			group by c.vehicle.id, c.vehicle.title
			order by count(c) desc
			""")
	List<VehicleClickSummaryProjection> aggregateVehicles(
			@Param("from") Instant from,
			@Param("to") Instant to,
			Pageable pageable);

	@Query("""
			select c.vehicle.id as vehicleId,
			       c.vehicle.title as vehicleTitle,
			       count(c) as clickCount,
			       count(distinct c.ipHash) as uniqueVisitors,
			       max(c.clickedAt) as lastClickedAt
			from VehicleClick c
			where c.vehicle.id = :vehicleId
			  and c.clickedAt >= :from and c.clickedAt < :to
			group by c.vehicle.id, c.vehicle.title
			""")
	List<VehicleClickSummaryProjection> aggregateVehicle(
			@Param("vehicleId") Long vehicleId,
			@Param("from") Instant from,
			@Param("to") Instant to);

	interface RegionClickProjection {
		String getRegion();

		String getCountry();

		long getClickCount();

		long getUniqueVisitors();
	}

	interface VehicleClickSummaryProjection {
		Long getVehicleId();

		String getVehicleTitle();

		long getClickCount();

		long getUniqueVisitors();

		Instant getLastClickedAt();
	}
}
