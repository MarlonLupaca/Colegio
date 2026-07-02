package com.colegio.audit_service.audit.repository;

import com.colegio.audit_service.audit.entity.AccionCritica;
import com.colegio.audit_service.audit.entity.RegistroBitacora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BitacoraRepository extends JpaRepository<RegistroBitacora, Long> {
    List<RegistroBitacora> findByAccion(AccionCritica accion);
    List<RegistroBitacora> findByRealizadoPor(String realizadoPor);
    List<RegistroBitacora> findByTimestampBetween(LocalDateTime desde, LocalDateTime hasta);
    List<RegistroBitacora> findByAccionAndRealizadoPor(AccionCritica accion, String realizadoPor);
    List<RegistroBitacora> findAllByOrderByTimestampDesc();
}
