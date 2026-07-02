package com.colegio.user_service.user.repository;

import com.colegio.user_service.user.entity.Rol;
import com.colegio.user_service.user.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCodigoUsuario(String codigoUsuario);
    Optional<Usuario> findByDni(String dni);
    boolean existsByDni(String dni);
    List<Usuario> findByRol(Rol rol);
    List<Usuario> findByActivoTrue();
    List<Usuario> findByRolAndActivoTrue(Rol rol);

    @Query("SELECT MAX(u.codigoUsuario) FROM Usuario u WHERE u.rol = :rol AND u.codigoUsuario LIKE CONCAT(:prefijo, :anio, '%')")
    Optional<String> findMaxCodigoByRolAndAnio(Rol rol, String prefijo, String anio);
}
