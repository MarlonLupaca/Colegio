package com.colegio.announcement_service.controller;

import com.colegio.announcement_service.model.AnnouncementAttachment;
import com.colegio.announcement_service.service.AnnouncementAttachmentService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcement/attachment")
public class AnnouncementAttachmentController {

    @Autowired
    private AnnouncementAttachmentService attachmentService;

    @GetMapping
    public ResponseEntity<List<AnnouncementAttachment>> getAttachments() {
        return ResponseEntity.ok(attachmentService.getAttachments());
    }

    @GetMapping("/announcement/{id}")
    public ResponseEntity<List<AnnouncementAttachment>> getAttachmentsByAnnouncement(@PathVariable Long id) {
        return ResponseEntity.ok(attachmentService.getAttachmentsByAnnoucement(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementAttachment> getAttachmentById(@PathVariable Long id) {
        return attachmentService.getAttachmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AnnouncementAttachment> createAttachment(@RequestBody AnnouncementAttachment attachment) {
        return ResponseEntity.ok(attachmentService.createAttachment(attachment));
    }

    @PutMapping
    public ResponseEntity<AnnouncementAttachment> updateAttachment(@RequestBody AnnouncementAttachment attachment) {
        return ResponseEntity.ok(attachmentService.updateAttachment(attachment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }


}
