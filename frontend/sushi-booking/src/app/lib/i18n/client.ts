"use client";

import { Locale, defaultLocale } from "./config";
import { Namespace, Translations, LanguageDictionary } from "./types";
import { useParams } from "next/navigation";
import { useMemo } from "react";

// Import các dictionary dùng đường dẫn tương đối
import footer_en from "../../locales/en/footer.json";
import header_en from "../../locales/en/header.json";
import footer_vi from "../../locales/vi/footer.json";
import header_vi from "../../locales/vi/header.json";
import home_vi from "../../locales/vi/homePage/home.json";
import home_en from "../../locales/en/homePage/home.json";
import combos_vi from "../../locales/vi/homePage/combos.json";
import combos_en from "../../locales/en/homePage/combos.json";
import about_vi from "../../locales/vi/homePage/about.json";
import about_en from "../../locales/en/homePage/about.json";
import menu_vi from "../../locales/vi/homePage/menu.json";
import menu_en from "../../locales/en/homePage/menu.json";
import myStory_vi from "../../locales/vi/homePage/myStory.json";
import myStory_en from "../../locales/en/homePage/myStory.json";
import favourite_vi from "../../locales/vi/homePage/favourite.json";
import favourite_en from "../../locales/en/homePage/favourite.json";
import callToAction_vi from "../../locales/vi/homePage/callToAction.json";
import callToAction_en from "../../locales/en/homePage/callToAction.json";
import product_vi from "../../locales/vi/cardList/product.json";
import product_en from "../../locales/en/cardList/product.json";
import aboutHero_vi from "../../locales/vi/aboutPage/aboutHero.json";
import aboutHero_en from "../../locales/en/aboutPage/aboutHero.json";
import introduction_vi from "../../locales/vi/aboutPage/introduction.json";
import introduction_en from "../../locales/en/aboutPage/introduction.json";
import history_vi from "../../locales/vi/aboutPage/history.json";
import history_en from "../../locales/en/aboutPage/history.json";
import philosophy_vi from "../../locales/vi/aboutPage/philosophy.json";
import philosophy_en from "../../locales/en/aboutPage/philosophy.json";
import chefs_vi from "../../locales/vi/aboutPage/chefs.json";
import chefs_en from "../../locales/en/aboutPage/chefs.json";
import restaurant_vi from "../../locales/vi/aboutPage/restaurant.json";
import restaurant_en from "../../locales/en/aboutPage/restaurant.json";
import core_vi from "../../locales/vi/aboutPage/core.json";
import core_en from "../../locales/en/aboutPage/core.json";
import contactHero_vi from "../../locales/vi/contactPage/contactHero.json";
import contactHero_en from "../../locales/en/contactPage/contactHero.json";
import contactInfo_vi from "../../locales/vi/contactPage/contactInfo.json";
import contactInfo_en from "../../locales/en/contactPage/contactInfo.json";
import contactFAQ_vi from "../../locales/vi/contactPage/contactFAQ.json";
import contactFAQ_en from "../../locales/en/contactPage/contactFAQ.json";
import contactTestimonials_vi from "../../locales/vi/contactPage/contactTestimonials.json";
import contactTestimonials_en from "../../locales/en/contactPage/contactTestimonials.json";
import contactMap_vi from "../../locales/vi/contactPage/contactMap.json";
import contactMap_en from "../../locales/en/contactPage/contactMap.json";
import loginPage_vi from "../../locales/vi/loginPage/loginPage.json";
import loginPage_en from "../../locales/en/loginPage/loginPage.json";
import register_vi from "../../locales/vi/registerPage/register.json";
import register_en from "../../locales/en/registerPage/register.json";

//  Dictionary đầy đủ
const dictionaries: LanguageDictionary = {
  en: {
    footer: footer_en,
    header: header_en,
    home: home_en,
    combos: combos_en,
    about: about_en,
    menu: menu_en,
    myStory: myStory_en,
    favourite: favourite_en,
    callToAction: callToAction_en,
    product: product_en,
    aboutHero: aboutHero_en,
    introduction: introduction_en,
    history: history_en,
    philosophy: philosophy_en,
    chefs: chefs_en,
    restaurant: restaurant_en,
    core: core_en,
    contactHero: contactHero_en,
    contactInfo: contactInfo_en,
    contactFAQ: contactFAQ_en,
    contactTestimonials: contactTestimonials_en,
    contactMap: contactMap_en,
    loginPage: loginPage_en,
    register: register_en,
  },
  vi: {
    footer: footer_vi,
    header: header_vi,
    home: home_vi,
    combos: combos_vi,
    about: about_vi,
    menu: menu_vi,
    myStory: myStory_vi,
    favourite: favourite_vi,
    callToAction: callToAction_vi,
    product: product_vi,
    aboutHero: aboutHero_vi,
    introduction: introduction_vi,
    history: history_vi,
    philosophy: philosophy_vi,
    chefs: chefs_vi,
    restaurant: restaurant_vi,
    core: core_vi,
    contactHero: contactHero_vi,
    contactInfo: contactInfo_vi,
    contactFAQ: contactFAQ_vi,
    contactTestimonials: contactTestimonials_vi,
    contactMap: contactMap_vi,
    loginPage: loginPage_vi,
    register: register_vi,
  },
};

export function useTranslation(ns: Namespace = "footer") {
  const params = useParams();
  const lang: Locale = (params.lang as Locale) || defaultLocale;

  return useMemo(() => {
    const dictionary =
      dictionaries[lang]?.[ns] ?? dictionaries[defaultLocale][ns];

    const t = (
      key: string,
      params?: Record<string, string | number>
    ): string => {
      let value: string | Translations | undefined;
      const keys = key.split(".");
      let current: string | Translations = dictionary;

      for (const k of keys) {
        if (typeof current === "object" && current !== null && k in current) {
          current = current[k];
        } else {
          current = key; // fallback
          break;
        }
      }

      if (typeof current !== "string") {
        current = key;
      }

      value = current as string;

      if (params) {
        for (const [param, paramValue] of Object.entries(params)) {
          value = value.replace(`{{${param}}}`, String(paramValue));
        }
      }

      return value;
    };

    return { t, lang };
  }, [lang, ns]);
}
