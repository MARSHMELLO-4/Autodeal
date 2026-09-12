package com.autodeal.ShreeGaneshAutodeal.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import com.autodeal.ShreeGaneshAutodeal.service.RabitMQ.RabbitmqReceiver;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RabbitmqReceiverTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private VehicleService vehicleService;

    @InjectMocks
    private RabbitmqReceiver rabbitmqReceiver;

    @Test
    @DisplayName("sendNotifications should invoke notificationService.notifySubscribers")
    void shouldSendNotifications() throws MessagingException {
        rabbitmqReceiver.sendNotifications(100L);

        verify(notificationService).notifySubscribers(100L);
    }

    @Test
    @DisplayName("sendNotifications should handle MessagingException gracefully without rethrowing")
    void shouldHandleMessagingExceptionGracefully() throws MessagingException {
        doThrow(new MessagingException("Mail server down"))
                .when(notificationService).notifySubscribers(100L);

        assertDoesNotThrow(() -> rabbitmqReceiver.sendNotifications(100L));
        verify(notificationService).notifySubscribers(100L);
    }

    @Test
    @DisplayName("generateVehicleDescription should invoke vehicleService.generateAndSaveAiDescription")
    void shouldGenerateVehicleDescription() {
        rabbitmqReceiver.generateVehicleDescription(200L);

        verify(vehicleService).generateAndSaveAiDescription(200L);
    }

    @Test
    @DisplayName("generateVehicleDescription should handle EntityNotFoundException gracefully without rethrowing")
    void shouldHandleEntityNotFoundGracefully() {
        doThrow(new EntityNotFoundException("Vehicle not found"))
                .when(vehicleService).generateAndSaveAiDescription(200L);

        assertDoesNotThrow(() -> rabbitmqReceiver.generateVehicleDescription(200L));
        verify(vehicleService).generateAndSaveAiDescription(200L);
    }
}
