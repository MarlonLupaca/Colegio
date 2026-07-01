package com.colegio.billing_service.controller;

import com.colegio.billing_service.model.PaymentConcept;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/billing/concept")
public class PaymentConceptController {

    @Autowired
    private PaymentConceptService conceptService;

    @GetMapping
    public ResponseEntity<List<PaymentConcept>> getConcepts(){return ResponseEntity.ok(conceptService.getConcepts());}

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
