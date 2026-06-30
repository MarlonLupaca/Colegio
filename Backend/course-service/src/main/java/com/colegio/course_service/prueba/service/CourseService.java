package com.colegio.course_service.prueba.service;

import com.colegio.course_service.prueba.entity.Course;
import com.colegio.course_service.prueba.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course saveCourse(Course course) {

        if ("secundaria".equalsIgnoreCase(course.getEducationLevel()) && course.getGradeLevel() > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(UUID id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con el ID: " + id));
    }

    public Course updateCourse(UUID id, Course courseDetails) {
        Course course = getCourseById(id);

        course.setName(courseDetails.getName());
        course.setDescription(courseDetails.getDescription());
        course.setHoursPerWeek(courseDetails.getHoursPerWeek());
        course.setIsActive(courseDetails.getIsActive());
        course.setEducationLevel(courseDetails.getEducationLevel());
        course.setGradeLevel(courseDetails.getGradeLevel());
        course.setAcademicArea(courseDetails.getAcademicArea());

        return courseRepository.save(course);
    }

    public void deleteCourse(UUID id) {
        Course course = getCourseById(id);
        course.setIsActive(false);
        courseRepository.save(course);
    }
}