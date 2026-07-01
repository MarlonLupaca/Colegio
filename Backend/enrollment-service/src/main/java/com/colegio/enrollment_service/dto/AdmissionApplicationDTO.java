package com.colegio.enrollment_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdmissionApplicationDTO {
    private Long id;
    private String applicantFirstName;
    private String applicantLastName;
    private String applicantDni;
    private String requestedGradeLevel;
    private Integer academicYear;
    private String guardianName;
    private String guardianPhone;
    private String guardianEmail;
    private String status;
    private LocalDateTime applicationDate;
    private String observations;
}
