package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.config.SupabaseProperties;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseStorageService {

	private final SupabaseProperties properties;

	public SupabaseStorageService(SupabaseProperties properties) {
		this.properties = properties;
	}

	public StoredDocument uploadVehicleDocument(Long vehicleId, MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new DocumentStorageException("Document file is required");
		}
		if (!properties.storageConfigured()) {
			throw new DocumentStorageException(
					"Supabase Storage is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET.");
		}

		String bucket = properties.getStorage().getBucket();
		String storagePath = "vehicles/%d/documents/%s-%s".formatted(
				vehicleId,
				UUID.randomUUID(),
				sanitizeFilename(file.getOriginalFilename()));
		String contentType = file.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.getContentType();

		try {
			RestClient.builder()
					.baseUrl(trimTrailingSlash(properties.getUrl()))
					.defaultHeader("apikey", properties.getServiceRoleKey())
					.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getServiceRoleKey())
					.build()
					.post()
					.uri("/storage/v1/object/" + bucket + "/" + storagePath)
					.header(HttpHeaders.CONTENT_TYPE, contentType)
					.header("x-upsert", "true")
					.body(file.getBytes())
					.retrieve()
					.toBodilessEntity();
			return new StoredDocument(publicUrl(bucket, storagePath), storagePath, contentType, file.getSize());
		} catch (IOException ex) {
			throw new DocumentStorageException("Unable to read document file", ex);
		} catch (RuntimeException ex) {
			throw new DocumentStorageException("Unable to upload document to Supabase Storage", ex);
		}
	}

	private String publicUrl(String bucket, String storagePath) {
		String encodedPath = URLEncoder.encode(storagePath, StandardCharsets.UTF_8).replace("+", "%20").replace("%2F", "/");
		return trimTrailingSlash(properties.getUrl()) + "/storage/v1/object/public/" + bucket + "/" + encodedPath;
	}

	private static String sanitizeFilename(String filename) {
		String value = filename == null || filename.isBlank() ? "document" : filename.trim();
		return value.replaceAll("[^A-Za-z0-9._-]", "-");
	}

	private static String trimTrailingSlash(String value) {
		return value == null ? "" : value.replaceAll("/+$", "");
	}
}
