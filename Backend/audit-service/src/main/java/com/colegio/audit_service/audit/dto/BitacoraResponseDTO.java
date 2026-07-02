package com.colegio.audit_service.audit.dto;

import com.colegio.audit_service.audit.entity.AccionCritica;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BitacoraResponseDTO {
    private Long id;
    private AccionCritica accion;
    private String entidadAfectada;
    private String idEntidad;
    private String realizadoPor;
    private String rolRealizador;
    private String detalles;
    private String ipOrigen;
    private LocalDateTime timestamp;
}
