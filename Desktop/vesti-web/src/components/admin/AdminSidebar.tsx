import Link from "next/link";
import { Users, AlertTriangle, LayoutDashboard, Settings } from "lucide-react";

export function AdminSidebar() {
    const navItems = [
        { name: "Takvim & Özet", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: "Kullanıcılar", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
        { name: "İlan Onayları", href: "/admin/listings", icon: <AlertTriangle className="w-5 h-5" /> },
        { name: "Şikayetler", href: "/admin/reports", icon: <AlertTriangle className="w-5 h-5" /> },
        { name: "Analitik", href: "/admin/analytics", icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 h-screen bg-vesti-dark text-white flex flex-col fixed left-0 top-0">
            <div className="h-16 flex items-center px-6 border-b border-white/10 font-bold text-xl text-vesti-primary">
                Vesti Admin
            </div>
            <div className="py-6 flex flex-col gap-2 px-4 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-vesti-primary hover:text-white transition-colors"
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
}
