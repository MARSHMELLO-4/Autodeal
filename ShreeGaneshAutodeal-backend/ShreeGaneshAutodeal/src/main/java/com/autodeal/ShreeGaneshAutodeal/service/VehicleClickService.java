package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleClick;
import com.autodeal.ShreeGaneshAutodeal.dto.RegionClickResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleClickReportResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleClickSummaryResponse;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleClickRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleClickRepository.VehicleClickSummaryProjection;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleRepository;
import com.autodeal.ShreeGaneshAutodeal.service.RegionResolver.ResolvedRegion;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VehicleClickService {

	private static final int MAX_SOURCE_LENGTH = 40;
	private static final int MAX_REferrer_LENGTH = 1000;
	private static final int MAX_USER_AGENT_LENGTH = 512;

	private final VehicleClickRepository vehicleClickRepository;
	private final VehicleRepository vehicleRepository;
	private final ClientIpResolver clientIpResolver;
	private final IpAddressHasher ipAddressHasher;
	private final RegionResolver regionResolver;
	private final int maxRegions;
	private final int maxTopVehicles;

	public VehicleClickService(
			VehicleClickRepository vehicleClickRepository,
			VehicleRepository vehicleRepository,
			ClientIpResolver clientIpResolver,
			IpAddressHasher ipAddressHasher,
			RegionResolver regionResolver,
			@Value("${app.analytics.report-region-limit:20}") int maxRegions,
			@Value("${app.analytics.report-top-vehicle-limit:10}") int maxTopVehicles) {
		this.vehicleClickRepository = vehicleClickRepository;
		this.vehicleRepository = vehicleRepository;
		this.clientIpResolver = clientIpResolver;
		this.ipAddressHasher = ipAddressHasher;
		this.regionResolver = regionResolver;
		this.maxRegions = Math.max(1, maxRegions);
		this.maxTopVehicles = Math.max(1, maxTopVehicles);
	}

	@Transactional
	public void recordClick(Long vehicleId, String source, HttpServletRequest request) {
		Vehicle vehicle = vehicleRepository.findById(vehicleId)
				.orElseThrow(() -> new EntityNotFoundException("Vehicle not found: " + vehicleId));

		String ipAddress = clientIpResolver.resolve(request);
		ResolvedRegion region = regionResolver.resolve(request, ipAddress);

		VehicleClick click = new VehicleClick();
		click.setVehicle(vehicle);
		click.setIpHash(ipAddressHasher.hash(ipAddress));
		click.setCountry(region.country());
		click.setRegion(region.region());
		click.setCity(region.city());
		click.setUserAgent(truncate(request.getHeader("User-Agent"), MAX_USER_AGENT_LENGTH));
		click.setReferrer(truncate(request.getHeader("Referer"), MAX_REferrer_LENGTH));
		click.setSource(normalizeSource(source));
		click.setClickedAt(Instant.now());
		vehicleClickRepository.save(click);
	}

	@Transactional(readOnly = true)
	public VehicleClickReportResponse report(Long vehicleId, LocalDate from, LocalDate to) {
		Instant start = startOfDay(from);
		Instant end = startOfDay(to == null ? from : to);
		if (end.isBefore(start)) {
			Instant swap = start;
			start = end;
			end = swap;
		}
		if (!end.isAfter(start)) {
			end = start.plusSeconds(24L * 60L * 60L);
		}

		if (vehicleId != null) {
			if (!vehicleRepository.existsById(vehicleId)) {
				throw new EntityNotFoundException("Vehicle not found: " + vehicleId);
			}
		}

		List<RegionClickResponse> regions = vehicleId == null
				? vehicleClickRepository.aggregateRegions(start, end, PageRequest.of(0, maxRegions))
						.stream()
						.map(projection -> new RegionClickResponse(
								projection.getRegion(),
								projection.getCountry(),
								projection.getClickCount(),
								projection.getUniqueVisitors()))
						.toList()
				: vehicleClickRepository.aggregateRegionsForVehicle(
								vehicleId, start, end, PageRequest.of(0, maxRegions))
						.stream()
						.map(projection -> new RegionClickResponse(
								projection.getRegion(),
								projection.getCountry(),
								projection.getClickCount(),
								projection.getUniqueVisitors()))
						.toList();

		List<VehicleClickSummaryResponse> topVehicles = new ArrayList<>();
		long totalClicks;
		long uniqueVisitors;
		if (vehicleId == null) {
			totalClicks = vehicleClickRepository.countClicks(start, end);
			uniqueVisitors = vehicleClickRepository.countUniqueVisitors(start, end);
			vehicleClickRepository.aggregateVehicles(start, end, PageRequest.of(0, maxTopVehicles))
					.forEach(projection -> topVehicles.add(new VehicleClickSummaryResponse(
							projection.getVehicleId(),
							projection.getVehicleTitle(),
							projection.getClickCount(),
							projection.getUniqueVisitors(),
							projection.getLastClickedAt())));
		} else {
			List<VehicleClickSummaryProjection> vehicleRows =
					vehicleClickRepository.aggregateVehicle(vehicleId, start, end);
			totalClicks = vehicleRows.isEmpty() ? 0 : vehicleRows.getFirst().getClickCount();
			uniqueVisitors = vehicleRows.isEmpty() ? 0 : vehicleRows.getFirst().getUniqueVisitors();
			vehicleRows.forEach(projection -> topVehicles.add(new VehicleClickSummaryResponse(
					projection.getVehicleId(),
					projection.getVehicleTitle(),
					projection.getClickCount(),
					projection.getUniqueVisitors(),
					projection.getLastClickedAt())));
		}

		return new VehicleClickReportResponse(vehicleId, totalClicks, uniqueVisitors, regions, topVehicles, Instant.now());
	}

	private Instant startOfDay(LocalDate date) {
		LocalDate target = date == null ? LocalDate.now(ZoneOffset.UTC) : date;
		return target.atStartOfDay(ZoneOffset.UTC).toInstant();
	}

	private String normalizeSource(String source) {
		if (source == null || source.isBlank()) {
			return "unknown";
		}
		return truncate(source.trim().toUpperCase(Locale.ROOT), MAX_SOURCE_LENGTH);
	}

	private String truncate(String value, int maxLength) {
		if (value == null || value.isBlank()) {
			return null;
		}
		String normalized = value.trim();
		return normalized.length() <= maxLength ? normalized : normalized.substring(0, maxLength);
	}
}
