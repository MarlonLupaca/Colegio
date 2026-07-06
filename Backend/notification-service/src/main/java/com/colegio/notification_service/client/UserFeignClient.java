package com.colegio.notification_service.client;

import com.colegio.notification_service.dto.UsuarioResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "user-service",
        url = "http://localhost:8082"
)
public interface UserFeignClient {

    @GetMapping("/api/user/usuarios/rol/{role}")
    List<UsuarioResponseDTO> findByRole(@PathVariable String role);

    @GetMapping("/api/user/usuarios")
    List<UsuarioResponseDTO> findAllUsers();

}