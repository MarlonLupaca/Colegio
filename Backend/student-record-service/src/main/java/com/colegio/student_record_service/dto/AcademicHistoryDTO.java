package com.colegio.student_record_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicHistoryDTO {
    private Long id;
    private Long studentRecordId;
    private Integer academicYear;
    private String gradeLevel;
    private Double generalAverage;
    private String observations;
}
