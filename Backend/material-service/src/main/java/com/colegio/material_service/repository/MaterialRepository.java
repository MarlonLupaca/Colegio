package com.colegio.material_service.repository;

import com.colegio.material_service.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByCourseId(UUID courseId);
    List<Material> findByCourseIdAndEsPublico(UUID courseId, Boolean esPublico);
    List<Material> findByCodigoDocente(String codigoDocente);
    List<Material> findByWeekId(Long weekId);
    Optional<Material> findByNombreHash(String nombreHash);
}
