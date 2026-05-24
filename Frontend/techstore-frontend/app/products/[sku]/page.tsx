import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import ProductFAQ from '@/components/ProductFAQ';

// 1. Tách hàm fetch ra để có thể tái sử dụng cho cả Metadata và Page
async function getProductDetail(sku: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://project-tmdt.onrender.com';
    const res = await fetch(`${API_URL}/api/products/${sku}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Lỗi kết nối Backend:", error);
    return null;
  }
}

// 2. SEO & AIEO Cấp độ 1: Tạo Metadata động cho các Crawler chuẩn
export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductDetail(resolvedParams.sku);

  if (!product) return { title: 'Không tìm thấy sản phẩm' };

  return {
    title: `${product.name} | Techstore`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl || ''],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const resolvedParams = await params; 
  const product = await getProductDetail(resolvedParams.sku);

  if (!product) {
    return (
      <div className="text-center mt-20 font-sans">
        <p className="text-2xl font-bold text-red-500 mb-2">Sản phẩm không tồn tại</p>
        <p className="text-gray-500 mb-4">Mã SKU: <span className="font-mono bg-gray-100 p-1 rounded">{resolvedParams.sku}</span></p>
        <Link href="/" className="text-blue-600 hover:underline">&larr; Quay lại trang chủ</Link>
      </div>
    );
  }

  // 3. SEO & AIEO Cấp độ 2: JSON-LD kết hợp Product và FAQPage (rất quan trọng cho AEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        image: product.imageUrl,
        description: product.description,
        sku: product.sku,
        brand: { '@type': 'Brand', name: product.brand },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'VND',
          price: product.price,
          availability: 'https://schema.org/InStock',
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: product.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })) || [],
      }
    ]
  };

  return (
    // Sử dụng thẻ <article> để nhóm một nội dung độc lập, trọn vẹn
    <article className="max-w-5xl mx-auto p-6 font-sans" itemScope itemType="https://schema.org/Product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline font-semibold">&larr; Quay lại</Link>
      </nav>

      {/* Phần 1: Thông tin sản phẩm cốt lõi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden h-80">
          {product.imageUrl ? (
             <img itemProp="image" src={product.imageUrl} alt={product.name} className="object-contain h-full w-full" />
          ) : (
             <span className="text-gray-400">Không có hình ảnh</span>
          )}
        </div>
        
        <div>
          <h1 itemProp="name" className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            SKU: <span itemProp="sku">{product.sku}</span> | Thương hiệu: <span itemProp="brand">{product.brand}</span>
          </p>
          
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="VND" />
            <p itemProp="price" content={product.price} className="text-3xl font-black text-red-600 mb-6">
              {product.price?.toLocaleString('vi-VN')} VNĐ
            </p>
          </div>

          {/* AIEO: Đoạn tóm tắt (TL;DR) giúp SGE hoặc AI dễ dàng trích xuất thông tin nhanh */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
            <h3 className="font-bold text-blue-900 mb-1">Tóm tắt nhanh (TL;DR):</h3>
            <p itemProp="description" className="text-blue-800 leading-relaxed text-sm">
              {product.name} là sản phẩm chính hãng thuộc thương hiệu {product.brand}, hiện đang được bán với giá {product.price?.toLocaleString('vi-VN')} VNĐ.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Mô tả chi tiết:</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </section>

      {/* Phần 2: Cấu trúc FAQ chuẩn Semantic HTML cho AEO */}
      <section className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>🤖</span> Hỏi đáp & Phân tích từ AI
        </h2>
        
        {(!product.faqs || product.faqs.length === 0) ? (
          <p className="text-gray-500 italic">Hệ thống AI đang phân tích dữ liệu kỹ thuật...</p>
        ) : (
          <dl className="space-y-6">
            {product.faqs.map((faq: any, index: number) => (
              <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <dt className="text-lg font-semibold text-blue-800 mb-2 flex gap-2">
                  <span className="text-blue-500 font-bold" aria-hidden="true">Q:</span> 
                  {faq.question}
                </dt>
                <dd className="text-gray-700 leading-relaxed flex gap-2 ml-0">
                  <span className="text-green-500 font-bold" aria-hidden="true">A:</span> 
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* PHẦN 3: Giao diện gọi AI Agent tích hợp n8n */}
      <section className="mt-8 mb-12">
        <ProductFAQ sku={product.sku} />
      </section>

    </article>
  );
}