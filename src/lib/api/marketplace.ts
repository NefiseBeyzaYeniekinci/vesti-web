export interface User {
    id: string;
    name: string;
    avatar: string;
    rating: number;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    size: string;
    condition: 'NEW' | 'LIKE_NEW' | 'USED' | 'DEFECTIVE';
    brand: string;
    seller: User;
    createdAt: string;
    isSwapOpen: boolean;
    status: string;
}

export const getMarketplaceItems = async (
    params?: { q?: string; category?: string; swap?: boolean }
): Promise<MarketplaceItem[]> => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.swap) searchParams.set("swap", "true");

    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' : '';
        const query = searchParams.toString();
        const res = await fetch(`${baseUrl}/api/marketplace${query ? `?${query}` : ""}`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Fetch error in getMarketplaceItems:", error);
        return [];
    }
};

export const getMarketplaceItemById = async (id: string): Promise<MarketplaceItem | null> => {
    try {
        const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' : '';
        const res = await fetch(`${baseUrl}/api/marketplace/${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Fetch error in getMarketplaceItemById:", error);
        return null;
    }
};
