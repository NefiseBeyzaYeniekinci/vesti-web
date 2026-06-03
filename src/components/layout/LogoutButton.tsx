"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = async () => {
        setShowModal(false);
        // NextAuth client-side signOut
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                type="button"
                className="flex items-center justify-center p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-500 transition-all duration-200 cursor-pointer border-none bg-transparent"
                title="Çıkış Yap"
            >
                <LogOut className="w-4.5 h-4.5" />
            </button>

            {/* Premium Custom Glassmorphic Dialog Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl p-8 w-full max-w-[360px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex flex-col items-center text-center animate-scale-up">
                        
                        {/* Elegant Minimal Icon */}
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 shadow-inner">
                            <LogOut className="w-5 h-5" />
                        </div>

                        {/* Title & Body */}
                        <h3 className="text-lg font-bold text-[#29294D] tracking-tight mb-2">Oturumu Kapat</h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-6 px-1">
                            Vesti oturumunuzu sonlandırmak istediğinizden emin misiniz?
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 text-xs font-bold tracking-wider uppercase bg-gray-100/90 hover:bg-gray-200/90 text-gray-650 rounded-full transition-all duration-200 cursor-pointer border border-gray-200/50"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 text-xs font-bold tracking-wider uppercase bg-[#FF6F61] hover:bg-[#E56356] text-white rounded-full transition-all duration-200 cursor-pointer border-none shadow-[0_4px_15px_rgba(255,111,97,0.25)]"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
                .animate-scale-up {
                    animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
}
