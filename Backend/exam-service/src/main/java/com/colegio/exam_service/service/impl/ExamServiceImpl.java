package com.colegio.exam_service.service.impl;

import com.colegio.exam_service.dto.ExamDTO;
import com.colegio.exam_service.entity.Exam;
import com.colegio.exam_service.repository.ExamRepository;
import com.colegio.exam_service.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Override
    @Transactional
    public ExamDTO createExam(ExamDTO dto) {
        Exam entity = Exam.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .courseId(dto.getCourseId())
                .sectionId(dto.getSectionId())
                .teacherId(dto.getTeacherId())
                .examDate(dto.getExamDate())
                .durationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 60)
                .maxScore(dto.getMaxScore() != null ? dto.getMaxScore() : 20.0)
                .weightPercentage(dto.getWeightPercentage() != null ? dto.getWeightPercentage() : 25.0)
                .status(dto.getStatus() != null ? dto.getStatus() : "SCHEDULED")
                .build();
        Exam saved = examRepository.save(entity);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamDTO getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + id));
        return mapToDTO(exam);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseId(courseId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsBySection(Long sectionId) {
        return examRepository.findBySectionId(sectionId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDTO> getExamsByTeacher(Long teacherId) {
        return examRepository.findByTeacherId(teacherId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExamDTO updateExam(Long id, ExamDTO dto) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + id));
        if (dto.getTitle() != null) exam.setTitle(dto.getTitle());
        if (dto.getDescription() != null) exam.setDescription(dto.getDescription());
        if (dto.getExamDate() != null) exam.setExamDate(dto.getExamDate());
        if (dto.getDurationMinutes() != null) exam.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getMaxScore() != null) exam.setMaxScore(dto.getMaxScore());
        if (dto.getWeightPercentage() != null) exam.setWeightPercentage(dto.getWeightPercentage());
        if (dto.getStatus() != null) exam.setStatus(dto.getStatus());
        return mapToDTO(examRepository.save(exam));
    }

    @Override
    @Transactional
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new RuntimeException("Exam not found with id: " + id);
        }
        examRepository.deleteById(id);
    }

    private ExamDTO mapToDTO(Exam entity) {
        return ExamDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .courseId(entity.getCourseId())
                .sectionId(entity.getSectionId())
                .teacherId(entity.getTeacherId())
                .examDate(entity.getExamDate())
                .durationMinutes(entity.getDurationMinutes())
                .maxScore(entity.getMaxScore())
                .weightPercentage(entity.getWeightPercentage())
                .status(entity.getStatus())
                .build();
    }
}
