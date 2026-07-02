package com.colegio.auth_service.auth.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventProducer {

    private static final String TOPIC = "audit-eventos";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publicarEvento(String accion, String entidadAfectada, String idEntidad,
                                String realizadoPor, String rolRealizador, String detalles) {
        Map<String, Object> evento = new HashMap<>();
        evento.put("accion", accion);
        evento.put("entidadAfectada", entidadAfectada);
        evento.put("idEntidad", idEntidad);
        evento.put("realizadoPor", realizadoPor);
        evento.put("rolRealizador", rolRealizador);
        evento.put("detalles", detalles);
        evento.put("timestamp", LocalDateTime.now().toString());

        try {
            kafkaTemplate.send(TOPIC, realizadoPor, evento);
            log.info("Evento de auditoría publicado: accion={}, realizadoPor={}", accion, realizadoPor);
        } catch (Exception e) {
            log.warn("No se pudo publicar evento de auditoría (Kafka no disponible): {}", e.getMessage());
        }
    }
}
