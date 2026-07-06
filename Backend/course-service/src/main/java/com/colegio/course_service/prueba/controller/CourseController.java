package com.colegio.course_service.prueba.controller;

import com.colegio.course_service.prueba.entity.Course;
import com.colegio.course_service.prueba.entity.EducationLevel;
import com.colegio.course_service.prueba.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public Course createCourse(@Valid @RequestBody Course course) {
        return courseService.saveCourse(course);
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/active")
    public List<Course> getActiveCourses() {
        return courseService.getActiveCourses();
    }

    @GetMapping("/inactive")
    public List<Course> getInactiveCourses() {
        return courseService.getInactiveCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id);
    }

    @GetMapping("/filter/education-level")
    public List<Course> getCoursesByEducationLevel(
            @RequestParam EducationLevel educationLevel) {
        return courseService.getCoursesByEducationLevel(educationLevel);
    }
    @GetMapping("/filter/education-level-and-grade")
    public List<Course> getCoursesByEducationLevelAndGrade(
            @RequestParam EducationLevel educationLevel,
            @RequestParam Integer gradeLevel) {
        return courseService.getCoursesByEducationLevelAndGrade(educationLevel, gradeLevel);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable UUID id, @Valid @RequestBody Course courseDetails) {
        return courseService.updateCourse(id, courseDetails);
    }

    @PatchMapping("/{id}/activate")
    public void activateCourse(@PathVariable UUID id) {
        courseService.activateCourse(id);
    }

    @PatchMapping("/{id}/deactivate")
    public void deactivateCourse(@PathVariable UUID id) {
        courseService.deactivateCourse(id);
    }


    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/teacher/{teacherCodeOrId}")
    public List<Course> getCoursesByTeacher(@PathVariable String teacherCodeOrId) {
        return courseService.getCoursesByTeacher(teacherCodeOrId);
    }
}