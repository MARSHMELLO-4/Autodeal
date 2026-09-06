package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.autodeal.ShreeGaneshAutodeal.domain.Subscriber;
import com.autodeal.ShreeGaneshAutodeal.domain.SubscriberStatus;
import com.autodeal.ShreeGaneshAutodeal.repository.SubscriberRepository;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SubscriberServiceTest {

    @Mock
    private SubscriberRepository subscriberRepository;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private SubscriberService subscriberService;

    @Test
    @DisplayName("requestOtp should normalize email, generate OTP, and send email")
    void shouldRequestOtpSuccessfully() {
        String rawEmail = "  User@Example.COM  ";
        String normalizedEmail = "user@example.com";

        when(otpService.generateOtp(normalizedEmail)).thenReturn("123456");

        subscriberService.requestOtp(rawEmail);

        verify(otpService).generateOtp(normalizedEmail);
        verify(emailService).sendOtpEmail(normalizedEmail, "123456");
    }

    @Test
    @DisplayName("verifyOtp should throw IllegalArgumentException when OTP is invalid or expired")
    void shouldThrowWhenOtpIsInvalid() {
        when(otpService.verifyOtp("user@example.com", "999999")).thenReturn(false);

        assertThatThrownBy(() -> subscriberService.verifyOtp("user@example.com", "999999"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid or expired OTP");

        verify(subscriberRepository, never()).save(any());
    }

    @Test
    @DisplayName("verifyOtp should create new subscriber with ACTIVE status when email not previously registered")
    void shouldCreateNewActiveSubscriberOnValidOtp() {
        when(otpService.verifyOtp("newbie@example.com", "123456")).thenReturn(true);
        when(subscriberRepository.findByEmail("newbie@example.com")).thenReturn(Optional.empty());

        subscriberService.verifyOtp("newbie@example.com", "123456");

        ArgumentCaptor<Subscriber> captor = ArgumentCaptor.forClass(Subscriber.class);
        verify(subscriberRepository).save(captor.capture());

        Subscriber saved = captor.getValue();
        assertThat(saved.getEmail()).isEqualTo("newbie@example.com");
        assertThat(saved.getStatus()).isEqualTo(SubscriberStatus.ACTIVE);
        assertThat(saved.getVerifiedAt()).isNotNull();
    }

    @Test
    @DisplayName("verifyOtp should update existing subscriber to ACTIVE on valid OTP")
    void shouldUpdateExistingSubscriberOnValidOtp() {
        Subscriber existing = new Subscriber();
        existing.setEmail("existing@example.com");
        existing.setStatus(SubscriberStatus.UNSUBSCRIBED);

        when(otpService.verifyOtp("existing@example.com", "123456")).thenReturn(true);
        when(subscriberRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(existing));

        subscriberService.verifyOtp("existing@example.com", "123456");

        verify(subscriberRepository).save(existing);
        assertThat(existing.getStatus()).isEqualTo(SubscriberStatus.ACTIVE);
        assertThat(existing.getVerifiedAt()).isNotNull();
    }
}
