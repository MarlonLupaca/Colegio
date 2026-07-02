package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.AnnualSections;
import com.colegio.section_service.prueba.entity.EducationLevel;
import com.colegio.section_service.prueba.repository.AnnualSectionsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnnualSectionsService {

    @Autowired
    private AnnualSectionsRepository annualSectionsRepository;

    public AnnualSections createAnnualSection(AnnualSections annualSection) {
        if (EducationLevel.SECUNDARIA.equals(annualSection.getEducationLevel()) && annualSection.getGradeLevel() > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }
        annualSectionsRepository.findByAcademicYearAndEducationLevelAndSectionLetter(
                annualSection.getAcademicYear(),
                annualSection.getEducationLevel(),
                annualSection.getSectionLetter()
        ).ifPresent(s -> {
            throw new IllegalArgumentException(
                    "Ya existe la sección " + annualSection.getEducationLevel() +
                            " \"" + annualSection.getSectionLetter() +
                            "\" para el año " + annualSection.getAcademicYear());
        });
        return annualSectionsRepository.save(annualSection);
    }

    public List<AnnualSections> getAllAnnualSections() {
        return annualSectionsRepository.findAll();
    }

    public AnnualSections getAnnualSectionById(UUID id) {
        return annualSectionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sección no encontrada con ID: " + id));
    }

    public List<AnnualSections> getByAcademicYear(Integer academicYear) {
        return annualSectionsRepository.findByAcademicYear(academicYear);
    }

    // Cambiado a EducationLevel
    public List<AnnualSections> getByEducationLevel(EducationLevel educationLevel) {
        return annualSectionsRepository.findByEducationLevel(educationLevel);
    }

    public List<AnnualSections> getByAcademicYearAndEducationLevel(Integer academicYear, EducationLevel educationLevel) {
        return annualSectionsRepository.findByAcademicYearAndEducationLevel(academicYear, educationLevel);
    }

    public AnnualSections updateAnnualSection(UUID id, AnnualSections details) {

        if (EducationLevel.SECUNDARIA.equals(details.getEducationLevel()) && details.getGradeLevel() > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }

        AnnualSections section = getAnnualSectionById(id);

        section.setAcademicYear(details.getAcademicYear());
        section.setEducationLevel(details.getEducationLevel());
        section.setGradeLevel(details.getGradeLevel());
        section.setSectionLetter(details.getSectionLetter());
        section.setClassroom(details.getClassroom());

        return annualSectionsRepository.save(section);
    }

    public void deleteAnnualSection(UUID id) {
        AnnualSections section = getAnnualSectionById(id);
        annualSectionsRepository.delete(section);
    }

    public List<AnnualSections> cloneFromYear(Integer fromYear, Integer toYear) {
        List<AnnualSections> previous = annualSectionsRepository.findByAcademicYear(fromYear);

        if (previous.isEmpty()) {
            throw new EntityNotFoundException(
                    "No se encontraron secciones para el año " + fromYear);
        }

        return previous.stream()
                .map(prev -> {
                    AnnualSections newSection = new AnnualSections();
                    newSection.setAcademicYear(toYear);
                    newSection.setEducationLevel(prev.getEducationLevel());
                    newSection.setGradeLevel(prev.getGradeLevel());
                    newSection.setSectionLetter(prev.getSectionLetter());
                    newSection.setClassroom(prev.getClassroom());
                    return annualSectionsRepository.save(newSection);
                })
                .toList();
    }

}
