package com.colegio.material_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponse {
    private Long id;
    private String titulo;
    private String descripcion;
    private String nombreOriginal;
    private String tipoArchivo;
    private Long tamanoBytes;
    private UUID courseId;
    private Long weekId;
    private String weekDescripcion;
    private String codigoDocente;
    private Boolean esPublico;
    private LocalDateTime fechaSubida;
    private String downloadUrl;
}
