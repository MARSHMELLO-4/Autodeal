package com.autodeal.ShreeGaneshAutodeal.service;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ClientIpResolver {

	private final boolean trustForwardedHeaders;

	public ClientIpResolver(
			@Value("${app.analytics.trust-forwarded-headers:true}") boolean trustForwardedHeaders) {
		this.trustForwardedHeaders = trustForwardedHeaders;
	}

	public String resolve(HttpServletRequest request) {
		if (trustForwardedHeaders) {
			String forwarded = firstAddress(request.getHeader("X-Forwarded-For"));
			if (forwarded != null) {
				return forwarded;
			}
			String realIp = firstAddress(request.getHeader("X-Real-IP"));
			if (realIp != null) {
				return realIp;
			}
		}
		return normalize(request.getRemoteAddr());
	}

	private String firstAddress(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}
		String[] addresses = value.split(",");
		for (String address : addresses) {
			String normalized = normalize(address);
			if (!"unknown".equals(normalized)) {
				return normalized;
			}
		}
		return null;
	}

	private String normalize(String value) {
		if (value == null || value.isBlank()) {
			return "unknown";
		}
		String normalized = value.trim();
		if (normalized.startsWith("[") && normalized.contains("]")) {
			normalized = normalized.substring(1, normalized.indexOf(']'));
		}
		if (normalized.length() > 45) {
			return "unknown";
		}
		if ("0:0:0:0:0:0:0:1".equals(normalized)) {
			return "127.0.0.1";
		}
		if (normalized.regionMatches(true, 0, "::ffff:", 0, 7)) {
			normalized = normalized.substring(7);
		}
		return normalized.toLowerCase(Locale.ROOT);
	}
}
