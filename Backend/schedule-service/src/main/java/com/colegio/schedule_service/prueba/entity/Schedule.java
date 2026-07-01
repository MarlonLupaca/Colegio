package com.colegio.schedule_service.prueba.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "schedules")
@Data
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "section_id", nullable = false)
    @NotNull(message = "La sección es obligatoria")
    private UUID sectionId;

    @Column(name = "course_id", nullable = false)
    @NotNull(message = "El curso es obligatorio")
    private UUID courseId;

    @Column(name = "teacher_id", nullable = false)
    @NotNull(message = "El profesor es obligatorio")
    private UUID teacherId;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 15)
    @NotNull(message = "El día es obligatorio")
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime endTime;

    @Column(name = "academic_year", nullable = false)
    @NotNull(message = "El año académico es obligatorio")
    private Integer academicYear;

    @Column(name = "is_active")
    private Boolean isActive = true;
}
