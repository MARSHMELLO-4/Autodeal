package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import tools.jackson.databind.json.JsonMapper;

class RegionResolverTests {

	private RegionResolver resolver() {
		return new RegionResolver(JsonMapper.builder().build(), "", "", 800);
	}

	@Test
	@DisplayName("edge headers should be preferred over lookups")
	void shouldPreferEdgeHeaders() {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("CF-IPCountry", "IN");
		request.addHeader("X-Geo-Region", "Maharashtra");
		request.addHeader("X-Geo-City", "Pune");

		var resolved = resolver().resolve(request, "203.0.113.9");

		assertThat(resolved.country()).isEqualTo("IN");
		assertThat(resolved.region()).isEqualTo("Maharashtra");
		assertThat(resolved.city()).isEqualTo("Pune");
	}

	@Test
	@DisplayName("placeholder geo values should resolve to Unknown")
	void shouldNormalizePlaceholders() {
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("CF-IPCountry", "XX");
		request.addHeader("X-Geo-Region", "T1");
		request.addHeader("X-Geo-City", "unknown");

		var resolved = resolver().resolve(request, "203.0.113.9");

		assertThat(resolved.country()).isEqualTo("Unknown");
		assertThat(resolved.region()).isEqualTo("Unknown");
		assertThat(resolved.city()).isEqualTo("Unknown");
	}

	@Test
	@DisplayName("missing headers should resolve to Unknown when no provider is configured")
	void shouldDefaultToUnknown() {
		var resolved = resolver().resolve(new MockHttpServletRequest(), "203.0.113.9");

		assertThat(resolved.country()).isEqualTo("Unknown");
		assertThat(resolved.region()).isEqualTo("Unknown");
		assertThat(resolved.city()).isEqualTo("Unknown");
	}

	@Test
	@DisplayName("private addresses should never trigger a provider lookup")
	void shouldSkipProviderForPrivateAddresses() {
		RegionResolver resolver = new RegionResolver(
				JsonMapper.builder().build(), "http://127.0.0.1:1/lookup", "", 100);

		var resolved = resolver.resolve(new MockHttpServletRequest(), "192.168.1.10");

		assertThat(resolved.region()).isEqualTo("Unknown");
	}
}
