package com.colegio.audit_service.audit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroBitacora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "accion", nullable = false, length = 30)
    private AccionCritica accion;

    @Column(name = "entidad_afectada", length = 50)
    private String entidadAfectada;

    @Column(name = "id_entidad", length = 50)
    private String idEntidad;

    @Column(name = "realizado_por", nullable = false, length = 12)
    private String realizadoPor;

    @Column(name = "rol_realizador", length = 20)
    private String rolRealizador;

    @Column(name = "detalles", columnDefinition = "TEXT")
    private String detalles;

    @Column(name = "ip_origen", length = 45)
    private String ipOrigen;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
