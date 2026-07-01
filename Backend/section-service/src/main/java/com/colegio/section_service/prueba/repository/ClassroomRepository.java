package com.colegio.section_service.prueba.repository;

import com.colegio.section_service.prueba.entity.Classroom;
import com.colegio.section_service.prueba.entity.ClassroomStatus;
import com.colegio.section_service.prueba.entity.ClassroomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {

    Optional<Classroom> findByRoomNumber(String roomNumber);

    List<Classroom> findByStatus(ClassroomStatus status);

    List<Classroom> findByType(ClassroomType type);

    List<Classroom> findByBuilding(String building);
}
