package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private OtpService otpService;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        otpService = new OtpService(redisTemplate);
    }

    @Test
    @DisplayName("generateOtp should create 6-digit OTP and store it in Redis with 5 minute expiration")
    void shouldGenerateOtpAndStoreInRedis() {
        String email = "test@example.com";
        String otp = otpService.generateOtp(email);

        assertThat(otp).hasSize(6);
        assertThat(otp).matches("\\d{6}");
        verify(valueOperations).set(eq("subscriber:otp:test@example.com"), eq(otp), eq(Duration.ofMinutes(5)));
    }

    @Test
    @DisplayName("verifyOtp should return true and delete key when OTP matches stored value")
    void shouldVerifyOtpSuccessfully() {
        String email = "test@example.com";
        String key = "subscriber:otp:test@example.com";
        when(valueOperations.get(key)).thenReturn("123456");

        boolean result = otpService.verifyOtp(email, "123456");

        assertThat(result).isTrue();
        verify(redisTemplate).delete(key);
    }

    @Test
    @DisplayName("verifyOtp should return false when no OTP is stored in Redis")
    void shouldReturnFalseWhenNoStoredOtp() {
        String email = "test@example.com";
        String key = "subscriber:otp:test@example.com";
        when(valueOperations.get(key)).thenReturn(null);

        boolean result = otpService.verifyOtp(email, "123456");

        assertThat(result).isFalse();
        verify(redisTemplate, never()).delete(any(String.class));
    }

    @Test
    @DisplayName("verifyOtp should return false when provided OTP does not match stored OTP")
    void shouldReturnFalseWhenOtpDoesNotMatch() {
        String email = "test@example.com";
        String key = "subscriber:otp:test@example.com";
        when(valueOperations.get(key)).thenReturn("123456");

        boolean result = otpService.verifyOtp(email, "654321");

        assertThat(result).isFalse();
        verify(redisTemplate, never()).delete(any(String.class));
    }
}
