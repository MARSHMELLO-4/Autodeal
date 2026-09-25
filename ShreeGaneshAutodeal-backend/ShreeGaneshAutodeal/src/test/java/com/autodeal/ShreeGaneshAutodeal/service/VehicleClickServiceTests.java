package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleClick;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleClickReportResponse;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleClickRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleClickRepository.RegionClickProjection;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleClickRepository.VehicleClickSummaryProjection;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mock.web.MockHttpServletRequest;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class VehicleClickServiceTests {

	@Mock
	private VehicleClickRepository vehicleClickRepository;

	@Mock
	private VehicleRepository vehicleRepository;

	private VehicleClickService service;

	@BeforeEach
	void setUp() {
		service = new VehicleClickService(
				vehicleClickRepository,
				vehicleRepository,
				new ClientIpResolver(true),
				new IpAddressHasher("test-salt"),
				new RegionResolver(null, "", "", 800),
				20,
				10);
	}

	@Test
	@DisplayName("recordClick should persist hashed ip and resolved region")
	void shouldPersistClick() {
		Vehicle vehicle = new Vehicle();
		when(vehicleRepository.findById(15L)).thenReturn(Optional.of(vehicle));

		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("X-Forwarded-For", "203.0.113.9");
		request.addHeader("User-Agent", "vitest-agent");
		request.addHeader("Referer", "https://example.com/");
		request.addHeader("CF-IPCountry", "IN");

		service.recordClick(15L, "card", request);

		ArgumentCaptor<VehicleClick> captor = ArgumentCaptor.forClass(VehicleClick.class);
		verify(vehicleClickRepository).save(captor.capture());

		VehicleClick click = captor.getValue();
		assertThat(click.getIpHash()).matches("[0-9a-f]{64}").doesNotContain("203.0.113.9");
		assertThat(click.getCountry()).isEqualTo("IN");
		assertThat(click.getRegion()).isEqualTo("Unknown");
		assertThat(click.getCity()).isEqualTo("Unknown");
		assertThat(click.getSource()).isEqualTo("CARD");
		assertThat(click.getUserAgent()).isEqualTo("vitest-agent");
		assertThat(click.getReferrer()).isEqualTo("https://example.com/");
		assertThat(click.getClickedAt()).isNotNull();
		assertThat(click.getVehicle()).isSameAs(vehicle);
	}

	@Test
	@DisplayName("recordClick should default a missing source to unknown")
	void shouldDefaultSource() {
		when(vehicleRepository.findById(15L)).thenReturn(Optional.of(new Vehicle()));

		service.recordClick(15L, null, new MockHttpServletRequest());

		ArgumentCaptor<VehicleClick> captor = ArgumentCaptor.forClass(VehicleClick.class);
		verify(vehicleClickRepository).save(captor.capture());

		assertThat(captor.getValue().getSource()).isEqualTo("unknown");
	}

	@Test
	@DisplayName("recordClick should reject unknown vehicles")
	void shouldRejectUnknownVehicle() {
		when(vehicleRepository.findById(anyLong())).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.recordClick(999L, "card", new MockHttpServletRequest()))
				.isInstanceOf(EntityNotFoundException.class);
	}

	@Test
	@DisplayName("report should aggregate site wide totals and top vehicles")
	void shouldBuildSiteWideReport() {
		RegionClickProjection maharashtra = new RegionClickProjection() {
			@Override
			public String getRegion() {
				return "Maharashtra";
			}

			@Override
			public String getCountry() {
				return "IN";
			}

			@Override
			public long getClickCount() {
				return 80;
			}

			@Override
			public long getUniqueVisitors() {
				return 30;
			}
		};

		VehicleClickSummaryProjection topVehicle = new VehicleClickSummaryProjection() {
			@Override
			public Long getVehicleId() {
				return 15L;
			}

			@Override
			public String getVehicleTitle() {
				return "Yamaha MT-15";
			}

			@Override
			public long getClickCount() {
				return 40;
			}

			@Override
			public long getUniqueVisitors() {
				return 22;
			}

			@Override
			public Instant getLastClickedAt() {
				return Instant.now();
			}
		};

		when(vehicleClickRepository.aggregateRegions(any(), any(), any()))
				.thenReturn(List.of(maharashtra));
		when(vehicleClickRepository.aggregateVehicles(any(), any(), any())).thenReturn(List.of(topVehicle));
		when(vehicleClickRepository.countClicks(any(), any())).thenReturn(120L);
		when(vehicleClickRepository.countUniqueVisitors(any(), any())).thenReturn(45L);

		VehicleClickReportResponse report = service.report(null, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 31));

		assertThat(report.scopeVehicleId()).isNull();
		assertThat(report.totalClicks()).isEqualTo(120L);
		assertThat(report.uniqueVisitors()).isEqualTo(45L);
		assertThat(report.regions()).hasSize(1);
		assertThat(report.regions().getFirst().region()).isEqualTo("Maharashtra");
		assertThat(report.topVehicles()).hasSize(1);
		assertThat(report.topVehicles().getFirst().vehicleTitle()).isEqualTo("Yamaha MT-15");
	}

	@Test
	@DisplayName("report should aggregate a single vehicle using unclamped totals")
	void shouldBuildVehicleReport() {
		VehicleClickSummaryProjection vehicleRow = new VehicleClickSummaryProjection() {
			@Override
			public Long getVehicleId() {
				return 15L;
			}

			@Override
			public String getVehicleTitle() {
				return "Yamaha MT-15";
			}

			@Override
			public long getClickCount() {
				return 500;
			}

			@Override
			public long getUniqueVisitors() {
				return 90;
			}

			@Override
			public Instant getLastClickedAt() {
				return Instant.now();
			}
		};

		when(vehicleRepository.existsById(15L)).thenReturn(true);
		when(vehicleClickRepository.aggregateRegionsForVehicle(any(), any(), any(), any()))
				.thenReturn(List.of());
		when(vehicleClickRepository.aggregateVehicle(any(), any(), any())).thenReturn(List.of(vehicleRow));

		VehicleClickReportResponse report = service.report(15L, null, null);

		assertThat(report.scopeVehicleId()).isEqualTo(15L);
		assertThat(report.totalClicks()).isEqualTo(500L);
		assertThat(report.uniqueVisitors()).isEqualTo(90L);
	}

	@Test
	@DisplayName("report should reject unknown vehicles")
	void shouldRejectUnknownVehicleReport() {
		when(vehicleRepository.existsById(999L)).thenReturn(false);

		assertThatThrownBy(() -> service.report(999L, null, null))
				.isInstanceOf(EntityNotFoundException.class);
	}
}
