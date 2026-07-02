package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SectionRepository  extends JpaRepository<Section, Long> {

    // Buscar secciones por nivel educativo
    List<Section> findByEducationLevel(String educationLevel);

    // Buscar secciones activas
    List<Section> findByIsActiveTrue();

    // Buscar por grado y sección
    Section findByGradeLevelAndSectionName(Integer gradeLevel, String sectionName);

    Optional<Section> findByEducationLevelAndGradeLevelAndSectionName(
            String educationLevel, Integer gradeLevel, String sectionName);


}
