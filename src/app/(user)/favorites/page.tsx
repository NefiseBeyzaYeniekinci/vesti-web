"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useClientLanguage } from "@/lib/i18n/client";
import { MarketplaceItem } from "@/lib/api/marketplace";

export default function FavoritesPage() {
    const language = useClientLanguage();
    const t = {
        title: language === "en" ? "My Favorites" : "Favorilerim",
        subtitle: language === "en" ? "The pieces you love are gathered here." : "Beğendiğin parçalar burada toplandı.",
        empty: language === "en" ? "No favorites yet." : "Henüz favori eklemedin.",
        explore: language === "en" ? "Explore Marketplace" : "Marketplace'e Göz At",
    };

    const { data, isLoading } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
            const res = await fetch("/api/favorites");
            if (!res.ok) throw new Error("Failed to fetch favorites");
            const json = await res.json();
            return json.data;
        }
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '0.5px solid #E0E3E8' }}>
                <h1 
                    className="text-3xl"
                    style={{ 
                        fontWeight: 600, 
                        color: '#29294D' 
                    }}
                >
                    {t.title}
                </h1>
                <p className="text-sm mt-1.5" style={{ color: '#607080' }}>{t.subtitle}</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-64 w-full rounded-2xl" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : data?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {data.map((fav: { listing: MarketplaceItem }) => (
                        <ProductCard 
                            key={fav.listing.id} 
                            item={fav.listing} 
                            initialIsFavorited={true} 
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Heart className="w-12 h-12 text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium">{t.empty}</p>
                </div>
            )}
        </div>
    );
}
