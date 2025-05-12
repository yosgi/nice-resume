import { useLanguage } from '../contexts/LanguageContext';
import enTranslations from '../messages/en.json';
import zhTranslations from '../messages/zh.json';

type TranslationType = typeof enTranslations;

const translations: Record<string, TranslationType> = {
  en: enTranslations,
  zh: zhTranslations,
};

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return String(params[key] || '');
      });
    }
    
    return value || key;
  };

  return { t };
} 