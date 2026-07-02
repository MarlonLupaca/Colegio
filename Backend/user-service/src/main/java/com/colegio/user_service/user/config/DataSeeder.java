package com.colegio.user_service.user.config;

import com.colegio.user_service.user.entity.Rol;
import com.colegio.user_service.user.entity.Usuario;
import com.colegio.user_service.user.repository.UsuarioRepository;
import com.colegio.user_service.user.client.AuthServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final AuthServiceClient authServiceClient;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            log.info("Iniciando inserción de datos de prueba (Seeder)...");

            // Crear 1 usuario para cada uno de los 6 roles
            for (Rol rol : Rol.values()) {
                String prefijo = obtenerPrefijo(rol);
                String codigo = String.format("%s2026%04d", prefijo, 1);
                
                Usuario usuario = Usuario.builder()
                        .codigoUsuario(codigo)
                        .rol(rol)
                        .nombres("Usuario " + rol.name() + " Demo")
                        .apellidos("Sauce Azul")
                        .dni("DNI2026" + rol.ordinal() + "1")
                        .email(rol.name().toLowerCase() + "@sauceazul.edu.pe")
                        .telefono("999888771")
                        .activo(true)
                        .build();

                // Específicos para Alumnos
                if (rol == Rol.ALUMNO) {
                    usuario.setGrado("5");
                    usuario.setSeccion("A");
                    usuario.setFechaNacimiento(LocalDate.of(2010, 5, 1));
                }
                // Específicos para Docentes
                if (rol == Rol.DOCENTE) {
                    usuario.setEspecialidad("Ciencias y Matemáticas");
                    usuario.setTitulo("Licenciado en Educación");
                }

                usuarioRepository.save(usuario);

                // Sincronizar credenciales con el auth-service
                authServiceClient.crearCredencial(codigo, rol);
            }
            log.info("Inserción de usuarios de prueba finalizada correctamente.");
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
