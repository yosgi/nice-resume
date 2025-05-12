import { useLanguage } from '../../../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded ${
          language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-2 py-1 rounded ${
          language === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        中文
      </button>
    </div>
  );
} 