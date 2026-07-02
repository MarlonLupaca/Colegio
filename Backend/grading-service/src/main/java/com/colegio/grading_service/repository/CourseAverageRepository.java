package com.colegio.grading_service.repository;

import com.colegio.grading_service.entity.CourseAverage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseAverageRepository extends JpaRepository<CourseAverage, Long> {
    List<CourseAverage> findByStudentId(Long studentId);
    Optional<CourseAverage> findByStudentIdAndCourseIdAndPeriod(Long studentId, Long courseId, String period);
}
