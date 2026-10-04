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
			order by s.saleDate desc, s.id desc
			""")
	List<SaleRecord> findAllReportRows();

	@Query("""
			select s from SaleRecord s
			join fetch s.vehicle v
			where s.saleDate >= :fromDate
			order by s.saleDate desc, s.id desc
			""")
	List<SaleRecord> findReportRowsFrom(@Param("fromDate") LocalDate fromDate);

	@Query("""
			select s from SaleRecord s
			join fetch s.vehicle v
			where s.saleDate <= :toDate
			order by s.saleDate desc, s.id desc
			""")
	List<SaleRecord> findReportRowsTo(@Param("toDate") LocalDate toDate);

	@Query("""
			select s from SaleRecord s
			join fetch s.vehicle v
			where s.saleDate >= :fromDate
				and s.saleDate <= :toDate
			order by s.saleDate desc, s.id desc
			""")
	List<SaleRecord> findReportRowsBetween(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);
}
