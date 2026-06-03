"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const router = useRouter();

  const handleLanguageChange = (lang: "tr" | "en") => {
    document.cookie = `vesti-lang=${lang}; path=/; max-age=31536000`;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("vesti-language-change"));
    }
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle language"
        >
          <Globe className="h-5 w-5 text-gray-800 dark:text-gray-200" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("tr")}>
          Türkçe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
