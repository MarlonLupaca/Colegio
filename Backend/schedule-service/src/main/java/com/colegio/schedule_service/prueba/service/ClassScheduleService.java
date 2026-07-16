package com.colegio.schedule_service.prueba.service;

import com.colegio.schedule_service.prueba.entity.ClassSchedule;
import com.colegio.schedule_service.prueba.entity.DayOfWeek;
import com.colegio.schedule_service.prueba.repository.ClassScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ClassScheduleService {

    @Autowired
    private ClassScheduleRepository classScheduleRepository;

    @Autowired
    private RestTemplate restTemplate;

    private static final String SECTION_SERVICE_URL = "http://localhost:8100/api/v1/assigned-classes/";

    public ClassSchedule createClassSchedule(ClassSchedule classSchedule) {

        validateNoOverlap(classSchedule, null);
        return classScheduleRepository.save(classSchedule);
    }

    public List<ClassSchedule> getAllClassSchedules() {
        return classScheduleRepository.findAll();
    }

    public ClassSchedule getClassScheduleById(UUID id) {
        return classScheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Horario no encontrado con ID: " + id));
    }

    public List<ClassSchedule> getByDayOfWeek(DayOfWeek dayOfWeek) {
        return classScheduleRepository.findByDayOfWeek(dayOfWeek);
    }

    public List<ClassSchedule> getByAssignedClass(UUID assignedClassId) {
        return classScheduleRepository.findByAssignedClassId(assignedClassId);
    }

    public ClassSchedule updateClassSchedule(UUID id, ClassSchedule details) {
        ClassSchedule classSchedule = getClassScheduleById(id);
        classSchedule.setTimeBlock(details.getTimeBlock());
        classSchedule.setDayOfWeek(details.getDayOfWeek());
        classSchedule.setAssignedClassId(details.getAssignedClassId());

        validateNoOverlap(classSchedule, id);
        return classScheduleRepository.save(classSchedule);
    }

    public void deleteClassSchedule(UUID id) {
        classScheduleRepository.delete(getClassScheduleById(id));
    }

    private Map<?, ?> getAssignedClass(UUID assignedClassId) {
        try {
            return restTemplate.getForObject(SECTION_SERVICE_URL + assignedClassId, Map.class);
        } catch (Exception e) {
            return null;
        }
    }

    private String getTeacherCodeFromAssignedClass(Map<?, ?> assignedClass) {
        if (assignedClass != null && assignedClass.get("teacherCode") != null) {
            return assignedClass.get("teacherCode").toString();
        }
        return null;
    }

    private UUID getClassroomIdFromAssignedClass(Map<?, ?> assignedClass) {
        if (assignedClass != null && assignedClass.get("annualSections") != null) {
            Map<?, ?> section = (Map<?, ?>) assignedClass.get("annualSections");
            if (section.get("classroom") != null) {
                Map<?, ?> classroom = (Map<?, ?>) section.get("classroom");
                if (classroom.get("id") != null) {
                    return UUID.fromString(classroom.get("id").toString());
                }
            }
        }
        return null;
    }

    private Map<?, ?> getCourseFromAssignedClass(Map<?, ?> assignedClass) {
        if (assignedClass != null && assignedClass.get("courseId") != null) {
            String courseId = assignedClass.get("courseId").toString();
            try {
                String courseUrl = "http://localhost:8089/api/v1/courses/" + courseId;
                return restTemplate.getForObject(courseUrl, Map.class);
            } catch (Exception e) {
                // Log warning or fallback
            }
        }
        return null;
    }

    private void validateNoOverlap(ClassSchedule classSchedule, UUID excludeId) {
        Map<?, ?> newAssignedClass = getAssignedClass(classSchedule.getAssignedClassId());
        if (newAssignedClass == null) {
            throw new IllegalArgumentException("La clase asignada no existe.");
        }

        // REGLA 1: Límite de horas semanales para el curso
        Map<?, ?> course = getCourseFromAssignedClass(newAssignedClass);
        int maxHours = 4; // default fallback
        if (course != null && course.get("hoursPerWeek") != null) {
            maxHours = ((Number) course.get("hoursPerWeek")).intValue();
        }

        long scheduledHours = classScheduleRepository.findByAssignedClassId(classSchedule.getAssignedClassId()).stream()
                .filter(existing -> excludeId == null || !existing.getId().equals(excludeId))
                .count();

        if (scheduledHours >= maxHours) {
            String courseName = course != null && course.get("name") != null ? course.get("name").toString() : "Curso";
            throw new IllegalArgumentException(
                    "No se puede programar más horas para " + courseName + ". Ya se han programado las " + maxHours + " horas semanales autorizadas.");
        }

        // Obtener todos los horarios asignados al mismo bloque y día
        List<ClassSchedule> timeBlockSchedules = classScheduleRepository
                .findByTimeBlockIdAndDayOfWeek(classSchedule.getTimeBlock().getId(), classSchedule.getDayOfWeek());

        // REGLA 2: Una sección no puede tener dos clases al mismo tiempo
        UUID newSectionId = null;
        if (newAssignedClass.get("annualSections") != null) {
            Map<?, ?> sec = (Map<?, ?>) newAssignedClass.get("annualSections");
            if (sec.get("id") != null) {
                newSectionId = UUID.fromString(sec.get("id").toString());
            }
        }

        for (ClassSchedule existing : timeBlockSchedules) {
            if (excludeId != null && existing.getId().equals(excludeId)) continue;

            Map<?, ?> existingAssignedClass = getAssignedClass(existing.getAssignedClassId());
            if (existingAssignedClass == null) continue;

            UUID existingSectionId = null;
            if (existingAssignedClass.get("annualSections") != null) {
                Map<?, ?> sec = (Map<?, ?>) existingAssignedClass.get("annualSections");
                if (sec.get("id") != null) {
                    existingSectionId = UUID.fromString(sec.get("id").toString());
                }
            }

            if (newSectionId != null && newSectionId.equals(existingSectionId)) {
                throw new IllegalArgumentException(
                        "La sección ya tiene otra asignatura programada en este mismo día y bloque horario.");
            }
        }

        // REGLA 3: Controlar que el profesor no se cruce
        String newTeacherCode = getTeacherCodeFromAssignedClass(newAssignedClass);
        if (newTeacherCode != null && !newTeacherCode.trim().isEmpty()) {
            for (ClassSchedule existing : timeBlockSchedules) {
                if (excludeId != null && existing.getId().equals(excludeId)) continue;

                Map<?, ?> existingAssignedClass = getAssignedClass(existing.getAssignedClassId());
                String existingTeacherCode = getTeacherCodeFromAssignedClass(existingAssignedClass);
                if (newTeacherCode.equals(existingTeacherCode)) {
                    throw new IllegalArgumentException(
                            "El profesor asignado ya tiene clase en este día y bloque horario con otra sección.");
                }
            }
        }

        // REGLA 4: Controlar que el aula de la sección no se cruce
        UUID newClassroomId = getClassroomIdFromAssignedClass(newAssignedClass);
        if (newClassroomId != null) {
            for (ClassSchedule existing : timeBlockSchedules) {
                if (excludeId != null && existing.getId().equals(excludeId)) continue;

                Map<?, ?> existingAssignedClass = getAssignedClass(existing.getAssignedClassId());
                UUID existingClassroomId = getClassroomIdFromAssignedClass(existingAssignedClass);
                if (newClassroomId.equals(existingClassroomId)) {
                    throw new IllegalArgumentException(
                            "El aula física asignada a la sección ya está ocupada por otra clase en este bloque horario.");
                }
            }
        }
    }

}