package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.model}")
    private String model;

    private final RestClient restClient;

    public GeminiService() {
        this.restClient = RestClient.builder().build();
    }

    GeminiService(RestClient restClient, String apiKey, String apiUrl, String model) {
        this.restClient = restClient;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
    }

    public byte[] generatePromoImage(Vehicle vehicle, String mimeType, byte[] inputImage) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is not configured. Add GEMINI_API_KEY to the backend environment.");
        }
        if (inputImage == null || inputImage.length == 0) {
            throw new IllegalArgumentException("A bike photo is required to generate the shareable image");
        }

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(
                                Map.of("text", buildPromoPrompt(vehicle)),
                                Map.of("inline_data", Map.of(
                                        "mime_type", mimeType,
                                        "data", Base64.getEncoder().encodeToString(inputImage)))
                        )
                )),
                "generationConfig", Map.of(
                        "responseModalities", List.of("IMAGE"),
                        "imageConfig", Map.of("aspectRatio", "9:16"))
        );

        GeminiResponse response = restClient.post()
                .uri(trailingSlash(apiUrl) + "/models/" + model + ":generateContent")
                .header("x-goog-api-key", apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(requestBody)
                .retrieve()
                .body(GeminiResponse.class);

        return extractImage(response);
    }

    public byte[] downloadBikeImage(String url) {
        try {
            return restClient.get()
                    .uri(url)
                    .header(HttpHeaders.USER_AGENT, "ShreeGaneshAutodeal-Backend")
                    .retrieve()
                    .body(byte[].class);
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("Unable to download the bike photo for AI generation.", ex);
        }
    }

    private byte[] extractImage(GeminiResponse response) {
        if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
            throw new RuntimeException("AI was unable to generate an image. Please try again.");
        }

        for (GeminiResponse.Candidate.Content.Part part
                : response.candidates().getFirst().content().parts()) {
            if (part.inlineData() != null && part.inlineData().data() != null) {
                return Base64.getDecoder().decode(part.inlineData().data());
            }
        }

        throw new RuntimeException("AI did not return an image. Please try again.");
    }

    String buildPromoPrompt(Vehicle vehicle) {
        return """
                You are a professional automotive advertising designer.

                Create a premium, eye-catching WhatsApp status image (9:16 portrait) promoting the
                motorcycle shown in the attached photo.

                Guidelines:
                - Keep the motorcycle's appearance EXACTLY as shown in the photo (same model, color, condition). Do NOT redesign or alter the bike itself.
                - Use a stylish, clean background with a smooth gradient and soft studio lighting that makes the bike stand out.
                - Overlay text in large, bold, easy-to-read fonts. All text must be spelled perfectly with zero typos.
                - Title: "%s"
                - Price: "%s"
                - Key highlights line: %d | %s | %d km%s
                - Dealership brand name: "SHREE GANESH AUTODEAL" rendered prominently.
                - Call to action: "Visit our showroom today!"
                - Footer: "Indore · MP  •  +91 89828 83521" in a small elegant line.
                - Do NOT invent any specifications, features, or offers that are not listed above.
                - Premium warm tones, high resolution, portrait orientation.
                """
                .formatted(
                        vehicle.getTitle(),
                        formatIndianPrice(vehicle.getPrice()),
                        vehicle.getManufactureYear(),
                        vehicle.getFuelType() == null ? "" : vehicle.getFuelType().name(),
                        vehicle.getKilometersDriven(),
                        vehicle.getColor() == null || vehicle.getColor().isBlank()
                                ? ""
                                : " | " + vehicle.getColor().trim());
    }

    private static String formatIndianPrice(BigDecimal price) {
        if (price == null) {
            return "Best Price";
        }
        return "\u20B9" + indianGrouping(price.setScale(0, RoundingMode.HALF_UP).toBigInteger().toString());
    }

    /** Reformats a plain number string using Indian digit grouping, e.g. 185000 -> 1,85,000 */
    static String indianGrouping(String plain) {
        if (plain == null || plain.length() <= 3) {
            return plain;
        }
        String last3 = plain.substring(plain.length() - 3);
        String rest = plain.substring(0, plain.length() - 3);
        int first = rest.length() % 2;
        StringBuilder out = new StringBuilder();
        int start = 0;
        if (first > 0) {
            out.append(rest, 0, first);
            start = first;
            if (start < rest.length()) {
                out.append(',');
            }
        }
        while (start < rest.length()) {
            int next = Math.min(start + 2, rest.length());
            out.append(rest, start, next);
            start = next;
            if (start < rest.length()) {
                out.append(',');
            }
        }
        return out.append(',').append(last3).toString();
    }

    private static String trailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }

    public record GeminiResponse(@JsonProperty("candidates") List<Candidate> candidates) {

        public record Candidate(@JsonProperty("content") Content content) {

            public record Content(@JsonProperty("parts") List<Part> parts) {

                public record Part(@JsonProperty("inlineData") InlineData inlineData) {

                    public record InlineData(
                            @JsonProperty("mimeType") String mimeType,
                            @JsonProperty("data") String data) {
                    }
                }
            }
        }
    }
}