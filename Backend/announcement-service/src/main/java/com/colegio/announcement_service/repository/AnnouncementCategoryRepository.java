package com.colegio.announcement_service.repository;

import com.colegio.announcement_service.model.AnnouncementCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementCategoryRepository extends JpaRepository<AnnouncementCategory, Long> {
}
