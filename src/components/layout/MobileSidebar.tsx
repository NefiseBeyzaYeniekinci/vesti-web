"use client";

import { useMobileMenuStore } from "@/store/mobileMenuStore";
import Link from "next/link";
import { Settings, Shirt, Sparkles, Store, MessageCircle, Heart, Home, X } from "lucide-react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileSidebarProps {
    language: "en" | "tr";
}

export function MobileSidebar({ language }: MobileSidebarProps) {
    const { isOpen, close } = useMobileMenuStore();
    const pathname = usePathname();

    const t = {
        home: language === "en" ? "Home" : "Anasayfa",
        wardrobe: language === "en" ? "Wardrobe" : "Gardırop",
        suggestions: language === "en" ? "Outfit Suggestions" : "Kombin Önerileri",
        marketplace: "Marketplace",
        messages: language === "en" ? "Messages" : "Mesajlar",
        favorites: language === "en" ? "My Favorites" : "Favorilerim",
        styleProfile: language === "en" ? "Style Profile" : "Tarz Profili",
        settings: language === "en" ? "Settings" : "Ayarlar",
    };

    const navItems = [
        { name: t.home, href: "/home", icon: <Home className="w-4 h-4" /> },
        { name: t.wardrobe, href: "/wardrobe", icon: <Shirt className="w-4 h-4" /> },
        { name: t.suggestions, href: "/suggestions", icon: <Sparkles className="w-4 h-4" /> },
        { name: t.marketplace, href: "/marketplace", icon: <Store className="w-4 h-4" /> },
        { name: t.messages, href: "/messages", icon: <MessageCircle className="w-4 h-4" /> },
        { name: t.favorites, href: "/favorites", icon: <Heart className="w-4 h-4" /> },
    ];

    // Close mobile sidebar on route changes
    useEffect(() => {
        close();
    }, [pathname, close]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={close}
            />

            {/* Panel */}
            <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col justify-between p-6 transition-transform transform translate-x-0">
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                        <Link
                            href="/home"
                            onClick={close}
                            className="text-2xl font-bold text-[#7986CB]"
                        >
                            Vesti
                        </Link>
                        <button 
                            type="button"
                            onClick={close}
                            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <div className="py-6 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ${
                                    pathname === item.href 
                                        ? "bg-indigo-50 text-indigo-600 font-bold" 
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <span className={pathname === item.href ? "text-indigo-600" : "text-gray-400"}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-1">
                    <Link
                        href="/style-profile"
                        className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ${
                            pathname === "/style-profile" 
                                ? "bg-indigo-50 text-indigo-600 font-bold" 
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${pathname === "/style-profile" ? "text-indigo-600" : "text-gray-400"}`} />
                        <span>{t.styleProfile}</span>
                    </Link>
                    <Link
                        href="/profile"
                        className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ${
                            pathname === "/profile" 
                                ? "bg-indigo-50 text-indigo-600 font-bold" 
                                : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Settings className={`w-4 h-4 ${pathname === "/profile" ? "text-indigo-600" : "text-gray-400"}`} />
                        <span>{t.settings}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
