package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.autodeal.ShreeGaneshAutodeal.domain.FuelType;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.dto.VehicleRequest;
import java.math.BigDecimal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LLMServiceTest {

    private final LLMService llmService = new LLMService();

    @Test
    @DisplayName("Should build comprehensive sales prompt from Vehicle entity")
    void shouldBuildPromptFromVehicleEntity() {
        Vehicle vehicle = new Vehicle();
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

        String prompt = llmService.buildPrompt(vehicle);

        assertThat(prompt).contains("Yamaha R15 V4");
        assertThat(prompt).contains("Brand: Yamaha");
        assertThat(prompt).contains("Model: R15 V4");
        assertThat(prompt).contains("Variant: Racing Blue");
        assertThat(prompt).contains("Manufacturing Year: 2023");
        assertThat(prompt).contains("Fuel Type: PETROL");
        assertThat(prompt).contains("Kilometers Driven: 4500 km");
        assertThat(prompt).contains("Price: ₹185000.00");
        assertThat(prompt).contains("Location: Indore");
    }

    @Test
    @DisplayName("Should build comprehensive sales prompt from VehicleRequest")
    void shouldBuildPromptFromVehicleRequest() {
        VehicleRequest request = new VehicleRequest(
                "KTM Duke 390", "MP09AB9999", "KTM", "Duke 390", "Gen 3",
                2024, 2024, 2000, FuelType.PETROL, 1, "Orange",
                new BigDecimal("310000.00"), null, null, 1L,
                null, "Bhopal", null
        );

        String prompt = llmService.buildPrompt(request);

        assertThat(prompt).contains("KTM Duke 390");
        assertThat(prompt).contains("Brand: KTM");
        assertThat(prompt).contains("Model: Duke 390");
        assertThat(prompt).contains("Variant: Gen 3");
        assertThat(prompt).contains("Manufacturing Year: 2024");
        assertThat(prompt).contains("Fuel Type: PETROL");
        assertThat(prompt).contains("Kilometers Driven: 2000 km");
        assertThat(prompt).contains("Price: ₹310000.00");
        assertThat(prompt).contains("Location: Bhopal");
    }
}
