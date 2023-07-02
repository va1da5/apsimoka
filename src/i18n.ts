import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import lt from "./locales/lt.json";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en,
    lt,
  },
  fallbackLng: "lt",
  debug: false,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
