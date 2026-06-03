import React from "react";
import Link from "next/link";
import { Smartphone, Sparkles, Shirt, Instagram, Twitter, ShieldCheck } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-[#29294D] text-white py-8 px-6 mt-auto border-t border-[#7986CB]/15">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                
                {/* Upper Level: Brand Identity & Social Icons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                    
                    {/* Left: Brand Name & Minimalist Tagline */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                        <Link href="/home" prefetch={true} className="text-xl font-bold tracking-widest text-white no-underline hover:text-[#7986CB] transition-colors">
                            VESTİ
                        </Link>
                        <span className="hidden sm:inline text-white/20">|</span>
                        <span className="text-xs sm:text-sm text-gray-400 font-medium">
                            Dolabındaki giysiler, şimdi daha anlamlı. 🌿
                        </span>
                    </div>

                    {/* Right: Beautiful Premium Social Media Handles */}
                    <div className="flex items-center gap-3">
                        <a 
                            href="https://instagram.com/vesti.app" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-350 hover:bg-[#7986CB] hover:text-white hover:border-[#7986CB] transition-all duration-200"
                            title="Instagram'da Vesti"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a 
                            href="https://x.com/vesti_app" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-350 hover:bg-[#7986CB] hover:text-white hover:border-[#7986CB] transition-all duration-200"
                            title="X / Twitter'da Vesti"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>

                </div>

                {/* Lower Level: Inline Navigation Links & Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
                    
                    {/* Centered/Left Inline Link Navigation */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-350 font-semibold">
                        <Link href="/about" prefetch={true} className="hover:text-[#7986CB] transition-colors no-underline">
                            Hakkımızda & Misyonumuz
                        </Link>
                        <Link href="/privacy" prefetch={true} className="hover:text-[#7986CB] transition-colors no-underline">
                            Kullanıcı Gizliliği ve KVKK
                        </Link>
                        <Link href="/contact" prefetch={true} className="hover:text-[#7986CB] transition-colors no-underline">
                            İletişim & Destek
                        </Link>
                    </div>

                    {/* Right aligned Copyright */}
                    <div className="text-gray-400 font-medium text-center md:text-right">
                        © 2026 Vesti. Tüm Hakları Saklıdır.
                    </div>

                </div>

            </div>
        </footer>
    );
}
