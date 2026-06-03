"use client";

import React from "react";
import { Send } from "lucide-react";

export function ContactForm() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Mesajınız başarıyla Vesti ekibine iletildi! En kısa sürede dönüş sağlayacağız.");
    };

    return (
        <div className="md:col-span-2 bg-white border border-[#E0E3E8] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-[#29294D]">Mesaj Gönderin</h2>
                <p className="text-xs text-gray-400 font-medium">Lütfen bilgilerinizi eksiksiz doldurarak talebinizi iletiniz.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Adınız Soyadınız</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Örn: Nefise Beyza" 
                            className="px-4 py-2.5 rounded-xl border border-[#E0E3E8] text-sm focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 font-medium transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">E-Posta Adresiniz</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="Örn: nefise@example.com" 
                            className="px-4 py-2.5 rounded-xl border border-[#E0E3E8] text-sm focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 font-medium transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Konu</label>
                    <input 
                        type="text" 
                        required 
                        placeholder="Neden yazıyorsunuz? (Örn: Mobil Senkronizasyon Sorunu)" 
                        className="px-4 py-2.5 rounded-xl border border-[#E0E3E8] text-sm focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 font-medium transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mesajınız</label>
                    <textarea 
                        rows={4} 
                        required 
                        placeholder="Bize detaylıca açıklayın..." 
                        className="px-4 py-2.5 rounded-xl border border-[#E0E3E8] text-sm focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 font-medium transition-all resize-none"
                    />
                </div>

                <button 
                    type="submit" 
                    className="flex items-center justify-center gap-2 py-3 bg-[#7986CB] hover:bg-[#6C75BD] text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer border-none"
                >
                    <Send className="w-4 h-4" />
                    Gönder
                </button>
            </form>
        </div>
    );
}
