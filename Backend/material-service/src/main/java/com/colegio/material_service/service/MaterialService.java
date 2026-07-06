package com.colegio.material_service.service;

import com.colegio.material_service.dto.MaterialResponse;
import com.colegio.material_service.dto.MaterialUploadRequest;
import com.colegio.material_service.entity.CourseWeek;
import com.colegio.material_service.entity.Material;
import com.colegio.material_service.repository.CourseWeekRepository;
import com.colegio.material_service.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CourseWeekRepository courseWeekRepository;
    private final FileStorageService fileStorageService;

    public MaterialResponse subirMaterial(MaterialUploadRequest req, MultipartFile file) throws IOException {
        String nombreHash = fileStorageService.store(file);
        String ext = file.getOriginalFilename() != null
            ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1).toUpperCase()
            : "BIN";

        CourseWeek week = null;
        if (req.getWeekId() != null) {
            week = courseWeekRepository.findById(req.getWeekId()).orElse(null);
        }

        Material material = Material.builder()
            .titulo(req.getTitulo())
            .descripcion(req.getDescripcion())
            .nombreOriginal(file.getOriginalFilename())
            .nombreHash(nombreHash)
            .tipoArchivo(ext)
            .tamanoBytes(file.getSize())
            .courseId(req.getCourseId())
            .week(week)
            .codigoDocente(req.getCodigoDocente())
            .esPublico(req.getEsPublico() != null ? req.getEsPublico() : true)
            .build();

        material = materialRepository.save(material);
        return toResponse(material);
    }

    public MaterialResponse obtenerMaterial(Long id) {
        Material m = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material no encontrado: " + id));
        return toResponse(m);
    }

    public List<MaterialResponse> listarPorCurso(UUID courseId) {
        return materialRepository.findByCourseId(courseId).stream().map(this::toResponse).toList();
    }

    public List<MaterialResponse> listarPorSemana(Long weekId) {
        return materialRepository.findByWeekId(weekId).stream().map(this::toResponse).toList();
    }

    public List<MaterialResponse> listarPorDocente(String codigoDocente) {
        return materialRepository.findByCodigoDocente(codigoDocente).stream().map(this::toResponse).toList();
    }

    public Resource descargarMaterial(Long id) throws IOException {
        Material m = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material no encontrado: " + id));
        return fileStorageService.loadAsResource(m.getNombreHash());
    }

    public void eliminarMaterial(Long id) throws IOException {
        Material m = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material no encontrado: " + id));
        fileStorageService.delete(m.getNombreHash());
        materialRepository.delete(m);
    }

    private MaterialResponse toResponse(Material m) {
        return MaterialResponse.builder()
            .id(m.getId())
            .titulo(m.getTitulo())
            .descripcion(m.getDescripcion())
            .nombreOriginal(m.getNombreOriginal())
            .tipoArchivo(m.getTipoArchivo())
            .tamanoBytes(m.getTamanoBytes())
            .courseId(m.getCourseId())
            .weekId(m.getWeek() != null ? m.getWeek().getId() : null)
            .weekDescripcion(m.getWeek() != null ? m.getWeek().getDescripcion() : null)
            .codigoDocente(m.getCodigoDocente())
            .esPublico(m.getEsPublico())
            .fechaSubida(m.getFechaSubida())
            .downloadUrl("/api/v1/materials/download/" + m.getId())
            .build();
    }
}
