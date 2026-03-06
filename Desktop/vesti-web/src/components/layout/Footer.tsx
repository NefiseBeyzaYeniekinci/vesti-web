import React from "react";

export function Footer() {
    return (
        <footer className="w-full bg-vesti-dark text-white py-8 px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-xl font-bold text-vesti-primary">Vesti</h2>
                    <p className="text-sm text-gray-400 mt-1">Dolabındaki Giysiler, Şimdi Daha Anlamlı.</p>
                </div>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="hover:text-vesti-primary transition-colors">Hakkımızda</a>
                    <a href="#" className="hover:text-vesti-primary transition-colors">Gizlilik Politikası</a>
                    <a href="#" className="hover:text-vesti-primary transition-colors">İletişim</a>
                </div>
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} Vesti. Tüm Hakları Saklıdır.</p>
            </div>
        </footer>
    );
}
