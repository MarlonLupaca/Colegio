package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.AnnualSections;
import com.colegio.section_service.prueba.repository.AnnualSectionsRepository;
import com.colegio.section_service.prueba.entity.AssignedClass;
import com.colegio.section_service.prueba.repository.AssignedClassRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@Service
public class AssignedClassService {

    @Autowired
    private AssignedClassRepository assignedClassRepository;

    @Autowired
    private AnnualSectionsRepository annualSectionsRepository;

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    private void populateDetails(AssignedClass assignedClass) {
        String teacherCode = null;

        // 1. Resolver Curso
        if (assignedClass.getCourseId() == null) {
            assignedClass.setCourseName("Curso Académico");
            assignedClass.setCourseCode("CUR-XXXX");
        } else {
            try {
                String url = "http://localhost:8089/api/v1/courses/" + assignedClass.getCourseId();
                java.util.Map<?, ?> response = restTemplate.getForObject(url, java.util.Map.class);
                if (response != null) {
                    if (response.get("name") != null) {
                        assignedClass.setCourseName((String) response.get("name"));
                    }
                    if (response.get("code") != null) {
                        assignedClass.setCourseCode((String) response.get("code"));
                    }
                    if (response.get("teacherCode") != null) {
                        teacherCode = (String) response.get("teacherCode");
                        assignedClass.setTeacherCode(teacherCode);
                    }
                    if (response.get("hoursPerWeek") != null) {
                        assignedClass.setHoursPerWeek(((Number) response.get("hoursPerWeek")).intValue());
                    }
                }
            } catch (Exception e) {
                assignedClass.setCourseName("Curso ID: " + assignedClass.getCourseId());
                assignedClass.setCourseCode("CUR-XXXX");
            }
        }

        // 2. Resolver Nombre del Docente usando su teacherCode
        if (teacherCode == null || teacherCode.trim().isEmpty()) {
            assignedClass.setTeacherName("Sin docente asignado");
        } else {
            try {
                String url = "http://localhost:8082/api/user/usuarios/" + teacherCode;
                java.util.Map<?, ?> response = restTemplate.getForObject(url, java.util.Map.class);
                if (response != null && response.get("nombres") != null && response.get("apellidos") != null) {
                    assignedClass.setTeacherName(response.get("nombres") + " " + response.get("apellidos"));
                } else {
                    assignedClass.setTeacherName("Docente: " + teacherCode);
                }
            } catch (Exception e) {
                assignedClass.setTeacherName("Docente: " + teacherCode);
            }
        }
    }

    private void populateListDetails(List<AssignedClass> list) {
        if (list != null) {
            list.forEach(this::populateDetails);
        }
    }

    private int getCourseHours(UUID courseId) {
        try {
            Map<?, ?> course = restTemplate.getForObject("http://localhost:8089/api/v1/courses/" + courseId, Map.class);
            if (course != null && course.get("hoursPerWeek") != null) {
                return ((Number) course.get("hoursPerWeek")).intValue();
            }
        } catch (Exception e) {
            // Log warning or return a default of 0
        }
        return 0;
    }

    public AssignedClass createAssignedClass(AssignedClass assignedClass) {
        if (assignedClass.getAnnualSections() != null && assignedClass.getAnnualSections().getId() != null) {
            UUID sectionId = assignedClass.getAnnualSections().getId();
            boolean alreadyExists = assignedClassRepository.existsByAnnualSectionsIdAndCourseId(
                    sectionId,
                    assignedClass.getCourseId()
            );

            if (alreadyExists) {
                throw new IllegalArgumentException(
                        "Este curso ya está asignado a esa sección.");
            }

            AnnualSections section = annualSectionsRepository.findById(sectionId)
                    .orElseThrow(() -> new EntityNotFoundException("Sección no encontrada con ID: " + sectionId));

            int maxWeeklyHours = section.getMaxWeeklyHours() != null ? section.getMaxWeeklyHours() : 30;

            List<AssignedClass> existingClasses = assignedClassRepository.findByAnnualSectionsId(sectionId);
            int currentTotalHours = existingClasses.stream()
                    .mapToInt(ac -> getCourseHours(ac.getCourseId()))
                    .sum();

            int courseHours = getCourseHours(assignedClass.getCourseId());
            if (currentTotalHours + courseHours > maxWeeklyHours) {
                throw new IllegalArgumentException(
                        "No se puede matricular el curso con " + courseHours + 
                        " horas. Superaría el límite máximo de la sección que es de " + maxWeeklyHours + " horas semanales (Total actual: " + currentTotalHours + " horas).");
            }
        }

        AssignedClass saved = assignedClassRepository.save(assignedClass);
        populateDetails(saved);
        return saved;
    }

    public List<AssignedClass> getAllAssignedClasses() {
        List<AssignedClass> list = assignedClassRepository.findAll();
        populateListDetails(list);
        return list;
    }

    public AssignedClass getAssignedClassById(UUID id) {
        AssignedClass assignedClass = assignedClassRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Clase asignada no encontrada con ID: " + id));
        populateDetails(assignedClass);
        return assignedClass;
    }

    public List<AssignedClass> getByAnnualSection(UUID annualSectionId) {
        List<AssignedClass> list = assignedClassRepository.findByAnnualSectionsId(annualSectionId);
        populateListDetails(list);
        return list;
    }

    public List<AssignedClass> getByCourse(UUID courseId) {
        List<AssignedClass> list = assignedClassRepository.findByCourseId(courseId);
        populateListDetails(list);
        return list;
    }

    public List<AssignedClass> getByTeacher(Long teacherId) {
        List<AssignedClass> list = assignedClassRepository.findByTeacherId(teacherId);
        populateListDetails(list);
        return list;
    }

    public AssignedClass updateAssignedClass(UUID id, AssignedClass details) {
        AssignedClass assignedClass = getAssignedClassById(id);
        assignedClass.setAnnualSections(details.getAnnualSections());
        assignedClass.setCourseId(details.getCourseId());
        assignedClass.setTeacherId(details.getTeacherId());
        AssignedClass updated = assignedClassRepository.save(assignedClass);
        populateDetails(updated);
        return updated;
    }

    public void deleteAssignedClass(UUID id) {
        assignedClassRepository.delete(getAssignedClassById(id));
    }

    @jakarta.transaction.Transactional
    public List<AssignedClass> addCoursesToSectionBatch(UUID sectionId, List<UUID> courseIds) {
        AnnualSections section = annualSectionsRepository.findById(sectionId)
                .orElseThrow(() -> new EntityNotFoundException("Sección no encontrada con ID: " + sectionId));

        int maxWeeklyHours = section.getMaxWeeklyHours() != null ? section.getMaxWeeklyHours() : 30;

        // Calculate current total hours
        List<AssignedClass> existingClasses = assignedClassRepository.findByAnnualSectionsId(sectionId);
        int currentTotalHours = existingClasses.stream()
                .mapToInt(ac -> getCourseHours(ac.getCourseId()))
                .sum();

        List<AssignedClass> newlyCreated = new java.util.ArrayList<>();
        int runningTotal = currentTotalHours;

        for (UUID courseId : courseIds) {
            if (courseId == null) continue;
            boolean alreadyExists = assignedClassRepository.existsByAnnualSectionsIdAndCourseId(sectionId, courseId);
            if (alreadyExists) continue;

            int courseHours = getCourseHours(courseId);
            if (runningTotal + courseHours > maxWeeklyHours) {
                throw new IllegalArgumentException(
                        "No se puede matricular el curso con " + courseHours + 
                        " horas. Superaría el límite máximo de la sección que es de " + maxWeeklyHours + " horas semanales (Total actual: " + runningTotal + " horas).");
            }

            AssignedClass ac = new AssignedClass();
            ac.setAnnualSections(section);
            ac.setCourseId(courseId);
            ac.setTeacherId(null);
            AssignedClass saved = assignedClassRepository.save(ac);
            populateDetails(saved);
            newlyCreated.add(saved);
            runningTotal += courseHours;
        }

        return newlyCreated;
    }
}
