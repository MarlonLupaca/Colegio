package com.colegio.enrollment_service.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentDTO {
    private Long id;
    private String enrollmentCode;
    private Long studentId;
    private UUID sectionId;
    private String gradeLevel;
    private Integer academicYear;
    private LocalDateTime enrollmentDate;
    private String status;
    private String condition;
}
