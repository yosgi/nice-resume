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
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  };

  return { t };
} 