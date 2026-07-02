package com.colegio.user_service.user.client;

import com.colegio.user_service.user.entity.Rol;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class AuthServiceClient {

    private final RestTemplate restTemplate;
    private final String authServiceUrl;

    public AuthServiceClient(RestTemplate restTemplate,
                             @Value("${app.services.auth-service-url}") String authServiceUrl) {
        this.restTemplate = restTemplate;
        this.authServiceUrl = authServiceUrl;
    }

    public boolean crearCredencial(String codigoUsuario, Rol rol) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("codigoUsuario", codigoUsuario);
            request.put("rol", rol.name());

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    authServiceUrl + "/api/auth/credencial/crear",
                    request,
                    Map.class
            );

            boolean exito = response.getStatusCode().is2xxSuccessful();
            log.info("Credencial creada para {}: {}", codigoUsuario, exito);
            return exito;
        } catch (Exception e) {
            log.error("Error al crear credencial en auth-service para {}: {}", codigoUsuario, e.getMessage());
            return false;
        }
    }

    public boolean desactivarCredencial(String codigoUsuario) {
        try {
            restTemplate.delete(authServiceUrl + "/api/auth/credencial/" + codigoUsuario);
            log.info("Credencial desactivada para: {}", codigoUsuario);
            return true;
        } catch (Exception e) {
            log.error("Error al desactivar credencial en auth-service para {}: {}", codigoUsuario, e.getMessage());
            return false;
        }
    }
}
