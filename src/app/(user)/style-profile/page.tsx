import StyleProfileForm from '@/components/style-profile/StyleProfileForm';
import { Palette } from 'lucide-react';
import { cookies } from 'next/headers';

export const metadata = {
    title: 'Tarz Profili | Vesti',
};

export default function StyleProfilePage() {
    const cookieStore = cookies();
    const language = cookieStore.get("vesti-lang")?.value === "en" ? "en" : "tr";
    
    const t = {
        title: language === "en" ? "Style Profile" : "Tarz Profili",
        subtitle: language === "en" 
            ? "Update your style preferences and measurements so we can recommend the best outfits for you." 
            : "Size en uygun kombinleri önerebilmemiz için tarz tercihlerinizi ve beden bilgilerinizi güncelleyin."
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 sm:p-8 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Palette className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-vesti-dark tracking-tight">{t.title}</h1>
                    <p className="text-vesti-text/80 text-sm mt-1.5 max-w-md">
                        {t.subtitle}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                    <StyleProfileForm language={language} />
                </div>
            </div>
        </div>
    );
}
