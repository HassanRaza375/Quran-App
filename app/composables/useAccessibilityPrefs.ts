const STORAGE_KEY = "quran:accessibility:v1";

export interface AccessibilityPrefs {
  reducedMotion: boolean;
  highContrast: boolean;
  largeTouchTargets: boolean;
  arabicFontScale: number; // 1 = default; applied to the Surah reader's Arabic text
}

const defaults: AccessibilityPrefs = {
  reducedMotion: false,
  highContrast: false,
  largeTouchTargets: false,
  arabicFontScale: 1,
};

export const useAccessibilityPrefs = () => {
  const prefs = useState<AccessibilityPrefs>("accessibility-prefs", () => ({ ...defaults }));

  const getStorage = () => useNuxtApp().$storage;

  // Applied after mount, not during SSR — same pattern the Pass 8 theme fix
  // uses, since the server can't know a client's saved preference and
  // rendering with a guess would just trade one hydration mismatch for another.
  const apply = () => {
    if (!import.meta.client) return;
    const root = document.documentElement;
    root.dataset.reducedMotion = String(prefs.value.reducedMotion);
    root.dataset.highContrast = String(prefs.value.highContrast);
    root.dataset.largeTouch = String(prefs.value.largeTouchTargets);
    root.style.setProperty("--arabic-font-scale", String(prefs.value.arabicFontScale));

    // Respect the OS-level reduced-motion preference too, even if the user
    // never touched the in-app toggle.
    if (!prefs.value.reducedMotion && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.reducedMotion = "true";
    }
  };

  const load = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    const saved = $storage?.get(STORAGE_KEY, null);
    prefs.value = { ...defaults, ...saved };
    apply();
  };

  const persist = () => {
    if (!import.meta.client) return;
    getStorage()?.set(STORAGE_KEY, prefs.value);
    apply();
  };

  const setPref = <K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => {
    prefs.value = { ...prefs.value, [key]: value };
    persist();
  };

  return { prefs, load, setPref };
};
