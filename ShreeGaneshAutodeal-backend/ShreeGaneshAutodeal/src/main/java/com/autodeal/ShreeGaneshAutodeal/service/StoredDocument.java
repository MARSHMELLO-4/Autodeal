package com.autodeal.ShreeGaneshAutodeal.service;

public record StoredDocument(
		String fileUrl,
		String storagePath,
		String contentType,
		long fileSize) {
}
