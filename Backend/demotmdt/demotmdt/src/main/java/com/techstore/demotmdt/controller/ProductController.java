package com.techstore.demotmdt.controller;

import com.techstore.demotmdt.dto.ProductDTO;
import com.techstore.demotmdt.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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
    @PostMapping("/ask-ai")
    public String askAI(@RequestBody AskAIRequest request) {
        String n8nUrl = "http://n8n:5678/webhook/ai-consultation";
        RestTemplate restTemplate = new RestTemplate();

        // Gửi SKU sang n8n và nhận phản hồi từ AI
        String aiResponse = restTemplate.postForObject(n8nUrl, request, String.class);

        return aiResponse;
    }

    // Tạo một class DTO đơn giản để nhận request từ frontend
    public static class AskAIRequest {
        private String sku;
        // getter, setter
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
    }
}