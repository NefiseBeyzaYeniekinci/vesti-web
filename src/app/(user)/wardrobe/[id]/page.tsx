"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wardrobeApi, ClothingItem } from "@/lib/api/wardrobe.api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2, Check, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// High-fidelity Turkish & English color mapper helper
function getHexColor(colorName: string): string {
    if (!colorName) return 'transparent';
    const c = colorName.trim().toLowerCase();
    
    const trMap: Record<string, string> = {
        'siyah': '#000000',
        'beyaz': '#ffffff',
        'gri': '#9ca3af',
        'kırmızı': '#ef4444',
        'bordo': '#800020',
        'mavi': '#3b82f6',
        'lacivert': '#1e3a8a',
        'yeşil': '#10b981',
        'haki': '#4b5320',
        'sarı': '#f59e0b',
        'turuncu': '#f97316',
        'pembe': '#ec4899',
        'mor': '#8b5cf6',
        'kahverengi': '#78350f',
        'bej': '#f5f5dc',
        'krem': '#fffdd0',
        'altın': '#d4af37',
        'gümüş': '#c0c0c0',
        'lila': '#c8a2c8',
        'turkuaz': '#06b6d4',
        'açık mavi': '#60a5fa',
        'koyu mavi': '#1d4ed8'
    };

    const enMap: Record<string, string> = {
        'black': '#000000',
        'white': '#ffffff',
        'gray': '#9ca3af',
        'red': '#ef4444',
        'burgundy': '#800020',
        'blue': '#3b82f6',
        'navy': '#1e3a8a',
        'green': '#10b981',
        'yellow': '#f59e0b',
        'orange': '#f97316',
        'pink': '#ec4899',
        'purple': '#8b5cf6',
        'brown': '#78350f',
        'beige': '#f5f5dc',
        'cream': '#fffdd0',
        'gold': '#d4af37',
        'silver': '#c0c0c0',
        'lilac': '#c8a2c8',
        'turquoise': '#06b6d4'
    };

    return trMap[c] || enMap[c] || (c.startsWith('#') ? c : 'transparent');
}

export default function WardrobeItemPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const id = params.id as string;

    // Fetch wardrobe item
    const { data: item, isLoading, isError } = useQuery({
        queryKey: ["wardrobeItem", id],
        queryFn: () => wardrobeApi.getById(id),
    });

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editBrand, setEditBrand] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editColor, setEditColor] = useState("");
    const [editSize, setEditSize] = useState("");
    const [editSeason, setEditSeason] = useState<string[]>([]);
    const [customTagInput, setCustomTagInput] = useState("");

    // Initialize values when data loads
    useEffect(() => {
        if (item) {
            setEditBrand(item.brand || "");
            setEditCategory(item.category);
            setEditColor(item.color || "");
            setEditSize(item.size || "");
            setEditSeason(item.season || []);
        }
    }, [item]);

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await wardrobeApi.delete(id);
        },
        onSuccess: () => {
            toast.success("Kıyafet başarıyla silindi! 🗑️");
            queryClient.invalidateQueries({ queryKey: ["wardrobe"] });
            router.push("/wardrobe");
        },
        onError: () => {
            toast.error("Kıyafet silinirken bir hata oluştu.");
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (updatedData: Partial<ClothingItem>) => {
            return await wardrobeApi.update(id, updatedData);
        },
        onSuccess: () => {
            toast.success("Kıyafet bilgileri başarıyla güncellendi! ✨");
            queryClient.invalidateQueries({ queryKey: ["wardrobeItem", id] });
            queryClient.invalidateQueries({ queryKey: ["wardrobe"] });
            setIsEditing(false);
        },
        onError: () => {
            toast.error("Güncelleme sırasında bir hata oluştu.");
        }
    });

    const handleSave = () => {
        if (!editCategory.trim()) {
            toast.error("Kategori alanı boş bırakılamaz.");
            return;
        }
        updateMutation.mutate({
            brand: editBrand,
            category: editCategory,
            color: editColor,
            size: editSize,
            season: editSeason
        });
    };

    const handleCancel = () => {
        if (item) {
            setEditBrand(item.brand || "");
            setEditCategory(item.category);
            setEditColor(item.color || "");
            setEditSize(item.size || "");
            setEditSeason(item.season || []);
        }
        setIsEditing(false);
    };

    const handleAddTag = () => {
        const trimmed = customTagInput.trim();
        if (trimmed && !editSeason.includes(trimmed)) {
            setEditSeason([...editSeason, trimmed]);
            setCustomTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditSeason(editSeason.filter((t) => t !== tagToRemove));
    };

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-[500px] w-full rounded-2xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-6 w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !item) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto text-center">
                <Button variant="ghost" className="mb-8" onClick={() => router.push("/wardrobe")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Gardıroba Dön
                </Button>
                <div className="bg-red-50 text-red-500 p-8 rounded-2xl flex flex-col items-center">
                    <p className="text-xl font-medium mb-4">Kıyafet bulunamadı veya yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Button variant="ghost" className="pl-0 hover:bg-transparent text-vesti-text hover:text-vesti-dark transition-colors" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-12 animate-in fade-in duration-300">
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image
                        src={item.imageUrl}
                        alt={item.category}
                        fill
                        className="object-contain p-4"
                        priority
                    />
                </div>

                {/* Info Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 mr-4">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marka</label>
                                        <input
                                            type="text"
                                            value={editBrand}
                                            onChange={(e) => setEditBrand(e.target.value)}
                                            placeholder="Örn: LCW, Zara"
                                            className="w-full border border-gray-250 rounded-xl px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#7986CB] focus:bg-white transition-all font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori *</label>
                                        <input
                                            type="text"
                                            value={editCategory}
                                            onChange={(e) => setEditCategory(e.target.value)}
                                            placeholder="Örn: Tişört, Gömlek"
                                            className="w-full border border-gray-250 rounded-xl px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#7986CB] focus:bg-white transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl md:text-4xl font-bold text-[#29294D] tracking-tight">{item.brand || item.category}</h1>
                                    {item.brand && <p className="text-lg text-gray-500 font-medium mt-1">{item.category}</p>}
                                </>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="flex space-x-2 shrink-0">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => setIsEditing(true)}
                                    className="h-10 w-10 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 transition-colors" 
                                    title="Düzenle"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    disabled={deleteMutation.isPending}
                                    onClick={() => {
                                        if (confirm("Bu kıyafeti gardırobunuzdan silmek istediğinize emin misiniz?")) {
                                            deleteMutation.mutate();
                                        }
                                    }}
                                    className="h-10 w-10 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-500 transition-colors" 
                                    title="Sil"
                                >
                                    {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 flex-grow border-t border-gray-100 pt-6">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            
                            {/* Color Field */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Renk</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editColor}
                                        onChange={(e) => setEditColor(e.target.value)}
                                        placeholder="Örn: Bordo, Mavi"
                                        className="w-full max-w-[180px] border border-gray-250 rounded-xl px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#7986CB] focus:bg-white transition-all font-semibold"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 font-medium flex items-center gap-2">
                                        <span
                                            className="w-4 h-4 rounded-full border border-gray-200 inline-block shadow-sm shrink-0"
                                            style={{ backgroundColor: getHexColor(item.color) }}
                                        ></span>
                                        {item.color}
                                    </p>
                                )}
                            </div>

                            {/* Size Field */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Beden</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editSize}
                                        onChange={(e) => setEditSize(e.target.value)}
                                        placeholder="Örn: M, 40, L"
                                        className="w-full max-w-[180px] border border-gray-250 rounded-xl px-3 py-2 bg-gray-50 text-sm focus:outline-none focus:border-[#7986CB] focus:bg-white transition-all font-semibold"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 font-medium">{item.size || "Belirtilmemiş"}</p>
                                )}
                            </div>

                            {/* Seasons & Tags Field */}
                            <div className="col-span-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Alt Kategori & Mevsim</h3>
                                {isEditing ? (
                                    <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-2xl max-w-md">
                                        <div className="flex flex-wrap gap-1.5">
                                            {editSeason.map((s) => (
                                                <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-[#7986CB] text-xs rounded-full font-semibold">
                                                    {s}
                                                    <button type="button" onClick={() => handleRemoveTag(s)} className="hover:text-red-500 focus:outline-none">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                            {editSeason.length === 0 && <span className="text-xs text-gray-400 italic">Etiket eklenmemiş.</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={customTagInput}
                                                onChange={(e) => setCustomTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                }}
                                                placeholder="Örn: V Yaka, Yaz, Oversize"
                                                className="flex-1 border border-gray-250 rounded-xl px-3 py-1 text-xs bg-white focus:outline-none focus:border-[#7986CB] transition-all"
                                            />
                                            <Button type="button" onClick={handleAddTag} className="h-8 px-3 text-xs bg-[#7986CB] hover:bg-[#6875b8] text-white">
                                                Ekle
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {item.season.map((s) => (
                                            <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                                                {s}
                                            </span>
                                        ))}
                                        {item.season.length === 0 && <span className="text-sm text-gray-450 italic">Belirtilmemiş</span>}
                                    </div>
                                )}
                            </div>

                            {/* Added Date */}
                            <div className="col-span-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Eklenme Tarihi</h3>
                                <p className="text-base text-gray-900 font-medium">
                                    {new Date(item.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Edit Mode Buttons */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                                <Button 
                                    onClick={handleCancel}
                                    variant="outline" 
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase border border-gray-200 hover:bg-gray-50 text-gray-650 cursor-pointer"
                                >
                                    <X className="w-4 h-4 mr-1.5" /> Vazgeç
                                </Button>
                                <Button 
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#7986CB] hover:bg-[#6875b8] text-white cursor-pointer shadow-sm"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-1.5" /> Değişiklikleri Kaydet
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
