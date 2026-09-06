package com.autodeal.ShreeGaneshAutodeal.service;


import com.autodeal.ShreeGaneshAutodeal.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitmqSender {

    private final RabbitTemplate rabbitTemplate;

    public RabbitmqSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendVehicleCreated(Long vehicleId) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.VEHICLE_CREATE_QUEUE,
                vehicleId
        );
    }

    public void sendGenerateDescription(Long vehicleId) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.LLM_DESCRIPTION_QUEUE,
                vehicleId
        );
    }
}
