package com.colegio.enrollment_service.repository;

import com.colegio.enrollment_service.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByEnrollmentCode(String enrollmentCode);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findBySectionId(UUID sectionId);
    List<Enrollment> findByAcademicYear(Integer academicYear);
    Optional<Enrollment> findByStudentIdAndAcademicYear(Long studentId, Integer academicYear);
}
