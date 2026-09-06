package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitmqReceiver {

    private static final Logger log = LoggerFactory.getLogger(RabbitmqReceiver.class);

    private final NotificationService notificationService;
    private final VehicleService vehicleService;

    public RabbitmqReceiver(NotificationService notificationService, VehicleService vehicleService) {
        this.notificationService = notificationService;
        this.vehicleService = vehicleService;
    }

    @RabbitListener(queues = RabbitMQConfig.VEHICLE_CREATE_QUEUE)
    public void sendNotifications(Long vehicleId) {
        try {
            notificationService.notifySubscribers(vehicleId);
        } catch (Exception e) {
            log.error("Failed to send vehicle notification for vehicle id: {}", vehicleId, e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.LLM_DESCRIPTION_QUEUE)
    public void generateVehicleDescription(Long vehicleId) {
        try {
            vehicleService.generateAndSaveAiDescription(vehicleId);
        } catch (Exception e) {
            log.error("Failed to generate AI description for vehicle id: {}", vehicleId, e);
        }
    }
}
