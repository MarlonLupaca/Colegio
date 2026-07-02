package com.colegio.auth_service.auth.service;

import com.colegio.auth_service.auth.dto.*;
import com.colegio.auth_service.auth.entity.Credencial;
import com.colegio.auth_service.auth.entity.Rol;
import com.colegio.auth_service.auth.kafka.AuditEventProducer;
import com.colegio.auth_service.auth.repository.CredencialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final CredencialRepository credencialRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuditEventProducer auditEventProducer;

    @Value("${app.security.default-password}")
    private String defaultPassword;

    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
        Credencial credencial = credencialRepository
                .findByCodigoUsuario(request.getCodigoUsuario())
                .orElseThrow(() -> new RuntimeException("Código de usuario no encontrado"));

        if (!credencial.isActivo()) {
            throw new RuntimeException("Cuenta desactivada. Contacte al administrador.");
        }

        if (!passwordEncoder.matches(request.getPassword(), credencial.getPasswordHash())) {
            auditEventProducer.publicarEvento("LOGIN_FALLIDO", "Credencial", credencial.getCodigoUsuario(),
                    credencial.getCodigoUsuario(), credencial.getRol().name(), "Login fallido - contraseña incorrecta");
            throw new RuntimeException("Contraseña incorrecta");
        }

        credencial.setUltimoAcceso(LocalDateTime.now());
        credencialRepository.save(credencial);

        String token = jwtService.generarToken(credencial);

        auditEventProducer.publicarEvento("LOGIN_EXITOSO", "Credencial", credencial.getCodigoUsuario(),
                credencial.getCodigoUsuario(), credencial.getRol().name(), "Login exitoso");

        return LoginResponseDTO.builder()
                .token(token)
                .codigoUsuario(credencial.getCodigoUsuario())
                .rol(credencial.getRol())
                .debeActualizarPassword(credencial.isDebeActualizarPassword())
                .mensaje(credencial.isDebeActualizarPassword()
                        ? "Debe cambiar su contraseña antes de continuar"
                        : "Login exitoso")
                .build();
    }

    @Transactional
    public ApiResponseDTO cambiarPassword(CambiarPasswordRequestDTO request) {
        Credencial credencial = credencialRepository
                .findByCodigoUsuario(request.getCodigoUsuario())
                .orElseThrow(() -> new RuntimeException("Código de usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPasswordActual(), credencial.getPasswordHash())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        credencial.setPasswordHash(passwordEncoder.encode(request.getNuevaPassword()));
        credencial.setDebeActualizarPassword(false);
        credencialRepository.save(credencial);

        log.info("Contraseña actualizada para usuario: {}", credencial.getCodigoUsuario());

        return ApiResponseDTO.builder()
                .exito(true)
                .mensaje("Contraseña actualizada correctamente")
                .build();
    }

    @Transactional
    public ApiResponseDTO crearCredencial(CrearCredencialRequestDTO request) {
        if (credencialRepository.existsByCodigoUsuario(request.getCodigoUsuario())) {
            throw new RuntimeException("Ya existe una credencial para el código: " + request.getCodigoUsuario());
        }

        Credencial credencial = Credencial.builder()
                .codigoUsuario(request.getCodigoUsuario())
                .passwordHash(passwordEncoder.encode(defaultPassword))
                .rol(request.getRol())
                .debeActualizarPassword(true)
                .activo(true)
                .build();

        credencialRepository.save(credencial);
        log.info("Credencial creada para usuario: {} con rol: {}", request.getCodigoUsuario(), request.getRol());

        return ApiResponseDTO.builder()
                .exito(true)
                .mensaje("Credencial creada correctamente para: " + request.getCodigoUsuario())
                .build();
    }

    @Transactional
    public ApiResponseDTO desactivarCredencial(String codigoUsuario) {
        Credencial credencial = credencialRepository
                .findByCodigoUsuario(codigoUsuario)
                .orElseThrow(() -> new RuntimeException("Credencial no encontrada para: " + codigoUsuario));

        credencial.setActivo(false);
        credencialRepository.save(credencial);

        log.info("Credencial desactivada para usuario: {}", codigoUsuario);

        return ApiResponseDTO.builder()
                .exito(true)
                .mensaje("Credencial desactivada para: " + codigoUsuario)
                .build();
    }
}
