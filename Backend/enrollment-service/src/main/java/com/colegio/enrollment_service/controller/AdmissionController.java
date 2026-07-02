package com.colegio.enrollment_service.controller;

import com.colegio.enrollment_service.dto.AdmissionApplicationDTO;
import com.colegio.enrollment_service.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment/admissions")
public class AdmissionController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<AdmissionApplicationDTO> submitAdmission(@RequestBody AdmissionApplicationDTO dto) {
        return new ResponseEntity<>(enrollmentService.submitAdmissionApplication(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdmissionApplicationDTO> getAdmissionById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getAdmissionById(id));
    }

    @GetMapping
    public ResponseEntity<List<AdmissionApplicationDTO>> getAllAdmissions(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(enrollmentService.getAllAdmissions(status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdmissionApplicationDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(enrollmentService.updateAdmissionStatus(id, status));
    }
}
