package com.colegio.billing_service.service;

import com.colegio.billing_service.model.StudentCharge;
import com.colegio.billing_service.repository.StudentChargeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentChargeService {

    @Autowired
    private StudentChargeRepository chargeRepository;

    public List<StudentCharge> getCharges(){return chargeRepository.findAll();}

    public List<StudentCharge> getChargesByStudent(Long id){return chargeRepository.findAllByStudent_Id(id);}

    public Optional<StudentCharge> getChargeById(Long id){return chargeRepository.findById(id);}

    public StudentCharge createCharge(StudentCharge charge){return chargeRepository.save(charge);}

    public StudentCharge updateCharge(StudentCharge charge){return chargeRepository.save(charge);}

    public void deleteCharge(Long id){chargeRepository.deleteById(id);}
    
}
