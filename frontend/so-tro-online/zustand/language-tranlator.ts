import { create } from "zustand";

type Language = "vi" | "en"

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "vi",
  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({
      language: state.language === "en" ? "vi" : "en",
    })),
}));