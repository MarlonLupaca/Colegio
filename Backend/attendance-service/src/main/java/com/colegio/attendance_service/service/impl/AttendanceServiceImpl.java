package com.colegio.attendance_service.service.impl;

import com.colegio.attendance_service.dto.AttendanceBatchDTO;
import com.colegio.attendance_service.dto.AttendanceDTO;
import com.colegio.attendance_service.entity.Attendance;
import com.colegio.attendance_service.repository.AttendanceRepository;
import com.colegio.attendance_service.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Override
    @Transactional
    public AttendanceDTO recordAttendance(AttendanceDTO dto) {
        Attendance entity = Attendance.builder()
                .personId(dto.getPersonId())
                .personType(dto.getPersonType() != null ? dto.getPersonType() : "STUDENT")
                .sectionId(dto.getSectionId())
                .courseId(dto.getCourseId())
                .date(dto.getDate() != null ? dto.getDate() : LocalDate.now())
                .time(dto.getTime() != null ? dto.getTime() : LocalTime.now())
                .status(dto.getStatus() != null ? dto.getStatus() : "PRESENT")
                .observations(dto.getObservations())
                .build();
        Attendance saved = attendanceRepository.save(entity);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public List<AttendanceDTO> recordBatchAttendance(AttendanceBatchDTO batchDTO) {
        List<AttendanceDTO> results = new ArrayList<>();
        if (batchDTO.getAttendances() != null) {
            for (AttendanceDTO item : batchDTO.getAttendances()) {
                item.setSectionId(batchDTO.getSectionId());
                item.setCourseId(batchDTO.getCourseId());
                item.setDate(batchDTO.getDate() != null ? batchDTO.getDate() : LocalDate.now());
                if (item.getPersonType() == null) item.setPersonType(batchDTO.getPersonType());
                results.add(recordAttendance(item));
            }
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceDTO getAttendanceById(Long id) {
        Attendance att = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));
        return mapToDTO(att);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDTO> getByPerson(Long personId, String personType) {
        return attendanceRepository.findByPersonIdAndPersonTypeOrderByDateDesc(personId, personType)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDTO> getBySectionAndDate(Long sectionId, LocalDate date) {
        return attendanceRepository.findBySectionIdAndDate(sectionId, date)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceDTO justifyAttendance(Long id, String observations) {
        Attendance att = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));
        att.setStatus("EXCUSED");
        if (observations != null) {
            att.setObservations(observations);
        }
        return mapToDTO(attendanceRepository.save(att));
    }

    private AttendanceDTO mapToDTO(Attendance entity) {
        return AttendanceDTO.builder()
                .id(entity.getId())
                .personId(entity.getPersonId())
                .personType(entity.getPersonType())
                .sectionId(entity.getSectionId())
                .courseId(entity.getCourseId())
                .date(entity.getDate())
                .time(entity.getTime())
                .status(entity.getStatus())
                .observations(entity.getObservations())
                .build();
    }
}
