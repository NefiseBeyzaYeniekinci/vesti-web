"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wardrobeApi, ClothingItem } from "@/lib/api/wardrobe.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ArrowLeft, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddClothingModal } from "@/components/wardrobe/AddClothingModal";
import { useClientLanguage } from "@/lib/i18n/client";
import { toast } from "sonner";

// Default high-quality cover fallbacks for category collections
const categoryDefaults: Record<string, string> = {
    'TİŞÖRT': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
    'GÖMLEK': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    'CEKET': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    'PANTOLON': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    'AYAKKABI': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    'ELBİSE': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    'TAKIMLAR': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
};


export default function WardrobePage() {
    const language = useClientLanguage();
    const queryClient = useQueryClient();
    
    // Core Navigation & Sub-tag filter state
    const [activeTab, setActiveTab] = useState<string>("Hepsi");
    const [activeSubTag, setActiveSubTag] = useState<string>("Hepsi");

    const t = {
        title: language === "en" ? "Digital Wardrobe" : "Dijital Gardırobun",
        subtitle: language === "en" ? "View and organize your collections." : "Koleksiyonlarını görüntüle ve yönet.",
        empty: language === "en" ? "You have not added any items yet." : "Henüz hiç kıyafet eklemediniz.",
        addFirst: language === "en" ? "Add Your First Item" : "İlk Kıyafetini Ekle",
        loadError: language === "en" ? "An error occurred while loading clothes." : "Kıyafetler yüklenirken bir hata oluştu.",
        allCollections: language === "en" ? "All Collections" : "Tüm Koleksiyonlar",
        piece: language === "en" ? "Piece of Clothing" : "Parça Kıyafet",
        deleteConfirm: language === "en" ? "Are you sure you want to delete this clothing item?" : "Bu kıyafeti silmek istediğinize emin misiniz?",
        deleteSuccess: language === "en" ? "Clothing item deleted successfully!" : "Kıyafet başarıyla silindi!",
        deleteError: language === "en" ? "Failed to delete clothing item." : "Kıyafet silinirken bir hata oluştu.",
    };

    const { data: dbClothes, isLoading, isError } = useQuery<ClothingItem[]>({
        queryKey: ["wardrobe"],
        queryFn: wardrobeApi.getAll,
    });

    const clothes = dbClothes || [];

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await wardrobeApi.delete(id);
        },
        onSuccess: () => {
            toast.success(t.deleteSuccess);
            queryClient.invalidateQueries({ queryKey: ["wardrobe"] });
        },
        onError: () => {
            toast.error(t.deleteError);
        }
    });

    // DYNAMIC CATEGORIES GENERATION:
    // Standard categories that should always exist, plus any additional user-created ones.
    const STANDARD_CATEGORIES = ["Tişört", "Gömlek", "Ceket", "Pantolon", "Ayakkabı", "Elbise", "Takımlar"];
    const uniqueCategoriesList: string[] = [...STANDARD_CATEGORIES];
    
    clothes.forEach(item => {
        const cat = item.category.trim();
        const formatted = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
        if (formatted && !uniqueCategoriesList.some(c => c.toLowerCase() === formatted.toLowerCase())) {
            uniqueCategoriesList.push(formatted);
        }
    });

    // Grouping and dynamic categories map
    const categoriesWithCounts = uniqueCategoriesList.map(catName => {
        const items = clothes.filter(item => 
            item.category.trim().toUpperCase() === catName.toUpperCase()
        );
        
        // Map category display name to default keys
        let defaultKey = catName.toUpperCase();
        if (defaultKey === "CEKET") defaultKey = "CEKET";
        
        return {
            name: catName,
            count: items.length,
            // Prefer cover fallback images if defined, otherwise dynamically use the user's actual uploaded item image!
            latestImage: categoryDefaults[defaultKey] || items[0]?.imageUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'
        };
    });

    // Filter clothes based on selected category and selected sub-tag
    const categoryClothes = clothes.filter(item => {
        if (activeTab === "Hepsi") return true;
        return item.category.trim().toUpperCase() === activeTab.toUpperCase();
    });

    // Dynamically extract unique tags (season field) for sub-filters inside this category
    const uniqueTags = ["Hepsi"];
    categoryClothes.forEach(item => {
        if (item.season) {
            item.season.forEach(tag => {
                const trimmed = tag.trim();
                if (trimmed && !uniqueTags.some(ut => ut.toLowerCase() === trimmed.toLowerCase())) {
                    uniqueTags.push(trimmed);
                }
            });
        }
    });

    // Filter by active sub-tag
    const displayedClothes = categoryClothes.filter(item => {
        if (activeSubTag === "Hepsi") return true;
        return item.season && item.season.some(tag => tag.trim().toLowerCase() === activeSubTag.toLowerCase());
    });

    return (
        <div className="space-y-6 relative pb-16">
            {/* Header — editoryal stil */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
                    <p className="text-sm mt-1.5" style={{ color: '#607080', fontWeight: 400 }}>
                        {t.subtitle}
                    </p>
                </div>
                <div className="hidden sm:block">
                    <AddClothingModal />
                </div>
            </div>

            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[250px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">{t.loadError}</div>
            )}

            {/* VIEW A: Dynamic Collections Grid (when activeTab is "Hepsi") */}
            {!isLoading && !isError && activeTab === "Hepsi" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {categoriesWithCounts.map((cat) => (
                        <div
                            key={cat.name}
                            onClick={() => {
                                setActiveTab(cat.name);
                                setActiveSubTag("Hepsi");
                            }}
                            className="relative rounded-[24px] overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
                            style={{ height: '240px' }}
                        >
                            {/* Background Image */}
                            <Image
                                src={cat.latestImage}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                            />
                            {/* Dark gradient overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.75) 100%)',
                                }}
                            />
                            {/* Bottom details */}
                            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    margin: '0 0 4px 0',
                                    letterSpacing: '-0.01em'
                                }}>
                                    {cat.name}
                                </h3>
                                <p style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 500,
                                    margin: 0
                                }}>
                                    {cat.count} {t.piece}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW B: Category Collection Items View (when activeTab is NOT "Hepsi") */}
            {!isLoading && !isError && activeTab !== "Hepsi" && (
                <div className="space-y-6">
                    {/* Back Button */}
                    <button
                        onClick={() => {
                            setActiveTab("Hepsi");
                            setActiveSubTag("Hepsi");
                        }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#7986CB',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        <ArrowLeft style={{ width: '16px', height: '16px' }} />
                        {t.allCollections}
                    </button>

                    {/* Sub-tag filters */}
                    {uniqueTags.length > 1 && (
                        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2">
                            {uniqueTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveSubTag(tag)}
                                    className="px-5 py-2.5 text-[14px] font-medium rounded-full transition-all duration-200"
                                    style={{
                                        backgroundColor: activeSubTag === tag ? '#7986CB' : '#F3F4FD',
                                        color: activeSubTag === tag ? '#ffffff' : '#607080',
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Category Items Grid */}
                    {displayedClothes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border-2 border-dashed border-gray-200 rounded-[24px] gap-4 max-w-md mx-auto shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-gray-900">
                                    {language === "en" ? "Category is Empty" : "Bu Kategoride Kıyafet Yok"}
                                </h3>
                                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                                    {language === "en" 
                                        ? "You haven't added any clothes here yet. Would you like to add one now?" 
                                        : "Bu kategoride henüz hiçbir kıyafetiniz bulunmuyor. Şimdi yeni bir parça eklemek ister misiniz?"}
                                </p>
                            </div>
                            <AddClothingModal trigger={
                                <button className="px-5 py-2.5 bg-[#7986CB] hover:bg-[#6875b8] text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-[0_4px_15px_rgba(121,134,203,0.2)] transition-all active:scale-[0.98]">
                                    {language === "en" ? "Add Clothing" : "Kıyafet Ekle"}
                                </button>
                            } />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {displayedClothes.map((item) => (
                                <div key={item.id} className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Delete Button (trash icon in top right) */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (confirm(t.deleteConfirm)) {
                                                deleteMutation.mutate(item.id);
                                            }
                                        }}
                                        className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 hover:bg-red-500 transition-colors z-10"
                                        title={language === "en" ? "Delete" : "Sil"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <Link href={`/wardrobe/${item.id}`} prefetch={true}>
                                        <div className="vesti-card cursor-pointer flex flex-col h-full bg-white">
                                            <div className="relative h-[240px] w-full bg-gray-50 overflow-hidden">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.category}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                                />
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <h3 className="font-semibold text-vesti-dark text-sm truncate">
                                                    {item.brand || item.category}
                                                </h3>
                                                <p className="text-xs mt-1" style={{ color: '#607080' }}>
                                                    {item.color}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Fixed Floating Plus Add Button — matches the bottom right "+" icon in screenshots */}
            <div className="fixed bottom-6 right-6 z-40 sm:hidden">
                <AddClothingModal trigger={
                    <button className="w-14 h-14 rounded-full bg-[#7986CB] hover:bg-[#6875b8] text-white flex items-center justify-center shadow-lg transition-all transform active:scale-95">
                        <Plus className="w-6 h-6" />
                    </button>
                } />
            </div>
        </div>
    );
}
