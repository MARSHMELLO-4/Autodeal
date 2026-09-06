package com.autodeal.ShreeGaneshAutodeal.service;


import com.autodeal.ShreeGaneshAutodeal.domain.Subscriber;
import com.autodeal.ShreeGaneshAutodeal.domain.SubscriberStatus;
import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.repository.SubscriberRepository;
import com.autodeal.ShreeGaneshAutodeal.repository.VehicleRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

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

    public void notifySubscribers(Long vehicleId) throws MessagingException {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + vehicleId));

        List<Subscriber> subscribersList = subscriberRepository.findAllByStatus(SubscriberStatus.ACTIVE);
        if (subscribersList.isEmpty()) {
            log.info("No active subscribers found. Skipping vehicle notification for vehicle id: {}", vehicleId);
            return;
        }

        String model = vehicle.getModelName() + (vehicle.getVariantName() != null && !vehicle.getVariantName().isBlank()
                ? " " + vehicle.getVariantName()
                : "");
        String price = vehicle.getPrice() != null ? vehicle.getPrice().toPlainString() : "0";

        for (Subscriber subscriber : subscribersList) {
            emailService.sendVehicleAddNotification(
                    subscriber.getEmail(),
                    vehicle.getTitle(),
                    vehicle.getBrand(),
                    model,
                    price,
                    vehicle.getThumbnailUrl()
            );
        }
        log.info("Successfully sent vehicle notifications to {} subscribers for vehicle id: {}", subscribersList.size(), vehicleId);
    }
}
