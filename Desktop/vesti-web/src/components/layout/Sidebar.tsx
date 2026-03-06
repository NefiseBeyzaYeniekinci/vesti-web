import Link from "next/link";
import { LogOut, Settings, Shirt, Sparkles, Store, MessageCircle } from "lucide-react";

export function Sidebar() {
    const navItems = [
        { name: "Gardırop", href: "/wardrobe", icon: <Shirt className="w-5 h-5" /> },
        { name: "Kombinler", href: "/outfits", icon: <Sparkles className="w-5 h-5" /> },
        { name: "Marketplace", href: "/marketplace", icon: <Store className="w-5 h-5" /> },
        { name: "Mesajlar", href: "/messages", icon: <MessageCircle className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 h-[calc(100vh-4rem)] border-r bg-vesti-background flex flex-col justify-between hidden md:flex sticky top-16">
            <div className="py-6 flex flex-col gap-2 px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-vesti-text hover:bg-vesti-primary hover:text-white transition-colors"
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>

            <div className="py-6 flex flex-col gap-2 px-4 border-t">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 rounded-lg text-vesti-text hover:bg-vesti-text/10 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Ayarlar</span>
                </Link>
                <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
}
