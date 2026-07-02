package com.colegio.audit_service.audit.kafka;

import com.colegio.audit_service.audit.dto.AuditEventDTO;
import com.colegio.audit_service.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventConsumer {

    private final AuditService auditService;

    @KafkaListener(topics = "audit-eventos", groupId = "audit-group")
    public void consumir(Map<String, Object> eventoMap) {
        log.info("Evento de auditoría recibido: {}", eventoMap);
        try {
            AuditEventDTO evento = AuditEventDTO.builder()
                    .accion(getString(eventoMap, "accion"))
                    .entidadAfectada(getString(eventoMap, "entidadAfectada"))
                    .idEntidad(getString(eventoMap, "idEntidad"))
                    .realizadoPor(getString(eventoMap, "realizadoPor"))
                    .rolRealizador(getString(eventoMap, "rolRealizador"))
                    .detalles(getString(eventoMap, "detalles"))
                    .ipOrigen(getString(eventoMap, "ipOrigen"))
                    .timestamp(getString(eventoMap, "timestamp"))
                    .build();

            auditService.registrarEvento(evento);
        } catch (Exception e) {
            log.error("Error procesando evento de auditoría: {}", e.getMessage());
        }
    }

    private String getString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }
}
