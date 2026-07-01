package com.colegio.schedule_service.prueba.repository;

import com.colegio.schedule_service.prueba.entity.BlockType;
import com.colegio.schedule_service.prueba.entity.TimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TimeBlockRepository extends JpaRepository<TimeBlock, UUID  > {

    List<TimeBlock> findByType(BlockType type);

}
