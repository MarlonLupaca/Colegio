package com.colegio.grading_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseAverageDTO {
    private Long id;
    private Long studentId;
    private Long courseId;
    private Long sectionId;
    private String period;
    private Double averageScore;
    private String approvalStatus;
}
