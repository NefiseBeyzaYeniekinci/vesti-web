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

export const getDailyWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
        throw new Error('OpenWeather API key is missing');
    }

    // units=metric parametresi ile sıcaklığı Celsius olarak alıyoruz
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`
    );

    if (!response.ok) {
        throw new Error('Hava durumu verisi alınamadı');
    }

    return response.json();
};

export const getWeatherByCity = async (city: string = 'Istanbul'): Promise<WeatherResponse> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
        throw new Error('OpenWeather API key is missing');
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`
    );

    if (!response.ok) {
        throw new Error('Hava durumu verisi alınamadı');
    }

    return response.json();
};
