package com.colegio.grading_service.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeBatchDTO {
    private Long examId;
    private Long courseId;
    private Long sectionId;
    private List<GradeDTO> grades;
}
