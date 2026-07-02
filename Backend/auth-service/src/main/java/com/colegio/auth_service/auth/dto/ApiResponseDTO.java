package com.colegio.auth_service.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponseDTO {
    private boolean exito;
    private String mensaje;
    private Object datos;
}
