package com.autodeal.ShreeGaneshAutodeal.dto;

import com.autodeal.ShreeGaneshAutodeal.domain.DocumentType;
import java.time.Instant;

public record VehicleDocumentResponse(
		Long id,
		Long vehicleId,
		DocumentType type,
		String title,
		String fileUrl,
		String storagePath,
		String contentType,
		Long fileSize,
		Instant uploadedAt) {
}
