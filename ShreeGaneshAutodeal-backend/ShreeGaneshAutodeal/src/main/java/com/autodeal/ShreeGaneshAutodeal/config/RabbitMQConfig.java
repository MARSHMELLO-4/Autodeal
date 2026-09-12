package com.autodeal.ShreeGaneshAutodeal.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String VEHICLE_CREATE_QUEUE = "vehicle_create";
    public static final String LLM_DESCRIPTION_QUEUE = "vehicle_llm_description";
    public static final String VEHICLE_SOLD = "vehicle_sold";

    @Bean
    public Queue vehicleCreateQueue() {
        return new Queue(VEHICLE_CREATE_QUEUE, true);
    }

    @Bean
    public Queue llmDescriptionQueue() {
        return new Queue(LLM_DESCRIPTION_QUEUE, true);
    }


    @Bean
    public Queue vehicleSoldWSQueue(){
        return new Queue(VEHICLE_SOLD, true);
    }
}