package com.colegio.student_record_service.service.impl;

import com.colegio.student_record_service.dto.AcademicHistoryDTO;
import com.colegio.student_record_service.dto.StudentRecordDTO;
import com.colegio.student_record_service.entity.AcademicHistory;
import com.colegio.student_record_service.entity.StudentRecord;
import com.colegio.student_record_service.repository.AcademicHistoryRepository;
import com.colegio.student_record_service.repository.StudentRecordRepository;
import com.colegio.student_record_service.service.StudentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentRecordServiceImpl implements StudentRecordService {

    @Autowired
    private StudentRecordRepository studentRecordRepository;

    @Autowired
    private AcademicHistoryRepository academicHistoryRepository;

    @Override
    @Transactional
    public StudentRecordDTO createStudentRecord(StudentRecordDTO dto) {
        StudentRecord entity = mapToEntity(dto);
        if (entity.getAdmissionDate() == null) {
            entity.setAdmissionDate(LocalDate.now());
        }
        if (entity.getStatus() == null) {
            entity.setStatus("ACTIVE");
        }
        StudentRecord saved = studentRecordRepository.save(entity);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentRecordDTO getStudentRecordById(Long id) {
        StudentRecord record = studentRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentRecord not found with id: " + id));
        return mapToDTO(record);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentRecordDTO getStudentRecordByUserId(Long userId) {
        StudentRecord record = studentRecordRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("StudentRecord not found for userId: " + userId));
        return mapToDTO(record);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentRecordDTO getStudentRecordByDni(String dni) {
        StudentRecord record = studentRecordRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("StudentRecord not found with DNI: " + dni));
        return mapToDTO(record);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentRecordDTO> getAllStudentRecords(String status) {
        List<StudentRecord> records;
        if (status != null && !status.trim().isEmpty()) {
            records = studentRecordRepository.findByStatus(status);
        } else {
            records = studentRecordRepository.findAll();
        }
        return records.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentRecordDTO updateStudentRecord(Long id, StudentRecordDTO dto) {
        StudentRecord record = studentRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentRecord not found with id: " + id));
        if (dto.getFirstName() != null) record.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) record.setLastName(dto.getLastName());
        if (dto.getAddress() != null) record.setAddress(dto.getAddress());
        if (dto.getPhone() != null) record.setPhone(dto.getPhone());
        if (dto.getEmail() != null) record.setEmail(dto.getEmail());
        if (dto.getGuardianUserId() != null) record.setGuardianUserId(dto.getGuardianUserId());
        if (dto.getStatus() != null) record.setStatus(dto.getStatus());
        if (dto.getBirthDate() != null) record.setBirthDate(dto.getBirthDate());
        if (dto.getGender() != null) record.setGender(dto.getGender());

        StudentRecord updated = studentRecordRepository.save(record);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteStudentRecord(Long id) {
        if (!studentRecordRepository.existsById(id)) {
            throw new RuntimeException("StudentRecord not found with id: " + id);
        }
        studentRecordRepository.deleteById(id);
    }

    @Override
    @Transactional
    public AcademicHistoryDTO addAcademicHistory(Long studentId, AcademicHistoryDTO historyDTO) {
        StudentRecord record = studentRecordRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("StudentRecord not found with id: " + studentId));
        AcademicHistory history = AcademicHistory.builder()
                .studentRecord(record)
                .academicYear(historyDTO.getAcademicYear())
                .gradeLevel(historyDTO.getGradeLevel())
                .generalAverage(historyDTO.getGeneralAverage())
                .observations(historyDTO.getObservations())
                .build();
        AcademicHistory saved = academicHistoryRepository.save(history);
        return mapHistoryToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicHistoryDTO> getAcademicHistoryByStudentId(Long studentId) {
        return academicHistoryRepository.findByStudentRecordIdOrderByAcademicYearDesc(studentId)
                .stream()
                .map(this::mapHistoryToDTO)
                .collect(Collectors.toList());
    }

    private StudentRecord mapToEntity(StudentRecordDTO dto) {
        return StudentRecord.builder()
                .id(dto.getId())
                .userId(dto.getUserId())
                .studentCode(dto.getStudentCode())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dni(dto.getDni())
                .birthDate(dto.getBirthDate())
                .gender(dto.getGender())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .guardianUserId(dto.getGuardianUserId())
                .status(dto.getStatus())
                .admissionDate(dto.getAdmissionDate())
                .build();
    }

    private StudentRecordDTO mapToDTO(StudentRecord entity) {
        List<AcademicHistoryDTO> histories = entity.getAcademicHistories() != null ?
                entity.getAcademicHistories().stream().map(this::mapHistoryToDTO).collect(Collectors.toList())
                : List.of();
        return StudentRecordDTO.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .studentCode(entity.getStudentCode())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .dni(entity.getDni())
                .birthDate(entity.getBirthDate())
                .gender(entity.getGender())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .guardianUserId(entity.getGuardianUserId())
                .status(entity.getStatus())
                .admissionDate(entity.getAdmissionDate())
                .academicHistories(histories)
                .build();
    }

    private AcademicHistoryDTO mapHistoryToDTO(AcademicHistory entity) {
        return AcademicHistoryDTO.builder()
                .id(entity.getId())
                .studentRecordId(entity.getStudentRecord() != null ? entity.getStudentRecord().getId() : null)
                .academicYear(entity.getAcademicYear())
                .gradeLevel(entity.getGradeLevel())
                .generalAverage(entity.getGeneralAverage())
                .observations(entity.getObservations())
                .build();
    }
}
