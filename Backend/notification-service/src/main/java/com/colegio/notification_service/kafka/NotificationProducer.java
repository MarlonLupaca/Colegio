package com.colegio.notification_service.kafka;

import com.colegio.notification_service.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {
    private final KafkaTemplate<String, NotificationRequest> kafkaTemplate;
    public void send(NotificationRequest request){
        kafkaTemplate.send("notifications", request);
    }
}