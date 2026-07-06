package com.colegio.material_service.service;

import com.colegio.material_service.entity.CourseWeek;
import com.colegio.material_service.entity.Trimestre;
import com.colegio.material_service.repository.CourseWeekRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeekGeneratorService {

    private final CourseWeekRepository courseWeekRepository;

    private record TrimestreConfig(Trimestre trimestre, LocalDate inicio, LocalDate fin) {}

    public void generarSemanasCurso(UUID courseId) {
        int year = LocalDate.now().getYear();

        List<TrimestreConfig> trimestres = List.of(
            new TrimestreConfig(Trimestre.PRIMERO,  LocalDate.of(year, 3, 2),  LocalDate.of(year, 5, 30)),
            new TrimestreConfig(Trimestre.SEGUNDO,  LocalDate.of(year, 6, 2),  LocalDate.of(year, 9, 26)),
            new TrimestreConfig(Trimestre.TERCERO,  LocalDate.of(year, 9, 29), LocalDate.of(year, 12, 19))
        );

        // ── Validar si las semanas existentes son del año actual ──────────────
        List<CourseWeek> existentes = courseWeekRepository
            .findByCourseIdOrderByTrimestreAscNumeroSemanaAsc(courseId);

        if (!existentes.isEmpty()) {
            int anioExistente = existentes.get(0).getFechaInicio().getYear();
            if (anioExistente != year) {
                // Año diferente → eliminar todo y regenerar
                log.info("Semanas del curso {} son del año {}. Eliminando y regenerando para {}...",
                    courseId, anioExistente, year);
                courseWeekRepository.deleteAll(existentes);
            } else {
                // Mismo año → verificar si los 3 trimestres están presentes
                boolean completas = trimestres.stream().allMatch(t ->
                    courseWeekRepository.existsByCourseIdAndTrimestreAndNumeroSemana(
                        courseId, t.trimestre(), 1)
                );
                if (completas) {
                    log.debug("Semanas del año {} ya existen para curso {}. Omitiendo.", year, courseId);
                    return;
                }
            }
        }

        // ── Generar semanas ───────────────────────────────────────────────────
        List<CourseWeek> toSave = new ArrayList<>();

        for (TrimestreConfig t : trimestres) {
            LocalDate cursor = t.inicio();
            // Avanzar al primer lunes desde la fecha de inicio
            while (cursor.getDayOfWeek().getValue() != 1) {
                cursor = cursor.plusDays(1);
            }

            int semana = 1;
            while (!cursor.isAfter(t.fin())) {
                LocalDate lunes   = cursor;
                LocalDate viernes = cursor.plusDays(4);

                if (!courseWeekRepository.existsByCourseIdAndTrimestreAndNumeroSemana(
                        courseId, t.trimestre(), semana)) {

                    toSave.add(CourseWeek.builder()
                        .courseId(courseId)
                        .trimestre(t.trimestre())
                        .numeroSemana(semana)
                        .fechaInicio(lunes)
                        .fechaFin(viernes)
                        .descripcion(String.format("Semana %d (%s al %s)", semana, lunes, viernes))
                        .build());
                }

                cursor = cursor.plusWeeks(1);
                semana++;
            }
        }

        if (!toSave.isEmpty()) {
            courseWeekRepository.saveAll(toSave);
            log.info("Generadas {} semanas para el curso {}", toSave.size(), courseId);
        }
    }
}
