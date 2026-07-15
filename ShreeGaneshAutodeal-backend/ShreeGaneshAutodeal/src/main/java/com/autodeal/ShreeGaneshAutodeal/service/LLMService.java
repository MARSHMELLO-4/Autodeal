package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.dto.VehicleRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.llm.ChatRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.llm.ChatResponse;
import com.autodeal.ShreeGaneshAutodeal.dto.llm.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class LLMService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final RestClient restClient = RestClient.builder().build();

    private static final String SYSTEM_PROMPT = """
            You are an expert automotive sales copywriter.

            Write a professional and attractive vehicle description.

            Rules:
            - Use ONLY the information provided.
            - Never invent features or specifications.
            - Never mention missing information.
            - Write 80-150 words.
            - Use a friendly dealership tone.
            - Highlight reliability, value, and condition.
            - Do not use bullet points.
            - Return ONLY the description.
            """;

    public String generateAiDescription(VehicleRequest request) {

        ChatRequest chatRequest = new ChatRequest(
                model,
                List.of(
                        new Message("system", SYSTEM_PROMPT),
                        new Message("user", buildPrompt(request))
                ),
                0.7
        );

        ChatResponse response = restClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(chatRequest)
                .retrieve()
                .body(ChatResponse.class);

        if (response == null
                || response.choices() == null
                || response.choices().isEmpty()) {
            throw new RuntimeException("Failed to generate AI description.");
        }

        return response.choices()
                .getFirst()
                .message()
                .content()
                .trim();
    }

    private String buildPrompt(VehicleRequest request) {

        return """
                Generate a sales description for the following used vehicle.

                Vehicle Details:

                Title: %s
                Brand: %s
                Model: %s
                Variant: %s
                Manufacturing Year: %d
                Registration Year: %s
                Fuel Type: %s
                Kilometers Driven: %d km
                Number of Owners: %s
                Color: %s
                Price: ₹%s
                Location: %s

                Return only the description.
                """
                .formatted(
                        request.title(),
                        request.brand(),
                        request.modelName(),
                        request.variantName(),
                        request.manufactureYear(),
                        request.registrationYear(),
                        request.fuelType(),
                        request.kilometersDriven(),
                        request.ownerSerial(),
                        request.color(),
                        request.price(),
                        request.location()
                );
    }

}