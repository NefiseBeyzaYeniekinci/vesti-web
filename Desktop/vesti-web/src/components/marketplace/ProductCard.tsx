import Image from 'next/image';
import Link from 'next/link';
import { MarketplaceItem } from '@/lib/api/marketplace';
import { ArrowRightLeft, Star } from 'lucide-react';

export function ProductCard({ item }: { item: MarketplaceItem }) {
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
        <Link href={`/marketplace/${item.id}`} className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Görsel ve Etiketler */}
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isSwapOpen && (
                        <span className="bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" /> TAKAS
                        </span>
                    )}
                    <span className="bg-white/90 backdrop-blur text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md">
                        {formatCondition(item.condition)}
                    </span>
                </div>
            </div>

            {/* Detaylar */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-medium text-gray-500">{item.brand}</p>
                    <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                        Beden: {item.size}
                    </span>
                </div>

                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                    {item.title}
                </h3>

                <p className="text-lg font-bold text-gray-900 mb-4">
                    {item.price.toLocaleString('tr-TR')} {item.currency}
                </p>

                {/* Satıcı Özeti */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <div className="w-6 h-6 relative rounded-full overflow-hidden bg-gray-100">
                        <Image src={item.seller.avatar} alt={item.seller.name} fill className="object-cover" />
                    </div>
                    <p className="text-xs text-gray-600 flex-1 truncate">{item.seller.name}</p>
                    <div className="flex items-center gap-0.5 text-xs font-medium text-yellow-600">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {item.seller.rating}
                    </div>
                </div>
            </div>
        </Link>
    );
}
