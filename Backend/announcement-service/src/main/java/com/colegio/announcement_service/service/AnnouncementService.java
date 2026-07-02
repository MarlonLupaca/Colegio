package com.colegio.announcement_service.service;

import com.colegio.announcement_service.model.Announcement;
import com.colegio.announcement_service.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAnnoucements(){return announcementRepository.findAll();}

    public List<Announcement> getAnnouncemetsByCategory(Long id){return announcementRepository.findAllByCategory_Id(id);}

    public Optional<Announcement> getAnnouncementById(Long id){return announcementRepository.findById(id);}

    public Announcement createAnnouncemet(Announcement announcement){return announcementRepository.save(announcement);}

    public Announcement updateAnnouncemet(Announcement announcement){return announcementRepository.save(announcement);}

    public void deleteAnnouncement(Long id){announcementRepository.deleteById(id);}

}
