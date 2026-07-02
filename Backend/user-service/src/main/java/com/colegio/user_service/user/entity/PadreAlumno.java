package com.colegio.user_service.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "padre_alumno",
        uniqueConstraints = @UniqueConstraint(columnNames = {"codigo_padre", "codigo_alumno"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PadreAlumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_padre", nullable = false, length = 12)
    private String codigoPadre;

    @Column(name = "codigo_alumno", nullable = false, length = 12)
    private String codigoAlumno;

    @Column(name = "parentesco", length = 30)
    private String parentesco; // e.g. PADRE, MADRE, TUTOR

    @Column(name = "fecha_vinculacion", nullable = false, updatable = false)
    private LocalDateTime fechaVinculacion;

    @PrePersist
    protected void onCreate() {
        this.fechaVinculacion = LocalDateTime.now();
    }
}
