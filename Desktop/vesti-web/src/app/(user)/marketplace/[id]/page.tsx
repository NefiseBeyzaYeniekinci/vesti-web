import { getMarketplaceItemById } from '@/lib/api/marketplace';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRightLeft, MessageCircle, MapPin, Tag, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const item = await getMarketplaceItemById(params.id);
    if (!item) return { title: 'İlan Bulunamadı | Vesti' };
    return { title: `${item.title} | Vesti Marketplace` };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const item = await getMarketplaceItemById(params.id);

    if (!item) {
        notFound();
    }

    const formatCondition = (cond: string) => {
        switch (cond) {
            case 'NEW': return 'Sıfır';
            case 'LIKE_NEW': return 'Yeni Gibi';
            case 'USED': return 'Kullanılmış';
            case 'DEFECTIVE': return 'Kusurlu';
            default: return cond;
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Geriyedönüş */}
            <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Marketplace'e Dön
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* Sol Kısım: Fotoğraflar */}
                    <div className="bg-gray-50 p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 relative min-h-[400px]">
                        {item.isSwapOpen && (
                            <div className="absolute top-6 left-6 z-10 bg-indigo-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                                <ArrowRightLeft className="w-4 h-4" />
                                Takasa Uygun
                            </div>
                        )}
                        {/* Şimdilik ilk fotoğraf. (İleride carousel yapılabilir) */}
                        <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src={item.images[0]}
                                alt={item.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Sağ Kısım: İçerik */}
                    <div className="p-8 lg:p-10 flex flex-col h-full">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">
                                    {item.category}
                                </span>
                                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                    Beden: {item.size}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {item.title}
                            </h1>

                            <p className="text-3xl font-extrabold text-indigo-600 mb-6">
                                {item.price.toLocaleString('tr-TR')} {item.currency}
                            </p>

                            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-8">
                                <div className="flex items-center gap-2 mb-2 text-orange-800 font-semibold">
                                    <Tag className="w-5 h-5" /> Satıcı Açıklaması
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Marka</p>
                                    <p className="font-semibold text-gray-900">{item.brand}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Durumu</p>
                                    <p className="font-semibold text-gray-900">{formatCondition(item.condition)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Satıcı ve Aksiyonlar */}
                        <div className="border-t border-gray-100 pt-8 mt-auto">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-indigo-50 text-indigo-200">
                                        <Image src={item.seller.avatar} alt={item.seller.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 leading-tight mb-0.5">{item.seller.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1 font-medium text-yellow-600">
                                                ⭐ {item.seller.rating.toFixed(1)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" /> İstanbul, TR
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg w-full sm:w-auto justify-center">
                                    <ShieldCheck className="w-4 h-4" /> Vesti Güvencesi
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="flex-1 bg-indigo-600 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm active:scale-[0.98]">
                                    Sipariş Ver
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-200 font-medium py-3.5 px-6 rounded-xl hover:bg-gray-50 transition-colors active:scale-[0.98]">
                                    <MessageCircle className="w-5 h-5" /> Satıcıya Mesaj At
                                </button>
                                {item.isSwapOpen && (
                                    <button className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-100 font-medium py-3.5 px-6 rounded-xl hover:bg-purple-100 transition-colors active:scale-[0.98]">
                                        <ArrowRightLeft className="w-5 h-5" /> Takas Teklif Et
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
