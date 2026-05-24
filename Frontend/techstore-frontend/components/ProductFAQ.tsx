"use client"; // Bắt buộc phải có dòng này ở đầu file cho các component có tương tác

import { useState } from 'react';

// Nhận sku từ trang cha (page.tsx) truyền xuống
export default function ProductFAQ({ sku }: { sku: string }) {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleAskAI = async () => {
    setLoading(true);
    setAiResponse(null); // Reset lại câu trả lời cũ (nếu có)

    try {
      // Gọi API Backend Spring Boot (Nhớ đổi URL này khi deploy lên Render)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      
      const response = await fetch(`${apiUrl}/api/products/ask-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku: sku }), // Gửi mã SKU sang cho Backend
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gọi Backend");
      }

      // Nhận kết quả từ Backend (do n8n trả về)
      const data = await response.text(); 
      setAiResponse(data);

    } catch (error) {
      console.error("Lỗi:", error);
      setAiResponse("Xin lỗi, AI hiện đang bận. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 border rounded-lg bg-gray-50 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Hỏi đáp với Chuyên gia AI</h3>
      
      <p className="text-gray-600 mb-4">
        Bạn có thắc mắc về sản phẩm này? Hãy để AI của Techstore phân tích thông số và tư vấn cho bạn.
      </p>

      <button 
        onClick={handleAskAI} 
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? "AI Đang suy nghĩ..." : "Tư vấn sản phẩm này"}
      </button>

      {/* Vùng hiển thị câu trả lời của AI */}
      {aiResponse && (
        <div className="mt-6 p-4 bg-white border border-blue-200 rounded-md shadow-inner">
          <h4 className="font-semibold text-blue-800 mb-2">AI Trả lời:</h4>
          {/* whitespace-pre-wrap giúp hiển thị đúng dấu xuống dòng của AI */}
          <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
        </div>
      )}
    </div>
  );
}