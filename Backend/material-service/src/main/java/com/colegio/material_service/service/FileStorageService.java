package com.colegio.material_service.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path storagePath;

    private static final Set<String> ALLOWED_TYPES = Set.of(
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    private static final Map<String, String> MIME_TO_EXT = Map.of(
        "application/pdf", "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"
    );

    @PostConstruct
    public void init() throws IOException {
        storagePath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(storagePath);
        log.info("Directorio de almacenamiento: {}", storagePath);
    }

    public String store(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Tipo de archivo no permitido. Solo PDF, DOCX y XLSX.");
        }

        String ext = MIME_TO_EXT.getOrDefault(contentType, "bin");
        String nombreHash = UUID.randomUUID().toString() + "." + ext;
        Path targetPath = storagePath.resolve(nombreHash);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Archivo guardado como: {}", nombreHash);
        return nombreHash;
    }

    public Resource loadAsResource(String nombreHash) throws MalformedURLException {
        Path filePath = storagePath.resolve(nombreHash).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Archivo no encontrado: " + nombreHash);
        }
        return resource;
    }

    public void delete(String nombreHash) throws IOException {
        Path filePath = storagePath.resolve(nombreHash).normalize();
        Files.deleteIfExists(filePath);
    }

    public String getExtension(String contentType) {
        return MIME_TO_EXT.getOrDefault(contentType, "bin");
    }
}
