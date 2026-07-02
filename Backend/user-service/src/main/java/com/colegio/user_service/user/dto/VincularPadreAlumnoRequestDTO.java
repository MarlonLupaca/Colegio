package com.colegio.user_service.user.dto;

import lombok.Data;

@Data
public class VincularPadreAlumnoRequestDTO {
    private String codigoPadre;
    private String codigoAlumno;
    private String parentesco; // PADRE, MADRE, TUTOR
}
