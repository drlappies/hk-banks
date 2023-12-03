import { Lang } from "../types";

export const mapI18nCodeToLang = (code: string): Lang => {
  if (code === "en") {
    return Lang.ENGLISH;
  }

  if (code === "zh") {
    return Lang.TRADITIONAL_CHINESE;
  }

  if (code === "zh-cn") {
    return Lang.SIMPIFIED_CHINESE;
  }

  return Lang.ENGLISH;
};
