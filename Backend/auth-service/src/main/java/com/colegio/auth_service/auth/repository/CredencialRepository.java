package com.colegio.auth_service.auth.repository;

import com.colegio.auth_service.auth.entity.Credencial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredencialRepository extends JpaRepository<Credencial, Long> {
    Optional<Credencial> findByCodigoUsuario(String codigoUsuario);
    boolean existsByCodigoUsuario(String codigoUsuario);
}
