import axios from "axios";

// Bu tipler ileride types/wardrobe.ts içine taşınabilir
export interface ClothingItem {
    id: string;
    userId: string;
    imageUrl: string;
    category: string;
    color: string;
    brand?: string;
    size?: string;
    season: string[];
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/wardrobe";

// Geçici mock veriler
const mockWardrobe: ClothingItem[] = [
    {
        id: "1",
        userId: "1",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop",
        category: "T-Shirt",
        color: "Beyaz",
        brand: "Zara",
        season: ["Yaz", "İlkbahar"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        userId: "1",
        imageUrl: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=400&auto=format&fit=crop",
        category: "Pantolon",
        color: "Mavi",
        brand: "Levi's",
        season: ["Dört Mevsim"],
        createdAt: new Date().toISOString(),
    },
];

export const wardrobeApi = {
    // Tüm kıyafetleri getir
    getAll: async (): Promise<ClothingItem[]> => {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    },

    // Yeni kıyafet ekle
    add: async (data: Partial<ClothingItem>, imageFile: File): Promise<ClothingItem> => {
        const formData = new FormData();

        // Ensure arrays like season are correctly formatted for form data
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => formData.append(key, v));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        formData.append('image', imageFile);

        const response = await axios.post(`${API_URL}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    },

    // Tekil kıyafet detayı getir
    getById: async (id: string): Promise<ClothingItem | null> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
};
