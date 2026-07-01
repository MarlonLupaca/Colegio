package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.AnnualSections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnnualSectionsRepository extends JpaRepository<AnnualSections, UUID> {

    List<AnnualSections> findByAcademicYear(Integer academicYear);

    List<AnnualSections> findByGrade(String grade);

    List<AnnualSections> findByAcademicYearAndGrade(Integer academicYear, String grade);

    Optional<AnnualSections> findByAcademicYearAndGradeAndSectionLetter(
            Integer academicYear, String grade, String sectionLetter);


}
