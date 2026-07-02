package com.colegio.schedule_service.prueba.service;

import com.colegio.schedule_service.prueba.entity.BlockType;
import com.colegio.schedule_service.prueba.entity.TimeBlock;
import com.colegio.schedule_service.prueba.repository.TimeBlockRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TimeBlockService {

    @Autowired
    private TimeBlockRepository timeBlockRepository;

    public TimeBlock createTimeBlock(TimeBlock timeBlock) {
        if (!timeBlock.getStartTime().isBefore(timeBlock.getEndTime())) {
            throw new IllegalArgumentException("La hora de inicio debe ser antes que la hora de fin");
        }

        // Validar que no se cruce con otro bloque ya creado
        if (timeBlockRepository.existsOverlappingBlock(timeBlock.getStartTime(), timeBlock.getEndTime(), null)) {
            throw new IllegalArgumentException("El rango de horas se cruza con un bloque horario existente.");
        }
        return timeBlockRepository.save(timeBlock);
    }

    public List<TimeBlock> getAllTimeBlocks() {
        return timeBlockRepository.findAll();
    }

    public TimeBlock getTimeBlockById(UUID id) {
        return timeBlockRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bloque no encontrado con ID: " + id));
    }

    public List<TimeBlock> getByType(BlockType type) {
        return timeBlockRepository.findByType(type);
    }

    public TimeBlock updateTimeBlock(UUID id, TimeBlock details) {
        if (!details.getStartTime().isBefore(details.getEndTime())) {
            throw new IllegalArgumentException("La hora de inicio debe ser antes que la hora de fin");
        }

        if (timeBlockRepository.existsOverlappingBlock(details.getStartTime(), details.getEndTime(), id)) {
            throw new IllegalArgumentException("El rango de horas se cruza con un bloque horario existente.");
        }
        TimeBlock timeBlock = getTimeBlockById(id);
        timeBlock.setStartTime(details.getStartTime());
        timeBlock.setEndTime(details.getEndTime());
        timeBlock.setType(details.getType());
        return timeBlockRepository.save(timeBlock);
    }

    public void deleteTimeBlock(UUID id) {
        timeBlockRepository.delete(getTimeBlockById(id));
    }
}