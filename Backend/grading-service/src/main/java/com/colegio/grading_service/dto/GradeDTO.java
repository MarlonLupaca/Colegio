package com.colegio.grading_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeDTO {
    private Long id;
    private Long studentId;
    private Long examId;
    private Long courseId;
    private Long sectionId;
    private Double score;
    private String teacherComment;
    private LocalDateTime recordedAt;
}
