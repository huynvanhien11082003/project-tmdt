import React from 'react';

// Định nghĩa kiểu dữ liệu cho câu hỏi
interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Máy này có phù hợp để sinh viên IT chạy Docker và máy ảo không?",
    answer: "Có, máy được trang bị RAM 16GB và CPU đa nhân thế hệ mới nhất, đáp ứng rất tốt việc chạy nhiều container cùng lúc một cách mượt mà."
  },
  {
    question: "Thời lượng pin thực tế của máy là bao nhiêu?",
    answer: "Trong điều kiện lập trình và lướt web thông thường, máy có thể hoạt động liên tục từ 6 đến 8 tiếng nhờ chip tiết kiệm điện năng."
  }
];

export default function ProductFAQ() {
  return (
    <section className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Câu hỏi thường gặp (Tối ưu AIEO)</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-4 last:border-0">
            <p className="font-semibold text-lg text-blue-700">Hỏi: {faq.question}</p>
            <p className="text-gray-700 mt-2">Đáp: {faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}