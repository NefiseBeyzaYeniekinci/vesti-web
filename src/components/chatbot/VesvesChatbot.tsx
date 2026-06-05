"use client";

import { useState, useRef } from "react";
import { Bot, X, Send, Sparkles, Image as ImageIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function VesvesChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text?: string, imageUrl?: string, isBot: boolean}[]>([
    { id: 1, text: "Merhaba! Ben Vesves ✨ Kombin önerileri ve tarz tavsiyeleri için buradayım.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateBotResponse = () => {
    setTimeout(() => {
      const mockResponses = [
        "Siyah bir kaban her dolabın vazgeçilmezidir, altına jean ve beyaz sneaker ile harika durur. 🧥",
        "Bu sezon vintage deri ceketler çok moda, dolabında varsa mutlaka değerlendir.",
        "Özel bir davet için bordo veya zümrüt yeşili tonlarında bir elbise seçmeni öneririm. ✨",
        "Bedenine uygun bir jean bulduğunda asla bırakma! Levi's 501 gibi klasik kesimler her zaman kurtarıcıdır.",
        "Katmanlı giyinmek her zaman iyi bir fikirdir — renk uyumuna dikkat et. 🧣",
        "Harika bir parça! Bunu açık renkli bir denim veya nötr tonlarda bir etekle kombinleyebilirsin.",
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: randomResponse, isBot: true }]);
    }, 900);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { id: Date.now(), imageUrl, isBot: false }]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const loadingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: loadingId, text: "Görselini inceliyorum... 🧐", isBot: true }]);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/ai/analyze', { method: 'POST', body: formData });
      const data = await response.json();
      setMessages((prev) =>
        prev.map(msg => msg.id === loadingId
          ? { ...msg, text: data.success ? data.message : "Görseli incelerken bir sorun oluştu." }
          : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map(msg => msg.id === loadingId
          ? { ...msg, text: "Yapay zeka sunucusuna bağlanılamadı. Python API çalışıyor mu? 🔌" }
          : msg
        )
      );
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), text: input, isBot: false }]);
    setInput("");
    simulateBotResponse();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-80 sm:w-96 rounded-2xl overflow-hidden mb-4 flex flex-col"
            style={{
              height: '460px',
              backgroundColor: '#ffffff',
              border: '0.5px solid #E0E3E8',
              boxShadow: '0 8px 40px rgba(41,41,77,0.10)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ backgroundColor: '#29294D', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(121,134,203,0.2)', border: '0.5px solid rgba(121,134,203,0.3)' }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: '#7986CB' }} />
                </div>
                <div>
                  <h3
                    className="leading-tight"
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#ffffff',
                    }}
                  >
                    Vesves
                  </h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em' }}>
                    AI Stil Asistanı
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 hide-scrollbar"
              style={{ backgroundColor: '#F8F9FA' }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className="max-w-[80%] p-3 text-sm overflow-hidden"
                    style={{
                      borderRadius: msg.isBot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                      backgroundColor: msg.isBot ? '#ffffff' : '#7986CB',
                      color: msg.isBot ? '#37474F' : '#ffffff',
                      border: msg.isBot ? '0.5px solid #E0E3E8' : 'none',
                      fontSize: '13px',
                      lineHeight: 1.55,
                    }}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg mb-2 object-cover"
                        style={{ maxHeight: '180px' }}
                      />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              className="p-3"
              style={{ backgroundColor: '#ffffff', borderTop: '0.5px solid #E0E3E8' }}
            >
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: '#607080' }}
                  title="Görsel Yükle"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Vesves'e bir şey sor..."
                  className="flex-1 text-sm rounded-full px-4 py-2 focus:outline-none transition-all"
                  style={{
                    backgroundColor: '#F8F9FA',
                    border: '0.5px solid #E0E3E8',
                    color: '#37474F',
                    fontSize: '13px',
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity disabled:opacity-40 shrink-0"
                  style={{ backgroundColor: '#7986CB', color: '#ffffff' }}
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Toggle Butonu */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full flex items-center justify-center transition-all"
        style={{
          width: '52px',
          height: '52px',
          backgroundColor: '#29294D',
          color: '#7986CB',
          border: '0.5px solid rgba(121,134,203,0.3)',
          boxShadow: '0 4px 20px rgba(41,41,77,0.25)',
        }}
      >
        {isOpen ? <X className="w-5 h-5" style={{ color: 'white' }} /> : <Bot className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}
