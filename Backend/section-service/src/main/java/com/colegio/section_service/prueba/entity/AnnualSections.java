package com.colegio.section_service.prueba.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "annual_sections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AnnualSections {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;  // Ej: 2026, 2027

    @Column(name = "grade", nullable = false)
    private String grade;  // Ej: "3ero de Primaria", "5to de Secundaria"

    @Column(name = "section_letter", nullable = false)
    private String sectionLetter;  // Ej: "A", "B", "C"

    @ManyToOne
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;  // FK to Classroom entity

}
