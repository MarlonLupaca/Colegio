package com.colegio.user_service.user.controller;

import com.colegio.user_service.user.dto.*;
import com.colegio.user_service.user.entity.Rol;
import com.colegio.user_service.user.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@RequestBody CrearUsuarioRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String realizadoPor = auth != null ? auth.getName() : "SISTEMA";
        String rolRealizador = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "SISTEMA";
        UsuarioResponseDTO response = usuarioService.crearUsuario(request, realizadoPor, rolRealizador);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar(
            @RequestParam(required = false) Boolean soloActivos) {
        List<UsuarioResponseDTO> lista = (soloActivos != null && soloActivos)
                ? usuarioService.listarActivos()
                : usuarioService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{codigoUsuario}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorCodigo(@PathVariable String codigoUsuario) {
        return ResponseEntity.ok(usuarioService.buscarPorCodigo(codigoUsuario));
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<UsuarioResponseDTO>> listarPorRol(@PathVariable Rol rol) {
        return ResponseEntity.ok(usuarioService.listarPorRol(rol));
    }

    @PutMapping("/{codigoUsuario}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable String codigoUsuario,
            @RequestBody ActualizarUsuarioRequestDTO request) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(codigoUsuario, request));
    }

    @DeleteMapping("/{codigoUsuario}")
    public ResponseEntity<ApiResponseDTO> eliminar(@PathVariable String codigoUsuario) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String realizadoPor = auth != null ? auth.getName() : "SISTEMA";
        String rolRealizador = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "SISTEMA";
        return ResponseEntity.ok(usuarioService.eliminarUsuario(codigoUsuario, realizadoPor, rolRealizador));
    }
}
