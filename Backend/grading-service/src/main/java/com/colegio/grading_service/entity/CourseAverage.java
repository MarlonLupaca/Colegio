package com.colegio.grading_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_averages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseAverage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @Column(name = "period", nullable = false, length = 50)
    private String period; // BIMESTER_1, BIMESTER_2, FINAL

    @Column(name = "average_score", nullable = false)
    private Double averageScore;

    @Column(name = "approval_status", nullable = false, length = 30)
    private String approvalStatus; // APPROVED, FAILED, IN_PROGRESS
}
