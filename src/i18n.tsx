import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from 'i18next-browser-languagedetector';
// import HttpApi from 'i18next-http-backend';
import enTranslation from "./assets/Locales/en/translation.json";
import arTranslation from "./assets/Locales/ar/translation.json";
const resources = {
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

i18n
  .use(initReactI18next)
  // .use(LanguageDetector)
  // .use(HttpApi)
  .init({
    supportedLngs: ["en", "ar"],
    resources,
    fallbackLng: "en",
    lng: "en", // Set default language to English
    detection: {
      order: ["localStorage", "htmlTag", "cookie", "path", "subdomain"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/Assets/locales/{{lng}}/translation.json",
    },
  });

export default i18n;
