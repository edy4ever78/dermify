"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import translations from '@/locales/translations';

const TranslationContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  isInitialized: false
});

export function TranslationProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Get language from localStorage or browser
      const savedLang = localStorage.getItem('language') || 'en';
      const validLang = savedLang in translations ? savedLang : 'en';
      setCurrentLanguage(validLang);
      setIsInitialized(true);
      console.log('Translation context initialized:', validLang);
    } catch (error) {
      // Fallback if localStorage is not available
      console.warn("Error accessing localStorage:", error);
      setCurrentLanguage('en');
      setIsInitialized(true);
    }
  }, []);

  const t = (key) => {
    if (!key) return '';
    
    try {
      // Handle nested keys with dot notation (e.g. "steps.analyze.title")
      if (key.includes('.')) {
        const keys = key.split('.');
        let value = translations[currentLanguage];
        
        // Navigate through the nested object
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            // Key not found in current language, try English fallback
            let fallbackValue = translations['en'];
            for (const fallbackKey of keys) {
              if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
                fallbackValue = fallbackValue[fallbackKey];
              } else {
                // Key not found in English either, return original key
                console.warn(`Translation key not found: ${key}`);
                return key;
              }
            }
            return typeof fallbackValue === 'string' ? fallbackValue : fallbackValue;
          }
        }
        
        return typeof value === 'string' ? value : value;
      }
      
      // Simple key lookup - handle both strings and objects
      const translation = translations[currentLanguage]?.[key] || 
                         translations['en'][key];
      
      if (translation === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      
      // For objects (like ageRanges, experienceLevels), return them as-is
      // For strings, ensure they are strings
      if (typeof translation === 'object') {
        return translation;
      } else if (typeof translation === 'string') {
        return translation;
      } else {
        console.warn(`Translation for key "${key}" is not a string or object:`, translation);
        return key;
      }
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  const setLanguage = (lang) => {
    console.log('Setting language via context to:', lang);
    if (lang in translations) {
      try {
        localStorage.setItem('language', lang);
        setCurrentLanguage(lang);
        console.log('Language set successfully via context:', lang);
      } catch (error) {
        console.warn("Error setting language in localStorage:", error);
      }
    }
  };

  // Helper function to get translated product data
  const getTranslatedProduct = (product) => {
    if (currentLanguage === 'en') return product;
    
    const translation = t(`productContent.${product.id}`);
    if (typeof translation === 'object') {
      return {
        ...product,
        name: translation.name || product.name,
        description: translation.description || product.description
      };
    }
    return product;
  };

  // Helper function to get translated ingredient data
  const getTranslatedIngredient = (ingredient) => {
    if (currentLanguage === 'en') return ingredient;
    
    const translation = t(`ingredientContent.${ingredient.id}`);
    if (typeof translation === 'object') {
      return {
        ...ingredient,
        name: translation.name || ingredient.name,
        description: translation.description || ingredient.description,
        benefits: translation.benefits || ingredient.benefits,
        concerns: translation.concerns || ingredient.concerns
      };
    }
    return ingredient;
  };

  // Helper function to get translated routine data
  const getTranslatedRoutine = (routine) => {
    if (currentLanguage === 'en') return routine;
    
    const translation = t(`routineContent.${routine.id}`);
    if (typeof translation === 'object') {
      const translatedSteps = routine.steps.map((step, index) => {
        const stepTranslation = translation.steps?.[index];
        return stepTranslation ? {
          ...step,
          name: stepTranslation.name || step.name,
          description: stepTranslation.description || step.description
        } : step;
      });

      return {
        ...routine,
        title: translation.title || routine.title,
        steps: translatedSteps
      };
    }
    return routine;
  };

  return (
    <TranslationContext.Provider 
      value={{ 
        language: currentLanguage, 
        setLanguage, 
        t, 
        isInitialized,
        getTranslatedProduct,
        getTranslatedIngredient,
        getTranslatedRoutine
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
