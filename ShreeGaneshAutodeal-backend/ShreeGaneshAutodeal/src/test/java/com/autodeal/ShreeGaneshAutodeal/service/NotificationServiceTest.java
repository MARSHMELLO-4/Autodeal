package com.autodeal.ShreeGaneshAutodeal.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.autodeal.ShreeGaneshAutodeal.domain.Subscriber;
import com.autodeal.ShreeGaneshAutodeal.domain.SubscriberStatus;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.repository.SubscriberRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private SubscriberRepository subscriberRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NotificationService notificationService;

    private Vehicle testVehicle;

    @BeforeEach
    void setUp() {
        testVehicle = new Vehicle();
        testVehicle.setId(10L);
        testVehicle.setTitle("Bajaj Pulsar NS200");
        testVehicle.setBrand("Bajaj");
        testVehicle.setModelName("Pulsar NS200");
        testVehicle.setVariantName("ABS BS6");
        testVehicle.setPrice(new BigDecimal("140000.00"));
        testVehicle.setThumbnailUrl("https://example.com/pulsar.jpg");
    }

    @Test
    @DisplayName("Should notify all active subscribers with formatted vehicle details")
    void shouldNotifyAllActiveSubscribers() throws MessagingException {
        Subscriber sub1 = new Subscriber();
        sub1.setEmail("user1@example.com");
        sub1.setStatus(SubscriberStatus.ACTIVE);

        Subscriber sub2 = new Subscriber();
        sub2.setEmail("user2@example.com");
        sub2.setStatus(SubscriberStatus.ACTIVE);

        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(testVehicle));
        when(subscriberRepository.findAllByStatus(SubscriberStatus.ACTIVE)).thenReturn(List.of(sub1, sub2));

        notificationService.notifySubscribers(10L);

        verify(emailService).sendVehicleAddNotification(
                eq("user1@example.com"),
                eq("Bajaj Pulsar NS200"),
                eq("Bajaj"),
                eq("Pulsar NS200 ABS BS6"),
                eq("140000.00"),
                eq("https://example.com/pulsar.jpg")
        );

        verify(emailService).sendVehicleAddNotification(
                eq("user2@example.com"),
                eq("Bajaj Pulsar NS200"),
                eq("Bajaj"),
                eq("Pulsar NS200 ABS BS6"),
                eq("140000.00"),
                eq("https://example.com/pulsar.jpg")
        );
    }

    @Test
    @DisplayName("Should return early without sending emails if no active subscribers exist")
    void shouldReturnEarlyWhenNoActiveSubscribers() throws MessagingException {
        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(testVehicle));
        when(subscriberRepository.findAllByStatus(SubscriberStatus.ACTIVE)).thenReturn(List.of());

        notificationService.notifySubscribers(10L);

        verify(emailService, never()).sendVehicleAddNotification(any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw EntityNotFoundException when vehicle is not found in repository")
    void shouldThrowWhenVehicleNotFound() {
        when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationService.notifySubscribers(999L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Vehicle not found with id: 999");

        verify(subscriberRepository, never()).findAllByStatus(any());
    }
}
