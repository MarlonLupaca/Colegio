package com.colegio.user_service.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ActualizarUsuarioRequestDTO {
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String grado;
    private String seccion;
    private LocalDate fechaNacimiento;
    private String especialidad;
    private String titulo;
}
