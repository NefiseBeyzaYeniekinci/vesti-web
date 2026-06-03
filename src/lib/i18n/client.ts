"use client";

import { useEffect, useState } from "react";

export type AppLanguage = "tr" | "en";

const LANG_KEY = "vesti-lang";

function resolveLanguage(value: string | null): AppLanguage {
  return value === "en" ? "en" : "tr";
}

export function useClientLanguage() {
  const [language, setLanguage] = useState<AppLanguage>("tr");

  useEffect(() => {
    const saved = resolveLanguage(localStorage.getItem(LANG_KEY));
    setLanguage(saved);

    const onStorage = (event: StorageEvent) => {
      if (event.key === LANG_KEY) {
        setLanguage(resolveLanguage(event.newValue));
      }
    };

    const onLanguageChanged = () => {
      setLanguage(resolveLanguage(localStorage.getItem(LANG_KEY)));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("vesti-language-change", onLanguageChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("vesti-language-change", onLanguageChanged);
    };
  }, []);

  return language;
}
