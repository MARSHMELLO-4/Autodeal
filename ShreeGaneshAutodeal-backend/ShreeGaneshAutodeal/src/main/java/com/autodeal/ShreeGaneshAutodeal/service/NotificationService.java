package com.autodeal.ShreeGaneshAutodeal.service;


import com.autodeal.ShreeGaneshAutodeal.domain.Subscriber;
import com.autodeal.ShreeGaneshAutodeal.domain.SubscriberStatus;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.repository.SubscriberRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleRepository;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final SubscriberRepository subscriberRepository;
    private final VehicleRepository vehicleRepository;
    private final EmailService emailService;

    public NotificationService(SubscriberRepository subscriberRepository,
                               VehicleRepository vehicleRepository,
                               EmailService emailService) {
        this.subscriberRepository = subscriberRepository;
        this.vehicleRepository = vehicleRepository;
        this.emailService = emailService;
    }

    //now we have to send the notification
    public void notifySubscribers(Long vehicleId) throws MessagingException {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();

        //now we have to get all the subscribers
        List<Subscriber> subscribersList = subscriberRepository.findAllByStatus(SubscriberStatus.ACTIVE);

        for (Subscriber subscriber : subscribersList) {
            //now we have to send the notification to the  subscriber
            emailService.sendVehicleAddNotification(
                    subscriber.getEmail(),
                    vehicle.getBrand(),
                    vehicle.getVariantName(),
                    vehicle.getManufactureYear().toString(),
                    vehicle.getPrice().toString(),
                    vehicle.getThumbnailUrl()
            );
        }

    }
}
