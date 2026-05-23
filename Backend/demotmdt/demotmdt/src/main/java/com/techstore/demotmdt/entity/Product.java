package com.techstore.demotmdt.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String brand;
    private double price;

    @Column(name = "in_stock")
    private boolean inStock;

    @Column(name = "image_url")
    private String imageUrl;

    // Mối quan hệ 1 sản phẩm có nhiều thuộc tính
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductAttribute> attributes; // Đổi List thành Set

    // Mối quan hệ 1 sản phẩm có nhiều câu hỏi FAQ
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductFaq> faqs; // Đổi List thành Set
}