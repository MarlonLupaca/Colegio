package com.colegio.section_service.prueba.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "assigned_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignedClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = " annual_section_id", nullable = false)
    @NotNull(message = "La sección anual es obligatoria")
    private AnnualSections annualSection;

    @Column(name = "course_id", nullable = false)
    @NotNull(message = "El curso es obligatorio")
    private UUID courseId;

    @Column(name = "teacher_id", nullable = false)
    @NotNull(message = "El profesor es obligatorio")
    private UUID teacherId;

}
