package com.colegio.attendance_service.service;

import com.colegio.attendance_service.dto.AttendanceBatchDTO;
import com.colegio.attendance_service.dto.AttendanceDTO;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    AttendanceDTO recordAttendance(AttendanceDTO dto);
    List<AttendanceDTO> recordBatchAttendance(AttendanceBatchDTO batchDTO);
    AttendanceDTO getAttendanceById(Long id);
    List<AttendanceDTO> getByPerson(Long personId, String personType);
    List<AttendanceDTO> getBySectionAndDate(Long sectionId, LocalDate date);
    AttendanceDTO justifyAttendance(Long id, String observations);
}
