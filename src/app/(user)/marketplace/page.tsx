"use client";

import { useState, useEffect, useCallback } from "react";
import { MarketplaceItem, getMarketplaceItems } from "@/lib/api/marketplace";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useClientLanguage } from "@/lib/i18n/client";

import { useAuthStore } from "@/store/authStore";

const CATEGORIES = [
    { labelEn: "All", labelTr: "Tümü", value: "" },
    { labelEn: "Outerwear", labelTr: "Dış Giyim", value: "DIŞ GİYİM" },
    { labelEn: "Shirts", labelTr: "Gömlek", value: "GÖMLEK" },
    { labelEn: "Shoes", labelTr: "Ayakkabı", value: "AYAKKABI" },
    { labelEn: "Pants", labelTr: "Pantolon", value: "PANTOLON" },
    { labelEn: "Dresses", labelTr: "Elbise", value: "ELBISE" },
    { labelEn: "Accessories", labelTr: "Aksesuar", value: "AKSESUAR" },
];

export default function MarketplacePage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [swapOnly, setSwapOnly] = useState(false);
    const language = useClientLanguage();

    const t = {
        title: "Vesti Marketplace",
        subtitle: language === "en" ? "Sell your unused clothes or swap them for new ones." : "Kullanmadığın kıyafetleri sat veya yenileriyle takasla.",
        create: language === "en" ? "Create Listing" : "İlan Ver",
        search: language === "en" ? "Search for clothes, brands, categories, or sellers..." : "Kıyafet, marka, kategori veya satıcı ara...",
        swapOnly: language === "en" ? "Swap Only" : "Sadece Takaslık",
        emptySearch: language === "en" ? "No listings matched your filters." : "Filtreyle eşleşen ilan bulunamadı.",
        emptyAll: language === "en" ? "There are no listings to show right now." : "Şu an gösterilecek ilan bulunmuyor.",
        clearFilters: language === "en" ? "Clear filters" : "Filtreleri temizle",
    };

    const [favoritedListingIds, setFavoritedListingIds] = useState<string[]>([]);

    // Manual debounce for search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMarketplaceItems({
                q: debouncedSearch || undefined,
                category: activeCategory || undefined,
                swap: swapOnly || undefined,
            });
            setItems(data);
        } catch {
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, activeCategory, swapOnly]);

    const fetchFavorites = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await fetch("/api/favorites");
            if (res.ok) {
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setFavoritedListingIds(json.data.map((fav: any) => fav.listingId));
                }
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return (
        <div className="space-y-8 pb-8">
            {/* Header — editoryal stil */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                style={{ border: '0.5px solid #E0E3E8' }}>
                <div>
                    <h1
                        className="text-3xl tracking-tight"
                        style={{
                            fontWeight: 600,
                            color: '#29294D',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {t.title}
                    </h1>
                    <p className="text-sm mt-1.5 max-w-md" style={{ color: '#607080', fontWeight: 400 }}>
                        {t.subtitle}
                    </p>
                </div>
                <Link
                    href={isAuthenticated ? "/marketplace/create" : "/login?callbackUrl=/marketplace/create"}
                    className="flex items-center gap-2 bg-vesti-primary text-white px-5 py-2.5 rounded-lg hover:bg-vesti-dark transition-colors font-medium text-sm shrink-0"
                    style={{ letterSpacing: '0.03em' }}
                >
                    <Plus className="w-4 h-4" /> {t.create}
                </Link>
            </div>

            {/* Arama & Filtreler */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.search}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-vesti-primary focus:border-vesti-primary outline-none transition-all shadow-sm font-medium"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-wrap">
                    <button
                        onClick={() => setSwapOnly(!swapOnly)}
                        className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 border rounded-2xl text-sm font-semibold transition-all ${
                            swapOnly
                                ? "bg-purple-50 text-purple-600 border-purple-200"
                                : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        {t.swapOnly}
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`whitespace-nowrap px-5 py-2.5 border rounded-2xl text-sm font-semibold transition-all ${
                                activeCategory === cat.value
                                    ? "bg-vesti-primary text-white border-vesti-primary"
                                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {language === "en" ? cat.labelEn : cat.labelTr}
                        </button>
                    ))}
                </div>
            </div>

            {/* İlan Listesi */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {items.map((item) => (
                        <ProductCard 
                            key={item.id} 
                            item={item} 
                            initialIsFavorited={favoritedListingIds.includes(item.id)} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 font-medium">
                        {searchQuery || activeCategory || swapOnly
                            ? t.emptySearch
                            : t.emptyAll}
                    </p>
                    {(searchQuery || activeCategory || swapOnly) && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("");
                                setSwapOnly(false);
                            }}
                            className="mt-3 text-sm text-vesti-primary font-semibold hover:underline"
                        >
                            {t.clearFilters}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
