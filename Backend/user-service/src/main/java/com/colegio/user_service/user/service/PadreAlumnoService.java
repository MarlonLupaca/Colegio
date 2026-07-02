package com.colegio.user_service.user.service;

import com.colegio.user_service.user.dto.ApiResponseDTO;
import com.colegio.user_service.user.dto.VincularPadreAlumnoRequestDTO;
import com.colegio.user_service.user.entity.PadreAlumno;
import com.colegio.user_service.user.entity.Rol;
import com.colegio.user_service.user.repository.PadreAlumnoRepository;
import com.colegio.user_service.user.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PadreAlumnoService {

    private final PadreAlumnoRepository padreAlumnoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public ApiResponseDTO vincular(VincularPadreAlumnoRequestDTO request) {
        // Validar que el padre existe y tiene rol PADRE
        usuarioRepository.findByCodigoUsuario(request.getCodigoPadre())
                .filter(u -> u.getRol() == Rol.PADRE)
                .orElseThrow(() -> new RuntimeException("No se encontró un PADRE con código: " + request.getCodigoPadre()));

        // Validar que el alumno existe y tiene rol ALUMNO
        usuarioRepository.findByCodigoUsuario(request.getCodigoAlumno())
                .filter(u -> u.getRol() == Rol.ALUMNO)
                .orElseThrow(() -> new RuntimeException("No se encontró un ALUMNO con código: " + request.getCodigoAlumno()));

        if (padreAlumnoRepository.existsByCodigoPadreAndCodigoAlumno(
                request.getCodigoPadre(), request.getCodigoAlumno())) {
            throw new RuntimeException("Ya existe la vinculación entre " + request.getCodigoPadre() + " y " + request.getCodigoAlumno());
        }

        PadreAlumno vinculo = PadreAlumno.builder()
                .codigoPadre(request.getCodigoPadre())
                .codigoAlumno(request.getCodigoAlumno())
                .parentesco(request.getParentesco())
                .build();

        padreAlumnoRepository.save(vinculo);
        log.info("Vinculación creada: padre={} alumno={}", request.getCodigoPadre(), request.getCodigoAlumno());

        return ApiResponseDTO.builder().exito(true)
                .mensaje("Vinculación padre-alumno creada correctamente")
                .datos(vinculo)
                .build();
    }

    public List<PadreAlumno> obtenerAlumnosDePadre(String codigoPadre) {
        return padreAlumnoRepository.findByCodigoPadre(codigoPadre);
    }

    public List<PadreAlumno> obtenerPadresDeAlumno(String codigoAlumno) {
        return padreAlumnoRepository.findByCodigoAlumno(codigoAlumno);
    }

    @Transactional
    public ApiResponseDTO desvincular(Long id) {
        if (!padreAlumnoRepository.existsById(id)) {
            throw new RuntimeException("Vinculación no encontrada con id: " + id);
        }
        padreAlumnoRepository.deleteById(id);
        return ApiResponseDTO.builder().exito(true).mensaje("Vinculación eliminada").build();
    }
}
