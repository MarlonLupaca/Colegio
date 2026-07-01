package com.colegio.enrollment_service.repository;

import com.colegio.enrollment_service.entity.AdmissionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionApplicationRepository extends JpaRepository<AdmissionApplication, Long> {
    List<AdmissionApplication> findByStatus(String status);
    List<AdmissionApplication> findByAcademicYear(Integer academicYear);
}
