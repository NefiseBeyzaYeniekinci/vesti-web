import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
    title: "İletişim & Canlı Destek | Vesti",
    description: "Vesti ekibine ulaşın, destek talebi oluşturun veya Gaziantep merkez AR-GE ofisi adres bilgilerimizi inceleyin."
};

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col pt-16 bg-[#F8F9FA] text-[#37474F]">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">
                
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
                    <span className="text-xs font-bold tracking-widest text-[#7986CB] uppercase">Bize Ulaşın</span>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#29294D]">
                        İletişim & Canlı Destek
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                        Bir sorunuz, geri bildiriminiz veya iş birliği öneriniz mi var? Aşağıdaki kanallardan veya iletişim formundan bizimle anında irtibata geçebilirsiniz.
                    </p>
                </div>

                {/* Grid layout: Info & Form */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left: Contact Info Channels */}
                    <div className="md:col-span-1 flex flex-col gap-5">
                        
                        {/* Channel 1: Email */}
                        <div className="bg-white border border-[#E0E3E8] rounded-2xl p-6 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                            <div className="w-10 h-10 rounded-xl bg-[#F3F4FD] flex items-center justify-center text-[#7986CB] shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#29294D] uppercase tracking-wider mb-0.5">E-Posta</span>
                                <a href="mailto:destek@vesti.app" className="text-sm text-gray-600 hover:text-[#7986CB] font-semibold transition-colors">
                                    destek@vesti.app
                                </a>
                                <span className="text-[11px] text-gray-400 font-medium mt-0.5">24 saat içinde yanıt verilir.</span>
                            </div>
                        </div>

                        {/* Channel 2: Address */}
                        <div className="bg-white border border-[#E0E3E8] rounded-2xl p-6 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#FF6F61] shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#29294D] uppercase tracking-wider mb-0.5">AR-GE Ofisimiz</span>
                                <span className="text-sm text-gray-650 font-semibold leading-normal">
                                    Gaziantep Teknopark,<br />Ofis No: B-14, Gaziantep
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium mt-1">Türkiye</span>
                            </div>
                        </div>

                        {/* Channel 3: Hours */}
                        <div className="bg-white border border-[#E0E3E8] rounded-2xl p-6 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                            <div className="w-10 h-10 rounded-xl bg-[#F3F4FD] flex items-center justify-center text-[#7986CB] shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#29294D] uppercase tracking-wider mb-0.5">Çalışma Saatleri</span>
                                <span className="text-sm text-gray-650 font-semibold">
                                    Pazartesi - Cuma
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium">09:00 - 18:00</span>
                            </div>
                        </div>

                    </div>

                    {/* Right: Contact Form */}
                    <ContactForm />

                </section>

                {/* VesVes Chatbot Callout Banner */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                        <MessageSquare className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                            7/24 Canlı Stil ve Teknik Desteği: VesVes Chatbot
                        </h3>
                        <p className="text-xs sm:text-sm text-emerald-850 leading-relaxed font-semibold">
                            Giriş yapmış olan tüm kullanıcılarımız, web ve mobil arayüzümüzde sağ alt köşede bulunan **VesVes Yapay Zeka Desteği** sayesinde anında hem teknik konularda canlı destek alabilir hem de giysileri için eşsiz kombin tavsiyeleri üretebilir. Destek bileti açmadan önce Vesves'e danışmayı unutmayın!
                        </p>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
