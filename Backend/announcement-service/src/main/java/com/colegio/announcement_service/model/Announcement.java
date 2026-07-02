package com.colegio.announcement_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcement")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "tittle")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private AnnouncementCategory category;

    @Column(name = "priority")
    private AnnouncementPriority priority;

    @Column(name = "audience")
    private AnnouncementAudience audience;

    @Column(name = "publish_date")
    private LocalDateTime publish_date;

    @Column(name = "status")
    private AnnouncementStatus status;

    @Column(name = "created_by")
    private Long created_by;

}
