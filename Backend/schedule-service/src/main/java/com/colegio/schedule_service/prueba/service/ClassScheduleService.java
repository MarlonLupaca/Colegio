package com.colegio.schedule_service.prueba.service;

import com.colegio.schedule_service.prueba.entity.ClassSchedule;
import com.colegio.schedule_service.prueba.entity.DayOfWeek;
import com.colegio.schedule_service.prueba.repository.ClassScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClassScheduleService {

    @Autowired
    private ClassScheduleRepository classScheduleRepository;

    public ClassSchedule createClassSchedule(ClassSchedule classSchedule) {
        boolean alreadyExists = classScheduleRepository
                .existsByTimeBlockIdAndDayOfWeekAndAssignedClassId(
                        classSchedule.getTimeBlock().getId(),
                        classSchedule.getDayOfWeek(),
                        classSchedule.getAssignedClassId()
                );

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "Ya existe un horario para esa clase en ese bloque y día.");
        }

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
        return classScheduleRepository.save(classSchedule);
    }

    public void deleteClassSchedule(UUID id) {
        classScheduleRepository.delete(getClassScheduleById(id));
    }
}