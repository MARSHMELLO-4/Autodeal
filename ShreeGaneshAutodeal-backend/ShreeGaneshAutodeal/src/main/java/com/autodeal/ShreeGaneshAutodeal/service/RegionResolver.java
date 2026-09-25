package com.autodeal.ShreeGaneshAutodeal.service;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Component
public class RegionResolver {

	private static final String UNKNOWN = "Unknown";

	private final ObjectMapper objectMapper;
	private final HttpClient httpClient;
	private final String geoIpUrl;
	private final String geoIpApiKey;
	private final Duration timeout;

	public RegionResolver(
			ObjectMapper objectMapper,
			@Value("${app.analytics.geoip-url:}") String geoIpUrl,
			@Value("${app.analytics.geoip-api-key:}") String geoIpApiKey,
			@Value("${app.analytics.geoip-timeout-ms:800}") long timeoutMs) {
		this.objectMapper = objectMapper;
		this.geoIpUrl = geoIpUrl == null ? "" : geoIpUrl.trim();
		this.geoIpApiKey = geoIpApiKey == null ? "" : geoIpApiKey.trim();
		this.timeout = Duration.ofMillis(Math.max(100, timeoutMs));
		this.httpClient = HttpClient.newBuilder().connectTimeout(this.timeout).build();
	}

	public ResolvedRegion resolve(HttpServletRequest request, String ipAddress) {
		String country = firstHeader(request, "CF-IPCountry", "CloudFront-Viewer-Country", "X-Geo-Country");
		String region = firstHeader(request, "X-Geo-Region", "CF-Region", "X-Region");
		String city = firstHeader(request, "X-Geo-City", "CF-City", "X-City");

		if (isMissing(country) || isMissing(region) || isMissing(city)) {
			ResolvedRegion providerRegion = lookup(ipAddress);
			if (providerRegion != null) {
				if (isMissing(country)) {
					country = providerRegion.country();
				}
				if (isMissing(region)) {
					region = providerRegion.region();
				}
				if (isMissing(city)) {
					city = providerRegion.city();
				}
			}
		}

		return new ResolvedRegion(valueOrUnknown(country), valueOrUnknown(region), valueOrUnknown(city));
	}

	private ResolvedRegion lookup(String ipAddress) {
		if (geoIpUrl.isBlank() || !isPublicAddress(ipAddress)) {
			return null;
		}
		try {
			HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
					.uri(URI.create(buildGeoIpUrl(ipAddress)))
					.timeout(timeout)
					.header("Accept", "application/json");
			if (!geoIpApiKey.isBlank()) {
				requestBuilder.header("X-API-Key", geoIpApiKey);
			}
			HttpResponse<String> response = httpClient.send(
					requestBuilder.GET().build(),
					HttpResponse.BodyHandlers.ofString());
			if (response.statusCode() < 200 || response.statusCode() >= 300) {
				return null;
			}
			return parse(response.body());
		} catch (InterruptedException exception) {
			Thread.currentThread().interrupt();
			return null;
		} catch (IOException | RuntimeException exception) {
			return null;
		}
	}

	private ResolvedRegion parse(String body) {
		JsonNode root = objectMapper.readTree(body);
		String country = text(root, "country_code", "countryCode");
		if (root.has("country") && root.get("country").isObject()) {
			country = firstNonBlank(
					text(root.get("country"), "code", "country_code", "name"),
					country);
		} else {
			country = firstNonBlank(text(root, "country"), country);
		}
		String region = firstNonBlank(
				text(root, "region", "region_name", "regionName"),
				text(root, "state", "state_name"));
		String city = text(root, "city", "locality");
		return new ResolvedRegion(valueOrUnknown(country), valueOrUnknown(region), valueOrUnknown(city));
	}

	private String buildGeoIpUrl(String ipAddress) {
		String encodedIp = URLEncoder.encode(ipAddress, StandardCharsets.UTF_8);
		if (geoIpUrl.contains("{ip}")) {
			return geoIpUrl.replace("{ip}", encodedIp);
		}
		return geoIpUrl + (geoIpUrl.contains("?") ? "&" : "?") + "ip=" + encodedIp;
	}

	private String firstHeader(HttpServletRequest request, String... names) {
		if (request == null) {
			return null;
		}
		for (String name : names) {
			String value = normalizeHeader(request.getHeader(name));
			if (!isMissing(value)) {
				return value;
			}
		}
		return null;
	}

	private String text(JsonNode node, String... names) {
		if (node == null) {
			return null;
		}
		for (String name : names) {
			JsonNode value = node.get(name);
			if (value != null && value.isValueNode() && !value.isNull()) {
				String text = normalizeHeader(value.asString());
				if (!isMissing(text)) {
					return text;
				}
			}
		}
		return null;
	}

	private String firstNonBlank(String first, String second) {
		return isMissing(first) ? second : first;
	}

	private String normalizeHeader(String value) {
		if (value == null) {
			return null;
		}
		String normalized = value.trim();
		if (normalized.isEmpty() || "unknown".equalsIgnoreCase(normalized)
				|| "xx".equalsIgnoreCase(normalized) || "t1".equalsIgnoreCase(normalized)) {
			return null;
		}
		if (normalized.length() > 120) {
			return normalized.substring(0, 120);
		}
		return normalized;
	}

	private String valueOrUnknown(String value) {
		return isMissing(value) ? UNKNOWN : value;
	}

	private boolean isMissing(String value) {
		return value == null || value.isBlank();
	}

	private boolean isPublicAddress(String ipAddress) {
		if (isMissing(ipAddress) || "unknown".equalsIgnoreCase(ipAddress)
				|| !ipAddress.matches("[0-9a-fA-F:.%]+")) {
			return false;
		}
		try {
			InetAddress address = InetAddress.getByName(ipAddress);
			if (address.isAnyLocalAddress() || address.isLoopbackAddress()
					|| address.isLinkLocalAddress() || address.isSiteLocalAddress()
					|| address.isMulticastAddress()) {
				return false;
			}
			byte[] bytes = address.getAddress();
			return bytes.length != 16 || (bytes[0] & 0xfe) != 0xfc;
		} catch (IOException exception) {
			return false;
		}
	}

	public record ResolvedRegion(String country, String region, String city) {
	}
}
