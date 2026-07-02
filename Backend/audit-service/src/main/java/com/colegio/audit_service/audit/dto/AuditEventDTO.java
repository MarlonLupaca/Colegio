package com.colegio.audit_service.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEventDTO {
    private String accion;
    private String entidadAfectada;
    private String idEntidad;
    private String realizadoPor;
    private String rolRealizador;
    private String detalles;
    private String ipOrigen;
    private String timestamp;
}
