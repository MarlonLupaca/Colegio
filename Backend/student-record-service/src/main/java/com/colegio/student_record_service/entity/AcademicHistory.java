package com.colegio.student_record_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "academic_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_record_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private StudentRecord studentRecord;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "grade_level", nullable = false, length = 50)
    private String gradeLevel;

    @Column(name = "general_average")
    private Double generalAverage;

    @Column(name = "observations", length = 500)
    private String observations;
}
