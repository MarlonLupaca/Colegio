package com.colegio.enrollment_service.repository;

import com.colegio.enrollment_service.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByEnrollmentCode(String enrollmentCode);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findBySectionId(Long sectionId);
    List<Enrollment> findByAcademicYear(Integer academicYear);
}
