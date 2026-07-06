package com.colegio.material_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "nombre_original", nullable = false, length = 300)
    private String nombreOriginal;

    @Column(name = "nombre_hash", nullable = false, unique = true, length = 100)
    private String nombreHash;

    @Column(name = "tipo_archivo", nullable = false, length = 10)
    private String tipoArchivo;

    @Column(name = "tamano_bytes")
    private Long tamanoBytes;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week_id")
    private CourseWeek week;

    @Column(name = "codigo_docente", nullable = false, length = 20)
    private String codigoDocente;

    @Column(name = "es_publico", nullable = false)
    private Boolean esPublico;

    @CreationTimestamp
    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida;
}
