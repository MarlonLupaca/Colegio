package com.colegio.section_service.prueba.controller;

import com.colegio.section_service.prueba.entity.Section;
import com.colegio.section_service.prueba.service.SectionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sections")
public class SectionController {

    @Autowired
    private SectionService sectionService;

    // Obtener todas las secciones
    @GetMapping
    public List<Section> getAllSections() {
        return sectionService.getAllSections();
    }

    // Obtener sección por ID
    @GetMapping("/{id}")
    public Section getSectionById(@PathVariable Long id) {
        return sectionService.getSectionById(id);
    }

    // Crear nueva sección
    @PostMapping
    public Section createSection(@Valid @RequestBody Section section) {
        return sectionService.createSection(section);
    }

    // Actualizar sección
    @PutMapping("/{id}")
    public Section updateSection(
            @PathVariable Long id,
            @Valid @RequestBody Section sectionDetails) {
        return sectionService.updateSection(id, sectionDetails);
    }

    // Eliminar sección
    @DeleteMapping("/{id}")
    public void deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
    }

    // Obtener secciones activas
    @GetMapping("/active")
    public List<Section> getActiveSections() {
        return sectionService.getActiveSections();
    }

}
