package com.colegio.material_service.controller;

import com.colegio.material_service.dto.CourseWeekResponse;
import com.colegio.material_service.entity.CourseWeek;
import com.colegio.material_service.repository.CourseWeekRepository;
import com.colegio.material_service.service.WeekGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/weeks")
@RequiredArgsConstructor
public class WeekController {

    private final CourseWeekRepository courseWeekRepository;
    private final WeekGeneratorService weekGeneratorService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseWeekResponse>> getByCourse(@PathVariable UUID courseId) {
        List<CourseWeek> weeks = courseWeekRepository.findByCourseIdOrderByTrimestreAscNumeroSemanaAsc(courseId);
        List<CourseWeekResponse> response = weeks.stream().map(w -> CourseWeekResponse.builder()
            .id(w.getId())
            .courseId(w.getCourseId())
            .trimestre(w.getTrimestre())
            .numeroSemana(w.getNumeroSemana())
            .fechaInicio(w.getFechaInicio())
            .fechaFin(w.getFechaFin())
            .descripcion(w.getDescripcion())
            .build()).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate/{courseId}")
    public ResponseEntity<String> generate(@PathVariable UUID courseId) {
        weekGeneratorService.generarSemanasCurso(courseId);
        return ResponseEntity.ok("Semanas generadas para el curso " + courseId);
    }
}
