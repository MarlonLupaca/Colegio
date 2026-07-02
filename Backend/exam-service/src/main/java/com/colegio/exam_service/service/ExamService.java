package com.colegio.exam_service.service;

import com.colegio.exam_service.dto.ExamDTO;

import java.util.List;

public interface ExamService {
    ExamDTO createExam(ExamDTO dto);
    ExamDTO getExamById(Long id);
    List<ExamDTO> getExamsByCourse(Long courseId);
    List<ExamDTO> getExamsBySection(Long sectionId);
    List<ExamDTO> getExamsByTeacher(Long teacherId);
    ExamDTO updateExam(Long id, ExamDTO dto);
    void deleteExam(Long id);
}
