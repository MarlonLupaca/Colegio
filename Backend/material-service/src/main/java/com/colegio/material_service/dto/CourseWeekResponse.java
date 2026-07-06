package com.colegio.material_service.dto;

import com.colegio.material_service.entity.Trimestre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseWeekResponse {
    private Long id;
    private UUID courseId;
    private Trimestre trimestre;
    private Integer numeroSemana;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String descripcion;
}
