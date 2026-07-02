package com.colegio.announcement_service.service;

import com.colegio.announcement_service.model.AnnouncementAttachment;
import com.colegio.announcement_service.repository.AnnouncementAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementAttachmentService {

    @Autowired
    private AnnouncementAttachmentRepository attachmentRepository;

    public List<AnnouncementAttachment> getAttachments(){return attachmentRepository.findAll();}

    public List<AnnouncementAttachment> getAttachmentsByAnnoucement(Long id){return attachmentRepository.findAllByAnnouncement_Id(id);}

    public Optional<AnnouncementAttachment> getAttachmentById(Long id){return attachmentRepository.findById(id);}

    public AnnouncementAttachment createAttachment(AnnouncementAttachment attachment){return attachmentRepository.save(attachment);}

    public AnnouncementAttachment updateAttachment(AnnouncementAttachment attachment){return attachmentRepository.save(attachment);}

    public void deleteAttachment(Long id){attachmentRepository.deleteById(id);}

}
