package com.colegio.audit_service.audit.controller;

import com.colegio.audit_service.audit.dto.BitacoraResponseDTO;
import com.colegio.audit_service.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/bitacora")
    public ResponseEntity<List<BitacoraResponseDTO>> listar(
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) String realizadoPor,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        List<BitacoraResponseDTO> resultado;

        if (accion != null) {
            resultado = auditService.filtrarPorAccion(accion);
        } else if (realizadoPor != null) {
            resultado = auditService.filtrarPorUsuario(realizadoPor);
        } else if (desde != null && hasta != null) {
            resultado = auditService.filtrarPorRango(desde, hasta);
        } else {
            resultado = auditService.listarTodos();
        }

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/bitacora/{id}")
    public ResponseEntity<BitacoraResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(auditService.obtenerPorId(id));
    }

    @GetMapping("/bitacora/usuario/{codigo}")
    public ResponseEntity<List<BitacoraResponseDTO>> listarPorUsuario(@PathVariable String codigo) {
        return ResponseEntity.ok(auditService.filtrarPorUsuario(codigo));
    }
}
