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

    public AssignedClass createAssignedClass(AssignedClass assignedClass) {
        boolean alreadyExists = assignedClassRepository.existsByAnnualSectionIdAndCourseId(
                assignedClass.getAnnualSection().getId(),
                assignedClass.getCourseId()
        );

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "Este curso ya está asignado a esa sección.");
        }

        return assignedClassRepository.save(assignedClass);
    }

    public List<AssignedClass> getAllAssignedClasses() {
        return assignedClassRepository.findAll();
    }

    public AssignedClass getAssignedClassById(UUID id) {
        return assignedClassRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Clase asignada no encontrada con ID: " + id));
    }

    public List<AssignedClass> getByAnnualSection(UUID annualSectionId) {
        return assignedClassRepository.findByAnnualSectionId(annualSectionId);
    }

    public List<AssignedClass> getByCourse(UUID courseId) {
        return assignedClassRepository.findByCourseId(courseId);
    }

    public List<AssignedClass> getByTeacher(UUID teacherId) {
        return assignedClassRepository.findByTeacherId(teacherId);
    }

    public AssignedClass updateAssignedClass(UUID id, AssignedClass details) {
        AssignedClass assignedClass = getAssignedClassById(id);
        assignedClass.setAnnualSection(details.getAnnualSection());
        assignedClass.setCourseId(details.getCourseId());
        assignedClass.setTeacherId(details.getTeacherId());
        return assignedClassRepository.save(assignedClass);
    }

    public void deleteAssignedClass(UUID id) {
        assignedClassRepository.delete(getAssignedClassById(id));
    }

}
