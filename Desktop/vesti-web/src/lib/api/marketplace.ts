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
}

// Mock veriler
const MOCK_ITEMS: MarketplaceItem[] = [
    {
        id: 'm1',
        title: 'Vintage Deri Ceket',
        description: '80\'lerden kalma, harika durumda hakiki deri ceket. Hiçbir yırtığı veya söküğü yoktur.',
        price: 1250,
        currency: '₺',
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
            'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=500&q=80'
        ],
        category: 'DIŞ GİYİM',
        size: 'M',
        condition: 'USED',
        brand: 'Vintage',
        seller: {
            id: 'u1',
            name: 'Ahmet Yılmaz',
            avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz',
            rating: 4.8
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 gün önce
        isSwapOpen: true,
    },
    {
        id: 'm2',
        title: 'Nike Air Force 1',
        description: 'Sıfır ayarında, sadece birkaç kez giyildi. Kutusu mevcut.',
        price: 3500,
        currency: '₺',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80'
        ],
        category: 'AYAKKABI',
        size: '42',
        condition: 'LIKE_NEW',
        brand: 'Nike',
        seller: {
            id: 'u2',
            name: 'Ayşe Kaya',
            avatar: 'https://ui-avatars.com/api/?name=Ayse+Kaya',
            rating: 5.0
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 saat önce
        isSwapOpen: false,
    },
    {
        id: 'm3',
        title: 'Zara Beyaz Keten Gömlek',
        description: 'Yazlık ferah keten gömlek. Etiketi üzerinde kullanılmamış.',
        price: 850,
        currency: '₺',
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80'
        ],
        category: 'GÖMLEK',
        size: 'L',
        condition: 'NEW',
        brand: 'Zara',
        seller: {
            id: 'u3',
            name: 'Mehmet Demir',
            avatar: 'https://ui-avatars.com/api/?name=Mehmet+Demir',
            rating: 4.5
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 gün önce
        isSwapOpen: true,
    }
];

export const getMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_ITEMS;
};

export const getMarketplaceItemById = async (id: string): Promise<MarketplaceItem | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const item = MOCK_ITEMS.find(item => item.id === id);
    return item || null;
};
