package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.domain.Subscriber;
import com.autodeal.ShreeGaneshAutodeal.domain.SubscriberStatus;
import com.autodeal.ShreeGaneshAutodeal.repository.SubscriberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscriberService {

    private final SubscriberRepository subscriberRepository;
    private final OtpService otpService;
    private final EmailService emailService;

    public SubscriberService(
            SubscriberRepository subscriberRepository,
            OtpService otpService,
            EmailService emailService) {

        this.subscriberRepository = subscriberRepository;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    public void requestOtp(String email) {

        email = normalizeEmail(email);

        String otp = otpService.generateOtp(email);

        emailService.sendOtpEmail(email, otp);
    }

    public void verifyOtp(String email, String otp) {

        email = normalizeEmail(email);

        boolean valid =
                otpService.verifyOtp(email, otp);

        if (!valid) {
            throw new IllegalArgumentException(
                    "Invalid or expired OTP"
            );
        }

        String finalEmail = email;
        Subscriber subscriber =
                subscriberRepository
                        .findByEmail(email)
                        .orElseGet(() -> {
                            Subscriber newSubscriber =
                                    new Subscriber();

                            newSubscriber.setEmail(finalEmail);
                            newSubscriber.setCreatedAt(
                                    LocalDateTime.now()
                            );

                            return newSubscriber;
                        });

        subscriber.setStatus(
                SubscriberStatus.ACTIVE
        );

        subscriber.setVerifiedAt(
                LocalDateTime.now()
        );

        subscriberRepository.save(subscriber);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
