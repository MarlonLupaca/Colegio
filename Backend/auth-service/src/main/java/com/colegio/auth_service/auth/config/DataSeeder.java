package com.colegio.auth_service.auth.config;

import com.colegio.auth_service.auth.entity.Credencial;
import com.colegio.auth_service.auth.entity.Rol;
import com.colegio.auth_service.auth.repository.CredencialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CredencialRepository credencialRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (credencialRepository.count() == 0) {
            log.info("Iniciando inserción de credenciales de prueba en auth-service (Seeder)...");

            // Crear credenciales por defecto para los 6 usuarios creados en el user-service
            for (Rol rol : Rol.values()) {
                String prefijo = obtenerPrefijo(rol);
                String codigo = String.format("%s2026%04d", prefijo, 1);

                Credencial credencial = Credencial.builder()
                        .codigoUsuario(codigo)
                        .passwordHash(passwordEncoder.encode("Colegio2024"))
                        .rol(rol)
                        .debeActualizarPassword(true)
                        .activo(true)
                        .build();

                credencialRepository.save(credencial);
            }
            log.info("Inserción de credenciales de prueba finalizada correctamente.");
        }
    }

    private String obtenerPrefijo(Rol rol) {
        return switch (rol) {
            case ADMIN_TIA -> "AT";
            case SECRETARIA -> "SE";
            case DIRECTOR -> "DI";
            case DOCENTE -> "DC";
            case ALUMNO -> "AL";
            case PADRE -> "PA";
        };
    }
}
