package com.colegio.billing_service.controller;

import com.colegio.billing_service.model.PaymentConcept;
import com.colegio.billing_service.notification.BillingNotificationProducer;
import com.colegio.billing_service.service.PaymentConceptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/billing/concept")
public class PaymentConceptController {

    @Autowired
    private PaymentConceptService conceptService;

    @Autowired
    private BillingNotificationProducer producer;

    @GetMapping
    public ResponseEntity<List<PaymentConcept>> getConcepts(){
//        Map<String, Object> event1 = new HashMap<>();
//        event1.put("title", "Notificacion de Role");
//        event1.put("message", "Para alumnos");
//        event1.put("recipientType", "ROLE");
//        event1.put("role", "ALUMNO");
//        event1.put("type", "ASSIGNMENT");
//
//        Map<String, Object> event2 = new HashMap<>();
//        event2.put("title", "Notificacion de Seccion");
//        event2.put("message", "Resolver página 25");
//        event2.put("recipientType", "SECTION");
//        event2.put("sectionId", 1L);
//        event2.put("type", "ASSIGNMENT");
//
//        Map<String, Object> event3 = new HashMap<>();
//        event3.put("title", "Notificacion a Todos");
//        event3.put("message", "Tu pago fue procesado");
//        event3.put("type", "PAYMENT");
//        event3.put("recipientType", "ALL");
//        producer.send(event1);
//        producer.send(event2);
//        producer.send(event3);
        return ResponseEntity.ok(conceptService.getConcepts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentConcept> getConceptById(@PathVariable Long id){
        return conceptService.getConceptById(id)
                .map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PaymentConcept> createConcept(@RequestBody PaymentConcept concept){return ResponseEntity.ok(conceptService.createConcept(concept));}

    @PutMapping
    public ResponseEntity<PaymentConcept> updateConcept(@RequestBody PaymentConcept concept){return ResponseEntity.ok(conceptService.updateConcept(concept));}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConcept(@PathVariable Long id){
        conceptService.deleteConcept(id);
        return ResponseEntity.noContent().build();
    }

}
