"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get initial language
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage) return savedLanguage;
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'zh' ? 'zh' : 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update localStorage when language changes and reload the page
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  // During SSR and initial client render, use a consistent language
  const value = {
    language: mounted ? language : 'en',
    setLanguage: handleLanguageChange,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 