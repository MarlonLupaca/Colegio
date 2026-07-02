package com.colegio.auth_service.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "credenciales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Credencial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_usuario", unique = true, nullable = false, length = 12)
    private String codigoUsuario;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "debe_actualizar_password", nullable = false)
    private boolean debeActualizarPassword;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20)
    private Rol rol;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.activo = true;
        this.debeActualizarPassword = true;
    }
}
