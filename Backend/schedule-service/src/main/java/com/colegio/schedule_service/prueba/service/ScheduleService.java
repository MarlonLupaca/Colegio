package com.colegio.schedule_service.prueba.service;

import com.colegio.schedule_service.prueba.entity.Schedule;
import com.colegio.schedule_service.prueba.repository.ScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public Schedule createSchedule(Schedule schedule) {
        validateNoOverlap(schedule, null);
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Schedule getScheduleById(UUID id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con ID: " + id));
    }

    public List<Schedule> getScheduleBySection(UUID sectionId) {
        return scheduleRepository.findBySectionId(sectionId);
    }

    public List<Schedule> getScheduleByTeacher(UUID teacherId) {
        return scheduleRepository.findByTeacherId(teacherId);
    }

    public Schedule updateSchedule(UUID id, Schedule details) {
        Schedule schedule = getScheduleById(id);
        validateNoOverlap(details, id);

        schedule.setSectionId(details.getSectionId());
        schedule.setCourseId(details.getCourseId());
        schedule.setTeacherId(details.getTeacherId());
        schedule.setDayOfWeek(details.getDayOfWeek());
        schedule.setStartTime(details.getStartTime());
        schedule.setEndTime(details.getEndTime());
        schedule.setIsActive(details.getIsActive());

        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(UUID id) {
        Schedule schedule = getScheduleById(id);
        schedule.setIsActive(false);
        scheduleRepository.save(schedule);
    }

    private void validateNoOverlap(Schedule schedule, UUID excludeId) {
        if (!schedule.getStartTime().isBefore(schedule.getEndTime())) {
            throw new IllegalArgumentException("La hora de inicio debe ser antes que la hora de fin");
        }

        List<Schedule> teacherSchedules = scheduleRepository
                .findByTeacherIdAndDayOfWeek(schedule.getTeacherId(), schedule.getDayOfWeek());

        for (Schedule existing : teacherSchedules) {
            if (excludeId != null && existing.getId().equals(excludeId)) continue;

            boolean overlaps = schedule.getStartTime().isBefore(existing.getEndTime())
                    && existing.getStartTime().isBefore(schedule.getEndTime());

            if (overlaps) {
                throw new IllegalArgumentException(
                        "El profesor ya tiene una clase asignada ese día en ese horario");
            }
        }

        List<Schedule> sectionSchedules = scheduleRepository
                .findBySectionIdAndDayOfWeek(schedule.getSectionId(), schedule.getDayOfWeek());

        for (Schedule existing : sectionSchedules) {
            if (excludeId != null && existing.getId().equals(excludeId)) continue;

            boolean overlaps = schedule.getStartTime().isBefore(existing.getEndTime())
                    && existing.getStartTime().isBefore(schedule.getEndTime());

            if (overlaps) {
                throw new IllegalArgumentException(
                        "La sección ya tiene un curso asignado ese día en ese horario");
            }
        }
    }

}
