package com.colegio.billing_service.prueba.service;

import com.colegio.billing_service.prueba.entity.Prueba;
import com.colegio.billing_service.prueba.repository.PruebaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PruebaService {
    @Autowired
    private PruebaRepository pruebaRepository;

    public List<Prueba> obtenerPruebas(String servicioNombre) {
        return pruebaRepository.findAll(servicioNombre);
    }
}
