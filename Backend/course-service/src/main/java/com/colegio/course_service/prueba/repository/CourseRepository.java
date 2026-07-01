package com.colegio.course_service.prueba.repository;

import com.colegio.course_service.prueba.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Optional<Course> findByCode(String code);

    List<Course> findByEducationLevelAndGradeLevel(String educationLevel, Integer gradeLevel);

    List<Course> findByIsActiveTrue();

    List<Course> findByIsActiveFalse();

    List<Course> findByEducationLevelIgnoreCase(String educationLevel);

    List<Course> findByEducationLevelIgnoreCaseAndGradeLevel(String educationLevel, Integer gradeLevel);
}