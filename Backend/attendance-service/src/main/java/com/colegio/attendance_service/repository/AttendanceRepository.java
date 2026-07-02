package com.colegio.attendance_service.repository;

import com.colegio.attendance_service.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByPersonIdAndPersonTypeOrderByDateDesc(Long personId, String personType);
    List<Attendance> findBySectionIdAndDate(Long sectionId, LocalDate date);
    List<Attendance> findByCourseIdAndDate(Long courseId, LocalDate date);
}
