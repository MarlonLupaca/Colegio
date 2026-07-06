package com.colegio.notification_service.controller;

import com.colegio.notification_service.dto.NotificationRequest;
import com.colegio.notification_service.kafka.NotificationProducer;
import com.colegio.notification_service.model.Notification;
import com.colegio.notification_service.model.NotificationType;
import com.colegio.notification_service.model.RecipientType;
import com.colegio.notification_service.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notification/test")
public class NotificationController {

    @Autowired
    private NotificationProducer producer;

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public String send(){
        NotificationRequest request = NotificationRequest.builder()
                .title("Nueva tarea")
                .message("Resolver página 25")
                .recipientType(String.valueOf(RecipientType.ALL))
                .type(String.valueOf(NotificationType.ASSIGNMENT))
                .build();
        producer.send(request);
        return "Mensaje enviado";
    }

    @GetMapping
    public List<Notification> getNotification(){
        return notificationService.getNotifications();
    }

}
