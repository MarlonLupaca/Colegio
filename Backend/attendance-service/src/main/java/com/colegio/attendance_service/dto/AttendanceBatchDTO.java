package com.colegio.attendance_service.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceBatchDTO {
    private Long sectionId;
    private Long courseId;
    private LocalDate date;
    private String personType;
    private List<AttendanceDTO> attendances;
}
