package com.colegio.course_service.prueba.entity;

public class Prueba {
    private Long id;
    private String mensaje;
    private String servicio;

    public Prueba() {}

    public Prueba(Long id, String mensaje, String servicio) {
        this.id = id;
        this.mensaje = mensaje;
        this.servicio = servicio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }
}
