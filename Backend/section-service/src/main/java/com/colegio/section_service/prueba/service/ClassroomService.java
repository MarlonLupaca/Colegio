package com.colegio.section_service.prueba.service;


import com.colegio.section_service.prueba.entity.Classroom;
import com.colegio.section_service.prueba.entity.ClassroomStatus;
import com.colegio.section_service.prueba.entity.ClassroomType;
import com.colegio.section_service.prueba.repository.ClassroomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    public Classroom createClassroom(Classroom classroom) {
        classroomRepository.findByRoomNumber(classroom.getRoomNumber())
                .ifPresent(c -> {
                    throw new IllegalArgumentException(
                            "Ya existe un aula con el número: " + classroom.getRoomNumber());
                });
        return classroomRepository.save(classroom);
    }

    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    public Classroom getClassroomById(UUID id) {
        return classroomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada con ID: " + id));
    }

    public List<Classroom> getClassroomsByStatus(ClassroomStatus status) {
        return classroomRepository.findByStatus(status);
    }

    public List<Classroom> getClassroomsByType(ClassroomType type) {
        return classroomRepository.findByType(type);
    }

    public List<Classroom> getClassroomsByBuilding(String building) {
        return classroomRepository.findByBuilding(building);
    }

    public Classroom updateClassroom(UUID id, Classroom details) {
        Classroom classroom = getClassroomById(id);
        classroom.setBuilding(details.getBuilding());
        classroom.setRoomNumber(details.getRoomNumber());
        classroom.setMaxCapacity(details.getMaxCapacity());
        classroom.setStatus(details.getStatus());
        classroom.setType(details.getType());
        return classroomRepository.save(classroom);
    }

    public void deleteClassroom(UUID id) {
        Classroom classroom = getClassroomById(id);
        classroom.setStatus(ClassroomStatus.INACTIVO);
        classroomRepository.save(classroom);
    }


}
