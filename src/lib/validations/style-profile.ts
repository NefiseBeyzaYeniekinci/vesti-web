import * as z from 'zod';

export const styleProfileSchema = z.object({
    favoriteColors: z.array(z.string()).min(1, 'En az bir favori renk girilmelidir.'),
    unwantedColors: z.array(z.string()).optional(),
    stylePreference: z.enum(['CASUAL', 'FORMAL', 'SPORT', 'MINIMAL', 'STREETWEAR']),
    bodyType: z.enum(['ECTOMORPH', 'MESOMORPH', 'ENDOMORPH', 'UNKNOWN']).optional(),
    sizeTops: z.string().min(1, 'Üst beden bilginizi giriniz.'),
    sizeBottoms: z.string().min(1, 'Alt beden bilginizi giriniz.'),
    sizeShoes: z.string().min(1, 'Ayakkabı numarası giriniz.'),
    // New detailed preferences mapped dynamically
    fitPreference: z.string().optional(),
    fabricPreference: z.string().optional(),
});

export type StyleProfileInput = z.infer<typeof styleProfileSchema>;
