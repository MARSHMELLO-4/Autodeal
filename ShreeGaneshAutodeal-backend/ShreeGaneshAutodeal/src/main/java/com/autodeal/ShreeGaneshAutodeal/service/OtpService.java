package com.autodeal.ShreeGaneshAutodeal.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final long OTP_EXPIRATION = 5;

    public OtpService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateOtp(String email) {

        String otp = String.format(
                "%06d",
                new SecureRandom().nextInt(1_000_000)
        );

        String key = "subscriber:otp:" + email;

        redisTemplate.opsForValue().set(
                key,
                otp,
                Duration.ofMinutes(OTP_EXPIRATION)
        );

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {

        String key = "subscriber:otp:" + email;

        String storedOtp =
                redisTemplate.opsForValue().get(key);

        if (storedOtp == null) {
            return false;
        }

        if (!storedOtp.equals(otp)) {
            return false;
        }

        redisTemplate.delete(key);

        return true;
    }
}