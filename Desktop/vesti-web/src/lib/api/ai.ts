export interface Suggestion {
    id: string;
    name: string;
    items: {
        id: string;
        imageUrl: string;
        category: string;
        name: string;
    }[];
    reason: string;
}

export const getOutfitSuggestions = async (
    weatherCondition: string,
    temperature: number
): Promise<Suggestion[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data based on simple rules
    if (temperature > 25) {
        return [
            {
                id: '1',
                name: 'Rahat Yazlık',
                reason: 'Hava oldukça sıcak, rahat ve nefes alan kumaşlar tercih edilmeli.',
                items: [
                    { id: '101', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', category: 'TİŞÖRT', name: 'Beyaz Basic Tişört' },
                    { id: '102', imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80', category: 'ŞORT', name: 'Kot Şort' },
                    { id: '103', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80', category: 'AYAKKABI', name: 'Beyaz Sneaker' },
                ],
            },
        ];
    } else if (temperature > 15 && temperature <= 25) {
        return [
            {
                id: '2',
                name: 'Bahar Esintisi',
                reason: 'Hava ılık, yanına ince bir ceket alman iyi olabilir.',
                items: [
                    { id: '201', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80', category: 'TİŞÖRT', name: 'Gri Tişört' },
                    { id: '202', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', category: 'PANTOLON', name: 'Mavi Jean' },
                    { id: '203', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', category: 'CEKET', name: 'İnce Hırka' },
                ],
            },
        ];
    } else {
        return [
            {
                id: '3',
                name: 'Kış Katmanları',
                reason: 'Hava soğuk görünüyor, katmanlı ve sıcak tutacak parçalar ideale en yakını.',
                items: [
                    { id: '301', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80', category: 'KAZAK', name: 'Kalın Kışlık Kazak' },
                    { id: '302', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80', category: 'PANTOLON', name: 'Koyu Renk Pantolon' },
                    { id: '303', imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80', category: 'DIŞ GİYİM', name: 'Siyah Kaban' },
                    { id: '304', imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&q=80', category: 'AYAKKABI', name: 'Der Kışlık Bot' },
                ],
            },
        ];
    }
};
