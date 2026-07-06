package com.colegio.enrollment_service.controller;

import com.colegio.enrollment_service.dto.EnrollmentDTO;
import com.colegio.enrollment_service.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollment/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<EnrollmentDTO> createEnrollment(@RequestBody EnrollmentDTO dto) {
        return new ResponseEntity<>(enrollmentService.createEnrollment(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentDTO>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> getEnrollmentById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentDTO>> getByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudentId(studentId));
    }

    @GetMapping("/student/{studentId}/active")
    public ResponseEntity<EnrollmentDTO> getActiveEnrollment(
            @PathVariable Long studentId,
            @RequestParam(required = false) Integer year) {
        int queryYear = (year != null) ? year : java.time.LocalDate.now().getYear();
        EnrollmentDTO active = enrollmentService.getActiveEnrollment(studentId, queryYear);
        if (active == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(active);
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<EnrollmentDTO>> getBySectionId(@PathVariable UUID sectionId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsBySectionId(sectionId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EnrollmentDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(enrollmentService.updateEnrollmentStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
