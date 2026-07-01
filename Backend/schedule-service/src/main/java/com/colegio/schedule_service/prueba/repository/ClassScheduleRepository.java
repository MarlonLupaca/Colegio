package com.colegio.schedule_service.prueba.repository;

import com.colegio.schedule_service.prueba.entity.ClassSchedule;
import com.colegio.schedule_service.prueba.entity.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, UUID> {

    List<ClassSchedule> findByDayOfWeek(DayOfWeek dayOfWeek);

    List<ClassSchedule> findByAssignedClassId(UUID assignedClassId);

    List<ClassSchedule> findByTimeBlockId(UUID timeBlockId);

    boolean existsByTimeBlockIdAndDayOfWeekAndAssignedClassId(
            UUID timeBlockId, DayOfWeek dayOfWeek, UUID assignedClassId);
}
