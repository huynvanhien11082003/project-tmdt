package com.techstore.demotmdt.service;

import com.techstore.demotmdt.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    ProductDTO getProductBySku(String sku);

    List<ProductDTO> getAllProducts();
}
