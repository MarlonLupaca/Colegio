package com.colegio.auth_service.auth.dto;

import com.colegio.auth_service.auth.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String codigoUsuario;
    private Rol rol;
    private boolean debeActualizarPassword;
    private String mensaje;
}
