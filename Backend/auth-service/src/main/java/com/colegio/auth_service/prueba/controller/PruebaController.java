package com.colegio.auth_service.prueba.controller;

import com.colegio.auth_service.prueba.entity.Prueba;
import com.colegio.auth_service.prueba.service.PruebaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/auth/prueba")
public class PruebaController {
    @Autowired
    private PruebaService pruebaService;

    @Value("${spring.application.name}")
    private String serviceName;

    @GetMapping
    public List<Prueba> getPruebas() {
        return pruebaService.obtenerPruebas(serviceName);
    }
}
