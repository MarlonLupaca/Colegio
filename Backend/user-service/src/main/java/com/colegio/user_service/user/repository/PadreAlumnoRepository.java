package com.colegio.user_service.user.repository;

import com.colegio.user_service.user.entity.PadreAlumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PadreAlumnoRepository extends JpaRepository<PadreAlumno, Long> {
    List<PadreAlumno> findByCodigoPadre(String codigoPadre);
    List<PadreAlumno> findByCodigoAlumno(String codigoAlumno);
    Optional<PadreAlumno> findByCodigoPadreAndCodigoAlumno(String codigoPadre, String codigoAlumno);
    boolean existsByCodigoPadreAndCodigoAlumno(String codigoPadre, String codigoAlumno);
}
