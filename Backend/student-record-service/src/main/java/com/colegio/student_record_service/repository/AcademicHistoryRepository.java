package com.colegio.student_record_service.repository;

import com.colegio.student_record_service.entity.AcademicHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicHistoryRepository extends JpaRepository<AcademicHistory, Long> {
    List<AcademicHistory> findByStudentRecordIdOrderByAcademicYearDesc(Long studentRecordId);
}
