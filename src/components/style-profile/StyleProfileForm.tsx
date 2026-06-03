'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { styleProfileSchema } from '@/lib/validations/style-profile';
import { Sparkles, Palette, ShieldAlert, Award, Ruler } from 'lucide-react';

const STYLES = [
    { value: 'CASUAL', label: 'Casual (Gündelik / Rahat)' },
    { value: 'FORMAL', label: 'Formal (Klasik / Şık)' },
    { value: 'SPORT', label: 'Sport (Spor Giyim)' },
    { value: 'MINIMAL', label: 'Minimal (Yalın Tarz)' },
    { value: 'STREETWEAR', label: 'Streetwear (Sokak Modası)' }
];

export default function StyleProfileForm({ language = "tr" }: { language?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [activeTab, setActiveTab] = useState<'colors' | 'fabrics' | 'sizes'>('colors');

    const t = {
        title: language === "en" ? "Detailed Style Profile" : "Tarz Profilini Detaylandır",
        success: language === "en" ? "Your style profile has been updated successfully!" : "Detaylı tarz profiliniz başarıyla kaydedildi! ✨",
        favColors: language === "en" ? "Favorite Colors" : "Favori Renklerin",
        favColorsPlaceholder: language === "en" ? "e.g. Black, Navy Blue, Earth tones, Beige" : "Örn: Siyah, Lacivert, Haki Yeşili, Krem",
        unwantedColors: language === "en" ? "Colors You Avoid / Unwanted (Optional)" : "Kaçındığın & İstemediğin Renkler",
        unwantedColorsPlaceholder: language === "en" ? "e.g. Neon yellow, Orange, Pink" : "Örn: Fosforlu renkler, Parlak sarı, Turuncu",
        stylePref: language === "en" ? "General Style Preference" : "Genel Tarz Tercihi",
        fitPref: language === "en" ? "Preferred Fit & Cut" : "Kalıp & Kesim Tercihi",
        fitPlaceholder: language === "en" ? "e.g. Oversized, Regular fit, Slim fit" : "Örn: Oversized, Standart (Regular), Dar kalıp (Slim)",
        fabricPref: language === "en" ? "Preferred Fabric Types" : "Tercih Ettiğin Kumaş Türleri",
        fabricPlaceholder: language === "en" ? "e.g. Cotton, Linen, Denim, Leather, Wool" : "Örn: Pamuk, Keten, Denim (Kot), Deri, Kaşe",
        bodyType: language === "en" ? "Body Type (Optional)" : "Vücut Tipi",
        noAnswer: language === "en" ? "Prefer not to say" : "Belirtmek İstemiyorum",
        ecto: language === "en" ? "Slim (Ectomorph)" : "Zayıf (Ektomorf)",
        meso: language === "en" ? "Athletic (Mesomorph)" : "Atletik (Mezomorf)",
        endo: language === "en" ? "Broad (Endomorph)" : "Geniş (Endomorf)",
        sizeTops: language === "en" ? "Top Size" : "Üst Beden",
        sizeBottoms: language === "en" ? "Bottom Size (Pants)" : "Alt Beden (Pantolon)",
        sizeShoes: language === "en" ? "Shoe Size" : "Ayakkabı Numarası",
        placeholderTops: language === "en" ? "e.g. M or L" : "Örn: M veya L",
        placeholderBottoms: language === "en" ? "e.g. 32 or 40" : "Örn: 32 veya 40",
        placeholderShoes: language === "en" ? "e.g. 42" : "Örn: 42",
        save: language === "en" ? "Save Detailed Profile" : "Detaylı Profilimi Kaydet",
        saving: language === "en" ? "Saving..." : "Kaydediliyor...",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(styleProfileSchema),
        defaultValues: async () => {
            try {
                const res = await fetch('/api/style-profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        return {
                            ...data,
                            favoriteColors: Array.isArray(data.favoriteColors) ? data.favoriteColors.join(', ') : '',
                            unwantedColors: Array.isArray(data.unwantedColors) ? data.unwantedColors.join(', ') : '',
                        };
                    }
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
            return {
                favoriteColors: '',
                unwantedColors: '',
                stylePreference: 'CASUAL',
                fitPreference: '',
                fabricPreference: '',
                bodyType: 'UNKNOWN',
                sizeTops: '',
                sizeBottoms: '',
                sizeShoes: ''
            };
        },
    });

    const onSubmit = async (formData: any) => {
        setIsLoading(true);
        setSuccessMsg('');

        // Transform free-text colors separated by commas back to string arrays expected by API
        const payload = {
            ...formData,
            favoriteColors: formData.favoriteColors
                ? formData.favoriteColors.split(',').map((c: string) => c.trim()).filter(Boolean)
                : [],
            unwantedColors: formData.unwantedColors
                ? formData.unwantedColors.split(',').map((c: string) => c.trim()).filter(Boolean)
                : [],
        };

        try {
            const res = await fetch('/api/style-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed to save');
            setSuccessMsg(t.success);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-white border border-[#E0E3E8] rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4FD] flex items-center justify-center text-[#7986CB]">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#29294D] tracking-tight">{t.title}</h2>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 shrink-0 text-emerald-600" />
                    {successMsg}
                </div>
            )}

            {/* Tab Seçicileri */}
            <div className="flex border-b border-gray-100 mb-8 overflow-x-auto gap-2 sm:gap-6 pb-px">
                <button
                    type="button"
                    onClick={() => setActiveTab('colors')}
                    className={`flex items-center gap-2 pb-3.5 text-sm font-semibold tracking-tight transition-all border-b-2 whitespace-nowrap px-1 ${
                        activeTab === 'colors'
                            ? 'border-[#7986CB] text-[#7986CB]'
                            : 'border-transparent text-gray-400 hover:text-gray-655'
                    }`}
                >
                    <Palette className="w-4 h-4" />
                    Renkler & Tarz
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('fabrics')}
                    className={`flex items-center gap-2 pb-3.5 text-sm font-semibold tracking-tight transition-all border-b-2 whitespace-nowrap px-1 ${
                        activeTab === 'fabrics'
                            ? 'border-[#7986CB] text-[#7986CB]'
                            : 'border-transparent text-gray-400 hover:text-gray-655'
                    }`}
                >
                    <Sparkles className="w-4 h-4" />
                    Kalıp & Kumaş
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('sizes')}
                    className={`flex items-center gap-2 pb-3.5 text-sm font-semibold tracking-tight transition-all border-b-2 whitespace-nowrap px-1 ${
                        activeTab === 'sizes'
                            ? 'border-[#7986CB] text-[#7986CB]'
                            : 'border-transparent text-gray-400 hover:text-gray-655'
                    }`}
                >
                    <Ruler className="w-4 h-4" />
                    Beden & Fiziksel
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* 1. ADIM: RENKLER & TARZ */}
                {activeTab === 'colors' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-md font-bold text-gray-950 mb-1">Renk Seçenekleri & Tarzın</h3>
                            <p className="text-xs text-gray-400 font-medium">Sana en çok yakışan renkleri ve genel giyim tarzını seçerek başla.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                    <Palette className="w-4 h-4 text-[#7986CB]" />
                                    {t.favColors}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t.favColorsPlaceholder}
                                    {...register('favoriteColors')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all placeholder:text-gray-400"
                                />
                                <span className="text-[10px] text-gray-450 italic">Favori renklerini aralarına virgül koyarak yazabilirsin.</span>
                                {errors.favoriteColors && (
                                    <p className="text-xs text-red-500 font-semibold">{errors.favoriteColors.message as string}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                    <ShieldAlert className="w-4 h-4 text-red-400" />
                                    {t.unwantedColors}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t.unwantedColorsPlaceholder}
                                    {...register('unwantedColors')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all placeholder:text-gray-400"
                                />
                                <span className="text-[10px] text-gray-450 italic">Kombinlerinde kesinlikle görmek istemediğin renkleri yazabilirsin.</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <label className="text-xs font-semibold text-gray-700">{t.stylePref}</label>
                            <select
                                {...register('stylePreference')}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all"
                            >
                                {STYLES.map((st) => (
                                    <option key={st.value} value={st.value}>
                                        {st.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* 2. ADIM: KALIP & KUMAŞ */}
                {activeTab === 'fabrics' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-md font-bold text-gray-950 mb-1">Kalıp & Kumaş Tercihleri</h3>
                            <p className="text-xs text-gray-400 font-medium">Giysilerde tercih ettiğin kesimleri ve konforuna uygun kumaşları belirt.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">{t.fitPref}</label>
                                <input
                                    type="text"
                                    placeholder={t.fitPlaceholder}
                                    {...register('fitPreference')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all placeholder:text-gray-400"
                                />
                                <span className="text-[10px] text-gray-450 italic">Örn: Oversized, Dar Kalıp, Standart.</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">{t.fabricPref}</label>
                                <input
                                    type="text"
                                    placeholder={t.fabricPlaceholder}
                                    {...register('fabricPreference')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all placeholder:text-gray-400"
                                />
                                <span className="text-[10px] text-gray-450 italic">Örn: Keten, Pamuk, Denim, Kaşe.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. ADIM: BEDEN & FİZİKSEL */}
                {activeTab === 'sizes' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-md font-bold text-gray-950 mb-1">Beden & Fiziksel Bilgiler</h3>
                            <p className="text-xs text-gray-400 font-medium">Sana en uygun kombin eşleştirmeleri için beden ölçülerini gir.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">{t.bodyType}</label>
                                <select
                                    {...register('bodyType')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-750 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all"
                                >
                                    <option value="UNKNOWN">{t.noAnswer}</option>
                                    <option value="ECTOMORPH">{t.ecto}</option>
                                    <option value="MESOMORPH">{t.meso}</option>
                                    <option value="ENDOMORPH">{t.endo}</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">{t.sizeTops}</label>
                                <input
                                    type="text"
                                    placeholder={t.placeholderTops}
                                    {...register('sizeTops')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all"
                                />
                                {errors.sizeTops && <p className="text-xs text-red-500 font-semibold">{errors.sizeTops.message as string}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">{t.sizeBottoms}</label>
                                <input
                                    type="text"
                                    placeholder={t.placeholderBottoms}
                                    {...register('sizeBottoms')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all"
                                />
                                {errors.sizeBottoms && <p className="text-xs text-red-500 font-semibold">{errors.sizeBottoms.message as string}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">{t.sizeShoes}</label>
                                <input
                                    type="text"
                                    placeholder={t.placeholderShoes}
                                    {...register('sizeShoes')}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#7986CB] focus:ring-2 focus:ring-[#7986CB]/15 focus:bg-white transition-all"
                                />
                                {errors.sizeShoes && <p className="text-xs text-red-500 font-semibold">{errors.sizeShoes.message as string}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Footer Action */}
                <div className="pt-6 border-t border-gray-150 flex items-center justify-between gap-4">
                    {activeTab !== 'colors' ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (activeTab === 'sizes') setActiveTab('fabrics');
                                else if (activeTab === 'fabrics') setActiveTab('colors');
                            }}
                            className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-650 font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm cursor-pointer bg-white"
                        >
                            ← Geri
                        </button>
                    ) : (
                        <div />
                    )}

                    {activeTab !== 'sizes' ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (activeTab === 'colors') setActiveTab('fabrics');
                                else if (activeTab === 'fabrics') setActiveTab('sizes');
                            }}
                            className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm cursor-pointer border border-indigo-100"
                        >
                            İleri →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-[#7986CB] hover:bg-[#6C75BD] text-white font-bold text-xs tracking-wider uppercase rounded-xl disabled:opacity-50 transition-all shadow-md cursor-pointer border-none"
                        >
                            {isLoading ? t.saving : t.save}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
