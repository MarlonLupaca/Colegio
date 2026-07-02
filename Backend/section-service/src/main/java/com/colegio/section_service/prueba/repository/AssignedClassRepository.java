package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.AssignedClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignedClassRepository extends JpaRepository<AssignedClass, UUID> {

    List<AssignedClass> findByAnnualSectionId(UUID annualSectionId);

    List<AssignedClass> findByCourseId(UUID courseId);

    List<AssignedClass> findByTeacherId(UUID teacherId);

    boolean existsByAnnualSectionIdAndCourseId(UUID annualSectionId, UUID courseId);

}
