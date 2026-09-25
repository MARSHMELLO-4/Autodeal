package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class IpAddressHasherTests {

	@Test
	@DisplayName("hashing should be deterministic and produce a 64 character digest")
	void shouldHashDeterministically() {
		IpAddressHasher hasher = new IpAddressHasher("salt");

		String first = hasher.hash("203.0.113.9");
		String second = hasher.hash("203.0.113.9");

		assertThat(first).isEqualTo(second).hasSize(64);
	}

	@Test
	@DisplayName("different addresses should produce different digests")
	void shouldDifferentiateAddresses() {
		IpAddressHasher hasher = new IpAddressHasher("salt");

		assertThat(hasher.hash("203.0.113.9")).isNotEqualTo(hasher.hash("203.0.113.10"));
	}

	@Test
	@DisplayName("changing the salt should change the digest")
	void shouldDependOnSalt() {
		assertThat(new IpAddressHasher("salt-a").hash("203.0.113.9"))
				.isNotEqualTo(new IpAddressHasher("salt-b").hash("203.0.113.9"));
	}

	@Test
	@DisplayName("raw ip addresses should never be part of the digest")
	void shouldNotLeakRawAddress() {
		String digest = new IpAddressHasher("salt").hash("203.0.113.9");

		assertThat(digest).doesNotContain("203.0.113.9").matches("[0-9a-f]{64}");
	}

	@Test
	@DisplayName("null addresses should still produce a digest")
	void shouldHashNullAddress() {
		assertThat(new IpAddressHasher("").hash(null)).matches("[0-9a-f]{64}");
	}
}
