"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Thêm thư viện này

export default function ProductFAQ({ sku }: { sku: string }) {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleAskAI = async () => {
    setLoading(true);
    setAiResponse(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      
      const response = await fetch(`${apiUrl}/api/products/ask-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku: sku }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gọi Backend");
      }

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
    <div className="mt-8 p-6 border rounded-xl bg-gray-50 shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Hỏi đáp với Chuyên gia AI</h3>
      
      <p className="text-gray-600 mb-6">
        Bạn có thắc mắc về sản phẩm này? Hãy để AI của Techstore phân tích thông số và tư vấn cho bạn.
      </p>

      <button 
        onClick={handleAskAI} 
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-sm"
      >
        {loading ? "AI Đang suy nghĩ..." : "Tư vấn sản phẩm này"}
      </button>

      {/* Vùng hiển thị câu trả lời đã được Render Markdown */}
      {aiResponse && (
        <div className="mt-6 p-6 bg-white border border-blue-100 rounded-lg shadow-inner">
          <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span>✨</span> AI Tư vấn:
          </h4>
          
          <div className="text-gray-700 leading-relaxed">
            <ReactMarkdown
              components={{
                // Cấu hình custom CSS cho từng thẻ HTML sinh ra từ Markdown
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-3 text-gray-900" {...props} />,
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="" {...props} />,
                hr: ({node, ...props}) => <hr className="my-6 border-gray-200" {...props} />,
              }}
            >
              {aiResponse}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}