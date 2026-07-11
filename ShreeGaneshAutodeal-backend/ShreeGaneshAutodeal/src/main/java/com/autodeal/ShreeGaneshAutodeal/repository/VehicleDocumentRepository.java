package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.VehicleDocument;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleDocumentRepository extends JpaRepository<VehicleDocument, Long> {

	List<VehicleDocument> findByVehicleIdOrderByUploadedAtDesc(Long vehicleId);
}
