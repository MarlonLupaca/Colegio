package com.colegio.enrollment_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "enrollment_code", unique = true, nullable = false, length = 50)
    private String enrollmentCode;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @Column(name = "grade_level", nullable = false, length = 50)
    private String gradeLevel;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "enrollment_date")
    private LocalDateTime enrollmentDate;

    @Column(name = "status", nullable = false, length = 30)
    private String status; // REGISTERED, CONFIRMED, CANCELLED

    @Column(name = "condition", length = 30)
    private String condition; // REGULAR, REPEATER, SCHOLARSHIP
}
