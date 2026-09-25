package com.autodeal.ShreeGaneshAutodeal.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class IpAddressHasher {

	private final String salt;

	public IpAddressHasher(@Value("${app.analytics.ip-hash-salt:}") String salt) {
		this.salt = salt == null ? "" : salt;
	}

	public String hash(String ipAddress) {
		byte[] value = (salt + "|" + (ipAddress == null ? "unknown" : ipAddress))
				.getBytes(StandardCharsets.UTF_8);
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			return HexFormat.of().formatHex(digest.digest(value));
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException("SHA-256 is not available", exception);
		}
	}
}
