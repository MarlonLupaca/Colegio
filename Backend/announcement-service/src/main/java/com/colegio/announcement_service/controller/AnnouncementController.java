package com.colegio.announcement_service.controller;

import com.colegio.announcement_service.model.Announcement;
import com.colegio.announcement_service.service.AnnouncementService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcement")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(announcementService.getAnnoucements());
    }

    @GetMapping("/by-category/{id}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncemetsByCategory(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        return announcementService.getAnnouncementById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(announcementService.createAnnouncemet(announcement));
    }

    @PutMapping
    public ResponseEntity<Announcement> updateAnnouncement(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(announcementService.updateAnnouncemet(announcement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }


//    @GetMapping("/active")
//    public ResponseEntity<List<Announcement>> getActiveAnnouncements() {
//        return ResponseEntity.ok(announcementService.getActiveAnnouncements());
//    }

//    @GetMapping("/recent")
//    public ResponseEntity<List<Announcement>> getRecentAnnouncements() {
//        return ResponseEntity.ok(announcementService.getRecentAnnouncements());
//    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Announcement>> searchAnnouncements(@RequestParam String keyword) {
//        return ResponseEntity.ok(announcementService.searchAnnouncements(keyword));
//    }

}
