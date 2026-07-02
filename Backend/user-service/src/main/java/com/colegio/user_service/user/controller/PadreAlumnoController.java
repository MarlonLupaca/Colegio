package com.colegio.user_service.user.controller;

import com.colegio.user_service.user.dto.ApiResponseDTO;
import com.colegio.user_service.user.dto.VincularPadreAlumnoRequestDTO;
import com.colegio.user_service.user.entity.PadreAlumno;
import com.colegio.user_service.user.service.PadreAlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/padre-alumno")
@RequiredArgsConstructor
public class PadreAlumnoController {

    private final PadreAlumnoService padreAlumnoService;

    @PostMapping
    public ResponseEntity<ApiResponseDTO> vincular(@RequestBody VincularPadreAlumnoRequestDTO request) {
        return ResponseEntity.ok(padreAlumnoService.vincular(request));
    }

    @GetMapping
    public ResponseEntity<List<PadreAlumno>> listarTodos() {
        return ResponseEntity.ok(padreAlumnoService.listarTodos());
    }

    @GetMapping("/padre/{codigoPadre}")
    public ResponseEntity<List<PadreAlumno>> alumnosDePadre(@PathVariable String codigoPadre) {
        return ResponseEntity.ok(padreAlumnoService.obtenerAlumnosDePadre(codigoPadre));
    }

    @GetMapping("/alumno/{codigoAlumno}")
    public ResponseEntity<List<PadreAlumno>> padresDeAlumno(@PathVariable String codigoAlumno) {
        return ResponseEntity.ok(padreAlumnoService.obtenerPadresDeAlumno(codigoAlumno));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO> desvincular(@PathVariable Long id) {
        return ResponseEntity.ok(padreAlumnoService.desvincular(id));
    }
}
