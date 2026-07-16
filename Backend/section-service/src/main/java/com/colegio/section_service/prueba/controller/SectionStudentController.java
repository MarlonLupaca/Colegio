package com.colegio.section_service.prueba.controller;

import com.colegio.section_service.prueba.entity.SectionStudent;
import com.colegio.section_service.prueba.service.SectionStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/annual-sections")
public class SectionStudentController {

    @Autowired
    private SectionStudentService sectionStudentService;

    @GetMapping("/{sectionId}/students")
    public List<SectionStudent> getStudentsBySection(@PathVariable UUID sectionId) {
        return sectionStudentService.getStudentsBySection(sectionId);
    }

    @GetMapping("/students")
    public List<SectionStudent> getAllSectionStudents() {
        return sectionStudentService.getAllSectionStudents();
    }

    @PostMapping("/{sectionId}/students/batch")
    public List<SectionStudent> addStudentsToSectionBatch(
            @PathVariable UUID sectionId,
            @RequestBody List<String> studentCodes) {
        return sectionStudentService.addStudentsToSectionBatch(sectionId, studentCodes);
    }

    @DeleteMapping("/{sectionId}/students/{studentCode}")
    public ResponseEntity<Void> removeStudentFromSection(
            @PathVariable UUID sectionId,
            @PathVariable String studentCode) {
        sectionStudentService.removeStudentFromSection(sectionId, studentCode);
        return ResponseEntity.noContent().build();
    }
}
