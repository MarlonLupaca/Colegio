package com.colegio.auth_service.auth.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String codigoUsuario;
    private String password;
}
