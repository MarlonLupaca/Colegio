package com.colegio.schedule_service.prueba.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "time_blocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "start_time", nullable = false)
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @NotNull(message = "El tipo de bloque es obligatorio")
    private BlockType type;
}