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


    //Crear Curso
    public Course saveCourse(Course course) {

        if ("secundaria".equalsIgnoreCase(course.getEducationLevel()) && course.getGradeLevel() > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }
        return courseRepository.save(course);
    }

    //Listar todos los cursos
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    //Listar cursos activos
    public List<Course> getActiveCourses()
    {
        return courseRepository.findByIsActiveTrue();
    }

    //Listar cursos inactivos
    public List<Course> getInactiveCourses()
    {
        return courseRepository.findByIsActiveFalse();
    }

    // Filtrar por nivel educativo
    public List<Course> getCoursesByEducationLevel(String educationLevel) {
        // Validar que el nivel sea válido
        if (!"primaria".equalsIgnoreCase(educationLevel) && !"secundaria".equalsIgnoreCase(educationLevel)) {
            throw new IllegalArgumentException("El nivel educativo debe ser 'primaria' o 'secundaria'");
        }
        return courseRepository.findByEducationLevelIgnoreCase(educationLevel);
    }

    //Filtrar por nivel educativo + grado
    public List<Course> getCoursesByEducationLevelAndGrade(String educationLevel, Integer gradeLevel) {
        // Validar que el nivel sea válido
        if (!"primaria".equalsIgnoreCase(educationLevel) && !"secundaria".equalsIgnoreCase(educationLevel)) {
            throw new IllegalArgumentException("El nivel educativo debe ser 'primaria' o 'secundaria'");
        }

        // Validar que el grado esté en el rango correcto
        if (gradeLevel < 1 || gradeLevel > 6) {
            throw new IllegalArgumentException("El grado debe estar entre 1 y 6");
        }

        // Validar lógica de negocio específica para secundaria
        if ("secundaria".equalsIgnoreCase(educationLevel) && gradeLevel > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }

        return courseRepository.findByEducationLevelIgnoreCaseAndGradeLevel(educationLevel, gradeLevel);
    }

    //Obtener curso por ID
    public Course getCourseById(UUID id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con el ID: " + id));
    }

    //Actualizar curso
    public Course updateCourse(UUID id, Course courseDetails) {
        Course course = getCourseById(id);

        course.setName(courseDetails.getName());
        course.setDescription(courseDetails.getDescription());
        course.setHoursPerWeek(courseDetails.getHoursPerWeek());
        course.setEducationLevel(courseDetails.getEducationLevel());
        course.setGradeLevel(courseDetails.getGradeLevel());
        course.setAcademicArea(courseDetails.getAcademicArea());

        return courseRepository.save(course);
    }

    //Desactivar cursos
    public void deactivateCourse(UUID id) {
        Course course = getCourseById(id);
        if (!course.getIsActive()) {
            throw new IllegalStateException("El curso ya está inactivo");
        }
        course.setIsActive(false);
        courseRepository.save(course);
    }

    //Activar cursos

    public void activateCourse(UUID id) {
        Course course = getCourseById(id);
        if (course.getIsActive()) {
            throw new IllegalStateException("El curso ya está activo");
        }
        course.setIsActive(true);
        courseRepository.save(course);
    }

    //Eliminar curso
    public void deleteCourse(UUID id) {
        Course course = getCourseById(id);
        if (course.getIsActive()) {
            throw new IllegalStateException("No se puede eliminar un curso activo. Desactívelo primero.");
        }
        courseRepository.delete(course);
    }
}