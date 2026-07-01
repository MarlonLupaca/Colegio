package com.colegio.billing_service.controller;

import com.colegio.billing_service.model.StudentCharge;
import com.colegio.billing_service.service.StudentChargeService;
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
@RequestMapping("/api/v1/billing/charge")
public class StudentChargeController {

    @Autowired
    private StudentChargeService chargeService;

    @GetMapping
    public ResponseEntity<List<StudentCharge>> getCharges(){return ResponseEntity.ok(chargeService.getCharges());}

    @GetMapping("/student/{id}")
    public ResponseEntity<List<StudentCharge>> getChargesByStudent(@PathVariable Long id){return ResponseEntity.ok(chargeService.getChargesByStudent(id));}

    @GetMapping("/{id}")
    public ResponseEntity<StudentCharge> getChargeById(@PathVariable Long id){
        return chargeService.getChargeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentCharge> createCharge(@RequestBody StudentCharge charge){return ResponseEntity.ok(chargeService.createCharge(charge));}

    @PutMapping
    public ResponseEntity<StudentCharge> updateCharge(@RequestBody StudentCharge charge){return ResponseEntity.ok(chargeService.updateCharge(charge));}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharge(@PathVariable Long id){
        chargeService.deleteCharge(id);
        return ResponseEntity.noContent().build();
    }

}
