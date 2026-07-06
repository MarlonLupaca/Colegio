package com.colegio.material_service.controller;

import com.colegio.material_service.dto.MaterialResponse;
import com.colegio.material_service.dto.MaterialUploadRequest;
import com.colegio.material_service.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialResponse> upload(
        @RequestPart("metadata") MaterialUploadRequest request,
        @RequestPart("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(materialService.subirMaterial(request, file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(materialService.obtenerMaterial(id));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<MaterialResponse>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(materialService.listarPorCurso(courseId));
    }

    @GetMapping("/week/{weekId}")
    public ResponseEntity<List<MaterialResponse>> getByWeek(@PathVariable Long weekId) {
        return ResponseEntity.ok(materialService.listarPorSemana(weekId));
    }

    @GetMapping("/docente/{codigo}")
    public ResponseEntity<List<MaterialResponse>> getByDocente(@PathVariable String codigo) {
        return ResponseEntity.ok(materialService.listarPorDocente(codigo));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        Resource resource = materialService.descargarMaterial(id);
        MaterialResponse info = materialService.obtenerMaterial(id);
        String contentType = switch (info.getTipoArchivo().toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            default -> "application/octet-stream";
        };
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + info.getNombreOriginal() + "\"")
            .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        materialService.eliminarMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
