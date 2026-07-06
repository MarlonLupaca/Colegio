package com.colegio.enrollment_service.service.impl;

import com.colegio.enrollment_service.dto.AdmissionApplicationDTO;
import com.colegio.enrollment_service.dto.EnrollmentDTO;
import com.colegio.enrollment_service.entity.AdmissionApplication;
import com.colegio.enrollment_service.entity.Enrollment;
import com.colegio.enrollment_service.repository.AdmissionApplicationRepository;
import com.colegio.enrollment_service.repository.EnrollmentRepository;
import com.colegio.enrollment_service.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private AdmissionApplicationRepository admissionRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public AdmissionApplicationDTO submitAdmissionApplication(AdmissionApplicationDTO dto) {
        AdmissionApplication entity = AdmissionApplication.builder()
                .applicantFirstName(dto.getApplicantFirstName())
                .applicantLastName(dto.getApplicantLastName())
                .applicantDni(dto.getApplicantDni())
                .requestedGradeLevel(dto.getRequestedGradeLevel())
                .academicYear(dto.getAcademicYear())
                .guardianName(dto.getGuardianName())
                .guardianPhone(dto.getGuardianPhone())
                .guardianEmail(dto.getGuardianEmail())
                .status("PENDING")
                .applicationDate(LocalDateTime.now())
                .observations(dto.getObservations())
                .build();
        AdmissionApplication saved = admissionRepository.save(entity);
        return mapAdmissionToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionApplicationDTO getAdmissionById(Long id) {
        AdmissionApplication app = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AdmissionApplication not found with id: " + id));
        return mapAdmissionToDTO(app);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionApplicationDTO> getAllAdmissions(String status) {
        List<AdmissionApplication> list;
        if (status != null && !status.trim().isEmpty()) {
            list = admissionRepository.findByStatus(status);
        } else {
            list = admissionRepository.findAll();
        }
        return list.stream().map(this::mapAdmissionToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdmissionApplicationDTO updateAdmissionStatus(Long id, String status) {
        AdmissionApplication app = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AdmissionApplication not found with id: " + id));
        app.setStatus(status);
        return mapAdmissionToDTO(admissionRepository.save(app));
    }

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    @Override
    @Transactional
    public EnrollmentDTO createEnrollment(EnrollmentDTO dto) {
        Enrollment entity = Enrollment.builder()
                .enrollmentCode(dto.getEnrollmentCode() != null ? dto.getEnrollmentCode() : "MAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .studentId(dto.getStudentId())
                .sectionId(dto.getSectionId())
                .gradeLevel(dto.getGradeLevel())
                .academicYear(dto.getAcademicYear())
                .enrollmentDate(dto.getEnrollmentDate() != null ? dto.getEnrollmentDate() : LocalDateTime.now())
                .status(dto.getStatus() != null ? dto.getStatus() : "REGISTERED")
                .condition(dto.getCondition() != null ? dto.getCondition() : "REGULAR")
                .build();
        Enrollment saved = enrollmentRepository.save(entity);

        // Generar Matrícula y Pensiones Automáticas en billing-service
        try {
            String billingUrl = "http://localhost:8080/api/v1/billing/charge";
            int currentYear = java.time.LocalDate.now().getYear();

            // 1. Cargo de Matrícula Única
            java.util.Map<String, Object> matriculaPayload = new java.util.HashMap<>();
            matriculaPayload.put("studentId", saved.getStudentId());
            matriculaPayload.put("description", "Costo de Derecho de Matrícula " + currentYear);
            matriculaPayload.put("totalAmount", new java.math.BigDecimal("350.00"));
            matriculaPayload.put("pendingAmount", new java.math.BigDecimal("350.00"));
            matriculaPayload.put("paidAmount", java.math.BigDecimal.ZERO);
            matriculaPayload.put("dueDate", java.time.LocalDateTime.now().toString());
            matriculaPayload.put("status", 0); // Ordinal de PENDING
            restTemplate.postForObject(billingUrl, matriculaPayload, Object.class);

            // 2. Cargos de Pensión Mensual (Marzo a Diciembre - 10 Cuotas)
            String[] meses = {"Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"};
            int[] dueMonths = {3, 4, 5, 6, 7, 8, 9, 10, 11, 12};

            for (int i = 0; i < meses.length; i++) {
                java.util.Map<String, Object> pensionPayload = new java.util.HashMap<>();
                pensionPayload.put("studentId", saved.getStudentId());
                pensionPayload.put("description", "Pensión Mensual de " + meses[i] + " " + currentYear);
                pensionPayload.put("totalAmount", new java.math.BigDecimal("450.00"));
                pensionPayload.put("pendingAmount", new java.math.BigDecimal("450.00"));
                pensionPayload.put("paidAmount", java.math.BigDecimal.ZERO);
                pensionPayload.put("dueDate", java.time.LocalDateTime.of(currentYear, dueMonths[i], 5, 23, 59).toString()); // Vence el 5 de cada mes
                pensionPayload.put("status", 0); // Ordinal de PENDING
                restTemplate.postForObject(billingUrl, pensionPayload, Object.class);
            }
        } catch (Exception e) {
            System.err.println("No se pudo generar los cargos automáticos de pensión (billing-service no disponible): " + e.getMessage());
        }

        return mapEnrollmentToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentDTO getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        return mapEnrollmentToDTO(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDTO> getEnrollmentsByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream().map(this::mapEnrollmentToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentDTO> getEnrollmentsBySectionId(UUID sectionId) {
        return enrollmentRepository.findBySectionId(sectionId)
                .stream().map(this::mapEnrollmentToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EnrollmentDTO updateEnrollmentStatus(Long id, String status) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        enrollment.setStatus(status);
        return mapEnrollmentToDTO(enrollmentRepository.save(enrollment));
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new RuntimeException("Enrollment not found with id: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    @Override
    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::mapEnrollmentToDTO)
                .toList();
    }

    @Override
    public EnrollmentDTO getActiveEnrollment(Long studentId, Integer academicYear) {
        return enrollmentRepository.findByStudentIdAndAcademicYear(studentId, academicYear)
                .map(this::mapEnrollmentToDTO)
                .orElse(null);
    }

    private AdmissionApplicationDTO mapAdmissionToDTO(AdmissionApplication entity) {
        return AdmissionApplicationDTO.builder()
                .id(entity.getId())
                .applicantFirstName(entity.getApplicantFirstName())
                .applicantLastName(entity.getApplicantLastName())
                .applicantDni(entity.getApplicantDni())
                .requestedGradeLevel(entity.getRequestedGradeLevel())
                .academicYear(entity.getAcademicYear())
                .guardianName(entity.getGuardianName())
                .guardianPhone(entity.getGuardianPhone())
                .guardianEmail(entity.getGuardianEmail())
                .status(entity.getStatus())
                .applicationDate(entity.getApplicationDate())
                .observations(entity.getObservations())
                .build();
    }

    private EnrollmentDTO mapEnrollmentToDTO(Enrollment entity) {
        return EnrollmentDTO.builder()
                .id(entity.getId())
                .enrollmentCode(entity.getEnrollmentCode())
                .studentId(entity.getStudentId())
                .sectionId(entity.getSectionId())
                .gradeLevel(entity.getGradeLevel())
                .academicYear(entity.getAcademicYear())
                .enrollmentDate(entity.getEnrollmentDate())
                .status(entity.getStatus())
                .condition(entity.getCondition())
                .build();
    }
}
