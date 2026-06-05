"use client";

import { useMobileMenuStore } from "@/store/mobileMenuStore";
import { Menu } from "lucide-react";

export function MobileMenuButton() {
    const toggle = useMobileMenuStore((state) => state.toggle);
    return (
        <button 
            type="button"
            onClick={toggle}
            className="md:hidden text-gray-600 p-1.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
        >
            <Menu className="w-5 h-5 text-gray-600" />
        </button>
    );
}
