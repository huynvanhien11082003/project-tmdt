package com.techstore.demotmdt.controller;

import com.techstore.demotmdt.dto.ProductDTO;
import com.techstore.demotmdt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // CORS mở cho Frontend Next.js gọi vào
public class ProductController {

    @Autowired
    private ProductService productService;

    // API thật kết nối trực tiếp xuống DB qua Service
    @GetMapping("/{sku}")
    public ProductDTO getProductBySku(@PathVariable String sku) {
        return productService.getProductBySku(sku);
    }

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }
}