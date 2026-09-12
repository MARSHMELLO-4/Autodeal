package com.autodeal.ShreeGaneshAutodeal.service;

import static org.mockito.Mockito.verify;

import com.autodeal.ShreeGaneshAutodeal.config.RabbitMQConfig;
import com.autodeal.ShreeGaneshAutodeal.service.RabitMQ.RabbitmqSender;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@ExtendWith(MockitoExtension.class)
class RabbitmqSenderTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private RabbitmqSender rabbitmqSender;

    @Test
    @DisplayName("Should send vehicle created message to vehicle_create queue")
    void shouldSendVehicleCreated() {
        rabbitmqSender.sendVehicleCreated(123L);

        verify(rabbitTemplate).convertAndSend(RabbitMQConfig.VEHICLE_CREATE_QUEUE, 123L);
    }

    @Test
    @DisplayName("Should send generate description message to vehicle_llm_description queue")
    void shouldSendGenerateDescription() {
        rabbitmqSender.sendGenerateDescription(456L);

        verify(rabbitTemplate).convertAndSend(RabbitMQConfig.LLM_DESCRIPTION_QUEUE, 456L);
    }
}
