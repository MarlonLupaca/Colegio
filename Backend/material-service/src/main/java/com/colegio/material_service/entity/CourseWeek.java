package com.colegio.material_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "course_weeks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "trimestre", "numero_semana"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseWeek {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Enumerated(EnumType.STRING)
    @Column(name = "trimestre", nullable = false, length = 20)
    private Trimestre trimestre;

    @Column(name = "numero_semana", nullable = false)
    private Integer numeroSemana;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "descripcion", length = 100)
    private String descripcion;
}
