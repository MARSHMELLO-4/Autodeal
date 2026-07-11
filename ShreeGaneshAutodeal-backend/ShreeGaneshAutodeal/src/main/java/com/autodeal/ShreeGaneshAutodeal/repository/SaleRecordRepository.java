package com.autodeal.ShreeGaneshAutodeal.repository;

import com.autodeal.ShreeGaneshAutodeal.domain.SaleRecord;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaleRecordRepository extends JpaRepository<SaleRecord, Long> {

	@Query("""
			select s from SaleRecord s
			join fetch s.vehicle v
			where (:fromDate is null or s.saleDate >= :fromDate)
				and (:toDate is null or s.saleDate <= :toDate)
			order by s.saleDate desc, s.id desc
			""")
	List<SaleRecord> findReportRows(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);
}
