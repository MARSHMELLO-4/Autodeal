package com.autodeal.ShreeGaneshAutodeal.dto;

public record AiShareResponse(
        Long vehicleId,
        String title,
        String brand,
        String modelName,
        int manufactureYear,
        String fuelType,
        int kilometersDriven,
        String color,
        String price,
        String imageBase64,
        String mimeType
) {
}