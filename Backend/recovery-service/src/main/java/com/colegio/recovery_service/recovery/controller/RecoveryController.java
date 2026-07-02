package com.colegio.recovery_service.recovery.controller;

import com.colegio.recovery_service.recovery.dto.ApiResponseDTO;
import com.colegio.recovery_service.recovery.dto.SolicitudRecuperacionRequestDTO;
import com.colegio.recovery_service.recovery.service.RecoveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recovery")
@RequiredArgsConstructor
public class RecoveryController {

    private final RecoveryService recoveryService;

    @PostMapping("/solicitar")
    public ResponseEntity<ApiResponseDTO> solicitarRecuperacion(
            @RequestBody SolicitudRecuperacionRequestDTO request) {
        return ResponseEntity.ok(recoveryService.solicitarRecuperacion(request));
    }
}
