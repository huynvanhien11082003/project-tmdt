package com.techstore.demotmdt.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product_faqs")
@Data
public class ProductFaq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
