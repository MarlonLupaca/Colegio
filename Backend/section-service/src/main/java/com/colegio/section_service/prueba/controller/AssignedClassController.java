package com.colegio.section_service.prueba.controller;

import com.colegio.section_service.prueba.entity.AssignedClass;
import com.colegio.section_service.prueba.service.AssignedClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/assigned-classes")
public class AssignedClassController {

    @Autowired
    private AssignedClassService assignedClassService;

    @PostMapping
    public AssignedClass createAssignedClass(@Valid @RequestBody AssignedClass assignedClass) {
        return assignedClassService.createAssignedClass(assignedClass);
    }

    @GetMapping
    public List<AssignedClass> getAllAssignedClasses() {
        return assignedClassService.getAllAssignedClasses();
    }

    @GetMapping("/{id}")
    public AssignedClass getAssignedClassById(@PathVariable UUID id) {
        return assignedClassService.getAssignedClassById(id);
    }

    @GetMapping("/section/{annualSectionId}")
    public List<AssignedClass> getByAnnualSection(@PathVariable UUID annualSectionId) {
        return assignedClassService.getByAnnualSection(annualSectionId);
    }

    @GetMapping("/course/{courseId}")
    public List<AssignedClass> getByCourse(@PathVariable UUID courseId) {
        return assignedClassService.getByCourse(courseId);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<AssignedClass> getByTeacher(@PathVariable Long teacherId) {
        return assignedClassService.getByTeacher(teacherId);
    }

    @PutMapping("/{id}")
    public AssignedClass updateAssignedClass(
            @PathVariable UUID id,
            @Valid @RequestBody AssignedClass details) {
        return assignedClassService.updateAssignedClass(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteAssignedClass(@PathVariable UUID id) {
        assignedClassService.deleteAssignedClass(id);
    }

    @PostMapping("/section/{sectionId}/batch")
    public List<AssignedClass> addCoursesToSectionBatch(
            @PathVariable UUID sectionId,
            @RequestBody List<UUID> courseIds) {
        return assignedClassService.addCoursesToSectionBatch(sectionId, courseIds);
    }
}