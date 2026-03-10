'use client';

import { Suggestion } from '@/lib/api/ai';
import { Sparkles, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface OutfitSuggestionCardProps {
    suggestion: Suggestion;
    onGenerateSimilar?: (id: string) => void;
}

export function OutfitSuggestionCard({ suggestion, onGenerateSimilar }: OutfitSuggestionCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {suggestion.name}
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-[280px] leading-relaxed">
                        {suggestion.reason}
                    </p>
                </div>
                {onGenerateSimilar && (
                    <button
                        onClick={() => onGenerateSimilar(suggestion.id)}
                        className="hidden md:flex items-center gap-1 text-xs font-medium text-indigo-600 bg-white border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                    >
                        Benzerini Üret
                    </button>
                )}
            </div>

            <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestion.items.map((item) => (
                        <div key={item.id} className="group/item flex flex-col gap-2">
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                                    {item.category}
                                </span>
                                <p className="text-sm font-medium text-gray-700 mt-1 truncate" title={item.name}>
                                    {item.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center sm:hidden">
                <button
                    onClick={() => onGenerateSimilar?.(suggestion.id)}
                    className="text-xs font-medium text-indigo-600 flex items-center gap-1"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Benzerini Üret
                </button>
                <button className="text-xs font-medium text-gray-600 flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Gardıroba Bak
                </button>
            </div>
        </div>
    );
}
