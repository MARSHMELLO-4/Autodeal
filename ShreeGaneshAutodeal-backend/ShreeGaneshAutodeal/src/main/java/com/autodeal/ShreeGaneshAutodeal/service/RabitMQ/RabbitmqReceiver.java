package com.autodeal.ShreeGaneshAutodeal.service.RabitMQ;

import com.autodeal.ShreeGaneshAutodeal.config.RabbitMQConfig;
import com.autodeal.ShreeGaneshAutodeal.service.NotificationService;
import com.autodeal.ShreeGaneshAutodeal.service.VehicleService;
import com.autodeal.ShreeGaneshAutodeal.service.websockets.VehicleWebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitmqReceiver {

    private static final Logger log = LoggerFactory.getLogger(RabbitmqReceiver.class);

    private final NotificationService notificationService;
    private final VehicleService vehicleService;
    private final VehicleWebSocketService vehicleWebSocketService;

    public RabbitmqReceiver(NotificationService notificationService
            , VehicleService vehicleService,
                            VehicleWebSocketService vehicleWebSocketService) {
        this.notificationService = notificationService;
        this.vehicleService = vehicleService;
        this.vehicleWebSocketService = vehicleWebSocketService;
    }

    @RabbitListener(queues = RabbitMQConfig.VEHICLE_CREATE_QUEUE)
    public void sendNotifications(Long vehicleId) {
        try {
            notificationService.notifySubscribers(vehicleId);
            vehicleWebSocketService.publishVehicleAdded(vehicleId);
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


    @RabbitListener(queues =  RabbitMQConfig.VEHICLE_SOLD)
    public void broadcastVehicleSold(Long vehicleID){
        try{
            vehicleWebSocketService.publishVehicleSold(vehicleID);
        } catch(Exception e){
            log.error("Failed to broadcast vehicle sold for the vehicle ID : {}", vehicleID, e);
        }
    }
}
