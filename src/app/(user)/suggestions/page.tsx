'use client';

import { useCallback, useEffect, useState } from 'react';
import { Suggestion } from '@/lib/api/ai';
import { WeatherWidget } from '@/components/suggestions/WeatherWidget';
import { OutfitSuggestionCard } from '@/components/suggestions/OutfitSuggestionCard';
import { useClientLanguage } from '@/lib/i18n/client';
import Link from 'next/link';
import { Shirt } from 'lucide-react';

import { toast } from 'sonner';

export default function SuggestionsPage() {
    const language = useClientLanguage();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Istanbul");

    const cityOptions = [
        "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
        "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu",
        "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
        "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
        "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "Istanbul", "Izmir",
        "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya",
        "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
        "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
        "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
        "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
        "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
        "Kilis", "Osmaniye", "Düzce",
    ].sort();

    const t = {
        title: language === "en" ? "Outfit Suggestions" : "Kombin Önerileri",
        subtitle: language === "en"
            ? "Ready-to-wear daily suggestions based on weather and style."
            : "Hava durumuna ve tarzina uygun, gunluk kullanima hazir oneriler.",
        picks: language === "en" ? "Selected For You" : "Senin İçin Seçtiklerimiz",
        refresh: language === "en" ? "Refresh Suggestions" : "Önerileri Yenile",
        cityAria: language === "en" ? "Select city" : "Il sec",
        pendingFeature: language === "en" ? "This feature will be available soon." : "Bu özellik yakında aktif olacak.",
    };

    const loadSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/suggestions?temp=20&condition=Clouds&city=${encodeURIComponent(selectedCity)}`);
            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    setSuggestions(json.data);
                    setIsEmpty(!!json.isEmpty);
                }
            }
        } catch (error) {
            console.error('Kombin önerileri alınamadı:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedCity]);

    useEffect(() => {
        loadSuggestions();
    }, [loadSuggestions]);

    const handleGenerateSimilar = async (id: string) => {
        console.log(`Buna benzer yeni bir id isteniyor: ${id}`);
        toast.info(t.pendingFeature);
    };

    return (
        <div className="space-y-6">
            {/* Header — editoryal koyu lacivert geniş stil */}
            <div 
                style={{
                    background: '#29294D',
                    borderRadius: '24px',
                    padding: '36px 40px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    boxShadow: '0 12px 40px rgba(41, 41, 77, 0.12)',
                    border: '0.5px solid rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#7986CB] opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500 opacity-5 rounded-full blur-2xl"></div>

                {/* Sol: Başlık ve Açıklama */}
                <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                    <p style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                    }}>
                        {t.title}
                    </p>
                    <h1 style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        fontSize: 'clamp(20px, 2.8vw, 28px)',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        margin: 0,
                        maxWidth: '90%',
                    }}>
                        {t.subtitle}
                    </h1>
                </div>

                {/* Sağ: Hava durumu widget (geniş, entegre ve yazısız) */}
                <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                    <WeatherWidget city={selectedCity} />
                </div>
            </div>

            {/* AI Suggestions */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">{t.picks}</h2>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-vesti-primary focus:border-vesti-primary outline-none"
                            aria-label={t.cityAria}
                        >
                            {cityOptions.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <button
                            disabled={loading}
                            onClick={loadSuggestions}
                            className="h-10 px-4 rounded-xl bg-vesti-primary/10 text-sm text-vesti-primary font-semibold hover:bg-vesti-primary hover:text-white transition-all disabled:opacity-50"
                        >
                            {t.refresh}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm h-64 animate-pulse">
                                <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-2/3 bg-gray-100 rounded mb-6"></div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="aspect-square bg-gray-100 rounded-2xl"></div>
                                    <div className="aspect-square bg-gray-100 rounded-2xl"></div>
                                    <div className="aspect-square bg-gray-100 rounded-2xl"></div>
                                    <div className="aspect-square bg-gray-100 rounded-2xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isEmpty || suggestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 py-16 bg-[#F8F9FA] rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                            <Shirt className="w-8 h-8 text-[#7986CB]" />
                        </div>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#29294D',
                            marginBottom: '8px'
                        }}>
                            {language === 'en' ? 'No Outfit Suggestions' : 'Kombin Önerisi Oluşturulamadı'}
                        </h3>
                        <p style={{
                            fontSize: '13.5px',
                            color: '#607080',
                            maxWidth: '440px',
                            lineHeight: 1.5,
                            marginBottom: '20px'
                        }}>
                            {language === 'en' 
                                ? 'We cannot prepare custom outfit suggestions for you because there are no clothes in your wardrobe yet. Add clothes to your wardrobe now to discover your first AI-powered outfit!'
                                : 'Dolabınızda henüz kıyafet bulunmadığı için size özel kombin önerileri hazırlayamıyoruz. Hemen gardırobunuza kıyafet ekleyerek yapay zeka destekli ilk kombininizi keşfedin!'}
                        </p>
                        <Link href="/wardrobe">
                            <button style={{
                                padding: '10px 24px',
                                fontSize: '13px',
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                backgroundColor: '#7986CB',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s',
                            }}>
                                {language === 'en' ? 'Add Clothes' : 'Kıyafet Ekle'}
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {suggestions.map((suggestion) => (
                            <OutfitSuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onGenerateSimilar={handleGenerateSimilar}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
