package com.colegio.course_service.prueba.repository;

import com.colegio.course_service.prueba.entity.Course;
import com.colegio.course_service.prueba.entity.EducationLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Optional<Course> findByCode(String code);

    Optional<Course> findFirstByCodeStartingWithOrderByCodeDesc(String prefix);

    List<Course> findByIsActiveTrue();

    List<Course> findByIsActiveFalse();

    List<Course> findByEducationLevel(EducationLevel educationLevel);

    List<Course> findByEducationLevelAndGradeLevel(EducationLevel educationLevel, Integer gradeLevel);

    List<Course> findByTeacherCode(String teacherCode);
}