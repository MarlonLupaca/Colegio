package com.colegio.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Orígenes permitidos (frontend local)
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:5173",
                "http://127.0.0.1:*"
        ));

        // Métodos HTTP permitidos
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Headers permitidos (todos)
        config.setAllowedHeaders(List.of("*"));

        // Headers que el frontend puede leer
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));

        // Permitir envío de cookies / credenciales
        config.setAllowCredentials(true);

        // Cache del preflight (1 hora)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
