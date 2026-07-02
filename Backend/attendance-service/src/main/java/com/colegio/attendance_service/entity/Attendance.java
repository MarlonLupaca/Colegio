package com.colegio.attendance_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "person_id", nullable = false)
    private Long personId;

    @Column(name = "person_type", nullable = false, length = 30)
    private String personType; // STUDENT, TEACHER

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "time", nullable = false)
    private LocalTime time;

    @Column(name = "status", nullable = false, length = 30)
    private String status; // PRESENT, LATE, ABSENT, EXCUSED

    @Column(name = "observations", length = 300)
    private String observations;
}
