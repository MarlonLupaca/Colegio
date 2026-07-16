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
    @JoinColumn(name = "annual_section_id", nullable = true)
    private AnnualSections annualSections;

    @Column(name = "classroom_override_id")
    private UUID classroomOverrideId;

    @Column(name = "course_id", nullable = false)
    @NotNull(message = "El curso es obligatorio")
    private UUID courseId;

    @Column(name = "teacher_id", nullable = true)
    private Long teacherId;

    @Transient
    private String teacherName;

    @Transient
    private String teacherCode;

    @Transient
    private String courseName;

    @Transient
    private String courseCode;

    @Transient
    private Integer hoursPerWeek;

}
