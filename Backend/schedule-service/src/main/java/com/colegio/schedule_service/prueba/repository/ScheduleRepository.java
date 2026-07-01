package com.colegio.schedule_service.prueba.repository;

import com.colegio.schedule_service.prueba.entity.DayOfWeek;
import com.colegio.schedule_service.prueba.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {

    List<Schedule> findBySectionId(UUID sectionId);
    List<Schedule> findByTeacherId(UUID teacherId);
    List<Schedule> findByTeacherIdAndDayOfWeek(UUID teacherId, DayOfWeek dayOfWeek);
    List<Schedule> findBySectionIdAndDayOfWeek(UUID sectionId, DayOfWeek dayOfWeek);

}
