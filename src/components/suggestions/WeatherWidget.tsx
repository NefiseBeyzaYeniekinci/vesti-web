'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, ThermometerSun, MapPin } from 'lucide-react';
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
            <div 
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '160px',
                }}
                className="animate-pulse"
            >
                <span className="text-sm text-indigo-200">Yükleniyor...</span>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div 
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '160px',
                }}
            >
                <span className="text-sm text-indigo-300">{error || 'Hava durumu bulunamadı.'}</span>
            </div>
        );
    }

    const { main, weather: conditions, name } = weather;
    const condition = conditions[0];
    const temp = Math.round(main.temp);

    const renderIcon = () => {
        const size = "w-6 h-6";
        if (condition.main === 'Clear') return <Sun className={size} style={{ color: '#C9A96E' }} />;
        if (condition.main === 'Clouds') return <Cloud className={size} style={{ color: '#8E9AA6' }} />;
        if (condition.main === 'Rain') return <CloudRain className={`${size} text-blue-400`} />;
        if (condition.main === 'Snow') return <CloudSnow className={`${size} text-sky-300`} />;
        if (condition.main === 'Drizzle') return <CloudDrizzle className={`${size} text-blue-300`} />;
        if (condition.main === 'Thunderstorm') return <CloudLightning className={`${size} text-yellow-400`} />;
        return <ThermometerSun className={`${size} text-orange-300`} />;
    };

    return (
        <div 
            style={{
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '4px',
                minWidth: '160px',
                position: 'relative',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                {renderIcon()}
                <span style={{
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    fontSize: 'clamp(36px, 5vw, 54px)',
                    fontWeight: 700,
                    color: '#7986CB',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                }}>
                    {temp}°
                </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative', zIndex: 1 }}>
                <MapPin style={{ width: '12px', height: '12px', color: 'rgba(255,255,255,0.3)' }} />
                <span style={{
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.06em',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                }}>
                    {name.toLocaleUpperCase('tr-TR')} · {condition.description.toLocaleUpperCase('tr-TR')}
                </span>
            </div>
        </div>
    );
}
