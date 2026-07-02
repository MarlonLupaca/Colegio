package com.colegio.student_record_service.controller;

import com.colegio.student_record_service.dto.AcademicHistoryDTO;
import com.colegio.student_record_service.dto.StudentRecordDTO;
import com.colegio.student_record_service.service.StudentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-record")
public class StudentRecordController {

    @Autowired
    private StudentRecordService studentRecordService;

    @PostMapping
    public ResponseEntity<StudentRecordDTO> createStudentRecord(@RequestBody StudentRecordDTO dto) {
        return new ResponseEntity<>(studentRecordService.createStudentRecord(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentRecordDTO> getStudentRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(studentRecordService.getStudentRecordById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentRecordDTO> getStudentRecordByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(studentRecordService.getStudentRecordByUserId(userId));
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<StudentRecordDTO> getStudentRecordByDni(@PathVariable String dni) {
        return ResponseEntity.ok(studentRecordService.getStudentRecordByDni(dni));
    }

    @GetMapping
    public ResponseEntity<List<StudentRecordDTO>> getAllStudentRecords(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(studentRecordService.getAllStudentRecords(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentRecordDTO> updateStudentRecord(@PathVariable Long id, @RequestBody StudentRecordDTO dto) {
        return ResponseEntity.ok(studentRecordService.updateStudentRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentRecord(@PathVariable Long id) {
        studentRecordService.deleteStudentRecord(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{studentId}/history")
    public ResponseEntity<AcademicHistoryDTO> addAcademicHistory(@PathVariable Long studentId, @RequestBody AcademicHistoryDTO historyDTO) {
        return new ResponseEntity<>(studentRecordService.addAcademicHistory(studentId, historyDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{studentId}/history")
    public ResponseEntity<List<AcademicHistoryDTO>> getAcademicHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentRecordService.getAcademicHistoryByStudentId(studentId));
    }
}
