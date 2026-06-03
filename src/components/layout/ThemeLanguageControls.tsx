"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

import { useRouter } from "next/navigation";

const LANG_KEY = "vesti-lang";

export function ThemeLanguageControls() {
  const [language, setLanguage] = useState("tr");
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem(LANG_KEY) || "tr";
    setLanguage(savedLang);
    document.documentElement.lang = savedLang;
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem(LANG_KEY, value);
    document.cookie = `vesti-lang=${value}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = value;
    window.dispatchEvent(new Event("vesti-language-change"));
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Globe className="w-4 h-4 text-vesti-text/70 absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="h-9 rounded-md bg-transparent pl-7 pr-6 text-xs font-medium text-vesti-text outline-none border border-gray-200"
          aria-label="Dil secimi"
        >
          <option value="tr">Türkçe (TR)</option>
          <option value="en">English (EN)</option>
        </select>
      </div>
    </div>
  );
}
