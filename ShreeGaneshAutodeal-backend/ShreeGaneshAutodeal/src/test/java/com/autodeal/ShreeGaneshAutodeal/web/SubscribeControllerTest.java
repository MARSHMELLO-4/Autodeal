package com.autodeal.ShreeGaneshAutodeal.web;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.autodeal.ShreeGaneshAutodeal.service.SubscriberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class SubscribeControllerTest {

    @Mock
    private SubscriberService subscriberService;

    @InjectMocks
    private SubscribeController subscribeController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(subscribeController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/subscribers/request-otp should return 200 OK with success message")
    void shouldRequestOtpSuccessfully() throws Exception {
        String json = """
                {
                    "email": "user@example.com"
                }
                """;

        mockMvc.perform(post("/api/subscribers/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("OTP sent to your email"));

        verify(subscriberService).requestOtp("user@example.com");
    }

    @Test
    @DisplayName("POST /api/subscribers/verify-otp should return 200 OK with success message")
    void shouldVerifyOtpSuccessfully() throws Exception {
        String json = """
                {
                    "email": "user@example.com",
                    "otp": "123456"
                }
                """;

        mockMvc.perform(post("/api/subscribers/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Email verified successfully"));

        verify(subscriberService).verifyOtp("user@example.com", "123456");
    }

    @Test
    @DisplayName("POST /api/subscribers/verify-otp should return 400 Bad Request when OTP is invalid")
    void shouldReturnBadRequestWhenOtpIsInvalid() throws Exception {
        String json = """
                {
                    "email": "user@example.com",
                    "otp": "000000"
                }
                """;

        doThrow(new IllegalArgumentException("Invalid or expired OTP"))
                .when(subscriberService).verifyOtp("user@example.com", "000000");

        mockMvc.perform(post("/api/subscribers/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }
}
