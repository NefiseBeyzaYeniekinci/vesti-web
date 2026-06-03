import Link from "next/link";
import { Sun, Cloud, CloudRain, Snowflake, MapPin, ArrowRight, Shirt, Star } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getWeatherByCity } from "@/lib/api/weather";

/* ─── Yardımcı: hava durumu ikonu ─── */
function getWeatherIcon(main: string, size = "w-5 h-5") {
    switch (main) {
        case "Clear":       return <Sun className={`${size}`} style={{ color: '#C9A96E' }} />;
        case "Rain":
        case "Drizzle":
        case "Thunderstorm": return <CloudRain className={`${size} text-blue-400`} />;
        case "Snow":        return <Snowflake className={`${size} text-sky-300`} />;
        default:            return <Cloud className={`${size}`} style={{ color: '#888780' }} />;
    }
}

/* ─── Yardımcı: hava durumuna göre kombin önerileri ─── */
function getOutfitSuggestions(temp: number, weatherMain: string, language: string) {
    const isHot = temp > 25;
    const isWarm = temp > 15 && temp <= 25;
    const isCold = temp <= 15;
    const isRainy = ["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain);

    if (isRainy) {
        return [
            {
                id: 1,
                title: language === "en" ? "Rainy Day Outfit" : "Yağmurlu Gün Kombini",
                tag: language === "en" ? "Rain" : "Yağmur",
                description: language === "en"
                    ? "Rain is expected. Don't forget your waterproof outerwear!"
                    : "Yağmur bekleniyor. Su geçirmez bir dış giysi ile çıkmayı unutma!",
                outfitImage: "https://images.unsplash.com/photo-1519635694798-b2f7e0c0f785?q=80&w=600&auto=format&fit=crop",
            },
            {
                id: 2,
                title: language === "en" ? "Cozy Indoor Day" : "Konforlu Kapalı Gün",
                tag: language === "en" ? "Cozy" : "Rahat",
                description: language === "en"
                    ? "A comfortable and stylish choice for an indoor day."
                    : "Ev günü için rahat ve şık bir tercihin olabilir.",
                outfitImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop",
            },
        ];
    }

    if (isHot) return [
        {
            id: 1,
            title: language === "en" ? "Hot Day Outfit" : "Sıcak Gün Kombini",
            tag: language === "en" ? "Summer" : "Yaz",
            description: language === "en"
                ? `It's ${Math.round(temp)}°C! Breathable fabrics are ideal today.`
                : `${Math.round(temp)}°C derece var! Nefes alan ince kumaşlar bugün için ideal.`,
            outfitImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: 2,
            title: language === "en" ? "Summer Casual" : "Yazlık Casual",
            tag: language === "en" ? "Casual" : "Günlük",
            description: language === "en"
                ? "A light dress or linen pants can be your savior in this heat."
                : "Hafif bir elbise veya keten pantolon bu sıcakta kurtarıcın olabilir.",
            outfitImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: 3,
            title: language === "en" ? "Beach Chic" : "Plaj Şıklığı",
            tag: language === "en" ? "Beach" : "Plaj",
            description: language === "en"
                ? "Don't forget your sunscreen — shorts and sandals are the perfect pair."
                : "Güneş kremini unutma — şort ve sandalet mükemmel ikilisi.",
            outfitImage: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=600&auto=format&fit=crop",
        },
    ];

    if (isWarm) return [
        {
            id: 1,
            title: language === "en" ? "Spring Outfit" : "Bahar Kombini",
            tag: language === "en" ? "Spring" : "İlkbahar",
            description: language === "en"
                ? `${Math.round(temp)}°C warm weather — a light jacket might be a good idea.`
                : `${Math.round(temp)}°C ılık hava — ince bir ceket iyi fikir olabilir.`,
            outfitImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: 2,
            title: language === "en" ? "Daily Chic" : "Günlük Şıklık",
            tag: language === "en" ? "Chic" : "Şık",
            description: language === "en"
                ? "A blazer and plain pants combination suits any environment."
                : "Blazer ceket ve düz pantolon kombinasyonu her ortama uygun.",
            outfitImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
        },
    ];

    if (isCold) return [
        {
            id: 1,
            title: language === "en" ? "Cold Weather Layering" : "Soğuk Hava Katmanlama",
            tag: language === "en" ? "Winter" : "Kış",
            description: language === "en"
                ? `${Math.round(temp)}°C cold! Take out your thick coat and layer up.`
                : `${Math.round(temp)}°C soğuk! Kalın kabanını çıkar, katmanlı giy.`,
            outfitImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: 2,
            title: language === "en" ? "Winter Chic" : "Kışlık Şıklık",
            tag: language === "en" ? "Cozy" : "Sıcacık",
            description: language === "en"
                ? "A thick knit sweater + dark pants combination always works."
                : "Kalın örgü kazak + koyu pantolon kombinasyonu her zaman işe yarar.",
            outfitImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        },
    ];

    return [];
}

/* ─── Mock marketplace ürünleri ─── */
const mockMarketplaceItems = [
    {
        id: 101,
        name: "H&M Keten Pantolon",
        price: "250 TL",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
        matchPct: 95,
    },
    {
        id: 102,
        name: "Zara Basic Tişört",
        price: "150 TL",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        matchPct: 89,
    },
    {
        id: 103,
        name: "Vintage Deri Çanta",
        price: "400 TL",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
        matchPct: 82,
    },
    {
        id: 104,
        name: "Nike Air Max 97",
        price: "1.200 TL",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        matchPct: 91,
    },
];

import { cookies } from "next/headers";

/* ─── Yardımcı: Dolap Analizi Renk Hex Eşlemesi ─── */
function getColorHex(colorName: string | null | undefined): string {
    if (!colorName) return "#E0E3E8";
    const name = colorName.trim().toLowerCase();
    switch (name) {
        case 'beyaz':      return '#FFFFFF';
        case 'mavi':       return '#5E97F6';
        case 'siyah':      return '#1E1E1E';
        case 'kırmızı':    return '#EF4444';
        case 'bej':        return '#E1D4C0';
        case 'lacivert':   return '#29294D';
        case 'gri':        return '#8E9AA6';
        case 'kahverengi': return '#8B5A2B';
        case 'yeşil':      return '#4CAF50';
        case 'sarı':       return '#FFEB3B';
        case 'turuncu':    return '#FF9800';
        case 'pembe':      return '#E91E63';
        case 'mor':        return '#9C27B0';
        case 'bordo':      return '#722F37';
        default:           return '#D0D3D8';
    }
}

/* ─── Yardımcı: Dolap Analizi Seviye Belirleme ─── */
function getWardrobeLevel(count: number, lang: string): string {
    if (lang === 'en') {
        if (count >= 15) return "Wardrobe Curator: Pro";
        if (count >= 5)  return "Fashion Lover: Intermediate";
        return "Outfit Prep: Beginner";
    } else {
        if (count >= 15) return "Gardırop Küratörü: İleri Seviye";
        if (count >= 5)  return "Moda Sever: Orta Seviye";
        return "Kombin Hazırlığı: Başlangıç";
    }
}

/* ─── Yardımcı: Kategori Adını Formatlama ─── */
function formatCategory(categoryName: string | null | undefined, lang: string): string {
    if (!categoryName) return lang === 'en' ? 'T-Shirt' : 'Tişört';
    const name = categoryName.trim().toUpperCase();
    if (lang === 'en') {
        switch (name) {
            case 'GÖMLEK':    return 'Shirt';
            case 'DIŞ GİYİM': return 'Outerwear';
            case 'PANTOLON':  return 'Pants';
            case 'AYAKKABI':  return 'Shoes';
            case 'ELBISE':    return 'Dress';
            case 'AKSESUAR':  return 'Accessory';
            default:          return categoryName.charAt(0) + categoryName.slice(1).toLowerCase();
        }
    } else {
        switch (name) {
            case 'GÖMLEK':    return 'Gömlek';
            case 'DIŞ GİYİM': return 'Dış Giyim';
            case 'PANTOLON':  return 'Pantolon';
            case 'AYAKKABI':  return 'Ayakkabı';
            case 'ELBISE':    return 'Elbise';
            case 'AKSESUAR':  return 'Aksesuar';
            default:          return categoryName.charAt(0) + categoryName.slice(1).toLowerCase();
        }
    }
}

interface HomeWardrobeItem {
    id: string;
    name: string;
    brand: string | null;
    size: string | null;
    imageUrl: string | null;
}

interface ColorGroup {
    color: string | null;
    _count: {
        color: number;
    };
}

interface CategoryGroup {
    category: string;
    _count: {
        category: number;
    };
}

export default async function HomePage() {
    const session = await auth();
    const userId = session?.user?.id;

    const cookieStore = cookies();
    const language = cookieStore.get("vesti-lang")?.value === "en" ? "en" : "tr";
    const firstName = session?.user?.name?.split(" ")[0] ?? null;

    const t = {
        greeting:    language === "en" ? "Good day" : "İyi günler",
        heroSub:     language === "en" ? "Today, the most harmonious pieces in your wardrobe are curated for you. Have a wonderful day! ✨" : "Bugün dolabındaki en uyumlu parçalar senin için seçildi; gününün harika geçmesi dileğiyle. ✨",
        outfitTitle: language === "en" ? "Outfit Suggestions by Weather" : "Hava Durumuna Göre Kombin",
        wardrobeBtn: language === "en" ? "Explore Wardrobe" : "Gardırobuma Git",
        marketTitle: language === "en" ? "Curated for Your Style" : "Tarzına Özel Seçimler",
        viewAll:     language === "en" ? "View All" : "Tümünü Gör",
        inspect:     language === "en" ? "Inspect" : "İncele",
        match:       language === "en" ? "match" : "eşleşme",
        // New translations
        recentTitle: language === "en" ? "Recently Added Pieces" : "Son Eklenen Parçalar",
        analysisTitle: language === "en" ? "Wardrobe Analysis" : "Dolabının Analizi",
        inspirationTitle: language === "en" ? "TODAY'S INSPIRATION" : "BUGÜNÜN İLHAMI",
    };

    let cityCode = "Istanbul";
    let lastAdded: HomeWardrobeItem[] = [];
    let totalCount = 0;
    let colorGroups: ColorGroup[] = [];
    let categoryGroups: CategoryGroup[] = [];

    if (userId) {
        try {
            // Run all user queries in parallel for peak performance
            const [user, items, count, colors, categories] = await Promise.all([
                prisma.user.findUnique({
                    where: { id: userId },
                    select: { location: true },
                }),
                prisma.wardrobeItem.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                }),
                prisma.wardrobeItem.count({
                    where: { userId },
                }),
                prisma.wardrobeItem.groupBy({
                    by: ['color'],
                    where: { userId, NOT: { color: null } },
                    _count: { color: true },
                    orderBy: { _count: { color: 'desc' } },
                    take: 4,
                }),
                prisma.wardrobeItem.groupBy({
                    by: ['category'],
                    where: { userId },
                    _count: { category: true },
                    orderBy: { _count: { category: 'desc' } },
                    take: 1,
                }),
            ]);

            if (user?.location) cityCode = user.location.split(',')[0].trim();
            lastAdded = items;
            totalCount = count;
            colorGroups = colors;
            categoryGroups = categories;
        } catch (error) {
            console.error("Home page DB query error:", error);
        }
    }

    // Set up display data with gorgeous mock fallbacks to match UX prototype screenshots
    const fallbackLastAdded = [
        {
            id: 'mock-1',
            name: language === 'en' ? 'Sneakers' : 'Sneaker',
            brand: 'Nike',
            size: '42',
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
        },
        {
            id: 'mock-2',
            name: language === 'en' ? 'Shirt' : 'Gömlek',
            brand: 'LCW',
            size: 'M',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'
        },
        {
            id: 'mock-3',
            name: language === 'en' ? 'Leather Jacket' : 'Deri Ceket',
            brand: 'Mango',
            size: 'L',
            imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
        }
    ];
    const displayLastAdded = lastAdded;

    const defaultColors = [
        { color: 'Beyaz', _count: { color: 1 } },
        { color: 'Mavi', _count: { color: 1 } },
        { color: 'Siyah', _count: { color: 1 } },
        { color: 'Kırmızı', _count: { color: 1 } }
    ];
    const displayColors = [...colorGroups];
    while (displayColors.length < 4) {
        const nextDefault = defaultColors.find(d => !displayColors.some(x => x.color?.toLowerCase() === d.color.toLowerCase()));
        if (nextDefault) {
            displayColors.push(nextDefault);
        } else {
            break;
        }
    }

    const weather    = await getWeatherByCity(cityCode, language);
    const temp       = weather.main.temp;
    const weatherMain = weather.weather[0]?.main ?? "Clear";
    const weatherDesc = weather.weather[0]?.description ?? "";
    const kombins    = getOutfitSuggestions(temp, weatherMain, language);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '64px' }}>

            {/* ══════════════════════════════════════════
                HERO SECTION — koyu, editoryal
            ══════════════════════════════════════════ */}
            <div
                style={{
                    position: 'relative',
                    backgroundColor: '#29294D',
                    borderRadius: '16px',
                    padding: '40px 44px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '24px',
                    minHeight: '180px',
                }}
            >
                {/* Dekoratif daire — sağ üst */}
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(121,134,203,0.12)',
                    pointerEvents: 'none',
                }} />

                {/* Sol: selamlama + alt başlık */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                    }}>
                        {language === 'en' 
                            ? `GOOD DAY${firstName ? `, ${firstName.toUpperCase()}` : ''}`
                            : `İYİ GÜNLER${firstName ? `, ${firstName.toLocaleUpperCase('tr-TR')}` : ''}`}
                    </p>
                    <h1 style={{
                        fontSize: 'clamp(20px, 3vw, 32px)',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        margin: 0,
                        maxWidth: '90%',
                    }}>
                        {t.heroSub}
                    </h1>
                </div>

                {/* Sağ: hava durumu widget */}
                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {getWeatherIcon(weatherMain, "w-6 h-6")}
                        <span style={{
                            fontSize: 'clamp(40px, 7vw, 68px)',
                            fontWeight: 700,
                            color: '#7986CB',
                            lineHeight: 1,
                            letterSpacing: '-0.03em',
                        }}>
                            {Math.round(temp)}°
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.3)' }} />
                        <span style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.4)',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            {cityCode.toLocaleUpperCase('tr-TR')} · {weatherDesc.toLocaleUpperCase('tr-TR')}
                        </span>
                    </div>
                </div>
            </div>


            {/* ══════════════════════════════════════════
                SON EKLENEN PARÇALAR
            ══════════════════════════════════════════ */}
            <section>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{
                        fontSize: 'clamp(20px, 3vw, 24px)',
                        fontWeight: 600,
                        color: '#1a1a18',
                        margin: 0,
                    }}>
                        {t.recentTitle}
                    </h2>
                    <Link
                        href="/wardrobe"
                        prefetch={true}
                        style={{
                            fontSize: '13px',
                            color: '#7986CB',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {t.viewAll}
                        <ArrowRight style={{ width: '13px', height: '13px' }} />
                    </Link>
                </div>

                {/* Horizontal list of items or Empty State */}
                {displayLastAdded.length > 0 ? (
                    <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {displayLastAdded.map((item) => (
                            <Link key={item.id} href={`/wardrobe`} prefetch={true} style={{ textDecoration: 'none' }}>
                                <div
                                    className="vesti-card"
                                    style={{ minWidth: '180px', width: '180px', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
                                >
                                    <div style={{ height: '200px', position: 'relative', overflow: 'hidden', backgroundColor: '#E8E6E0' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        {item.size && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '10px',
                                                left: '10px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                                color: '#ffffff',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                backdropFilter: 'blur(4px)',
                                                letterSpacing: '0.02em'
                                            }}>
                                                {item.size}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '12px 14px' }}>
                                        <h3 style={{
                                            fontSize: '13.5px',
                                            fontWeight: 600,
                                            color: '#1a1a18',
                                            margin: '0 0 3px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '11.5px',
                                            color: '#888780',
                                            margin: 0
                                        }}>
                                            {item.brand || "Vesti"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div 
                        style={{
                            border: '0.5px dashed #E0E3E8',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '32px 20px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.01)'
                        }}
                    >
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#F3F4FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Shirt className="w-5 h-5 text-[#7986CB]" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#29294D', margin: 0 }}>
                                Dolabınız Henüz Boş
                            </h4>
                            <p style={{ fontSize: '12px', color: '#888780', margin: 0, maxWidth: '300px', lineHeight: 1.5 }}>
                                İlk kıyafetinizi mobil veya web uygulamamızdan ekleyerek dijital gardırobunuzu hemen oluşturun!
                            </p>
                        </div>
                        <Link href="/wardrobe" prefetch={true} style={{ textDecoration: 'none' }}>
                            <span style={{
                                display: 'inline-block',
                                fontSize: '11px',
                                fontWeight: 750,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                color: '#ffffff',
                                backgroundColor: '#7986CB',
                                padding: '8px 20px',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 10px rgba(121,134,203,0.2)'
                            }}
                            className="hover:bg-[#6C75BD]"
                            >
                                Kıyafet Ekle
                            </span>
                        </Link>
                    </div>
                )}
            </section>


            {/* ══════════════════════════════════════════
                DOLABININ ANALİZİ
            ══════════════════════════════════════════ */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{
                    fontSize: 'clamp(20px, 3vw, 24px)',
                    fontWeight: 600,
                    color: '#1a1a18',
                    margin: 0,
                }}>
                    {t.analysisTitle}
                </h2>

                <div 
                    className="bg-white rounded-3xl p-6 sm:p-8"
                    style={{
                        border: '0.5px solid #E0E3E8',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px'
                    }}
                >
                    {/* Üst Kısım: Dolap Çeşiti ve Parça Sayısı */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {language === 'en' ? 'WARDROBE TYPE' : 'DOLAP ÇEŞİTİ'}
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#29294D' }}>
                                {getWardrobeLevel(totalCount, language)}
                            </span>
                        </div>
                        <div style={{
                            backgroundColor: '#F3F4FD',
                            color: '#7986CB',
                            fontSize: '14px',
                            fontWeight: 600,
                            padding: '8px 16px',
                            borderRadius: '12px',
                        }}>
                            {totalCount} {language === 'en' ? 'Pieces' : 'Parça'}
                        </div>
                    </div>

                    {/* Orta Kısım: Renk Paleti ve Askı Dağılımı */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '24px',
                        borderTop: '0.5px solid #F0F2F5',
                        paddingTop: '20px'
                    }}>
                        {/* Renk Paleti Sol Sütun */}
                        <div style={{ 
                            borderRight: '0.5px solid #F0F2F5', 
                            paddingRight: '16px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            minHeight: '120px'
                        }}>
                            <div>
                                <span style={{ fontSize: '12px', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {language === 'en' ? 'COLOR PALETTE' : 'RENK PALETİ'}
                                </span>
                                
                                {/* Üst üste binen renkli kartlar */}
                                <div style={{ position: 'relative', width: '80px', height: '48px', margin: '14px 0' }}>
                                    {/* En alttaki */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '16px',
                                        width: '44px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        backgroundColor: getColorHex(displayColors[2]?.color),
                                        border: getColorHex(displayColors[2]?.color) === '#FFFFFF' ? '1px solid #D0D3D8' : 'none',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                                        zIndex: 1
                                    }} />
                                    {/* Ortadaki */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        left: '8px',
                                        width: '44px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        backgroundColor: getColorHex(displayColors[1]?.color),
                                        border: getColorHex(displayColors[1]?.color) === '#FFFFFF' ? '1px solid #D0D3D8' : 'none',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                                        zIndex: 2
                                    }} />
                                    {/* En üstteki */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        left: '0',
                                        width: '44px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        backgroundColor: getColorHex(displayColors[0]?.color),
                                        border: getColorHex(displayColors[0]?.color) === '#FFFFFF' ? '1px solid #D0D3D8' : 'none',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                        zIndex: 3
                                    }} />
                                </div>
                            </div>

                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#29294D' }}>
                                {displayColors[0]?.color || (language === 'en' ? 'White' : 'Beyaz')}
                            </span>
                        </div>

                        {/* Askı / Kıyafet Renk Dağılımı Sağ Sütun */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '14px', justifyContent: 'space-around', alignItems: 'center' }}>
                                {displayColors.slice(0, 4).map((c, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                        <div style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '50%',
                                            backgroundColor: '#F8F9FA',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                            border: '0.5px solid #E0E3E8'
                                        }}>
                                            <Shirt 
                                                className="w-5 h-5 shrink-0" 
                                                style={{ 
                                                    color: getColorHex(c.color),
                                                    fill: getColorHex(c.color) === '#FFFFFF' ? '#F3F4F6' : getColorHex(c.color)
                                                }} 
                                            />
                                        </div>
                                        <span style={{ fontSize: '10.5px', color: '#607080', fontWeight: 500 }}>
                                            {c.color}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Alt Kısım: Bilgi Kartları */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        borderTop: '0.5px solid #F0F2F5',
                        paddingTop: '20px'
                    }}>
                        <div style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            border: '0.5px solid #EAECEF'
                        }}>
                            <span style={{ fontSize: '11px', color: '#888780', fontWeight: 500 }}>
                                {language === 'en' ? 'TOTAL ITEMS' : 'TOPLAM PARÇA'}
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: 700, color: '#29294D' }}>
                                {totalCount} {language === 'en' ? 'Qty' : 'Adet'}
                            </span>
                        </div>

                        <div style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            border: '0.5px solid #EAECEF',
                            overflow: 'hidden'
                        }}>
                            <span style={{ fontSize: '11px', color: '#888780', fontWeight: 500 }}>
                                {language === 'en' ? 'FAVORITE CATEGORY' : 'FAVORİ KATEGORİ'}
                            </span>
                            <span style={{ 
                                fontSize: '18px', 
                                fontWeight: 700, 
                                color: '#29294D',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}>
                                {formatCategory(categoryGroups[0]?.category, language)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════
                BUGÜNÜN İLHAMI
            ══════════════════════════════════════════ */}
            <section 
                style={{
                    background: 'linear-gradient(135deg, #F3F4FD 0%, #ECEEFA 100%)',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '0.5px solid #E0E3E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    boxShadow: '0 4px 15px rgba(121, 134, 203, 0.05)'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#7986CB',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        {t.inspirationTitle}
                    </span>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#29294D',
                        margin: 0,
                        letterSpacing: '-0.01em'
                    }}>
                        {language === 'en' ? 'Timeless Vintage Spirit' : 'Zamansız Vintage Ruhu'}
                    </h3>
                    <p style={{
                        fontSize: '13.5px',
                        color: '#607080',
                        lineHeight: 1.5,
                        margin: '4px 0 12px 0',
                        maxWidth: '480px'
                    }}>
                        {language === 'en' 
                            ? 'Combine the pieces in your wardrobe with retro touches to catch an effortless chic look.' 
                            : 'Dolabındaki parçaları Retro esintilerle birleştirerek çaba gerektirmeyen şıklığı yakala.'}
                    </p>
                    <Link
                        href="/suggestions"
                        prefetch={true}
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#7986CB',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            width: 'fit-content'
                        }}
                    >
                        {language === 'en' ? 'Explore Outfit' : 'Kombini Keşfet'}
                        <ArrowRight style={{ width: '13px', height: '13px' }} />
                    </Link>
                </div>
                
                {/* Yıldız Butonu */}
                <div style={{ flexShrink: 0 }}>
                    <Link href="/suggestions" prefetch={true}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#E5E8FA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            boxShadow: '0 2px 8px rgba(121, 134, 203, 0.1)'
                        }}
                        className="hover:bg-[#DCDFF7]"
                        >
                            <Star className="w-5 h-5 text-[#7986CB] fill-[#7986CB]" />
                        </div>
                    </Link>
                </div>
            </section>


            {/* ══════════════════════════════════════════
                SECTION 1: Kombin Önerileri
            ══════════════════════════════════════════ */}
            <section>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{
                        fontSize: 'clamp(20px, 3vw, 26px)',
                        fontWeight: 600,
                        color: '#1a1a18',
                        margin: 0,
                    }}>
                        {t.outfitTitle}
                    </h2>
                    <Link
                        href="/wardrobe"
                        style={{
                            fontSize: '12px',
                            color: '#888780',
                            letterSpacing: '0.07em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                    >
                        {t.wardrobeBtn}
                        <ArrowRight style={{ width: '12px', height: '12px' }} />
                    </Link>
                </div>

                {/* Horizontal Scroll Cards */}
                {totalCount === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '48px 24px',
                        backgroundColor: '#F8F9FA',
                        borderRadius: '24px',
                        border: '1px dashed #E0E3E8',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#E8EAF6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Shirt style={{ width: '24px', height: '24px', color: '#7986CB' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#29294D',
                                margin: 0
                            }}>
                                {language === 'en' ? 'No Outfit Suggestions' : 'Kombin Önerisi Oluşturulamadı'}
                            </h3>
                            <p style={{
                                fontSize: '13px',
                                color: '#607080',
                                margin: 0,
                                maxWidth: '400px',
                                lineHeight: 1.5
                            }}>
                                {language === 'en'
                                    ? 'We cannot suggest outfits because there are no clothes in your wardrobe yet. Add clothes now to get customized recommendations!'
                                    : 'Dolabınızda henüz kıyafet bulunmadığı için kombin önerileri oluşturulamıyor. Yapay zeka kombinlerinizi görmek için lütfen önce kıyafet ekleyin!'}
                            </p>
                        </div>
                        <Link href="/wardrobe" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '10px 22px',
                                fontSize: '12px',
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
                    <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px' }}>
                        {kombins.map((item) => (
                            <div
                                key={item.id}
                                className="vesti-card"
                                style={{ minWidth: '240px', width: '240px', flexShrink: 0, overflow: 'hidden' }}
                            >
                                {/* Görsel */}
                                <div style={{ height: '260px', position: 'relative', overflow: 'hidden', backgroundColor: '#E8E6E0' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.outfitImage}
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                    {/* Tag rozeti */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: '#1a1a18',
                                        color: '#C9A96E',
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                    }}>
                                        {item.tag}
                                    </div>
                                </div>

                                {/* İçerik */}
                                <div style={{ padding: '18px 20px 20px' }}>
                                    <h3 style={{
                                        fontFamily: "'Outfit', system-ui, sans-serif",
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#1a1a18',
                                        margin: '0 0 6px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#888780',
                                        lineHeight: 1.6,
                                        margin: '0 0 14px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    } as React.CSSProperties}>
                                        {item.description}
                                    </p>
                                    <Link href="/wardrobe">
                                        <button style={{
                                            width: '100%',
                                            padding: '9px 0',
                                            fontSize: '11px',
                                            fontWeight: 500,
                                            letterSpacing: '0.06em',
                                            textTransform: 'uppercase',
                                            backgroundColor: '#7986CB',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s',
                                        }}>
                                            {t.wardrobeBtn}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ══════════════════════════════════════════
                SECTION 2: Marketplace Önerileri
            ══════════════════════════════════════════ */}
            <section>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{
                        fontSize: 'clamp(20px, 3vw, 26px)',
                        fontWeight: 600,
                        color: '#1a1a18',
                        margin: 0,
                    }}>
                        {t.marketTitle}
                    </h2>
                    <Link
                        href="/marketplace"
                        style={{
                            fontSize: '12px',
                            color: '#888780',
                            letterSpacing: '0.07em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                    >
                        {t.viewAll}
                        <ArrowRight style={{ width: '12px', height: '12px' }} />
                    </Link>
                </div>

                {/* Horizontal Scroll Cards */}
                <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px' }}>
                    {mockMarketplaceItems.map((item) => (
                        <div
                            key={item.id}
                            className="vesti-card"
                            style={{ minWidth: '200px', width: '200px', flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            {/* Görsel */}
                            <div style={{ height: '220px', position: 'relative', overflow: 'hidden', backgroundColor: '#E8E6E0' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                />
                                {/* Eşleşme rozeti — sağ üst, koyu zemin beyaz metin */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: '#29294D',
                                    color: '#ffffff',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.04em',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}>
                                    %{item.matchPct}
                                </div>
                            </div>

                            {/* İçerik */}
                            <div style={{ padding: '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        color: '#1a1a18',
                                        margin: '0 0 4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        color: '#1a1a18',
                                        margin: 0,
                                    }}>
                                        {item.price}
                                    </p>
                                </div>
                                <Link href="/marketplace" style={{ marginTop: '12px', display: 'block' }}>
                                    <button style={{
                                        width: '100%',
                                        padding: '8px 0',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        backgroundColor: 'transparent',
                                        color: '#37474F',
                                        border: '0.5px solid #E0E3E8',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s, color 0.2s',
                                    }}>
                                        {t.inspect}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
