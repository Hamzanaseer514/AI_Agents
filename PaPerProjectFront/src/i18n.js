import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import enTranslation from '@/locales/en/translation.json';
import arCommon from '@/locales/ar/common.json';
import arComponents from '@/locales/ar/components.json';
import arPages from '@/locales/ar/pages.json';
import arReviews from '@/locales/ar/reviews.json';
import arPredictor from '@/locales/ar/predictor.json';
import frTranslation from '@/locales/fr/translation.json';
import deTranslation from '@/locales/de/translation.json';
import plTranslation from '@/locales/pl/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: {
      ...arCommon,
      ...arComponents,
      ...arPages,
      ...arReviews,
      ...arPredictor
    }
  },
  fr: {
    translation: frTranslation
  },
  de: {
    translation: deTranslation
  },
  pl: {
    translation: plTranslation
  }
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'fr', 'de', 'pl'],
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    }
  });

export default i18n;