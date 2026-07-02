package com.colegio.schedule_service.prueba.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "class_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "time_block_id", nullable = false)
    @NotNull(message = "El bloque horario es obligatorio")
    private TimeBlock timeBlock;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    @NotNull(message = "El día es obligatorio")
    private DayOfWeek dayOfWeek;

    @Column(name = "assigned_class_id", nullable = false)
    @NotNull(message = "La clase asignada es obligatoria")
    private UUID assignedClassId;
}