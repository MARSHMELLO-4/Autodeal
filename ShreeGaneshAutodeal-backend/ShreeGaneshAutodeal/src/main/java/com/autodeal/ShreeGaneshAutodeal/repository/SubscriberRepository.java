package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.Subscriber;
import com.autodeal.ShreeGaneshAutodeal.domain.SubscriberStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    Optional<Subscriber> findByEmail(String email);


    boolean existsByEmail(String email);

    List<Subscriber> findAllByStatus(SubscriberStatus status);
}
