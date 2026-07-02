package com.colegio.attendance_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceDTO {
    private Long id;
    private Long personId;
    private String personType;
    private Long sectionId;
    private Long courseId;
    private LocalDate date;
    private LocalTime time;
    private String status;
    private String observations;
}
