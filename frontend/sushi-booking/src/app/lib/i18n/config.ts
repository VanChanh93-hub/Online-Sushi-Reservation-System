export const defaultLocale = "vi";
export const locales = ["en", "vi"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};
