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

    private Long getTeacherIdFromAssignedClass(UUID assignedClassId) {
        try {
            Map response = restTemplate.getForObject(
                    SECTION_SERVICE_URL + assignedClassId, Map.class);
            if (response != null && response.get("teacherId") != null) {
                return Long.valueOf(response.get("teacherId").toString());
            }
        } catch (Exception e) {
            throw new IllegalStateException(
                    "No se pudo obtener el profesor de section-service: " + e.getMessage());
        }
        throw new IllegalStateException("teacherId no encontrado para la clase: " + assignedClassId);
    }

    private void validateNoOverlap(ClassSchedule classSchedule, UUID excludeId) {
        // REGLA 1: Una misma clase asignada (salón-curso) no puede tener dos horarios el mismo día a la misma hora
        List<ClassSchedule> sectionSchedules = classScheduleRepository
                .findByTimeBlockIdAndDayOfWeek(classSchedule.getTimeBlock().getId(), classSchedule.getDayOfWeek());

        for (ClassSchedule existing : sectionSchedules) {
            if (excludeId != null && existing.getId().equals(excludeId)) continue;

            // Si el ID de la clase asignada es idéntico, es un choque real de salón
            if (existing.getAssignedClassId().equals(classSchedule.getAssignedClassId())) {
                throw new IllegalArgumentException(
                        "Esta sección ya tiene una clase asignada ese día en ese bloque horario.");
            }
        }

        // REGLA 2: Controlar que el profesor no se cruce
        Long newTeacherId = getTeacherIdFromAssignedClass(classSchedule.getAssignedClassId());
        for (ClassSchedule existing : sectionSchedules) {
            if (excludeId != null && existing.getId().equals(excludeId)) continue;

            Long existingTeacherId = getTeacherIdFromAssignedClass(existing.getAssignedClassId());
            if (existingTeacherId.equals(newTeacherId)) {
                throw new IllegalArgumentException(
                        "El profesor ya tiene una clase asignada ese día en ese bloque horario.");
            }
        }
    }

}