package com.colegio.grading_service.repository;

import com.colegio.grading_service.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByExamId(Long examId);
    List<Grade> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
