import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shirt, Smartphone, Sparkles, Shield, ArrowRight, Heart } from "lucide-react";

export const metadata = {
    title: "Hakkımızda & Misyonumuz | Vesti",
    description: "Vesti'nin sürdürülebilir moda misyonu, yapay zeka destekli gardırop hedefleri ve mobil entegrasyonu hakkında bilgi alın."
};

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col pt-16 bg-[#F8F9FA] text-[#37474F]">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
                
                {/* Hero Section */}
                <div className="relative rounded-3xl bg-[#29294D] text-white p-8 sm:p-12 overflow-hidden shadow-xl">
                    <div className="absolute top-[-50px] right-[-50px] w-72 h-72 rounded-full bg-[#7986CB]/10 pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl flex flex-col gap-4">
                        <span className="text-xs font-bold tracking-wider text-[#7986CB] uppercase">Biz Kimiz?</span>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                            Gardırobuna Değer Katan Akıllı Bir Moda Hareketi
                        </h1>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
                            Vesti, giyilmeyen kıyafetleri dijitalleştirerek onlara hak ettikleri değeri yeniden kazandırmayı hedefleyen, yapay zeka destekli ve sürdürülebilirlik odaklı yeni nesil bir moda platformudur.
                        </p>
                    </div>
                </div>

                {/* Core Mission Columns */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Mission Card 1: AI Closet */}
                    <div className="bg-white border border-[#E0E3E8] rounded-3xl p-8 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                        <div className="w-12 h-12 rounded-2xl bg-[#F3F4FD] flex items-center justify-center text-[#7986CB]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#29294D] mb-2">Yapay Zeka Destekli Akıllı Gardırop</h2>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                Vesti, giysilerinizi fotoğraflayarak renk, kategori ve tarz bilgilerini otomatik olarak algılar. Konumunuzdaki anlık hava durumunu analiz ederek, dolabınızdaki en uyumlu ve şık parçalardan oluşan günlük kombin önerilerini saniyeler içinde karşınıza çıkarır.
                            </p>
                        </div>
                    </div>

                    {/* Mission Card 2: Sustainability */}
                    <div className="bg-white border border-[#E0E3E8] rounded-3xl p-8 flex flex-col gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FF6F61]">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#29294D] mb-2">Sürdürülebilir ve Bilinçli Moda</h2>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                Dünyada her yıl milyonlarca tekstil ürünü çöpe gidiyor. Vesti olarak amacımız, dolabınızın köşesinde unutulan kıyafetleri tekrar aktif kombinlerinize katarak kullanım ömürlerini uzatmak, tüketim çılgınlığını azaltmak ve doğayı korumaktır.
                            </p>
                        </div>
                    </div>

                </section>

                {/* Mobile App Sync Feature Banner */}
                <section className="bg-gradient-to-br from-[#F3F4FD] to-[#ECEEFA] border border-[#E0E3E8] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                    <div className="flex flex-col gap-4 max-w-xl">
                        <div className="flex items-center gap-2 text-[#7986CB]">
                            <Smartphone className="w-5 h-5" />
                            <span className="text-xs font-bold tracking-widest uppercase">Dolabın Cebinde!</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#29294D] tracking-tight">
                            Android Mobil Uygulamamız ve Kusursuz Senkronizasyon
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            Vesti Android uygulamamız sayesinde gardırobunuzu saniyeler içinde fotoğraflayıp buluta yükleyebilir, dışarıdayken konum bazlı hava durumu değişimlerine göre anlık kombin tavsiyesi bildirimleri alabilirsiniz. Telefonunuzdan eklediğiniz her parça, web panelinizde ve veritabanınızda anında güncellenir.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                        <div className="bg-white border border-[#E0E3E8] rounded-2xl p-4 flex items-center gap-4">
                            <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#29294D]">%100 Eşzamanlı Veritabanı</span>
                                <span className="text-[11px] text-gray-450 font-medium">PostgreSQL Bulut Altyapısı</span>
                            </div>
                        </div>
                        <div className="bg-white border border-[#E0E3E8] rounded-2xl p-4 flex items-center gap-4">
                            <Shirt className="w-5 h-5 text-[#7986CB] shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#29294D]">Yapay Zeka Destekli Etiketleme</span>
                                <span className="text-[11px] text-gray-450 font-medium">Mobil Kamera Analizi</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Goals Timeline */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-[#29294D] tracking-tight text-center sm:text-left">Hedeflerimiz</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 flex flex-col gap-3">
                            <span className="text-3xl font-extrabold text-[#7986CB]">01</span>
                            <h3 className="text-base font-bold text-[#29294D]">Sıfır Kıyafet İsrafı</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                Her kıyafeti aktif olarak dolap kombinlerine katarak tekstil israfının önüne geçmeyi amaçlıyoruz.
                            </p>
                        </div>
                        <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 flex flex-col gap-3">
                            <span className="text-3xl font-extrabold text-[#FF6F61]">02</span>
                            <h3 className="text-base font-bold text-[#29294D]">Akıllı Takas Kültürü</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                İkinci el pazaryerimizde gereksiz para harcamadan güvenli takas (swap) imkanı sağlıyoruz.
                            </p>
                        </div>
                        <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 flex flex-col gap-3">
                            <span className="text-3xl font-extrabold text-[#7986CB]">03</span>
                            <h3 className="text-base font-bold text-[#29294D]">Gelişmiş AI Analizi</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                Stil profilinizi öğrenen asistanımızla kişisel tarzınızı her gün yeniden tanımlıyoruz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call To Action */}
                <div className="text-center py-6">
                    <Link href="/login" prefetch={true} className="inline-flex items-center gap-2 bg-[#7986CB] hover:bg-[#6C75BD] text-white font-bold text-sm tracking-wide uppercase px-8 py-3.5 rounded-full transition-all shadow-md">
                        Hemen Bize Katıl
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </main>

            <Footer />
        </div>
    );
}
