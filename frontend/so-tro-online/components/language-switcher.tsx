"use client";

import { useLanguageStore } from "@/zustand/language-tranlator";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";

export default function LanguageSwitcher() {
  const {toggleLanguage} = useLanguageStore();

  return (
    <Button onClick={() => toggleLanguage()} variant="ghost" size="sm">
        <Languages className="w-5 h-5"/>
    </Button>
  );
}
