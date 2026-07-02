package com.colegio.user_service.user.dto;

import com.colegio.user_service.user.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String codigoUsuario;
    private Rol rol;
    private String nombres;
    private String apellidos;
    private String dni;
    private String email;
    private String telefono;
    private boolean activo;
    private String grado;
    private String seccion;
    private LocalDate fechaNacimiento;
    private String especialidad;
    private String titulo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
