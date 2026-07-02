package com.colegio.exam_service.repository;

import com.colegio.exam_service.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCourseId(Long courseId);
    List<Exam> findBySectionId(Long sectionId);
    List<Exam> findByTeacherId(Long teacherId);
    List<Exam> findByStatus(String status);
}
