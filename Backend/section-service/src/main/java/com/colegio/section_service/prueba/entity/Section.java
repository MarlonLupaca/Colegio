package com.colegio.section_service.prueba.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name="sections")
@Data
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "academic_year", nullable = false, length = 4)
    @NotBlank(message = "El año académico es obligatorio")
    private String academicYear;

    @Column(name = "max_students")
    @Min(1) @Max(40)
    private Integer maxStudents = 30;

    @NotBlank(message = "El nombre de sección es obligatorio")
    private String sectionName;



}
