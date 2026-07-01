package com.colegio.billing_service.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_charge")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentCharge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "concept_id")
    private PaymentConcept paymentConcept;

    @Column(name = "concept_name")
    private String conceptName;

    @Column(name = "reference_service")
    private ReferenceService referenceService;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

    @Column(name = "pending_amount")
    private BigDecimal pendingAmount;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "status")
    private StudentChargeStatus status;

    @Column(name = "description")
    private String description;

}
