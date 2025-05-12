"use client";

import { useCallback, useState, useEffect } from 'react';
import translations from '@/locales/translations';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    try {
      // Get language from localStorage or browser
      const savedLang = localStorage.getItem('language') || 'en';
      setCurrentLanguage(savedLang in translations ? savedLang : 'en');
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn("Error accessing localStorage:", error);
    }
  }, []);

  const t = useCallback((key) => {
    if (!key) return '';
    
    try {
      // Handle nested keys with dot notation (e.g. "header.title")
      if (key.includes('.')) {
        const keys = key.split('.');
        let value = translations[currentLanguage];
        
        for (const k of keys) {
          if (!value || !value[k]) {
            // If key doesn't exist in current language, try English
            value = translations['en'];
            for (const fallbackKey of keys) {
              if (!value || !value[fallbackKey]) {
                return key; // Return original key if fallback fails
              }
              value = value[fallbackKey];
            }
            return value;
          }
          value = value[k];
        }
        return value;
      }
      
      // Simple key lookup
      return translations[currentLanguage]?.[key] || 
             translations['en'][key] || 
             key;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  }, [currentLanguage]);

  const setLanguage = useCallback((lang) => {
    if (lang in translations) {
      try {
        localStorage.setItem('language', lang);
      } catch (error) {
        console.warn("Error setting language in localStorage:", error);
      }
      setCurrentLanguage(lang);
    }
  }, []);

  return { t, language: currentLanguage, setLanguage };
}
