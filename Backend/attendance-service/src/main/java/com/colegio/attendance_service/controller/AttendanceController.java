package com.colegio.attendance_service.controller;

import com.colegio.attendance_service.dto.AttendanceBatchDTO;
import com.colegio.attendance_service.dto.AttendanceDTO;
import com.colegio.attendance_service.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<AttendanceDTO> recordAttendance(@RequestBody AttendanceDTO dto) {
        return new ResponseEntity<>(attendanceService.recordAttendance(dto), HttpStatus.CREATED);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<AttendanceDTO>> recordBatch(@RequestBody AttendanceBatchDTO batchDTO) {
        return new ResponseEntity<>(attendanceService.recordBatchAttendance(batchDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<AttendanceDTO>> getByPerson(@PathVariable Long personId, @RequestParam(defaultValue = "STUDENT") String personType) {
        return ResponseEntity.ok(attendanceService.getByPerson(personId, personType));
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<AttendanceDTO>> getBySectionAndDate(
            @PathVariable Long sectionId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getBySectionAndDate(sectionId, date));
    }

    @PatchMapping("/{id}/justify")
    public ResponseEntity<AttendanceDTO> justify(@PathVariable Long id, @RequestParam(required = false) String observations) {
        return ResponseEntity.ok(attendanceService.justifyAttendance(id, observations));
    }
}
