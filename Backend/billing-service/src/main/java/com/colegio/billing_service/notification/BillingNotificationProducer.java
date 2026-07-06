package com.colegio.billing_service.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BillingNotificationProducer {

    private final KafkaTemplate<Object, Map<String, Object>> kafkaTemplate;

    public void send(Map<String, Object> event) {
        kafkaTemplate.send("notifications", event);
    }
}
