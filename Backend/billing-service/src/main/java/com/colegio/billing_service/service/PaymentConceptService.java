package com.colegio.billing_service.service;

import com.colegio.billing_service.model.PaymentConcept;
import com.colegio.billing_service.repository.PaymentConceptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentConceptService {

    @Autowired
    private PaymentConceptRepository paymentConceptRepository;

    public List<PaymentConcept> getConcepts(){return paymentConceptRepository.findAll();}

    public Optional<PaymentConcept> getConceptById(Long id){return paymentConceptRepository.findById(id);}

    public PaymentConcept createConcept(PaymentConcept concept){return paymentConceptRepository.save(concept);}

    public PaymentConcept updateConcept(PaymentConcept concept){return paymentConceptRepository.save(concept);}

    public void deleteConcept(Long id){paymentConceptRepository.deleteById(id);}

}
