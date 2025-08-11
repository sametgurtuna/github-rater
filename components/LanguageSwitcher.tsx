'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200 w-full sm:w-auto">
        <GlobeAltIcon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium truncate">{t('language.switch')}</span>
        <svg className="w-4 h-4 transition-transform group-hover:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          <button
            onClick={() => setLanguage('en')}
            className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
              language === 'en' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            🇺🇸 {t('language.en')}
          </button>
          <button
            onClick={() => setLanguage('tr')}
            className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
              language === 'tr' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            🇹🇷 {t('language.tr')}
          </button>
        </div>
      </div>
    </div>
  );
}
