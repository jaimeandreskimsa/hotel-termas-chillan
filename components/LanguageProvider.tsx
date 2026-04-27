"use client";
import { createContext, useContext, useEffect, useState } from "react";
import es from "@/messages/es.json";
import en from "@/messages/en.json";
import pt from "@/messages/pt.json";

export type Locale = "es" | "en" | "pt";

type MessageTree = Record<string, string | Record<string, string>>;

const MESSAGES: Record<Locale, MessageTree> = { es, en, pt };

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  setLocale: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const stored = localStorage.getItem("htch_locale") as Locale | null;
    if (stored && stored in MESSAGES) setLocaleState(stored);
  }, []);

  const setLocale = (l: Locale) => {
    localStorage.setItem("htch_locale", l);
    setLocaleState(l);
  };

  const t = (key: string): string => {
    const parts = key.split(".");
    let val: unknown = MESSAGES[locale];
    for (const p of parts) {
      if (typeof val === "object" && val !== null) {
        val = (val as Record<string, unknown>)[p];
      } else {
        return key;
      }
    }
    return typeof val === "string" ? val : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
