'use client';

import { useEffect, useState } from 'react';
import { getOutfitSuggestions, Suggestion } from '@/lib/api/ai';
import { WeatherWidget } from '@/components/suggestions/WeatherWidget';
import { OutfitSuggestionCard } from '@/components/suggestions/OutfitSuggestionCard';
import { Sparkles } from 'lucide-react';

export default function SuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    // Normalde hava durumuna göre (WeatherWidget içindeki data ile) çağrılabilir.
    // Ancak mock API olduğu için şimdilik sabit bir hava koşulu parametresi gönderiyoruz.
    useEffect(() => {
        async function loadSuggestions() {
            try {
                setLoading(true);
                // Örnek: Hava 20 derece
                const data = await getOutfitSuggestions('Clouds', 20);
                setSuggestions(data);
            } catch (error) {
                console.error('Kombin önerileri alınamadı:', error);
            } finally {
                setLoading(false);
            }
        }

        loadSuggestions();
    }, []);

    const handleGenerateSimilar = async (id: string) => {
        // Burada AI'dan yeni benzer bir kombin istenecek
        console.log(`Buna benzer yeni bir id isteniyor: ${id}`);
        alert('Yapay zeka bu fonksiyonda devreye girecek!');
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header & Weather */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kombin Önerileri</h1>
                        <p className="text-sm text-gray-500">
                            Hava durumuna ve tarzına uygun yapay zeka destekli öneriler.
                        </p>
                    </div>
                </div>

                <WeatherWidget city="Istanbul" />
            </div>

            {/* AI Suggestions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Senin İçin Seçtiklerimiz</h2>
                    <button
                        disabled={loading}
                        onClick={() => window.location.reload()}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                    >
                        Önerileri Yenile
                    </button>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-64 animate-pulse">
                                <div className="h-6 w-1/3 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-2/3 bg-gray-100 rounded mb-6"></div>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="aspect-square bg-gray-100 rounded-xl"></div>
                                    <div className="aspect-square bg-gray-100 rounded-xl"></div>
                                    <div className="aspect-square bg-gray-100 rounded-xl"></div>
                                    <div className="aspect-square bg-gray-100 rounded-xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {suggestions.map((suggestion) => (
                            <OutfitSuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onGenerateSimilar={handleGenerateSimilar}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
