package com.colegio.enrollment_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admission_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "applicant_first_name", nullable = false, length = 100)
    private String applicantFirstName;

    @Column(name = "applicant_last_name", nullable = false, length = 100)
    private String applicantLastName;

    @Column(name = "applicant_dni", nullable = false, length = 20)
    private String applicantDni;

    @Column(name = "requested_grade_level", nullable = false, length = 50)
    private String requestedGradeLevel;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "guardian_name", nullable = false, length = 150)
    private String guardianName;

    @Column(name = "guardian_phone", length = 30)
    private String guardianPhone;

    @Column(name = "guardian_email", length = 100)
    private String guardianEmail;

    @Column(name = "status", nullable = false, length = 30)
    private String status; // PENDING, UNDER_REVIEW, APPROVED, REJECTED

    @Column(name = "application_date")
    private LocalDateTime applicationDate;

    @Column(name = "observations", length = 500)
    private String observations;
}
