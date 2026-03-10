import * as z from 'zod';

export const createListingSchema = z.object({
    title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır.').max(70, 'Başlık çok uzun.'),
    description: z.string().min(20, 'Lütfen ürünü detaylıca açıklayın (en az 20 karakter).'),
    price: z.coerce.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır.'),
    category: z.string().min(1, 'Lütfen bir kategori seçin.'),
    size: z.string().min(1, 'Beden bilgisi giriniz.'),
    condition: z.enum(['NEW', 'LIKE_NEW', 'USED', 'DEFECTIVE']),
    brand: z.string().min(1, 'Marka adı giriniz. Markası yoksa "Diğer" yazabilirsiniz.'),
    images: z.array(z.string()).min(1, 'En az bir fotoğraf yüklemelisiniz.'), // Pratikte URL'ler, ama şimdilik string tutulacak
    isSwapOpen: z.boolean(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
