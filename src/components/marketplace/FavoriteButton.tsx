"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
    listingId: string;
    initialIsFavorited?: boolean;
}

export function FavoriteButton({ listingId, initialIsFavorited = false }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Link tıklamasını engelle
        e.stopPropagation();

        if (loading) return;

        setLoading(true);
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                body: JSON.stringify({ listingId }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                const data = await res.json();
                setIsFavorited(data.action === "added");
                toast.success(data.action === "added" ? "Favorilere eklendi" : "Favorilerden çıkarıldı");
            } else if (res.status === 401) {
                toast.error("Favoriye eklemek için giriş yapmalısınız");
            } else {
                toast.error("Bir hata oluştu");
            }
        } catch {
            toast.error("Bağlantı hatası");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                isFavorited 
                ? "bg-red-50 text-red-500" 
                : "bg-white/70 text-gray-400 hover:text-red-400 hover:bg-white"
            }`}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>
    );
}
