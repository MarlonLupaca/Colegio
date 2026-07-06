package com.colegio.course_service.prueba.service;

import com.colegio.course_service.prueba.entity.Course;
import com.colegio.course_service.prueba.entity.EducationLevel;
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

    //crear clase
    public Course saveCourse(Course course) {

        if (EducationLevel.SECUNDARIA.equals(course.getEducationLevel()) && course.getGradeLevel() > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }

        // Generación automática del código
        if (course.getCode() == null || course.getCode().trim().isEmpty()) {
            String prefix = "CUR-";
            var ultimoCursoOpt = courseRepository.findFirstByCodeStartingWithOrderByCodeDesc(prefix);
            int nextNumber = 1;

            if (ultimoCursoOpt.isPresent()) {
                String ultimoCodigo = ultimoCursoOpt.get().getCode();
                try {
                    String numeroStr = ultimoCodigo.substring(prefix.length());
                    nextNumber = Integer.parseInt(numeroStr) + 1;
                } catch (Exception e) {
                    nextNumber = (int) (courseRepository.count() + 1);
                }
            }

            String nuevoCodigo = String.format("%s%04d", prefix, nextNumber);
            course.setCode(nuevoCodigo);
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
    public List<Course> getCoursesByEducationLevel(EducationLevel educationLevel) {
        return courseRepository.findByEducationLevel(educationLevel);
    }

    //Filtrar por nivel educativo + grado
    public List<Course> getCoursesByEducationLevelAndGrade(EducationLevel educationLevel, Integer gradeLevel) {
        if (gradeLevel < 1 || gradeLevel > 6) {
            throw new IllegalArgumentException("El grado debe estar entre 1 y 6");
        }

        if (EducationLevel.SECUNDARIA.equals(educationLevel) && gradeLevel > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }

        return courseRepository.findByEducationLevelAndGradeLevel(educationLevel, gradeLevel);
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

        // Validación extra por si cambian a secundaria con grado > 5 en la actualización
        if (EducationLevel.SECUNDARIA.equals(course.getEducationLevel()) && course.getGradeLevel() > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }

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