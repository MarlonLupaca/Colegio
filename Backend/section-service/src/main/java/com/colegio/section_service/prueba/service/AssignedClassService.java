package com.colegio.section_service.prueba.service;

import com.colegio.section_service.prueba.entity.AssignedClass;
import com.colegio.section_service.prueba.repository.AssignedClassRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AssignedClassService {

    @Autowired
    private AssignedClassRepository assignedClassRepository;

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    private void populateDetails(AssignedClass assignedClass) {
        // 1. Resolver Nombre del Docente
        if (assignedClass.getTeacherId() == null) {
            assignedClass.setTeacherName("Sin docente asignado");
        } else {
            try {
                String url = "http://localhost:8082/api/user/usuarios/buscar-id/" + assignedClass.getTeacherId();
                java.util.Map<?, ?> response = restTemplate.getForObject(url, java.util.Map.class);
                if (response != null && response.get("nombres") != null && response.get("apellidos") != null) {
                    assignedClass.setTeacherName(response.get("nombres") + " " + response.get("apellidos"));
                } else {
                    assignedClass.setTeacherName("Profesor ID: " + assignedClass.getTeacherId());
                }
            } catch (Exception e) {
                assignedClass.setTeacherName("Profesor ID: " + assignedClass.getTeacherId());
            }
        }

        // 2. Resolver Nombre y Código del Curso
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
                }
            } catch (Exception e) {
                assignedClass.setCourseName("Curso ID: " + assignedClass.getCourseId());
                assignedClass.setCourseCode("CUR-XXXX");
            }
        }
    }

    private void populateListDetails(List<AssignedClass> list) {
        if (list != null) {
            list.forEach(this::populateDetails);
        }
    }

    public AssignedClass createAssignedClass(AssignedClass assignedClass) {
        if (assignedClass.getAnnualSections() != null && assignedClass.getAnnualSections().getId() != null) {
            boolean alreadyExists = assignedClassRepository.existsByAnnualSectionsIdAndCourseId(
                    assignedClass.getAnnualSections().getId(),
                    assignedClass.getCourseId()
            );

            if (alreadyExists) {
                throw new IllegalArgumentException(
                        "Este curso ya está asignado a esa sección.");
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
}
