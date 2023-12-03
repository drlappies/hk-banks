import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { isNodeDev } from "./helpers/env";
import localeEn from "./locales/en.json";
import localeZhCn from "./locales/zh-cn.json";
import localeZh from "./locales/zh.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: localeZh,
      en: localeEn,
      "zh-cn": localeZhCn,
    },
    fallbackLng: "zh",
    supportedLngs: ["en", "zh", "zh-cn"],
    lowerCaseLng: true,
    debug: isNodeDev(),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage"],
    },
  });

export default i18next;
