package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.Section;
import com.colegio.section_service.prueba.repository.SectionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;

    // Obtener todas las secciones
    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    // Obtener sección por ID
    public Section getSectionById(Long id) {
        return sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada con ID: " + id));
    }

    // Crear nueva sección
    public Section createSection(Section section) {
        if ("secundaria".equalsIgnoreCase(section.getEducationLevel()) && section.getGradeLevel() > 5) {
            throw new IllegalArgumentException("Secundaria solo tiene hasta 5 grados.");
        }

        sectionRepository.findByEducationLevelAndGradeLevelAndSectionName(
                section.getEducationLevel(),
                section.getGradeLevel(),
                section.getSectionName()
        ).ifPresent(s -> {
            throw new IllegalArgumentException("Ya existe la sección " +
                    section.getGradeLevel() + "° " + section.getEducationLevel() +
                    " \"" + section.getSectionName() + "\"");
        });

        return sectionRepository.save(section);
    }

    // Actualizar sección existente
    public Section updateSection(Long id, Section sectionDetails) {
        Section existingSection = getSectionById(id);

        if ("secundaria".equalsIgnoreCase(sectionDetails.getEducationLevel()) && sectionDetails.getGradeLevel() > 5) {
            throw new IllegalArgumentException("Secundaria solo tiene hasta 5 grados.");
        }

        existingSection.setEducationLevel(sectionDetails.getEducationLevel());
        existingSection.setGradeLevel(sectionDetails.getGradeLevel());
        existingSection.setSectionName(sectionDetails.getSectionName());
        existingSection.setMaxStudents(sectionDetails.getMaxStudents());
        existingSection.setIsActive(sectionDetails.getIsActive());

        return sectionRepository.save(existingSection);
    }

    // Eliminar sección
    public void deleteSection(Long id) {
        Section section = getSectionById(id);
        sectionRepository.delete(section);
    }

    // Obtener secciones activas
    public List<Section> getActiveSections() {
        return sectionRepository.findByIsActiveTrue();
    }
}
