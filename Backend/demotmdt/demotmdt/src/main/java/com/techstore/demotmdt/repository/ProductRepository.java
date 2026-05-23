package com.techstore.demotmdt.repository;

import com.techstore.demotmdt.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Kỹ thuật JOIN FETCH giúp lấy Product kèm luôn Attributes và FAQs chỉ trong 1 câu lệnh SQL duy nhất
    // Giúp tối ưu hiệu năng hệ thống và tránh lỗi Lazy Load
    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.attributes " +
            "LEFT JOIN FETCH p.faqs " +
            "WHERE p.sku = :sku")
    Optional<Product> findBySku(@Param("sku") String sku);
}