package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class ClientIpResolverTests {

	@Test
	@DisplayName("first forwarded address should win")
	void shouldUseFirstForwardedAddress() {
		ClientIpResolver resolver = new ClientIpResolver(true);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("X-Forwarded-For", "203.0.113.9, 70.41.3.18, 150.172.238.178");

		assertThat(resolver.resolve(request)).isEqualTo("203.0.113.9");
	}

	@Test
	@DisplayName("unknown entries should be skipped")
	void shouldSkipUnknownEntries() {
		ClientIpResolver resolver = new ClientIpResolver(true);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("X-Forwarded-For", "unknown, 70.41.3.18");

		assertThat(resolver.resolve(request)).isEqualTo("70.41.3.18");
	}

	@Test
	@DisplayName("ipv6 loopback and ipv4 mapped addresses should be normalized")
	void shouldNormalizeAddresses() {
		ClientIpResolver resolver = new ClientIpResolver(true);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("X-Forwarded-For", "::ffff:203.0.113.9");

		assertThat(resolver.resolve(request)).isEqualTo("203.0.113.9");

		MockHttpServletRequest ipv6Request = new MockHttpServletRequest();
		ipv6Request.addHeader("X-Forwarded-For", "0:0:0:0:0:0:0:1");

		assertThat(resolver.resolve(ipv6Request)).isEqualTo("127.0.0.1");
	}

	@Test
	@DisplayName("remote address should be used when no forwarded header is present")
	void shouldUseRemoteAddress() {
		ClientIpResolver resolver = new ClientIpResolver(true);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setRemoteAddr("198.51.100.7");

		assertThat(resolver.resolve(request)).isEqualTo("198.51.100.7");
	}

	@Test
	@DisplayName("forwarded headers should be ignored when not trusted")
	void shouldIgnoreForwardedHeadersWhenUntrusted() {
		ClientIpResolver resolver = new ClientIpResolver(false);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("X-Forwarded-For", "203.0.113.9");
		request.addHeader("X-Real-IP", "70.41.3.18");
		request.setRemoteAddr("198.51.100.7");

		assertThat(resolver.resolve(request)).isEqualTo("198.51.100.7");
	}

	@Test
	@DisplayName("blank forwarded headers should fall back to the remote address")
	void shouldFallBackWhenForwardedHeaderIsBlank() {
		ClientIpResolver resolver = new ClientIpResolver(true);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.addHeader("X-Forwarded-For", "   ");
		request.setRemoteAddr("198.51.100.7");

		assertThat(resolver.resolve(request)).isEqualTo("198.51.100.7");
	}

	@Test
	@DisplayName("absent remote address should resolve to unknown")
	void shouldResolveMissingAddressToUnknown() {
		ClientIpResolver resolver = new ClientIpResolver(true);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setRemoteAddr(null);

		assertThat(resolver.resolve(request)).isEqualTo("unknown");
	}
}
