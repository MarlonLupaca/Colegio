package com.colegio.auth_service.auth.service;

import com.colegio.auth_service.auth.entity.Credencial;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generarToken(Credencial credencial) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", credencial.getRol().name());
        claims.put("debeActualizarPassword", credencial.isDebeActualizarPassword());

        return Jwts.builder()
                .claims(claims)
                .subject(credencial.getCodigoUsuario())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims validarToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extraerCodigoUsuario(String token) {
        return validarToken(token).getSubject();
    }

    public boolean esTokenValido(String token) {
        try {
            validarToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
