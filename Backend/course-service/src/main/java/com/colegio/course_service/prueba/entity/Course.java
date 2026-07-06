package com.colegio.course_service.prueba.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses")
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_level", nullable = false, length = 20)
    @NotNull(message = "El nivel educativo es obligatorio")
    private EducationLevel educationLevel;

    @Column(name = "grade_level", nullable = false)
    @Min(1) @Max(6)
    private Integer gradeLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "academic_area", nullable = false, length = 50)
    @NotNull(message = "El área académica es obligatoria")
    private AcademicArea academicArea;

    @Column(name = "hours_per_week")
    @NotNull(message = "Las horas por semana son obligatorias")
    private Integer hoursPerWeek;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}