// Bu tipler ileride types/wardrobe.ts içine taşınabilir
export interface ClothingItem {
    id: string;
    userId: string;
    name?: string;
    imageUrl: string;
    category: string;
    color: string;
    brand?: string;
    size?: string;
    season: string[];
    createdAt: string;
}

export const wardrobeApi = {
    // Tüm kıyafetleri getir
    getAll: async (): Promise<ClothingItem[]> => {
        const res = await fetch("/api/wardrobe", { cache: "no-store" });
        if (!res.ok) throw new Error("Gardırop yüklenemedi");
        return res.json();
    },

    // Yeni kıyafet ekle
    add: async (data: Partial<ClothingItem>, imageFile: File): Promise<ClothingItem> => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => formData.append(key, v));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        formData.append("image", imageFile);

        const res = await fetch("/api/wardrobe", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Kıyafet eklenemedi");
        }

        return res.json();
    },

    // Tekil kıyafet detayı getir
    getById: async (id: string): Promise<ClothingItem | null> => {
        const res = await fetch(`/api/wardrobe?id=${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    },

    // Kıyafet sil
    delete: async (id: string): Promise<void> => {
        const res = await fetch(`/api/wardrobe?id=${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Kıyafet silinemedi");
    },

    // Kıyafet güncelle
    update: async (id: string, data: Partial<ClothingItem>): Promise<ClothingItem> => {
        const res = await fetch(`/api/wardrobe/items/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Kıyafet güncellenemedi");
        return res.json();
    },
};
