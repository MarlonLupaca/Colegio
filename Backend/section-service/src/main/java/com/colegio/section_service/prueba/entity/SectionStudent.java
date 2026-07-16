package com.colegio.section_service.prueba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "section_students", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"section_id", "student_code"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectionStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private AnnualSections section;

    @Column(name = "student_code", nullable = false, length = 20)
    private String studentCode;

    @Transient
    private String studentName;
}
