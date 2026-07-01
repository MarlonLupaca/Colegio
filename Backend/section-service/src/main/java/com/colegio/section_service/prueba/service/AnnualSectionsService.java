package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.AnnualSections;
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
        annualSectionsRepository.findByAcademicYearAndGradeAndSectionLetter(
                annualSection.getAcademicYear(),
                annualSection.getGrade(),
                annualSection.getSectionLetter()
        ).ifPresent(s -> {
            throw new IllegalArgumentException(
                    "Ya existe la sección " + annualSection.getGrade() +
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

    public List<AnnualSections> getByGrade(String grade) {
        return annualSectionsRepository.findByGrade(grade);
    }

    public List<AnnualSections> getByAcademicYearAndGrade(Integer academicYear, String grade) {
        return annualSectionsRepository.findByAcademicYearAndGrade(academicYear, grade);
    }

    public AnnualSections updateAnnualSection(UUID id, AnnualSections details) {
        AnnualSections section = getAnnualSectionById(id);
        section.setAcademicYear(details.getAcademicYear());
        section.setGrade(details.getGrade());
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
                    newSection.setGrade(prev.getGrade());
                    newSection.setSectionLetter(prev.getSectionLetter());
                    newSection.setClassroom(prev.getClassroom());
                    return annualSectionsRepository.save(newSection);
                })
                .toList();
    }

}
