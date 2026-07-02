package com.colegio.schedule_service.prueba.controller;

import com.colegio.schedule_service.prueba.entity.Schedule;
import com.colegio.schedule_service.prueba.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping
    public Schedule createSchedule(@Valid @RequestBody Schedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public Schedule getScheduleById(@PathVariable UUID id) {
        return scheduleService.getScheduleById(id);
    }

    @GetMapping("/section/{sectionId}")
    public List<Schedule> getScheduleBySection(@PathVariable UUID sectionId) {
        return scheduleService.getScheduleBySection(sectionId);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Schedule> getScheduleByTeacher(@PathVariable UUID teacherId) {
        return scheduleService.getScheduleByTeacher(teacherId);
    }

    @PutMapping("/{id}")
    public Schedule updateSchedule(@PathVariable UUID id, @Valid @RequestBody Schedule details) {
        return scheduleService.updateSchedule(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable UUID id) {
        scheduleService.deleteSchedule(id);
    }
}
