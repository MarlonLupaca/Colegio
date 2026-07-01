package com.colegio.billing_service.service;

import com.colegio.billing_service.model.Payment;
import com.colegio.billing_service.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getPayments(){return paymentRepository.findAll();}

    public List<Payment> getPaymentByStudent(Long id){return paymentRepository.findAllByCharge_Id(id);}

    public Optional<Payment> getPaymentById(Long id){return paymentRepository.findById(id);}

    public Payment createPayment(Payment charge){return paymentRepository.save(charge);}

    public Payment updatePayment(Payment charge){return paymentRepository.save(charge);}

    public void deletePayment(Long id){paymentRepository.deleteById(id);}

}
