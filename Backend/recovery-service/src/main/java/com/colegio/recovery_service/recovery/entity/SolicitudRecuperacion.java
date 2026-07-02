package com.colegio.recovery_service.recovery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_recuperacion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudRecuperacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_usuario", nullable = false, length = 12)
    private String codigoUsuario;

    @Column(name = "token", unique = true, length = 100)
    private String token;

    @Column(name = "fecha_solicitud", nullable = false, updatable = false)
    private LocalDateTime fechaSolicitud;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

    @Column(name = "utilizado", nullable = false)
    private boolean utilizado;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 15)
    private EstadoSolicitud estado;

    @PrePersist
    protected void onCreate() {
        this.fechaSolicitud = LocalDateTime.now();
        this.utilizado = false;
        this.estado = EstadoSolicitud.PENDIENTE;
    }
}
