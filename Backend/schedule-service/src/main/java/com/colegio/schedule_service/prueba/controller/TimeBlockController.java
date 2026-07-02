package com.colegio.schedule_service.prueba.controller;

import com.colegio.schedule_service.prueba.entity.BlockType;
import com.colegio.schedule_service.prueba.entity.TimeBlock;
import com.colegio.schedule_service.prueba.service.TimeBlockService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/time-blocks")
public class TimeBlockController {

    @Autowired
    private TimeBlockService timeBlockService;

    @PostMapping
    public TimeBlock createTimeBlock(@Valid @RequestBody TimeBlock timeBlock) {
        return timeBlockService.createTimeBlock(timeBlock);
    }

    @GetMapping
    public List<TimeBlock> getAllTimeBlocks() {
        return timeBlockService.getAllTimeBlocks();
    }

    @GetMapping("/{id}")
    public TimeBlock getTimeBlockById(@PathVariable UUID id) {
        return timeBlockService.getTimeBlockById(id);
    }

    @GetMapping("/type/{type}")
    public List<TimeBlock> getByType(@PathVariable BlockType type) {
        return timeBlockService.getByType(type);
    }

    @PutMapping("/{id}")
    public TimeBlock updateTimeBlock(@PathVariable UUID id, @Valid @RequestBody TimeBlock details) {
        return timeBlockService.updateTimeBlock(id, details);
    }

    @DeleteMapping("/{id}")
    public void deleteTimeBlock(@PathVariable UUID id) {
        timeBlockService.deleteTimeBlock(id);
    }
}