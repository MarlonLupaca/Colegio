package com.colegio.user_service.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_usuario", unique = true, nullable = false, length = 12)
    private String codigoUsuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20)
    private Rol rol;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "dni", unique = true, length = 15)
    private String dni;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    // Campos específicos de ALUMNO
    @Column(name = "grado", length = 20)
    private String grado;

    @Column(name = "seccion", length = 5)
    private String seccion;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    // Campos específicos de DOCENTE
    @Column(name = "especialidad", length = 100)
    private String especialidad;

    @Column(name = "titulo", length = 150)
    private String titulo;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.activo = true;
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}
