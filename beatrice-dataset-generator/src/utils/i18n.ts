import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en.json";
import jaTranslation from "../locales/ja.json";
import koTranslation from "../locales/ko.json";
import deTranslation from "../locales/de.json";
import arTranslation from "../locales/ar.json";
import elTranslation from "../locales/el.json";
import esTranslation from "../locales/es.json";
import frTranslation from "../locales/fr.json";
import itTranslation from "../locales/it.json";
import laTranslation from "../locales/la.json";
import msTranslation from "../locales/ms.json";
import ruTranslation from "../locales/ru.json";
import zhTranslation from "../locales/zh.json";
import hiTranslation from "../locales/hi.json";
import ptTranslation from "../locales/pt.json";
import idTranslation from "../locales/id.json";
import bnTranslation from "../locales/bn.json";
import trTranslation from "../locales/tr.json";
import urTranslation from "../locales/ur.json";
import swTranslation from "../locales/sw.json";
import viTranslation from "../locales/vi.json";
import taTranslation from "../locales/ta.json";
import faTranslation from "../locales/fa.json";
import paTranslation from "../locales/pa.json";
import mrTranslation from "../locales/mr.json";
import teTranslation from "../locales/te.json";
import wuuTranslation from "../locales/wuu.json";
import jvTranslation from "../locales/jv.json";

// 対応言語
export const LANGUAGES = {
    EN: "en",
    JA: "ja",
    KO: "ko",
    DE: "de",
    AR: "ar",
    EL: "el",
    ES: "es",
    FR: "fr",
    IT: "it",
    LA: "la",
    MS: "ms",
    RU: "ru",
    ZH: "zh",
    HI: "hi",
    PT: "pt",
    ID: "id",
    BN: "bn",
    TR: "tr",
    UR: "ur",
    SW: "sw",
    VI: "vi",
    TA: "ta",
    FA: "fa",
    PA: "pa",
    MR: "mr",
    TE: "te",
    WUU: "wuu",
    JV: "jv",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

// ユーザーの言語設定を取得
const getUserLanguage = (): Language => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
        return savedLanguage;
    }

    // ブラウザの言語設定から取得
    const browserLanguage = navigator.language.split("-")[0];
    if (Object.values(LANGUAGES).includes(browserLanguage as Language)) {
        return browserLanguage as Language;
    }

    // デフォルトは英語
    return LANGUAGES.EN;
};

// i18n初期化
i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enTranslation,
        },
        ja: {
            translation: jaTranslation,
        },
        ko: {
            translation: koTranslation,
        },
        de: {
            translation: deTranslation,
        },
        ar: {
            translation: arTranslation,
        },
        el: {
            translation: elTranslation,
        },
        es: {
            translation: esTranslation,
        },
        fr: {
            translation: frTranslation,
        },
        it: {
            translation: itTranslation,
        },
        la: {
            translation: laTranslation,
        },
        ms: {
            translation: msTranslation,
        },
        ru: {
            translation: ruTranslation,
        },
        zh: {
            translation: zhTranslation,
        },
        hi: {
            translation: hiTranslation,
        },
        pt: {
            translation: ptTranslation,
        },
        id: {
            translation: idTranslation,
        },
        bn: {
            translation: bnTranslation,
        },
        tr: {
            translation: trTranslation,
        },
        ur: {
            translation: urTranslation,
        },
        sw: {
            translation: swTranslation,
        },
        vi: {
            translation: viTranslation,
        },
        ta: {
            translation: taTranslation,
        },
        fa: {
            translation: faTranslation,
        },
        pa: {
            translation: paTranslation,
        },
        mr: {
            translation: mrTranslation,
        },
        te: {
            translation: teTranslation,
        },
        wuu: {
            translation: wuuTranslation,
        },
        jv: {
            translation: jvTranslation,
        },
    },
    lng: getUserLanguage(),
    fallbackLng: LANGUAGES.EN,
    interpolation: {
        escapeValue: false,
    },
});

// 言語を切り替える関数
export const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
};

export default i18n;
