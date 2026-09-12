package com.autodeal.ShreeGaneshAutodeal.service.websockets;


import com.autodeal.ShreeGaneshAutodeal.dto.wesockets.WebSocketVehicleEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class VehicleWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public VehicleWebSocketService(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate; //dependency injection
    }

    public void publishVehicleSold(Long vehicleId){

        WebSocketVehicleEvent event =
                new WebSocketVehicleEvent(
                        "VEHICLE_SOLD",
                        vehicleId
                );

        //now publish the event
        messagingTemplate.convertAndSend(
                "/topic/inventory",
                event
        );


    }


}
