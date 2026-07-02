package com.colegio.schedule_service.prueba.controller;

import com.colegio.schedule_service.prueba.entity.ClassSchedule;
import com.colegio.schedule_service.prueba.entity.DayOfWeek;
import com.colegio.schedule_service.prueba.service.ClassScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/class-schedules")
public class ClassScheduleController {

    @Autowired
    private ClassScheduleService classScheduleService;

    @PostMapping
    public ClassSchedule createClassSchedule(@Valid @RequestBody ClassSchedule classSchedule) {
        return classScheduleService.createClassSchedule(classSchedule);
    }

    @GetMapping
    public List<ClassSchedule> getAllClassSchedules() {
        return classScheduleService.getAllClassSchedules();
    }

    @GetMapping("/{id}")
    public ClassSchedule getClassScheduleById(@PathVariable UUID id) {
        return classScheduleService.getClassScheduleById(id);
    }

    @GetMapping("/day/{dayOfWeek}")
    public List<ClassSchedule> getByDayOfWeek(@PathVariable DayOfWeek dayOfWeek) {
        return classScheduleService.getByDayOfWeek(dayOfWeek);
    }

    @GetMapping("/assigned-class/{assignedClassId}")
    public List<ClassSchedule> getByAssignedClass(@PathVariable UUID assignedClassId) {
        return classScheduleService.getByAssignedClass(assignedClassId);
    }

    @PutMapping("/{id}")
    public ClassSchedule updateClassSchedule(
            @PathVariable UUID id,
            @Valid @RequestBody ClassSchedule details) {
        return classScheduleService.updateClassSchedule(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteClassSchedule(@PathVariable UUID id) {
        classScheduleService.deleteClassSchedule(id);
    }
}