package com.colegio.exam_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "section_id", nullable = false)
    private Long sectionId;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Column(name = "exam_date")
    private LocalDateTime examDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "max_score", nullable = false)
    private Double maxScore;

    @Column(name = "weight_percentage", nullable = false)
    private Double weightPercentage;

    @Column(name = "status", nullable = false, length = 30)
    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, GRADED
}
