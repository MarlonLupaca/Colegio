package com.colegio.notification_service.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationRequest implements Serializable {

    private String title;
    private String message;
    private String type;
    private String recipientType;  // ALL, USER, ROLE, COURSE, GRADE, SECTION
    private Long userId;
    private String role;           // ADMIN, TEACHER, STUDENT, PARENT
    private Long courseId;
    private Long gradeId;
    private Long sectionId;
}