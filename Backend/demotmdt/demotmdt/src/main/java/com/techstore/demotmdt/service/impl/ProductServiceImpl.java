package com.techstore.demotmdt.service.impl;

import com.techstore.demotmdt.dto.AttributeDTO;
import com.techstore.demotmdt.dto.FaqDTO;
import com.techstore.demotmdt.dto.ProductDTO;
import com.techstore.demotmdt.entity.Product;
import com.techstore.demotmdt.repository.ProductRepository;
import com.techstore.demotmdt.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public ProductDTO getProductBySku(String sku) {
        // 1. Lấy dữ liệu Entity từ database
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với mã SKU: " + sku));

        // 2. Chuyển đổi dữ liệu (Mapping) từ Entity sang DTO
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPrice());
        dto.setInStock(product.isInStock());
        dto.setImageUrl(product.getImageUrl());

        // Mapping danh sách thuộc tính (Attributes)
        if (product.getAttributes() != null) {
            dto.setAttributes(product.getAttributes().stream()
                    .map(attr -> new AttributeDTO(attr.getAttributeName(), attr.getAttributeValue()))
                    .collect(Collectors.toList()));
        }

        // Mapping danh sách câu hỏi (FAQs)
        if (product.getFaqs() != null) {
            dto.setFaqs(product.getFaqs().stream()
                    .map(faq -> new FaqDTO(faq.getQuestion(), faq.getAnswer()))
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    @Override
    @Transactional
    public List<ProductDTO> getAllProducts() {
        // Lấy toàn bộ sản phẩm từ DB
        List<Product> products = productRepository.findAll();

        // Dùng Stream để biến đổi Entity thành DTO
        return products.stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setSku(product.getSku());
            dto.setName(product.getName());
            dto.setPrice(product.getPrice());
            dto.setImageUrl(product.getImageUrl());
            // Cố tình bỏ qua attributes và faqs để payload JSON nhẹ nhất có thể
            return dto;
        }).collect(Collectors.toList());
    }
}
