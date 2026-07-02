package com.colegio.auth_service.auth.controller;

import com.colegio.auth_service.auth.dto.*;
import com.colegio.auth_service.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<ApiResponseDTO> cambiarPassword(@RequestBody CambiarPasswordRequestDTO request) {
        ApiResponseDTO response = authService.cambiarPassword(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint interno — llamado por user-service
    @PostMapping("/credencial/crear")
    public ResponseEntity<ApiResponseDTO> crearCredencial(@RequestBody CrearCredencialRequestDTO request) {
        ApiResponseDTO response = authService.crearCredencial(request);
        return ResponseEntity.ok(response);
    }

    // Endpoint interno — llamado por user-service
    @DeleteMapping("/credencial/{codigoUsuario}")
    public ResponseEntity<ApiResponseDTO> desactivarCredencial(@PathVariable String codigoUsuario) {
        ApiResponseDTO response = authService.desactivarCredencial(codigoUsuario);
        return ResponseEntity.ok(response);
    }
}
