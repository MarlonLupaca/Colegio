package com.colegio.student_record_service.service;

import com.colegio.student_record_service.dto.AcademicHistoryDTO;
import com.colegio.student_record_service.dto.StudentRecordDTO;

import java.util.List;

public interface StudentRecordService {
    StudentRecordDTO createStudentRecord(StudentRecordDTO dto);
    StudentRecordDTO getStudentRecordById(Long id);
    StudentRecordDTO getStudentRecordByUserId(Long userId);
    StudentRecordDTO getStudentRecordByDni(String dni);
    List<StudentRecordDTO> getAllStudentRecords(String status);
    StudentRecordDTO updateStudentRecord(Long id, StudentRecordDTO dto);
    void deleteStudentRecord(Long id);

    AcademicHistoryDTO addAcademicHistory(Long studentId, AcademicHistoryDTO historyDTO);
    List<AcademicHistoryDTO> getAcademicHistoryByStudentId(Long studentId);
}
