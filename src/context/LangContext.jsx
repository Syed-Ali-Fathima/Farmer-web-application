/**
 * LangContext.jsx
 * Multilingual context – persists user language preference
 */
import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "../i18n/translations";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("kisan_lang") || "en";
  });

  const setLang = useCallback((code) => {
    setLangState(code);
    localStorage.setItem("kisan_lang", code);
  }, []);

  // t(key) returns translation, falls back to English, then the key itself
  const t = useCallback((key) => {
    return (translations[lang] && translations[lang][key])
      || (translations["en"] && translations["en"][key])
      || key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
};
