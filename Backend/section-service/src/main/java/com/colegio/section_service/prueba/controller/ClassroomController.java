package com.colegio.section_service.prueba.controller;

import com.colegio.section_service.prueba.entity.Classroom;
import com.colegio.section_service.prueba.entity.ClassroomStatus;
import com.colegio.section_service.prueba.entity.ClassroomType;
import com.colegio.section_service.prueba.service.ClassroomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping
    public Classroom createClassroom(@Valid @RequestBody Classroom classroom) {
        return classroomService.createClassroom(classroom);
    }

    @GetMapping
    public List<Classroom> getAllClassrooms() {
        return classroomService.getAllClassrooms();
    }

    @GetMapping("/{id}")
    public Classroom getClassroomById(@PathVariable UUID id) {
        return classroomService.getClassroomById(id);
    }

    @GetMapping("/status/{status}")
    public List<Classroom> getByStatus(@PathVariable ClassroomStatus status) {
        return classroomService.getClassroomsByStatus(status);
    }

    @GetMapping("/type/{type}")
    public List<Classroom> getByType(@PathVariable ClassroomType type) {
        return classroomService.getClassroomsByType(type);
    }

    @GetMapping("/building/{building}")
    public List<Classroom> getByBuilding(@PathVariable String building) {
        return classroomService.getClassroomsByBuilding(building);
    }

    @PutMapping("/{id}")
    public Classroom updateClassroom(@PathVariable UUID id, @Valid @RequestBody Classroom details) {
        return classroomService.updateClassroom(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteClassroom(@PathVariable UUID id) {
        classroomService.deleteClassroom(id);
    }
}
