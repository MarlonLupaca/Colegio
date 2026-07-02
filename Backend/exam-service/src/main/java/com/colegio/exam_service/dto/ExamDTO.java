package com.colegio.exam_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDTO {
    private Long id;
    private String title;
    private String description;
    private Long courseId;
    private Long sectionId;
    private Long teacherId;
    private LocalDateTime examDate;
    private Integer durationMinutes;
    private Double maxScore;
    private Double weightPercentage;
    private String status;
}
