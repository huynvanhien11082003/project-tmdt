import React from 'react';
import Link from 'next/link';

// Hàm gọi API lấy chi tiết sản phẩm từ Spring Boot
async function getProductDetail(sku: string) {
  try {
    // Ưu tiên dùng biến môi trường, nếu không có mới dùng link dự phòng
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://project-tmdt.onrender.com';
    
    console.log("=> Đang fetch CHI TIẾT sản phẩm từ:", `${API_URL}/api/products/${sku}`);
    
    const res = await fetch(`${API_URL}/api/products/${sku}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
    return null;
  }
}

// Cấu hình params dưới dạng Promise để tương thích chuẩn Next.js 15
export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  
  // Giải mã Promise để lấy mã SKU thực tế (Ví dụ: SKU-1029, SKU-1030...)
  const resolvedParams = await params; 
  const product = await getProductDetail(resolvedParams.sku);

  // Giao diện bảo vệ nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="text-center mt-20 font-sans">
        <p className="text-2xl font-bold text-red-500 mb-2">Sản phẩm không tồn tại</p>
        <p className="text-gray-500 mb-4">Next.js đang tìm kiếm mã SKU: <span className="font-mono bg-gray-100 p-1 rounded font-bold text-gray-700">{resolvedParams.sku}</span></p>
        <Link href="/" className="text-blue-600 hover:underline font-semibold">
          &larr; Quay lại trang chủ
        </Link>
      </div>
    );
  }

  // Khối JSON-LD phục vụ tối ưu cấu trúc dữ liệu cho Bot AI (AIEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faqs?.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })) || [],
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      {/* Nhúng cấu trúc Schema vào trang */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline font-semibold">
          &larr; Quay lại trang chủ
        </Link>
      </div>

      {/* Thông tin chi tiết sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden h-80">
          {product.imageUrl ? (
             <img src={product.imageUrl} alt={product.name} className="object-contain h-full w-full" />
          ) : (
             <span className="text-gray-400">Không có hình ảnh</span>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">SKU: {product.sku} | Thương hiệu: {product.brand}</p>
          <p className="text-3xl font-black text-red-600 mb-6">{product.price?.toLocaleString('vi-VN')} VNĐ</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Mô tả sản phẩm:</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Vùng hiển thị FAQ nhận từ Database do n8n sinh ra */}
      <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🤖</span> Hỏi đáp chuyên gia (Tạo tự động bằng AI)
        </h2>
        
        {(!product.faqs || product.faqs.length === 0) ? (
          <p className="text-gray-500 italic">Hệ thống AI đang phân tích dữ liệu kỹ thuật và chuẩn bị câu trả lời cho sản phẩm này...</p>
        ) : (
          <div className="space-y-6">
            {product.faqs.map((faq: any, index: number) => (
              <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex gap-2">
                  <span className="text-blue-500 font-bold">Q:</span> {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed flex gap-2">
                  <span className="text-green-500 font-bold">A:</span> {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}