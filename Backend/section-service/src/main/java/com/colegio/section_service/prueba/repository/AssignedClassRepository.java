package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.AssignedClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignedClassRepository extends JpaRepository<AssignedClass, UUID> {

    List<AssignedClass> findByAnnualSectionId(Long annualSectionId);

    List<AssignedClass> findByCourseId(Long courseId);

    List<AssignedClass> findByTeacherId(Long teacherId);

    boolean existsByAnnualSectionIdAndCourseId(Long annualSectionId, Long courseId);

}
