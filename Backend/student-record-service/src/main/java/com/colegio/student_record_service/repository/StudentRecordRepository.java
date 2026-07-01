package com.colegio.student_record_service.repository;

import com.colegio.student_record_service.entity.StudentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRecordRepository extends JpaRepository<StudentRecord, Long> {
    Optional<StudentRecord> findByStudentCode(String studentCode);
    Optional<StudentRecord> findByDni(String dni);
    Optional<StudentRecord> findByUserId(Long userId);
    List<StudentRecord> findByStatus(String status);
}
