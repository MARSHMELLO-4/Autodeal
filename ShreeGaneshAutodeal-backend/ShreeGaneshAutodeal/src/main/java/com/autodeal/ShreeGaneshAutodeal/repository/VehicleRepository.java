package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.Vehicle;
import com.autodeal.ShreeGaneshAutodeal.domain.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

	long countByStatus(VehicleStatus status);
}
