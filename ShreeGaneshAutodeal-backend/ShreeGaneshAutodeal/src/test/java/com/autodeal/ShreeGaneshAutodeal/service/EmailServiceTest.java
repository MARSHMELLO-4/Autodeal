package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(mailSender, "test@autodeal.com");
    }

    @Test
    @DisplayName("Should send simple OTP email with correct recipient, subject, and text")
    void shouldSendOtpEmail() {
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        emailService.sendOtpEmail("customer@example.com", "482910");

        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();
        assertThat(sent.getFrom()).isEqualTo("test@autodeal.com");
        assertThat(sent.getTo()).containsExactly("customer@example.com");
        assertThat(sent.getSubject()).isEqualTo("Verification Mail - Shree Ganesh Autodeal");
        assertThat(sent.getText()).contains("482910");
    }

    @Test
    @DisplayName("Should send vehicle notification email with image thumbnail")
    void shouldSendVehicleAddNotificationWithImage() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendVehicleAddNotification(
                "buyer@example.com",
                "Honda Activa 6G",
                "Honda",
                "Activa 6G Deluxe",
                "75000",
                "https://example.com/activa.jpg"
        );

        verify(mailSender).send(mimeMessage);
        assertThat(mimeMessage.getSubject()).isEqualTo("New Vehicle Available - Shree Ganesh Autodeal");
    }

    @Test
    @DisplayName("Should send vehicle notification email safely when thumbnail URL is null")
    void shouldSendVehicleAddNotificationWithoutImage() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendVehicleAddNotification(
                "buyer@example.com",
                "TVS Jupiter",
                "TVS",
                "Jupiter 125",
                "85000",
                null
        );

        verify(mailSender).send(mimeMessage);
        assertThat(mimeMessage.getSubject()).isEqualTo("New Vehicle Available - Shree Ganesh Autodeal");
    }
}
