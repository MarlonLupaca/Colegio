package com.colegio.student_record_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRecordDTO {
    private Long id;
    private Long userId;
    private String studentCode;
    private String firstName;
    private String lastName;
    private String dni;
    private LocalDate birthDate;
    private String gender;
    private String address;
    private String phone;
    private String email;
    private Long guardianUserId;
    private String status;
    private LocalDate admissionDate;
    private List<AcademicHistoryDTO> academicHistories;
}
