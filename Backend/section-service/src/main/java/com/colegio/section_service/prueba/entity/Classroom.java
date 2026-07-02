package com.colegio.section_service.prueba.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "classrooms")
@Data
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "building", nullable = false, length = 100)
    @NotBlank(message = "El edificio/pabellón es obligatorio")
    private String building;

    @Column(name = "room_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "El número de aula es obligatorio")
    private String roomNumber;

    @Column(name = "max_capacity", nullable = false)
    @NotNull(message = "La capacidad máxima es obligatoria")
    @Min(1)
    @Max(30)
    private Integer maxCapacity = 30;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClassroomStatus status = ClassroomStatus.DISPONIBLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @NotNull(message = "El tipo de aula es obligatorio")
    private ClassroomType type = ClassroomType.AULA_NORMAL;
}
