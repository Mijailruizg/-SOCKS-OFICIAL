import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocale, setLocale as setI18nLocale } from '@/lib/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(getLocale());

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLocaleState(event.detail.locale);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const setLanguage = (newLocale) => {
    setI18nLocale(newLocale);
    setLocaleState(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export default LanguageContext;
