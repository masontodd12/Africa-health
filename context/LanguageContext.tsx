"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Language, TRANSLATIONS, Translations } from "@/lib/translations";

type LanguageContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  const setLang = (l: Language) => {
    setLangState(l);
    // persist so returning users skip the picker
    if (typeof window !== "undefined") localStorage.setItem("afrihealth_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
