package com.colegio.recovery_service.recovery.service;

import com.colegio.recovery_service.recovery.dto.ApiResponseDTO;
import com.colegio.recovery_service.recovery.dto.SolicitudRecuperacionRequestDTO;
import com.colegio.recovery_service.recovery.repository.SolicitudRecuperacionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecoveryService {

    private final SolicitudRecuperacionRepository solicitudRepository;

    /**
     * Stub — implementación diferida.
     * Estructura base lista para cuando se implemente el flujo de recuperación de contraseña.
     */
    public ApiResponseDTO solicitarRecuperacion(SolicitudRecuperacionRequestDTO request) {
        log.info("Solicitud de recuperación recibida para: {} (no implementado aún)", request.getCodigoUsuario());
        return ApiResponseDTO.builder()
                .exito(false)
                .mensaje("Módulo de recuperación de contraseña aún no disponible. Contacte al administrador.")
                .build();
    }
}
