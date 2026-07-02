package com.colegio.user_service.user.service;

import com.colegio.user_service.user.entity.Rol;
import com.colegio.user_service.user.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CodigoGeneratorService {

    private final UsuarioRepository usuarioRepository;

    private static final Map<Rol, String> PREFIJOS = Map.of(
            Rol.ADMIN_TIA,   "AT",
            Rol.SECRETARIA,  "SE",
            Rol.DIRECTOR,    "DI",
            Rol.DOCENTE,     "DC",
            Rol.ALUMNO,      "AL",
            Rol.PADRE,       "PA"
    );

    public synchronized String generarCodigo(Rol rol) {
        String prefijo = PREFIJOS.get(rol);
        String anio = String.valueOf(LocalDate.now().getYear());

        Optional<String> maxCodigo = usuarioRepository.findMaxCodigoByRolAndAnio(rol, prefijo, anio);

        int siguienteSecuencia = 1;
        if (maxCodigo.isPresent() && maxCodigo.get() != null) {
            String ultimoCodigo = maxCodigo.get();
            // Extrae los últimos 4 dígitos que son la secuencia
            String secuenciaStr = ultimoCodigo.substring(ultimoCodigo.length() - 4);
            siguienteSecuencia = Integer.parseInt(secuenciaStr) + 1;
        }

        return String.format("%s%s%04d", prefijo, anio, siguienteSecuencia);
    }
}
