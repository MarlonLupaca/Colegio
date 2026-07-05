package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.AssignedClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssignedClassRepository extends JpaRepository<AssignedClass, UUID> {


    List<AssignedClass> findByAnnualSectionsId(UUID annualSectionId);

    List<AssignedClass> findByCourseId(UUID courseId);

    List<AssignedClass> findByTeacherId(Long teacherId);

    boolean existsByAnnualSectionsIdAndCourseId(UUID annualSectionId, UUID courseId);

}
