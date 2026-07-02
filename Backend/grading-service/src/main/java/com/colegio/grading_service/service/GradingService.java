package com.colegio.grading_service.service;

import com.colegio.grading_service.dto.CourseAverageDTO;
import com.colegio.grading_service.dto.GradeBatchDTO;
import com.colegio.grading_service.dto.GradeDTO;

import java.util.List;

public interface GradingService {
    GradeDTO recordGrade(GradeDTO dto);
    List<GradeDTO> recordBatchGrades(GradeBatchDTO batchDTO);
    GradeDTO getGradeById(Long id);
    List<GradeDTO> getGradesByStudent(Long studentId);
    List<GradeDTO> getGradesByExam(Long examId);
    GradeDTO updateGrade(Long id, Double newScore, String comment);

    CourseAverageDTO calculateAndSaveAverage(Long studentId, Long courseId, Long sectionId, String period);
    List<CourseAverageDTO> getAveragesByStudent(Long studentId);
}
