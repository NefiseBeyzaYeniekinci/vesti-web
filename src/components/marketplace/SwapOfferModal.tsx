"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { wardrobeApi, ClothingItem } from "@/lib/api/wardrobe.api";
import { ArrowRightLeft, Loader2, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import { useClientLanguage } from "@/lib/i18n/client";

// High-fidelity fallback clothes just in case their database closet is empty
const MOCK_CLOTHES: ClothingItem[] = [
    {
        id: "mock-1",
        userId: "mock-user",
        category: "Tişört",
        color: "Beyaz",
        brand: "Basic Tişört",
        season: ["Basic"],
        imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
        createdAt: new Date().toISOString(),
    },
    {
        id: "mock-2",
        userId: "mock-user",
        category: "Gömlek",
        color: "Açık Mavi",
        brand: "Klasik Gömlek",
        season: ["Classic"],
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        createdAt: new Date().toISOString(),
    },
    {
        id: "mock-5",
        userId: "mock-user",
        category: "Ayakkabı",
        color: "Kahverengi",
        brand: "Sneaker",
        season: ["Casual"],
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        createdAt: new Date().toISOString(),
    },
    {
        id: "mock-6",
        userId: "mock-user",
        category: "Takımlar",
        color: "Bej",
        brand: "Blazer Takım",
        season: ["Blazer Takım"],
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        createdAt: new Date().toISOString(),
    }
];

// Base standard Vesti categories that should always be displayed
const BASE_CATEGORIES = ["Tişört", "Gömlek", "Pantolon", "Ceket", "Ayakkabı", "Takımlar", "Diğer"];

interface SwapOfferModalProps {
    sellerId: string;
    listingId: string;
    sellerName: string;
    itemTitle: string;
}

export function SwapOfferModal({ sellerId, listingId, sellerName, itemTitle }: SwapOfferModalProps) {
    const [open, setOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [customMessage, setCustomMessage] = useState("");
    const [sending, setSending] = useState(false);
    
    // In-modal category filter state (defaults to null for performance and UX focus)
    const [modalCategoryFilter, setModalCategoryFilter] = useState<string | null>(null);

    const router = useRouter();
    const language = useClientLanguage();

    const t = {
        trigger: language === "en" ? "Offer Swap" : "Takas Teklif Et",
        title: language === "en" ? "Make a Swap Offer" : "Takas Teklifi Gönder",
        desc: language === "en" 
            ? `Offer an item from your wardrobe to swap with ${sellerName}'s "${itemTitle}".`
            : `${sellerName} adlı satıcının "${itemTitle}" ilanıyla kendi gardırobundan bir kıyafeti takas etmeyi teklif et.`,
        selectItem: language === "en" ? "Select one of your clothing items:" : "Gardırobundan bir kıyafet seçin:",
        messageLabel: language === "en" ? "Swap Message (Optional)" : "Teklif Mesajı (Opsiyonel)",
        placeholderMsg: language === "en" 
            ? "E.g., Hey, I'd love to swap my jacket for your shirt!"
            : "Örn: Merhaba, bu parçayı sizin ilanınızla takas etmek istiyorum!",
        sendBtn: language === "en" ? "Send Swap Offer" : "Takas Teklifini Gönder",
        sendingBtn: language === "en" ? "Sending..." : "Gönderiliyor...",
        emptyWardrobe: language === "en" ? "No items found in your wardrobe." : "Gardırobunuzda kıyafet bulunamadı.",
        errorSelect: language === "en" ? "Please select a clothing item to swap." : "Lütfen takas etmek istediğiniz kıyafeti seçin.",
        successToast: language === "en" ? "Swap offer sent successfully!" : "Takas teklifiniz satıcıya başarıyla iletildi!",
        errorToast: language === "en" ? "Failed to send swap offer." : "Takas teklifi iletilirken bir hata oluştu.",
    };

    const { data: dbClothes, isLoading } = useQuery<ClothingItem[]>({
        queryKey: ["wardrobe"],
        queryFn: wardrobeApi.getAll,
        enabled: open, // Only fetch when modal is opened
    });

    const clothes = dbClothes ? [...dbClothes, ...MOCK_CLOTHES] : MOCK_CLOTHES;

    // Dynamic hybrid list: base categories + any custom categories added by the user in their wardrobe
    const customCategories = Array.from(
        new Set(
            clothes
                .map(c => c.category)
                .filter(cat => !BASE_CATEGORIES.includes(cat))
        )
    );
    const availableCategories = [...BASE_CATEGORIES, ...customCategories];

    // Filter items based on selected category chip in modal
    const filteredClothes = modalCategoryFilter
        ? clothes.filter(c => c.category === modalCategoryFilter)
        : [];

    const handleSendSwapOffer = async () => {
        if (!selectedItemId) {
            toast.error(t.errorSelect);
            return;
        }

        const selectedItem = clothes.find(c => c.id === selectedItemId);
        if (!selectedItem) return;

        setSending(true);
        try {
            const swapContent = `🔄 TAKAS TEKLİFİ: "${selectedItem.brand || selectedItem.category} (${selectedItem.color})" adlı kıyafetimi bu ilanınızla takas etmek istiyorum! \n\n${customMessage || "Merhaba! Takas teklifimi inceleyebilir misiniz?"}`;

            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientId: sellerId,
                    listingId,
                    content: swapContent,
                }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }
                throw new Error("Failed to send");
            }

            const data = await res.json();
            toast.success(t.successToast);
            setOpen(false);
            router.push(`/messages/${data.conversationId}`);
        } catch {
            toast.error(t.errorToast);
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
                setSelectedItemId(null);
                setCustomMessage("");
                setModalCategoryFilter(null);
            }
        }}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-100 font-medium py-3.5 px-6 rounded-xl hover:bg-purple-100 transition-colors active:scale-[0.98]">
                    <ArrowRightLeft className="w-5 h-5" />
                    {t.trigger}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] p-8 overflow-y-auto rounded-[24px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <ArrowRightLeft className="w-5 h-5 text-[#7986CB]" />
                        {t.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 pt-1">
                        {t.desc}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">{t.selectItem}</label>
                        
                        {/* Dynamic Clean Category Chips without emojis */}
                        {!isLoading && clothes.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {availableCategories.map((cat) => {
                                    const isActive = modalCategoryFilter === cat;
                                    return (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => {
                                                setModalCategoryFilter(cat);
                                                setSelectedItemId(null); // Reset selected item when category changes
                                            }}
                                            className="px-4 py-2 text-xs font-semibold rounded-full border transition-all"
                                            style={{
                                                backgroundColor: isActive ? '#7986CB' : '#F3F4FD',
                                                color: isActive ? '#ffffff' : '#607080',
                                                borderColor: isActive ? '#7986CB' : '#E0E3E8',
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex gap-4 py-2 overflow-x-auto scrollbar-none">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-[180px] w-[130px] rounded-2xl shrink-0" />
                            ))}
                        </div>
                    ) : !modalCategoryFilter ? (
                        // Gorgeous minimalist fashion instructional placeholder
                        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#7986CB] mb-3">
                                <ArrowRightLeft className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-gray-700 text-center">
                                Teklif Etmek İstediğiniz Kıyafetin Kategorisini Seçin
                            </p>
                            <p className="text-[11px] text-gray-400 text-center mt-1">
                                Dolabınızdaki parçaları listelemek için yukarıdan bir kategori seçin.
                            </p>
                        </div>
                    ) : filteredClothes.length === 0 ? (
                        <p className="text-center py-8 text-sm text-gray-400">Bu kategoride kıyafet bulunamadı.</p>
                    ) : (
                        <div className="flex flex-row overflow-x-auto gap-4 py-2 pr-1 scrollbar-none snap-x snap-mandatory hide-scrollbar">
                            {filteredClothes.map((item) => {
                                const isSelected = selectedItemId === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedItemId(item.id)}
                                        className="relative rounded-2xl border overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col w-[130px] h-[180px] shrink-0 snap-start bg-white"
                                        style={{
                                            borderColor: isSelected ? '#7986CB' : '#E0E3E8',
                                            boxShadow: isSelected ? '0 4px 14px -3px rgba(121, 134, 203, 0.3)' : 'none',
                                        }}
                                    >
                                        <div className="relative h-[125px] w-full bg-gray-50">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.category}
                                                fill
                                                className="object-cover"
                                            />
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7986CB] text-white flex items-center justify-center shadow-sm">
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2.5 flex-1 flex flex-col justify-center bg-white">
                                            <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">
                                                {item.brand || item.category}
                                            </p>
                                            <p className="text-[10px] text-gray-400 truncate mt-1 font-semibold">
                                                {item.color}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-semibold text-gray-700">{t.messageLabel}</label>
                        <Input
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            placeholder={t.placeholderMsg}
                            className="py-6 rounded-xl"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSendSwapOffer}
                    disabled={sending || !selectedItemId}
                    className="w-full bg-[#7986CB] hover:bg-[#6875b8] text-white font-semibold py-6 rounded-xl mt-4 transition-colors"
                >
                    {sending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t.sendingBtn}
                        </>
                    ) : (
                        t.sendBtn
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
