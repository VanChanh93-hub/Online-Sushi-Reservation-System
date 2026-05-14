"use client";

import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import axios from "axios";

const SushiChatWidget = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động scroll xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat", {
        messages: newMessages,
        customer_id: 1,
      });
      const reply = res.data.reply;
      setMessages([...newMessages, { role: "model", text: reply }]);
    } catch (err) {
      console.error("LỖI:", err);
      setMessages([
        ...newMessages,
        { role: "model", text: "Lỗi khi kết nối đến AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Nút mở chat - Đã nâng cấp */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center group"
          title="Trò chuyện với Sushi AI"
          aria-label="Mở chat"
        >
          <FiMessageCircle
            size={24}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            NEW
          </span>
        </button>
      )}

      {/* Hộp chat - Đã nâng cấp */}
      {isOpen && (
        <div className="w-100 h-[500px] bg-white rounded-xl shadow-2xl border border-orange-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold tracking-wide text-sm">
                Sushi AI Trợ Lý
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-400/30 p-1 rounded-full transition-all duration-200"
              aria-label="Đóng chat"
            >
              <FiX size={18} className="hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-orange-50 to-white">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-orange-100 p-3 rounded-full mb-3">
                  <FiMessageCircle size={24} className="text-orange-500" />
                </div>
                <h3 className="font-medium text-orange-800 mb-1">
                  Xin chào! Tôi là Sushi AI
                </h3>
                <p className="text-xs text-gray-500">
                  Tôi có thể giúp gì cho bạn hôm nay?
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm whitespace-pre-line transition-all duration-200 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md"
                        : "bg-white border border-orange-100 shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-white border border-orange-100 shadow-sm text-sm flex space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Đã nâng cấp */}
          <div className="p-3 border-t border-orange-100 bg-white">
            <div className="relative flex gap-2">
              <input
                type="text"
                placeholder="Bạn muốn ăn gì?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2 text-sm border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                  input.trim()
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                } transition-all duration-200 shadow-sm`}
                aria-label="Gửi tin nhắn"
              >
                <FiSend size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center">
              Sushi AI có thể mắc lỗi. Kiểm tra thông tin quan trọng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SushiChatWidget;
