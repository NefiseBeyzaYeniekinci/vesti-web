import { getMarketplaceItems } from '@/lib/api/marketplace';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Marketplace | Vesti',
    description: 'İkinci el kıyafet al, sat, takasla.',
};

// Bu sayfa bir Server Component olup listeyi request anında çeker (SSR veya ISR yapılabilir).
export default async function MarketplacePage() {
    const items = await getMarketplaceItems();

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Üst Alan */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vesti Marketplace</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kullanmadığın kıyafetleri sat veya yenileriyle takasla.
                    </p>
                </div>
                <Link
                    href="/marketplace/create"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                >
                    <Plus className="w-4 h-4" /> İlan Ver
                </Link>
            </div>

            {/* Arama & Filtreler */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Kıyafet, marka veya kategori ara..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <button className="whitespace-nowrap flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700">
                        <Filter className="w-4 h-4" /> Filtreler
                    </button>
                    <button className="whitespace-nowrap px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-medium">
                        Tümü
                    </button>
                    <button className="whitespace-nowrap px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700">
                        Sadece Takaslık
                    </button>
                    <button className="whitespace-nowrap px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700">
                        Dış Giyim
                    </button>
                    <button className="whitespace-nowrap px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700">
                        Ayakkabı
                    </button>
                </div>
            </div>

            {/* İlan Listesi */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {items.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Şu an gösterilecek ilan bulunmuyor.</p>
                </div>
            )}
        </div>
    );
}
