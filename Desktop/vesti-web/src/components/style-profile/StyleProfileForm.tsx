'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { styleProfileSchema, StyleProfileInput } from '@/lib/validations/style-profile';

const COLORS = ['Siyah', 'Beyaz', 'Gri', 'Lacivert', 'Kırmızı', 'Mavi', 'Yeşil', 'Sarı'];
const STYLES = ['CASUAL', 'FORMAL', 'SPORT', 'MINIMAL', 'STREETWEAR'];

export default function StyleProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<StyleProfileInput>({
        resolver: zodResolver(styleProfileSchema),
        defaultValues: {
            favoriteColors: [],
            unwantedColors: [],
            stylePreference: 'CASUAL',
        },
    });

    const watchFavColors = watch('favoriteColors') || [];

    const handleToggleColor = (color: string) => {
        if (watchFavColors.includes(color)) {
            setValue(
                'favoriteColors',
                watchFavColors.filter((c) => c !== color)
            );
        } else {
            setValue('favoriteColors', [...watchFavColors, color]);
        }
    };

    const onSubmit = async (data: StyleProfileInput) => {
        setIsLoading(true);
        setSuccessMsg('');
        try {
            // Simulate API save
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Saved data:', data);
            setSuccessMsg('Tarz profiliniz başarıyla güncellendi!');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Tarz Profilini Güncelle</h2>

            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Favori Renkler */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favori Renklerin (En az 1)</label>
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => handleToggleColor(color)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${watchFavColors.includes(color)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                    {errors.favoriteColors && (
                        <p className="mt-1 text-sm text-red-600">{errors.favoriteColors.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Genel Tarz */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genel Tarz Tercihi</label>
                        <select
                            {...register('stylePreference')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {STYLES.map((style) => (
                                <option key={style} value={style}>
                                    {style}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Vücut Tipi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vücut Tipi (Opsiyonel)</label>
                        <select
                            {...register('bodyType')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="UNKNOWN">Belirtmek İstemiyorum</option>
                            <option value="ECTOMORPH">Zayıf (Ektomorf)</option>
                            <option value="MESOMORPH">Atletik (Mezomorf)</option>
                            <option value="ENDOMORPH">Geniş (Endomorf)</option>
                        </select>
                    </div>

                    {/* Bedenler */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Üst Beden</label>
                        <input
                            type="text"
                            placeholder="Örn: M veya L"
                            {...register('sizeTops')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.sizeTops && <p className="mt-1 text-sm text-red-600">{errors.sizeTops.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Beden (Pantolon)</label>
                        <input
                            type="text"
                            placeholder="Örn: 32 veya 40"
                            {...register('sizeBottoms')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.sizeBottoms && <p className="mt-1 text-sm text-red-600">{errors.sizeBottoms.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ayakkabı Numarası</label>
                        <input
                            type="text"
                            placeholder="Örn: 42"
                            {...register('sizeShoes')}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.sizeShoes && <p className="mt-1 text-sm text-red-600">{errors.sizeShoes.message}</p>}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
