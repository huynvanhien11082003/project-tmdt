package com.techstore.demotmdt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private String brand;
    private double price;
    private boolean inStock;
    private String imageUrl;

    // Thêm 2 list này để chứa dữ liệu từ các bảng con
    private List<AttributeDTO> attributes;
    private List<FaqDTO> faqs;
}