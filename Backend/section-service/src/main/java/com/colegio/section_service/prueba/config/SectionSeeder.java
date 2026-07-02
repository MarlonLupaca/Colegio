package com.colegio.section_service.prueba.config;

import com.colegio.section_service.prueba.entity.Section;
import com.colegio.section_service.prueba.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SectionSeeder implements CommandLineRunner {

    private final SectionRepository sectionRepository;

    @Override
    public void run(String... args) throws Exception {
        
        // Si ya existen secciones en la base de datos, no sembramos nada
        if (sectionRepository.count() > 0) {
            log.info("Estructura de secciones escolares ya se encuentra sembrada.");
            return;
        }

        log.info("Sembrando estructura base de 11 aulas por defecto (A)...");
        List<Section> defaultSections = new ArrayList<>();

        // 1. Primaria: 1° a 6° grado (Letra A)
        for (int grade = 1; grade <= 6; grade++) {
            Section section = new Section();
            section.setEducationLevel("primaria");
            section.setGradeLevel(grade);
            section.setSectionName("A");
            section.setMaxStudents(30);
            section.setIsActive(true);
            defaultSections.add(section);
        }

        // 2. Secundaria: 1° a 5° grado (Letra A)
        for (int grade = 1; grade <= 5; grade++) {
            Section section = new Section();
            section.setEducationLevel("secundaria");
            section.setGradeLevel(grade);
            section.setSectionName("A");
            section.setMaxStudents(30);
            section.setIsActive(true);
            defaultSections.add(section);
        }

        sectionRepository.saveAll(defaultSections);
        log.info("¡Se sembraron con éxito {} secciones base en la base de datos!", defaultSections.size());
    }
}
