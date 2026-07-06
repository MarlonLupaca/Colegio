package com.colegio.material_service.repository;

import com.colegio.material_service.entity.CourseWeek;
import com.colegio.material_service.entity.Trimestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseWeekRepository extends JpaRepository<CourseWeek, Long> {
    boolean existsByCourseIdAndTrimestreAndNumeroSemana(UUID courseId, Trimestre trimestre, Integer numeroSemana);
    List<CourseWeek> findByCourseIdOrderByTrimestreAscNumeroSemanaAsc(UUID courseId);
    List<CourseWeek> findByCourseIdAndTrimestreOrderByNumeroSemanaAsc(UUID courseId, Trimestre trimestre);
}
