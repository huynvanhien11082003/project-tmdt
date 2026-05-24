export const dynamic = 'force-dynamic'; // CHÌA KHÓA ĐỂ SỬA LỖI BUILD DOCKER

import React from 'react';
import Link from 'next/link'; 

async function getProducts() {
  try {
    // Ưu tiên dùng biến môi trường, nếu chạy Docker Local thì tự fallback về backend:8080
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8080';
    
    console.log("Đang fetch danh sách sản phẩm từ:", `${API_URL}/api/products`);
    
    const res = await fetch(`${API_URL}/api/products`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      console.error("Backend trả về lỗi:", res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Lỗi mất kết nối Backend:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <header className="mb-12 text-center mt-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">TechStore E-Commerce</h1>
        <p className="text-gray-600 text-lg">Khám phá các dòng sản phẩm công nghệ tối ưu cho hệ thống AI</p>
      </header>

      {products.length === 0 ? (
        <div className="text-center text-red-500 font-bold mt-10">
          Chưa có sản phẩm nào hoặc Backend chưa chạy.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <Link href={`/products/${product.sku}`} key={product.id}>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer group flex flex-col h-full">
                
                <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400">Không có hình ảnh</span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs text-gray-500 mb-1">{product.sku}</span>
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h2>
                  
                  <div className="mt-auto pt-4">
                    <p className="text-xl font-extrabold text-red-600">
                      {product.price?.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
                
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}