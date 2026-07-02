package com.colegio.grading_service.controller;

import com.colegio.grading_service.dto.CourseAverageDTO;
import com.colegio.grading_service.dto.GradeBatchDTO;
import com.colegio.grading_service.dto.GradeDTO;
import com.colegio.grading_service.service.GradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grading")
public class GradingController {

    @Autowired
    private GradingService gradingService;

    @PostMapping("/grades")
    public ResponseEntity<GradeDTO> recordGrade(@RequestBody GradeDTO dto) {
        return new ResponseEntity<>(gradingService.recordGrade(dto), HttpStatus.CREATED);
    }

    @PostMapping("/grades/batch")
    public ResponseEntity<List<GradeDTO>> recordBatch(@RequestBody GradeBatchDTO batchDTO) {
        return new ResponseEntity<>(gradingService.recordBatchGrades(batchDTO), HttpStatus.CREATED);
    }

    @GetMapping("/grades/{id}")
    public ResponseEntity<GradeDTO> getGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(gradingService.getGradeById(id));
    }

    @GetMapping("/grades/student/{studentId}")
    public ResponseEntity<List<GradeDTO>> getGradesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradingService.getGradesByStudent(studentId));
    }

    @GetMapping("/grades/exam/{examId}")
    public ResponseEntity<List<GradeDTO>> getGradesByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(gradingService.getGradesByExam(examId));
    }

    @PatchMapping("/grades/{id}")
    public ResponseEntity<GradeDTO> updateGrade(@PathVariable Long id, @RequestParam Double score, @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(gradingService.updateGrade(id, score, comment));
    }

    @PostMapping("/averages/calculate")
    public ResponseEntity<CourseAverageDTO> calculateAverage(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestParam Long sectionId,
            @RequestParam(defaultValue = "FINAL") String period) {
        return ResponseEntity.ok(gradingService.calculateAndSaveAverage(studentId, courseId, sectionId, period));
    }

    @GetMapping("/averages/student/{studentId}")
    public ResponseEntity<List<CourseAverageDTO>> getAveragesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradingService.getAveragesByStudent(studentId));
    }
}
