import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from './resources/en/common.json';
import enHero from './resources/en/hero.json';
import enAbout from './resources/en/about.json';
import enFeatures from './resources/en/features.json';
import enArchitecture from './resources/en/architecture.json';
import enIndexing from './resources/en/indexing.json';
import enQna from './resources/en/qna.json';
import enCredit from './resources/en/credit.json';
import enFilelister from './resources/en/filelister.json';
import enMetrics from './resources/en/metrics.json';

// Import Korean translations
import koCommon from './resources/ko/common.json';
import koHero from './resources/ko/hero.json';
import koAbout from './resources/ko/about.json';
import koFeatures from './resources/ko/features.json';
import koArchitecture from './resources/ko/architecture.json';
import koIndexing from './resources/ko/indexing.json';
import koQna from './resources/ko/qna.json';
import koCredit from './resources/ko/credit.json';
import koFilelister from './resources/ko/filelister.json';
import koMetrics from './resources/ko/metrics.json';

const resources = {
  en: {
    common: enCommon,
    hero: enHero,
    about: enAbout,
    features: enFeatures,
    architecture: enArchitecture,
    indexing: enIndexing,
    qna: enQna,
    credit: enCredit,
    filelister: enFilelister,
    metrics: enMetrics,
  },
  ko: {
    common: koCommon,
    hero: koHero,
    about: koAbout,
    features: koFeatures,
    architecture: koArchitecture,
    indexing: koIndexing,
    qna: koQna,
    credit: koCredit,
    filelister: koFilelister,
    metrics: koMetrics,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'hero', 'about', 'features', 'architecture', 'indexing', 'qna', 'credit', 'filelister', 'metrics'],

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ftp.io.kr.language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;
