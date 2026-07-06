package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.*;
import com.colegio.section_service.prueba.repository.AnnualSectionsRepository;
import com.colegio.section_service.prueba.repository.ClassroomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnnualSectionsService {

    @Autowired
    private AnnualSectionsRepository annualSectionsRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Transactional
    public AnnualSections createAnnualSection(AnnualSections annualSection) {
        validateGradeLevel(annualSection.getEducationLevel(), annualSection.getGradeLevel());

        annualSectionsRepository.findByAcademicYearAndEducationLevelAndGradeLevelAndSectionLetter(
                annualSection.getAcademicYear(),
                annualSection.getEducationLevel(),
                annualSection.getGradeLevel(),
                annualSection.getSectionLetter()
        ).ifPresent(s -> {
            throw new IllegalArgumentException(
                    "Ya existe la sección " + annualSection.getGradeLevel() + "° " +
                            annualSection.getEducationLevel() + " \"" + annualSection.getSectionLetter() +
                            "\" para el año " + annualSection.getAcademicYear());
        });

        Classroom classroom = resolveAndValidateClassroom(annualSection);
        annualSection.setClassroom(classroom);

        return annualSectionsRepository.save(annualSection);
    }

    public AnnualSections findByAcademicYearAndEducationLevelAndGradeLevelAndSectionLetter(
            Integer academicYear,
            EducationLevel educationLevel,
            Integer gradeLevel,
            SectionLetter sectionLetter) {
        return annualSectionsRepository
                .findByAcademicYearAndEducationLevelAndGradeLevelAndSectionLetter(
                        academicYear, educationLevel, gradeLevel, sectionLetter)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Sección no encontrada para año: " + academicYear +
                                ", nivel: " + educationLevel +
                                ", grado: " + gradeLevel +
                                ", sección: " + sectionLetter));
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

    public List<AnnualSections> getByEducationLevel(EducationLevel educationLevel) {
        return annualSectionsRepository.findByEducationLevel(educationLevel);
    }

    public List<AnnualSections> getByAcademicYearAndEducationLevel(Integer academicYear, EducationLevel educationLevel) {
        return annualSectionsRepository.findByAcademicYearAndEducationLevel(academicYear, educationLevel);
    }

    @Transactional
    public AnnualSections updateAnnualSection(UUID id, AnnualSections details) {
        validateGradeLevel(details.getEducationLevel(), details.getGradeLevel());

        AnnualSections section = getAnnualSectionById(id);

        section.setAcademicYear(details.getAcademicYear());
        section.setEducationLevel(details.getEducationLevel());
        section.setGradeLevel(details.getGradeLevel());
        section.setSectionLetter(details.getSectionLetter());
        section.setTutorTeacherId(details.getTutorTeacherId());

        boolean cambioDeAula = details.getClassroom() != null &&
                (section.getClassroom() == null ||
                        !details.getClassroom().getId().equals(section.getClassroom().getId()));

        if (cambioDeAula) {
            Classroom classroom = resolveAndValidateClassroom(details);
            section.setClassroom(classroom);
        }

        return annualSectionsRepository.save(section);
    }

    public void deleteAnnualSection(UUID id) {
        AnnualSections section = getAnnualSectionById(id);
        annualSectionsRepository.delete(section);

    }

    @Transactional
    public List<AnnualSections> cloneFromYear(Integer fromYear, Integer toYear) {
        List<AnnualSections> previous = annualSectionsRepository.findByAcademicYear(fromYear);

        if (previous.isEmpty()) {
            throw new EntityNotFoundException("No se encontraron secciones para el año " + fromYear);
        }

        return previous.stream()
                .map(prev -> {
                    AnnualSections newSection = new AnnualSections();
                    newSection.setAcademicYear(toYear);
                    newSection.setEducationLevel(prev.getEducationLevel());
                    newSection.setGradeLevel(prev.getGradeLevel());
                    newSection.setSectionLetter(prev.getSectionLetter());
                    newSection.setTutorTeacherId(prev.getTutorTeacherId());

                    Classroom classroom = prev.getClassroom();
                    boolean ocupadaEnNuevoAnio = classroom != null &&
                            annualSectionsRepository.findByClassroomIdAndAcademicYear(classroom.getId(), toYear).isPresent();

                    if (classroom != null && classroom.getStatus() == ClassroomStatus.DISPONIBLE && !ocupadaEnNuevoAnio) {
                        newSection.setClassroom(classroom);
                    } else {
                        newSection.setClassroom(null);
                    }

                    return annualSectionsRepository.save(newSection);
                })
                .toList();
    }


    private void validateGradeLevel(EducationLevel educationLevel, Integer gradeLevel) {
        if (EducationLevel.SECUNDARIA.equals(educationLevel) && gradeLevel > 5) {
            throw new IllegalArgumentException("En el Perú, el nivel secundaria solo tiene hasta 5 grados.");
        }
    }

    private Classroom resolveAndValidateClassroom(AnnualSections annualSection) {
        if (annualSection.getClassroom() == null || annualSection.getClassroom().getId() == null) {
            throw new IllegalArgumentException("Es obligatorio asignar un aula válida para crear la sección.");
        }

        UUID classroomId = annualSection.getClassroom().getId();

        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada con ID: " + classroomId));

        if (classroom.getStatus() != ClassroomStatus.DISPONIBLE) {
            throw new IllegalArgumentException("El aula no está disponible (" + classroom.getStatus() + ").");
        }

        annualSectionsRepository.findByClassroomIdAndAcademicYear(classroomId, annualSection.getAcademicYear())
                .ifPresent(s -> {
                    throw new IllegalArgumentException(
                            "El aula ya está asignada a otra sección en el año " + annualSection.getAcademicYear());
                });

        return classroom;
    }

    public List<Classroom> getAvailableClassrooms(Integer academicYear) {
        List<UUID> occupiedIds = annualSectionsRepository.findByAcademicYear(academicYear).stream()
                .map(s -> s.getClassroom().getId())
                .toList();

        return classroomRepository.findAll().stream()
                .filter(c -> c.getStatus() == ClassroomStatus.DISPONIBLE)
                .filter(c -> !occupiedIds.contains(c.getId()))
                .toList();
    }
}