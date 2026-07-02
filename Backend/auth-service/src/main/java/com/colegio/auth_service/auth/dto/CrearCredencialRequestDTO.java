package com.colegio.auth_service.auth.dto;

import com.colegio.auth_service.auth.entity.Rol;
import lombok.Data;

@Data
public class CrearCredencialRequestDTO {
    private String codigoUsuario;
    private Rol rol;
}
