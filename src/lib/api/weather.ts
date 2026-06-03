import { getWeatherCache, setWeatherCache } from '../redis';

export interface WeatherResponse {
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    wind: {
        speed: number;
        deg: number;
    };
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    name: string;
}

// Fallback: API key yoksa veya istek başarısız olursa kullanılır
function getFallbackWeather(city: string): WeatherResponse {
    return {
        weather: [{ id: 800, main: "Clear", description: "açık", icon: "01d" }],
        main: {
            temp: 20,
            feels_like: 19,
            temp_min: 16,
            temp_max: 24,
            pressure: 1013,
            humidity: 60,
        },
        wind: { speed: 3, deg: 180 },
        sys: {
            type: 1,
            id: 1,
            country: "TR",
            sunrise: 0,
            sunset: 0,
        },
        name: city,
    };
}

export const getDailyWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
    const cacheKey = `${lat},${lon}`;

    // 1. Redis Cache kontrolü
    const cached = await getWeatherCache(cacheKey);
    if (cached) return cached as WeatherResponse;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
        console.warn('OpenWeather API key eksik, fallback kullanılıyor.');
        return getFallbackWeather(`${lat},${lon}`);
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`
        );
        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        await setWeatherCache(cacheKey, data);
        return data;
    } catch (error) {
        console.warn('Hava durumu alınamadı, fallback kullanılıyor:', error);
        return getFallbackWeather(`${lat},${lon}`);
    }
};

export const getWeatherByCity = async (city: string = 'Istanbul', lang: string = 'tr'): Promise<WeatherResponse> => {
    const cacheKey = `${city}-${lang}`;
    // 1. Redis Cache kontrolü
    const cached = await getWeatherCache(cacheKey);
    if (cached) return cached as WeatherResponse;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
        console.warn('OpenWeather API key eksik, fallback kullanılıyor.');
        return getFallbackWeather(city);
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${lang}`,
            { next: { revalidate: 900 } } // 15 dk
        );
        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        await setWeatherCache(cacheKey, data);
        return data;
    } catch (error) {
        console.warn(`"${city}" hava durumu alınamadı, fallback kullanılıyor:`, error);
        return getFallbackWeather(city);
    }
};
