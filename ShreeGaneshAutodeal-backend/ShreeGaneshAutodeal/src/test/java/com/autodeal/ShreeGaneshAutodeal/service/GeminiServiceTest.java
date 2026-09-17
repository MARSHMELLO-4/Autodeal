package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class GeminiServiceTest {

    private MockRestServiceServer server;
    private GeminiService geminiService;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        geminiService = new GeminiService(
                builder.build(),
                "test-key",
                "https://generativelanguage.googleapis.com/v1beta",
                "gemini-2.5-flash-image");
    }

    private Vehicle buildVehicle() {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setTitle("Yamaha R15 V4");
        vehicle.setBrand("Yamaha");
        vehicle.setModelName("R15 V4");
        vehicle.setVariantName("Racing Blue");
        vehicle.setManufactureYear(2023);
        vehicle.setRegistrationYear(2023);
        vehicle.setFuelType(FuelType.PETROL);
        vehicle.setKilometersDriven(4500);
        vehicle.setOwnerSerial(1);
        vehicle.setColor("Blue");
        vehicle.setPrice(new BigDecimal("185000.00"));
        vehicle.setLocation("Indore");
        return vehicle;
    }

    @Test
    @DisplayName("Should call Gemini and return generated image bytes")
    void shouldCallGeminiAndReturnImage() {
        byte[] input = new byte[]{1, 2, 3};

        server.expect(requestTo(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("x-goog-api-key", "test-key"))
                .andRespond(withSuccess("""
                        {
                          "candidates": [
                            {
                              "content": {
                                "parts": [
                                  { "inlineData": { "mimeType": "image/png", "data": "QUJDRA==" } }
                                ]
                              }
                            }
                          ]
                        }
                        """, MediaType.APPLICATION_JSON));

        byte[] result = geminiService.generatePromoImage(buildVehicle(), "image/jpeg", input);

        assertThat(result).isEqualTo("ABCD".getBytes());
        server.verify();
    }

    @Test
    @DisplayName("Should throw when Gemini returns no candidates")
    void shouldThrowWhenNoCandidates() {
        server.expect(requestTo(org.hamcrest.Matchers.containsString(":generateContent")))
                .andRespond(withSuccess("""
                        { "promptFeedback": { "blockReason": "SAFETY" } }
                        """, MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> geminiService.generatePromoImage(
                buildVehicle(), "image/jpeg", new byte[]{1, 2, 3}))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("AI was unable to generate an image");

        server.verify();
    }

    @Test
    @DisplayName("Should throw when API key is not configured")
    void shouldThrowWhenApiKeyMissing() {
        GeminiService withoutKey = new GeminiService(
                RestClient.builder().build(),
                null,
                "https://generativelanguage.googleapis.com/v1beta",
                "gemini-2.5-flash-image");

        assertThatThrownBy(() -> withoutKey.generatePromoImage(
                buildVehicle(), "image/jpeg", new byte[]{1, 2, 3}))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Gemini API key is not configured");
    }

    @Test
    @DisplayName("Should throw when input image is empty")
    void shouldThrowWhenInputImageEmpty() {
        assertThatThrownBy(() -> geminiService.generatePromoImage(
                buildVehicle(), "image/jpeg", new byte[0]))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("bike photo is required");
    }

    @Test
    @DisplayName("Should build promotional prompt with vehicle details and brand")
    void shouldBuildPromoPrompt() {
        String prompt = geminiService.buildPromoPrompt(buildVehicle());

        assertThat(prompt).contains("Yamaha R15 V4");
        assertThat(prompt).contains("₹1,85,000");
        assertThat(prompt).contains("2023 | PETROL | 4500 km | Blue");
        assertThat(prompt).contains("SHREE GANESH AUTODEAL");
        assertThat(prompt).contains("Visit our showroom today!");
    }

    @Test
    @DisplayName("Should format price using Indian digit grouping")
    void shouldFormatIndianPrices() {
        assertThat(GeminiService.indianGrouping("185000")).isEqualTo("1,85,000");
        assertThat(GeminiService.indianGrouping("1000")).isEqualTo("1,000");
        assertThat(GeminiService.indianGrouping("999")).isEqualTo("999");
        assertThat(GeminiService.indianGrouping("10000000")).isEqualTo("1,00,00,000");
        assertThat(GeminiService.indianGrouping("500")).isEqualTo("500");
    }
}