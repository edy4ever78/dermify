"use client";

import { createContext, useState, useEffect } from 'react';

export const LocaleContext = createContext({
  locale: 'en',
  setLocale: () => {},
});

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Get language from localStorage or navigator language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLocale(savedLanguage);
    } else {
      // Get browser language
      const browserLang = navigator.language.split('-')[0];
      // Check if we support this language
      const supportedLanguage = ['en', 'ro'].includes(browserLang) ? browserLang : 'en';
      setLocale(supportedLanguage);
      localStorage.setItem('language', supportedLanguage);
    }
  }, []);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
