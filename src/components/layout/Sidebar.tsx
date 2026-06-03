import Link from "next/link";
import { LogOut, Settings, Shirt, Sparkles, Store, MessageCircle, Heart, Home } from "lucide-react";
import { cookies } from "next/headers";

export function Sidebar() {
    const language = cookies().get("vesti-lang")?.value === "en" ? "en" : "tr";
    const t = {
        home: language === "en" ? "Home" : "Anasayfa",
        wardrobe: language === "en" ? "Wardrobe" : "Gardırop",
        suggestions: language === "en" ? "Outfit Suggestions" : "Kombin Önerileri",
        marketplace: "Marketplace",
        messages: language === "en" ? "Messages" : "Mesajlar",
        favorites: language === "en" ? "My Favorites" : "Favorilerim",
        styleProfile: language === "en" ? "Style Profile" : "Tarz Profili",
        settings: language === "en" ? "Settings" : "Ayarlar",
        logout: language === "en" ? "Sign Out" : "Çıkış Yap",
    };

    const navItems = [
        { name: t.home, href: "/home", icon: <Home className="w-4 h-4" /> },
        { name: t.wardrobe, href: "/wardrobe", icon: <Shirt className="w-4 h-4" /> },
        { name: t.suggestions, href: "/suggestions", icon: <Sparkles className="w-4 h-4" /> },
        { name: t.marketplace, href: "/marketplace", icon: <Store className="w-4 h-4" /> },
        { name: t.messages, href: "/messages", icon: <MessageCircle className="w-4 h-4" /> },
        { name: t.favorites, href: "/favorites", icon: <Heart className="w-4 h-4" /> },
    ];

    return (
        <aside className="w-60 h-[calc(100vh-4rem)] flex flex-col justify-between hidden md:flex sticky top-16 bg-white"
            style={{ borderRight: '0.5px solid #E0E3E8' }}
        >
            {/* Nav Items */}
            <div className="py-6 flex flex-col gap-0.5 px-3">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        className="group flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 text-vesti-text hover:bg-vesti-primary/10 hover:text-vesti-primary"
                        style={{ fontWeight: 400, letterSpacing: '0.02em' }}
                    >
                        <span className="shrink-0 text-vesti-text/50 group-hover:text-vesti-primary transition-colors">
                            {item.icon}
                        </span>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="py-5 flex flex-col gap-0.5 px-3" style={{ borderTop: '0.5px solid #E0E3E8' }}>
                <Link
                    href="/style-profile"
                    prefetch={true}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg text-vesti-text/70 hover:bg-vesti-primary/10 hover:text-vesti-primary transition-all"
                >
                    <Heart className="w-4 h-4 shrink-0" />
                    <span>{t.styleProfile}</span>
                </Link>
                <Link
                    href="/profile"
                    prefetch={true}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg text-vesti-text/70 hover:bg-vesti-primary/10 hover:text-vesti-primary transition-all"
                >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>{t.settings}</span>
                </Link>
            </div>
        </aside>
    );
}
