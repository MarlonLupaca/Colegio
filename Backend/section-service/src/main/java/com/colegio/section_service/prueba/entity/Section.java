package com.colegio.section_service.prueba.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name="sections")
@Data
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "education_level", nullable = false, length = 20)
    @NotBlank(message = "El nivel educativo es obligatorio")
    @Pattern(regexp = "primaria|secundaria", message = "Debe ser 'primaria' o 'secundaria'")
    private String educationLevel;

    @Column(name = "grade_level", nullable = false)
    @NotNull(message = "El grado es obligatorio")
    @Min(1) @Max(6)
    private Integer gradeLevel;

    @Column(name = "section_name", nullable = false, length = 5)
    @NotBlank(message = "El nombre de sección es obligatorio")
    @Pattern(regexp = "[A-Z]", message = "La sección debe ser una letra mayúscula (A, B, C...)")
    private String sectionName;

    @Column(name = "max_students")
    @Min(1) @Max(40)
    private Integer maxStudents = 30;

    @Column(name = "is_active")
    private Boolean isActive = true;


}
