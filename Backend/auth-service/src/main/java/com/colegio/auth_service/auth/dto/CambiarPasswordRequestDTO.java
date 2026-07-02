package com.colegio.auth_service.auth.dto;

import lombok.Data;

@Data
public class CambiarPasswordRequestDTO {
    private String codigoUsuario;
    private String passwordActual;
    private String nuevaPassword;
}
