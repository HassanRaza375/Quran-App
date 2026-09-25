// Wajibat (Module 18) user preferences: the chosen marja' and the language
// rulings are read in. One versioned record through $storage, persisted
// synchronously after every change (same load/persist shape as
// usePoetModules.ts). Settings' "export all data" / "clear all data" cover
// it automatically because they dump/clear every localStorage key.
import type { ContentLang, MarjaId } from "~/data/wajibat/types";
import { isMarjaId } from "~/data/wajibat/marja";

const STORAGE_KEY = "quran:fiqh-prefs:v1";

export type FiqhReadingLang = ContentLang | "both";

export interface FiqhPrefs {
  /** null = not chosen yet → the marja' picker is shown before any ruling (decision Q2). */
  marjaId: MarjaId | null;
  lang: FiqhReadingLang;
  updatedAt: number;
}

const DEFAULTS: FiqhPrefs = { marjaId: null, lang: "en", updatedAt: 0 };
const LANGS: FiqhReadingLang[] = ["en", "ur", "both"];

export const useFiqhPrefs = () => {
  const prefs = useState<FiqhPrefs>("fiqh-prefs", () => ({ ...DEFAULTS }));
  // Prefs are read post-mount; pages show a neutral placeholder until then so
  // the picker doesn't flash for a user who has already chosen.
  const loaded = useState<boolean>("fiqh-prefs-loaded", () => false);

  const getStorage = () => useNuxtApp().$storage;

  const load = () => {
    if (!import.meta.client) return;
    const saved = getStorage()?.get(STORAGE_KEY, null) as Partial<FiqhPrefs> | null;
    prefs.value = {
      marjaId: isMarjaId(saved?.marjaId) ? saved!.marjaId! : null,
      lang: LANGS.includes(saved?.lang as FiqhReadingLang) ? (saved!.lang as FiqhReadingLang) : "en",
      updatedAt: typeof saved?.updatedAt === "number" ? saved.updatedAt : 0,
    };
    loaded.value = true;
  };

  const persist = () => {
    if (import.meta.client) getStorage()?.set(STORAGE_KEY, prefs.value);
  };

  const setMarja = (id: MarjaId | null) => {
    prefs.value = { ...prefs.value, marjaId: id, updatedAt: Date.now() };
    persist();
  };

  const setLang = (lang: FiqhReadingLang) => {
    if (!LANGS.includes(lang)) return;
    prefs.value = { ...prefs.value, lang, updatedAt: Date.now() };
    persist();
  };

  return {
    prefs,
    loaded,
    marjaId: computed(() => prefs.value.marjaId),
    lang: computed(() => prefs.value.lang),
    load,
    setMarja,
    setLang,
  };
};
