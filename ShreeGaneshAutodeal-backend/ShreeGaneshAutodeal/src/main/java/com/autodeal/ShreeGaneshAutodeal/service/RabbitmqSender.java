package com.autodeal.ShreeGaneshAutodeal.service;


import com.autodeal.ShreeGaneshAutodeal.config.RabbitMQConfig;
import com.rabbitmq.client.AMQP;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class RabbitmqSender {

    private RabbitTemplate rabbitTemplate;

    public RabbitmqSender(RabbitTemplate rabbitTemplate){
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendVehicleCreated(Long vehicleId){
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.VEHICLE_CREATE_QUEUE,
                vehicleId
        );
    }

}
