import Link from "next/link";
import { User, Menu } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full h-16 border-b bg-vesti-background flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-vesti-text hover:text-vesti-primary">
                    <Menu className="w-6 h-6" />
                </button>
                <Link href="/" className="text-2xl font-bold text-vesti-primary">
                    Vesti
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/outfits" className="text-sm font-medium text-vesti-text hover:text-vesti-primary transition-colors">
                    Kombinler
                </Link>
                <Link href="/marketplace" className="text-sm font-medium text-vesti-text hover:text-vesti-primary transition-colors">
                    Marketplace
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-vesti-text hover:text-vesti-primary transition-colors">
                    <User className="w-5 h-5" />
                    <span>Giriş Yap</span>
                </Link>
            </div>
        </nav>
    );
}
