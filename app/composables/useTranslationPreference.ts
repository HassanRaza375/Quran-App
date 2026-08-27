// Shared "which translation language" preference — the single source of
// truth for both the main Surah reader's inline translation panel
// (app/pages/surah/[id].vue) and Module 17's AyahReferenceCard, so picking a
// language in either place is instantly reflected in the other during the
// same session and persists identically for the next one. Extracted from
// the reader's own pre-existing logic, not a new preference system.
//
// Deliberately keeps using a raw (un-JSON-wrapped) localStorage string under
// the "translationDefaultLang" key rather than this app's usual `$storage`
// JSON-safe wrapper — that's the key/format this preference already shipped
// under before this file existed. Switching wrappers now would silently
// break reading back a value saved by the pre-refactor code.
export type TranslationLang = "english" | "urdu" | "bengali" | "arabic2";

export const TRANSLATION_LANGS: { value: TranslationLang; title: string }[] = [
  { value: "english", title: "English" },
  { value: "urdu", title: "Urdu" },
  { value: "bengali", title: "Bengali" },
  { value: "arabic2", title: "Arabic (Alt)" },
];

const RTL_TRANSLATION_LANGS = new Set<TranslationLang>(["urdu", "arabic2"]);
export const isRtlTranslationLang = (lang: string | null | undefined): boolean =>
  !!lang && RTL_TRANSLATION_LANGS.has(lang as TranslationLang);

export const translationLangTitle = (lang: string | null | undefined): string =>
  TRANSLATION_LANGS.find((l) => l.value === lang)?.title ?? lang ?? "";

const STORAGE_KEY = "translationDefaultLang";
const isValidLang = (v: unknown): v is TranslationLang => TRANSLATION_LANGS.some((l) => l.value === v);

export const useTranslationPreference = () => {
  const preferredLang = useState<TranslationLang | null>("translation-preferred-lang", () => null);

  const load = () => {
    if (!import.meta.client) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isValidLang(saved)) preferredLang.value = saved;
  };

  const setPreferredLang = (lang: TranslationLang) => {
    preferredLang.value = lang;
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, lang);
  };

  return { preferredLang, load, setPreferredLang };
};
