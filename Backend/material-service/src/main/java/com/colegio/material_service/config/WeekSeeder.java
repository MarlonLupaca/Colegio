package com.colegio.material_service.config;

import com.colegio.material_service.service.WeekGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class WeekSeeder implements ApplicationRunner {

    private final WeekGeneratorService weekGeneratorService;
    private final RestTemplate restTemplate;

    @Value("${app.course-service.url:http://localhost:8089}")
    private String courseServiceUrl;

    @Override
    @SuppressWarnings("unchecked")
    public void run(ApplicationArguments args) {
        log.info("Iniciando generación automática de semanas del calendario...");
        try {
            List<Map<String, Object>> courses = restTemplate.getForObject(
                courseServiceUrl + "/api/v1/courses", List.class);

            if (courses == null || courses.isEmpty()) {
                log.warn("No se encontraron cursos en course-service. Saltando generación de semanas.");
                return;
            }

            log.info("Se encontraron {} cursos. Generando semanas...", courses.size());
            for (Map<String, Object> course : courses) {
                try {
                    UUID courseId = UUID.fromString((String) course.get("id"));
                    weekGeneratorService.generarSemanasCurso(courseId);
                } catch (Exception e) {
                    log.error("Error generando semanas para curso {}: {}", course.get("id"), e.getMessage());
                }
            }
            log.info("Generación de semanas completada.");
        } catch (Exception e) {
            log.warn("No se pudo conectar al course-service para generar semanas: {}", e.getMessage());
        }
    }
}
