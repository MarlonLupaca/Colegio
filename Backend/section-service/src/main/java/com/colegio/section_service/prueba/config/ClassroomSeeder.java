package com.colegio.section_service.prueba.config;

import com.colegio.section_service.prueba.entity.Classroom;
import com.colegio.section_service.prueba.entity.ClassroomStatus;
import com.colegio.section_service.prueba.entity.ClassroomType;
import com.colegio.section_service.prueba.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ClassroomSeeder implements CommandLineRunner {

    private final ClassroomRepository classroomRepository;

    @Override
    public void run(String... args) throws Exception {
        // Si ya existen aulas, no sembramos nada
        if (classroomRepository.count() > 0) {
            log.info("Las aulas físicas ya se encuentran sembradas. Total: {}", classroomRepository.count());
            return;
        }

        log.info("🌱 Sembrando 10 aulas físicas (classrooms)...");
        List<Classroom> classrooms = new ArrayList<>();

        // =========================================================================
        // AULAS NORMALES - Edificio Principal (6 aulas)
        // =========================================================================
        for (int i = 1; i <= 6; i++) {
            Classroom classroom = new Classroom();
            classroom.setBuilding("Principal");
            classroom.setRoomNumber("A" + String.format("%03d", i));
            classroom.setMaxCapacity(30);
            classroom.setStatus(ClassroomStatus.DISPONIBLE);
            classroom.setType(ClassroomType.AULA_NORMAL);
            classrooms.add(classroom);
        }

        // =========================================================================
        // LABORATORIO - Edificio Ciencias (1 aula)
        // =========================================================================
        Classroom laboratorio = new Classroom();
        laboratorio.setBuilding("Ciencias");
        laboratorio.setRoomNumber("LAB-01");
        laboratorio.setMaxCapacity(25);
        laboratorio.setStatus(ClassroomStatus.DISPONIBLE);
        laboratorio.setType(ClassroomType.LABORATORIO);
        classrooms.add(laboratorio);

        // =========================================================================
        // SALA DE COMPUTACIÓN - Edificio Tecnología (1 aula)
        // =========================================================================
        Classroom salaComputo = new Classroom();
        salaComputo.setBuilding("Tecnología");
        salaComputo.setRoomNumber("COMP-01");
        salaComputo.setMaxCapacity(25);
        salaComputo.setStatus(ClassroomStatus.DISPONIBLE);
        salaComputo.setType(ClassroomType.SALA_COMPUTACION);
        classrooms.add(salaComputo);

        // =========================================================================
        // AULA NORMAL - Edificio Secundaria (1 aula)
        // =========================================================================
        Classroom aulaSecundaria = new Classroom();
        aulaSecundaria.setBuilding("Secundaria");
        aulaSecundaria.setRoomNumber("S-101");
        aulaSecundaria.setMaxCapacity(30);
        aulaSecundaria.setStatus(ClassroomStatus.DISPONIBLE);
        aulaSecundaria.setType(ClassroomType.AULA_NORMAL);
        classrooms.add(aulaSecundaria);

        // =========================================================================
        // TALLER - Edificio Artes (1 aula)
        // =========================================================================
        Classroom taller = new Classroom();
        taller.setBuilding("Artes");
        taller.setRoomNumber("TALLER-01");
        taller.setMaxCapacity(20);
        taller.setStatus(ClassroomStatus.DISPONIBLE);
        taller.setType(ClassroomType.TALLER);
        classrooms.add(taller);

        // =========================================================================
        // AUDITORIO - Edificio Principal (capacidad ajustada a 30)
        // =========================================================================
        Classroom auditorio = new Classroom();
        auditorio.setBuilding("Principal");
        auditorio.setRoomNumber("AUD-01");
        auditorio.setMaxCapacity(30);  // ✅ Cambiado de 50 a 30
        auditorio.setStatus(ClassroomStatus.DISPONIBLE);
        auditorio.setType(ClassroomType.AUDITORIO);
        classrooms.add(auditorio);

        // Guardar todas las aulas
        classroomRepository.saveAll(classrooms);

        log.info("✅ ¡Se sembraron con éxito {} aulas físicas!", classrooms.size());

        // Mostrar resumen
        log.info("📊 Resumen de aulas creadas:");
        classrooms.forEach(c -> {
            log.info("  - {} | {} | Capacidad: {} | {}",
                    c.getRoomNumber(),
                    c.getBuilding(),
                    c.getMaxCapacity(),
                    c.getType()
            );
        });
    }
}