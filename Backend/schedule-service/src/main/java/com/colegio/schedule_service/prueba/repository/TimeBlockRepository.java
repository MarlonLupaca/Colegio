package com.colegio.schedule_service.prueba.repository;

import com.colegio.schedule_service.prueba.entity.BlockType;
import com.colegio.schedule_service.prueba.entity.TimeBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface TimeBlockRepository extends JpaRepository<TimeBlock, UUID  > {

    List<TimeBlock> findByType(BlockType type);

    @Query("SELECT COUNT(t) > 0 FROM TimeBlock t WHERE " +
            "(:id IS NULL OR t.id <> :id) AND " +
            "(t.startTime < :endTime AND t.endTime > :startTime)")
    boolean existsOverlappingBlock(@Param("startTime") LocalTime startTime,
                                   @Param("endTime") LocalTime endTime,
                                   @Param("id") UUID id);

}
