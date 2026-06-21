package com.colegio.announcement_service.prueba.repository;

import com.colegio.announcement_service.prueba.entity.Prueba;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PruebaRepository {
    public List<Prueba> findAll(String servicioNombre) {
        List<Prueba> pruebas = new ArrayList<>();
        pruebas.add(new Prueba(1L, "Conexion exitosa al modulo de prueba estructurado", servicioNombre));
        pruebas.add(new Prueba(2L, "El servicio esta respondiendo correctamente en la red estructurada", servicioNombre));
        return pruebas;
    }
}
