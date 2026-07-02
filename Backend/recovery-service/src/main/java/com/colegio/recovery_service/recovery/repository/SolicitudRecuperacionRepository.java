package com.colegio.recovery_service.recovery.repository;

import com.colegio.recovery_service.recovery.entity.SolicitudRecuperacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudRecuperacionRepository extends JpaRepository<SolicitudRecuperacion, Long> {
    List<SolicitudRecuperacion> findByCodigoUsuario(String codigoUsuario);
    Optional<SolicitudRecuperacion> findByToken(String token);
}
