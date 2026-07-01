package com.colegio.billing_service.repository;

import com.colegio.billing_service.model.StudentCharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentChargeRepository extends JpaRepository<StudentCharge, Long> {
    List<StudentCharge> findAllByStudent_Id(Long id);
}
