import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, Trash2, Database, EyeOff, FileText } from "lucide-react";

export const metadata = { 
    title: "Gizlilik Politikası ve KVKK | Vesti",
    description: "Vesti veri gizliliği politikası, KVKK aydınlatma metni ve Neon bulut veritabanı güvenlik önlemleri hakkında detaylı bilgi."
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col pt-16 bg-[#F8F9FA] text-[#37474F]">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
                
                {/* Header */}
                <div className="flex flex-col gap-3 max-w-2xl">
                    <div className="flex items-center gap-2 text-[#7986CB]">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-bold tracking-widest uppercase">Güvenlik ve Uyum</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#29294D]">
                        Kullanıcı Gizliliği ve KVKK
                    </h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Son güncelleme tarihi: 1 Haziran 2026. Vesti platformu olarak verilerinizin güvenliği ve gizliliği bizim için en yüksek önceliktir.
                    </p>
                </div>

                {/* Privacy Topics in Cards */}
                <div className="flex flex-col gap-6">
                    
                    {/* Item 1: Cryptography & Cloud Database */}
                    <div className="bg-white border border-[#E0E3E8] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                        <div className="w-12 h-12 rounded-2xl bg-[#F3F4FD] flex items-center justify-center text-[#7986CB] shrink-0">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#29294D]">1. Şifreleme ve Neon Bulut Veritabanı Güvenliği</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                                Vesti verileriniz, dünya standartlarındaki **Neon PostgreSQL bulut veritabanında** SSL şifrelemeli tünellerle korunarak saklanır. Şifreleriniz sisteme kaydedilirken en güvenli hashing algoritmalarından biri olan **bcrypt** ile şifrelenir ve asla düz metin olarak okunamaz.
                            </p>
                        </div>
                    </div>

                    {/* Item 2: Realtime Database Sync */}
                    <div className="bg-white border border-[#E0E3E8] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FF6F61] shrink-0">
                            <Database className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#29294D]">2. Eşzamanlı Mobil & Web Veri Paylaşımı</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                                Web ve mobil sürümlerimiz ortak bir API katmanı üzerinden çalışır. Android uygulamasında eklediğiniz her bir kıyafet veya konum güncellemesi, güvenlik yetkilendirmesi kontrollerinden (NextAuth JWT session) geçirilerek veritabanına işlenir. Yetkisiz hiçbir sorgunun veritabanına erişmesine izin verilmez.
                            </p>
                        </div>
                    </div>

                    {/* Item 3: Swap & Marketplace Privacy */}
                    <div className="bg-white border border-[#E0E3E8] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                        <div className="w-12 h-12 rounded-2xl bg-[#F3F4FD] flex items-center justify-center text-[#7986CB] shrink-0">
                            <EyeOff className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#29294D]">3. Pazaryeri ve İkinci El Takas Bilgileri</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                                Pazaryerinde paylaştığınız ilanlar tüm ziyaretçiler tarafından incelenebilir ancak doğrudan iletişim kurma, mesaj gönderme veya takas teklifi yapma yetkisi yalnızca doğrulanmış giriş yapmış üyelere aittir. Kendi rızanız dışında e-posta adresiniz veya kişisel iletişim detaylarınız asla ilanlarda sergilenmez.
                            </p>
                        </div>
                    </div>

                    {/* Item 4: Kalıcı Hesap Silme Hakkı */}
                    <div className="bg-white border border-[#E0E3E8] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FF6F61] shrink-0">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-bold text-[#29294D]">4. Kalıcı Olarak Silinme Hakkı (KVKK Uyum)</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                                KVKK kapsamında, dilediğiniz an profilinizi silme hakkına sahipsiniz. Vesti uygulamasındaki hesabınızı sildiğinizde, dolabınızdaki tüm kıyafetler, profil detaylarınız, mesajlaşmalarınız ve ilanlarınız **veritabanından kalıcı olarak (hard-delete) temizlenir** ve geri getirilemeyecek şekilde yok edilir.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Back to Home Link */}
                <div className="flex justify-center mt-4">
                    <Link href="/home" prefetch={true} className="inline-flex items-center gap-2 border border-[#E0E3E8] hover:border-[#7986CB] text-[#29294D] hover:text-[#7986CB] bg-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-full transition-all">
                        Anasayfaya Dön
                    </Link>
                </div>

            </main>

            <Footer />
        </div>
    );
}
