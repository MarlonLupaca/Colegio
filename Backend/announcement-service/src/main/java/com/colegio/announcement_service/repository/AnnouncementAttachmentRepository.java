package com.colegio.announcement_service.repository;


import com.colegio.announcement_service.model.AnnouncementAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementAttachmentRepository extends JpaRepository<AnnouncementAttachment, Long> {
    List<AnnouncementAttachment> findAllByAnnouncement_Id(Long id);
}
