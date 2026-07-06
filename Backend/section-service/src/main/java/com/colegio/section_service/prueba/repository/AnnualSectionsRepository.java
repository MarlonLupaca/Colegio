package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.AnnualSections;
import com.colegio.section_service.prueba.entity.EducationLevel;
import com.colegio.section_service.prueba.entity.SectionLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnnualSectionsRepository extends JpaRepository<AnnualSections, UUID> {

    List<AnnualSections> findByAcademicYear(Integer academicYear);

    List<AnnualSections> findByEducationLevel(EducationLevel educationLevel);

    List<AnnualSections> findByAcademicYearAndEducationLevel(Integer academicYear, EducationLevel educationLevel);

    Optional<AnnualSections> findByAcademicYearAndEducationLevelAndGradeLevelAndSectionLetter(
            Integer academicYear, EducationLevel educationLevel, Integer gradeLevel, SectionLetter sectionLetter);

    // saber si un aula ya está en uso en un año específico
    Optional<AnnualSections> findByClassroomIdAndAcademicYear(UUID classroomId, Integer academicYear);
}