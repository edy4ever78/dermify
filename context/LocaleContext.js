"use client";

import { createContext, useState, useEffect } from 'react';

export const LocaleContext = createContext({
  locale: 'en',
  setLocale: () => {},
});

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Get locale from localStorage or navigator language
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
    } else {
      // Get browser language
      const browserLang = navigator.language.split('-')[0];
      // Check if we support this language
      const supportedLocale = ['en', 'ro'].includes(browserLang) ? browserLang : 'en';
      setLocale(supportedLocale);
      localStorage.setItem('locale', supportedLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
