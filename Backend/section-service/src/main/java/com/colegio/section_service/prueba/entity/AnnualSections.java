package com.colegio.section_service.prueba.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "annual_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnualSections {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;  // Ej: 2026, 2027

    @Enumerated(EnumType.STRING)
    @Column(name = "grade", nullable = false)
    private EducationLevel educationLevel;  // Primaria", "Secundaria"

    @Column(name = "grade_level", nullable = false)
    @Min(1) @Max(6)
    private Integer gradeLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_letter", nullable = false)
    private SectionLetter sectionLetter; // Ej: "A", "B", "C"

    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;  // FK to Classroom entity

}
