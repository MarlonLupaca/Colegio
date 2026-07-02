package com.colegio.grading_service.service.impl;

import com.colegio.grading_service.dto.CourseAverageDTO;
import com.colegio.grading_service.dto.GradeBatchDTO;
import com.colegio.grading_service.dto.GradeDTO;
import com.colegio.grading_service.entity.CourseAverage;
import com.colegio.grading_service.entity.Grade;
import com.colegio.grading_service.repository.CourseAverageRepository;
import com.colegio.grading_service.repository.GradeRepository;
import com.colegio.grading_service.service.GradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradingServiceImpl implements GradingService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private CourseAverageRepository courseAverageRepository;

    @Override
    @Transactional
    public GradeDTO recordGrade(GradeDTO dto) {
        Grade entity = Grade.builder()
                .studentId(dto.getStudentId())
                .examId(dto.getExamId())
                .courseId(dto.getCourseId())
                .sectionId(dto.getSectionId())
                .score(dto.getScore())
                .teacherComment(dto.getTeacherComment())
                .recordedAt(dto.getRecordedAt() != null ? dto.getRecordedAt() : LocalDateTime.now())
                .build();
        Grade saved = gradeRepository.save(entity);
        return mapGradeToDTO(saved);
    }

    @Override
    @Transactional
    public List<GradeDTO> recordBatchGrades(GradeBatchDTO batchDTO) {
        List<GradeDTO> results = new ArrayList<>();
        if (batchDTO.getGrades() != null) {
            for (GradeDTO g : batchDTO.getGrades()) {
                if (g.getExamId() == null) g.setExamId(batchDTO.getExamId());
                if (g.getCourseId() == null) g.setCourseId(batchDTO.getCourseId());
                if (g.getSectionId() == null) g.setSectionId(batchDTO.getSectionId());
                results.add(recordGrade(g));
            }
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public GradeDTO getGradeById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found with id: " + id));
        return mapGradeToDTO(grade);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId)
                .stream().map(this::mapGradeToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeDTO> getGradesByExam(Long examId) {
        return gradeRepository.findByExamId(examId)
                .stream().map(this::mapGradeToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GradeDTO updateGrade(Long id, Double newScore, String comment) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found with id: " + id));
        if (newScore != null) grade.setScore(newScore);
        if (comment != null) grade.setTeacherComment(comment);
        return mapGradeToDTO(gradeRepository.save(grade));
    }

    @Override
    @Transactional
    public CourseAverageDTO calculateAndSaveAverage(Long studentId, Long courseId, Long sectionId, String period) {
        List<Grade> grades = gradeRepository.findByStudentIdAndCourseId(studentId, courseId);
        double avg = 0.0;
        if (!grades.isEmpty()) {
            avg = grades.stream().mapToDouble(Grade::getScore).average().orElse(0.0);
        }
        String status = avg >= 11.0 ? "APPROVED" : "FAILED";

        CourseAverage courseAverage = courseAverageRepository.findByStudentIdAndCourseIdAndPeriod(studentId, courseId, period)
                .orElse(CourseAverage.builder()
                        .studentId(studentId)
                        .courseId(courseId)
                        .sectionId(sectionId)
                        .period(period)
                        .build());
        courseAverage.setAverageScore(Math.round(avg * 100.0) / 100.0);
        courseAverage.setApprovalStatus(status);

        CourseAverage saved = courseAverageRepository.save(courseAverage);
        return mapAverageToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseAverageDTO> getAveragesByStudent(Long studentId) {
        return courseAverageRepository.findByStudentId(studentId)
                .stream().map(this::mapAverageToDTO).collect(Collectors.toList());
    }

    private GradeDTO mapGradeToDTO(Grade entity) {
        return GradeDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudentId())
                .examId(entity.getExamId())
                .courseId(entity.getCourseId())
                .sectionId(entity.getSectionId())
                .score(entity.getScore())
                .teacherComment(entity.getTeacherComment())
                .recordedAt(entity.getRecordedAt())
                .build();
    }

    private CourseAverageDTO mapAverageToDTO(CourseAverage entity) {
        return CourseAverageDTO.builder()
                .id(entity.getId())
                .studentId(entity.getStudentId())
                .courseId(entity.getCourseId())
                .sectionId(entity.getSectionId())
                .period(entity.getPeriod())
                .averageScore(entity.getAverageScore())
                .approvalStatus(entity.getApprovalStatus())
                .build();
    }
}
