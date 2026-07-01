package com.colegio.enrollment_service.service;

import com.colegio.enrollment_service.dto.AdmissionApplicationDTO;
import com.colegio.enrollment_service.dto.EnrollmentDTO;

import java.util.List;

public interface EnrollmentService {
    // Admission Methods
    AdmissionApplicationDTO submitAdmissionApplication(AdmissionApplicationDTO dto);
    AdmissionApplicationDTO getAdmissionById(Long id);
    List<AdmissionApplicationDTO> getAllAdmissions(String status);
    AdmissionApplicationDTO updateAdmissionStatus(Long id, String status);

    // Enrollment Methods
    EnrollmentDTO createEnrollment(EnrollmentDTO dto);
    EnrollmentDTO getEnrollmentById(Long id);
    List<EnrollmentDTO> getEnrollmentsByStudentId(Long studentId);
    List<EnrollmentDTO> getEnrollmentsBySectionId(Long sectionId);
    EnrollmentDTO updateEnrollmentStatus(Long id, String status);
    void deleteEnrollment(Long id);
}
