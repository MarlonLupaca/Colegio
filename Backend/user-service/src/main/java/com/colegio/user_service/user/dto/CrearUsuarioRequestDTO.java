package com.colegio.user_service.user.dto;

import com.colegio.user_service.user.entity.Rol;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CrearUsuarioRequestDTO {
    private Rol rol;
    private String nombres;
    private String apellidos;
    private String dni;
    private String email;
    private String telefono;
    // Solo para ALUMNO
    private String grado;
    private String seccion;
    private LocalDate fechaNacimiento;
    // Solo para DOCENTE
    private String especialidad;
    private String titulo;
}
