package com.colegio.billing_service.controller;

import com.colegio.billing_service.model.Payment;
import com.colegio.billing_service.service.PaymentService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/billing/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getPayments(){return ResponseEntity.ok(paymentService.getPayments());}

    @GetMapping("/charge/{id}")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(@PathVariable Long id){return ResponseEntity.ok(paymentService.getPaymentByStudent(id));}

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id){
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment){return ResponseEntity.ok(paymentService.createPayment(payment));}

    @PutMapping
    public ResponseEntity<Payment> updatePayment(@RequestBody Payment payment){return ResponseEntity.ok(paymentService.updatePayment(payment));}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id){
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

}
