package com.colegio.material_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class MaterialUploadRequest {
    @NotBlank(message = "El título es obligatorio")
    private String titulo;
    private String descripcion;
    @NotNull(message = "El courseId es obligatorio")
    private UUID courseId;
    private Long weekId;
    @NotBlank(message = "El código del docente es obligatorio")
    private String codigoDocente;
    private Boolean esPublico = true;
}
