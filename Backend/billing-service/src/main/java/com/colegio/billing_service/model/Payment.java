package com.colegio.billing_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "charge_id")
    private StudentCharge studentChage;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "operation_number")
    private String operationNumber;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "status")
    private PaymentStatus status;

    @Column(name = "creator_id")
    private Long createdBy;

}
