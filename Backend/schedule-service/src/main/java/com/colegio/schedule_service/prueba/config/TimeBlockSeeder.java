package com.colegio.schedule_service.prueba.config;

import com.colegio.schedule_service.prueba.entity.BlockType;
import com.colegio.schedule_service.prueba.entity.TimeBlock;
import com.colegio.schedule_service.prueba.repository.TimeBlockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TimeBlockSeeder implements CommandLineRunner {

    private final TimeBlockRepository timeBlockRepository;

    @Override
    public void run(String... args) throws Exception {
        if (timeBlockRepository.count() > 0) {
            log.info("Los bloques de tiempo ya se encuentran sembrados. Total: {}", timeBlockRepository.count());
            return;
        }

        log.info("🌱 Sembrando bloques de tiempo (TimeBlocks) - Horario Escolar 8:00 AM - 3:30 PM...");
        List<TimeBlock> timeBlocks = new ArrayList<>();

        // =========================================================================
        // BLOQUE 1: 08:00 - 09:30 (CLASE) - 1.5 horas
        // =========================================================================
        TimeBlock bloque1 = new TimeBlock();
        bloque1.setStartTime(LocalTime.of(8, 0));
        bloque1.setEndTime(LocalTime.of(9, 30));
        bloque1.setType(BlockType.CLASE);
        timeBlocks.add(bloque1);

        // =========================================================================
        // BLOQUE 2: 09:30 - 11:00 (CLASE) - 1.5 horas
        // =========================================================================
        TimeBlock bloque2 = new TimeBlock();
        bloque2.setStartTime(LocalTime.of(9, 30));
        bloque2.setEndTime(LocalTime.of(11, 0));
        bloque2.setType(BlockType.CLASE);
        timeBlocks.add(bloque2);

        // =========================================================================
        // BLOQUE 3: 11:00 - 11:30 (RECREO) - 30 minutos
        // =========================================================================
        TimeBlock recreo = new TimeBlock();
        recreo.setStartTime(LocalTime.of(11, 0));
        recreo.setEndTime(LocalTime.of(11, 30));
        recreo.setType(BlockType.RECREO);
        timeBlocks.add(recreo);

        // =========================================================================
        // BLOQUE 4: 11:30 - 13:00 (CLASE) - 1.5 horas
        // =========================================================================
        TimeBlock bloque4 = new TimeBlock();
        bloque4.setStartTime(LocalTime.of(11, 30));
        bloque4.setEndTime(LocalTime.of(13, 0));
        bloque4.setType(BlockType.CLASE);
        timeBlocks.add(bloque4);

        // =========================================================================
        // BLOQUE 5: 13:00 - 14:00 (ALMUERZO) - 1 hora
        // =========================================================================
        TimeBlock almuerzo = new TimeBlock();
        almuerzo.setStartTime(LocalTime.of(13, 0));
        almuerzo.setEndTime(LocalTime.of(14, 0));
        almuerzo.setType(BlockType.ALMUERZO);
        timeBlocks.add(almuerzo);

        // =========================================================================
        // BLOQUE 6: 14:00 - 15:30 (CLASE) - 1.5 horas
        // =========================================================================
        TimeBlock bloque6 = new TimeBlock();
        bloque6.setStartTime(LocalTime.of(14, 0));
        bloque6.setEndTime(LocalTime.of(15, 30));
        bloque6.setType(BlockType.CLASE);
        timeBlocks.add(bloque6);

        // Guardar todos los bloques
        timeBlockRepository.saveAll(timeBlocks);

        log.info("✅ ¡Se sembraron con éxito {} bloques de tiempo!", timeBlocks.size());

    }
}