package com.autodeal.ShreeGaneshAutodeal.service;


import com.autodeal.ShreeGaneshAutodeal.config.RabbitMQConfig;
import jakarta.mail.MessagingException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitmqReceiver {

    private NotificationService notificationService;

    public RabbitmqReceiver(NotificationService notificationService){
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = RabbitMQConfig.VEHICLE_CREATE_QUEUE)
    public void sendNotifications(Long vehicleId) throws MessagingException {
        //get the subscribers from the list
        //then send them the notifications
        notificationService.notifySubscribers(vehicleId);
    }


}
