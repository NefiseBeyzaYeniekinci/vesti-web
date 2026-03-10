'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, ThermometerSun } from 'lucide-react';
import { getWeatherByCity, WeatherResponse } from '@/lib/api/weather';

export function WeatherWidget({ city = 'Istanbul' }: { city?: string }) {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWeather() {
            try {
                setLoading(true);
                const data = await getWeatherByCity(city);
                setWeather(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Hava durumu alınamadı.');
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [city]);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg animate-pulse flex items-center justify-center min-h-[160px]">
                <span>Yükleniyor...</span>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center min-h-[160px] text-gray-500">
                <span>{error || 'Hava durumu verisi bulunamadı.'}</span>
            </div>
        );
    }

    const { main, weather: conditions, name } = weather;
    const condition = conditions[0];
    const temp = Math.round(main.temp);

    // Basit bir ikon eşleştirme (OpenWeather icon kodlarına göre de yapılabilir)
    const renderIcon = () => {
        const defaultClasses = "w-16 h-16 text-yellow-300";
        if (condition.main === 'Clear') return <Sun className={defaultClasses} />;
        if (condition.main === 'Clouds') return <Cloud className="w-16 h-16 text-gray-200" />;
        if (condition.main === 'Rain') return <CloudRain className="w-16 h-16 text-blue-300" />;
        if (condition.main === 'Snow') return <CloudSnow className="w-16 h-16 text-blue-100" />;
        if (condition.main === 'Drizzle') return <CloudDrizzle className="w-16 h-16 text-blue-200" />;
        if (condition.main === 'Thunderstorm') return <CloudLightning className="w-16 h-16 text-yellow-400" />;
        return <ThermometerSun className="w-16 h-16 text-orange-300" />;
    };

    const today = new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            {/* Dekoratif çemberler */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-medium tracking-wide mb-1 opacity-90">{name}</h2>
                    <p className="text-sm opacity-75 mb-4">{today}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold tracking-tighter">{temp}°C</span>
                        <span className="text-lg opacity-80 capitalize">{condition.description}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    {renderIcon()}
                    <p className="mt-2 text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        Yarın ne giyeceğim?
                    </p>
                </div>
            </div>
        </div>
    );
}
