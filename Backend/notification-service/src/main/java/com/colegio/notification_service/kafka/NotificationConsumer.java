package com.colegio.notification_service.kafka;

import com.colegio.notification_service.dto.NotificationRequest;
import com.colegio.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "notifications",
            groupId = "notification-group"
    )
    public void recieve(Map<String, Object> event) {

        NotificationRequest request = new NotificationRequest();

        request.setTitle((String) event.get("title"));
        request.setMessage((String) event.get("message"));
        request.setType((String) event.get("type"));
        request.setRecipientType((String) event.get("recipientType"));
        request.setRole((String) event.get("role"));
        request.setSectionId(event.get("sectionId") != null ? Long.valueOf(event.get("sectionId").toString()) : null);
        notificationService.processNotification(request);
    }

}