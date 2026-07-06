package com.colegio.user_service.user.service;

import com.colegio.user_service.user.client.AuthServiceClient;
import com.colegio.user_service.user.dto.*;
import com.colegio.user_service.user.entity.Rol;
import com.colegio.user_service.user.entity.Usuario;
import com.colegio.user_service.user.kafka.AuditEventProducer;
import com.colegio.user_service.user.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CodigoGeneratorService codigoGeneratorService;
    private final AuthServiceClient authServiceClient;
    private final AuditEventProducer auditEventProducer;

    @Transactional
    public UsuarioResponseDTO crearUsuario(CrearUsuarioRequestDTO request, String realizadoPor, String rolRealizador) {
        if (request.getDni() != null && usuarioRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("Ya existe un usuario con el DNI: " + request.getDni());
        }

        String codigoUsuario = codigoGeneratorService.generarCodigo(request.getRol());

        Usuario usuario = Usuario.builder()
                .codigoUsuario(codigoUsuario)
                .rol(request.getRol())
                .nombres(request.getNombres())
                .apellidos(request.getApellidos())
                .dni(request.getDni())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .grado(request.getGrado())
                .seccion(request.getSeccion())
                .fechaNacimiento(request.getFechaNacimiento())
                .especialidad(request.getEspecialidad())
                .titulo(request.getTitulo())
                .activo(true)
                .build();

        usuarioRepository.save(usuario);

        // Crear credencial en auth-service
        authServiceClient.crearCredencial(codigoUsuario, request.getRol());

        // Publicar evento de auditoría
        auditEventProducer.publicarEvento(
                "CREACION_USUARIO",
                "Usuario",
                codigoUsuario,
                realizadoPor != null ? realizadoPor : "SISTEMA",
                rolRealizador != null ? rolRealizador : "SISTEMA",
                "Nuevo usuario creado: " + request.getNombres() + " " + request.getApellidos() + " | Rol: " + request.getRol()
        );

        log.info("Usuario creado: {} ({})", codigoUsuario, request.getRol());
        return toDTO(usuario);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<UsuarioResponseDTO> listarActivos() {
        return usuarioRepository.findByActivoTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<UsuarioResponseDTO> listarPorRol(Rol rol) {
        return usuarioRepository.findByRolAndActivoTrue(rol).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UsuarioResponseDTO buscarPorCodigo(String codigoUsuario) {
        return usuarioRepository.findByCodigoUsuario(codigoUsuario)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + codigoUsuario));
    }

    public UsuarioResponseDTO buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado por ID: " + id));
    }

    @Transactional
    public UsuarioResponseDTO actualizarUsuario(String codigoUsuario, ActualizarUsuarioRequestDTO request) {
        Usuario usuario = usuarioRepository.findByCodigoUsuario(codigoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + codigoUsuario));

        if (request.getNombres() != null)        usuario.setNombres(request.getNombres());
        if (request.getApellidos() != null)      usuario.setApellidos(request.getApellidos());
        if (request.getEmail() != null)          usuario.setEmail(request.getEmail());
        if (request.getTelefono() != null)       usuario.setTelefono(request.getTelefono());
        if (request.getGrado() != null)          usuario.setGrado(request.getGrado());
        if (request.getSeccion() != null)        usuario.setSeccion(request.getSeccion());
        if (request.getFechaNacimiento() != null) usuario.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getEspecialidad() != null)   usuario.setEspecialidad(request.getEspecialidad());
        if (request.getTitulo() != null)         usuario.setTitulo(request.getTitulo());

        usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    @Transactional
    public ApiResponseDTO eliminarUsuario(String codigoUsuario, String realizadoPor, String rolRealizador) {
        Usuario usuario = usuarioRepository.findByCodigoUsuario(codigoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + codigoUsuario));

        usuario.setActivo(false);
        usuarioRepository.save(usuario);

        // Desactivar credencial en auth-service
        authServiceClient.desactivarCredencial(codigoUsuario);

        // Publicar evento de auditoría
        auditEventProducer.publicarEvento(
                "ELIMINACION_USUARIO",
                "Usuario",
                codigoUsuario,
                realizadoPor != null ? realizadoPor : "SISTEMA",
                rolRealizador != null ? rolRealizador : "SISTEMA",
                "Usuario desactivado: " + usuario.getNombres() + " " + usuario.getApellidos()
        );

        log.info("Usuario desactivado: {}", codigoUsuario);
        return ApiResponseDTO.builder().exito(true).mensaje("Usuario desactivado correctamente").build();
    }

    private UsuarioResponseDTO toDTO(Usuario u) {
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .codigoUsuario(u.getCodigoUsuario())
                .rol(u.getRol())
                .nombres(u.getNombres())
                .apellidos(u.getApellidos())
                .dni(u.getDni())
                .email(u.getEmail())
                .telefono(u.getTelefono())
                .activo(u.isActivo())
                .grado(u.getGrado())
                .seccion(u.getSeccion())
                .fechaNacimiento(u.getFechaNacimiento())
                .especialidad(u.getEspecialidad())
                .titulo(u.getTitulo())
                .fechaCreacion(u.getFechaCreacion())
                .fechaActualizacion(u.getFechaActualizacion())
                .build();
    }
}
