"use client";

import { useState } from "react";
import { MapPin, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const TURKISH_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
    "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu",
    "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
    "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun",
    "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "Istanbul", "Izmir",
    "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya",
    "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
    "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
    "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
    "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
    "Kilis", "Osmaniye", "Düzce",
].sort();

interface Props {
    currentCity: string;
}

export function WeatherCitySelector({ currentCity }: Props) {
    const router = useRouter();
    const [selected, setSelected] = useState(currentCity);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSelect = async (city: string) => {
        setSelected(city);
        setOpen(false);
        setSaving(true);
        setSaved(false);

        try {
            await fetch("/api/user/city", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cityCode: city }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            router.refresh(); // Hava durumu verisini sunucuda yenile
        } catch {
            // ignore
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-vesti-primary transition-colors bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
            >
                <MapPin className="w-3.5 h-3.5" />
                <span>{selected}</span>
                {saving ? (
                    <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-vesti-primary rounded-full animate-spin" />
                ) : saved ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                )}
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg w-52 max-h-60 overflow-y-auto text-sm">
                        {TURKISH_CITIES.map((city) => (
                            <button
                                key={city}
                                onClick={() => handleSelect(city)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between transition-colors ${
                                    city === selected ? "text-vesti-primary font-semibold" : "text-gray-700"
                                }`}
                            >
                                {city}
                                {city === selected && <Check className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
