// Literary/poet study modules (Mir Anis, and others added later).
// Two concerns live here:
//   1. A small registry of which poet modules exist, so the sidebar/index
//      page don't need to know about each one individually.
//   2. The "Additional Modules" visibility switch — off by default, flipped
//      on from Settings, persisted via $storage like every other stateful
//      composable in this app (see useAccessibilityPrefs.ts for the same
//      load/persist shape).
const STORAGE_KEY = "quran:additional-modules-enabled:v1";

export interface PoetModuleMeta {
  slug: string;
  name: string;
  nameUrdu: string;
  tagline: string;
  status: "seed" | "in-progress" | "complete";
}

// New poet/literary modules get one line added here — everything else
// (sidebar entry, index card, route) follows automatically.
export const POET_MODULES: PoetModuleMeta[] = [
  {
    slug: "mir-anis",
    name: "Mir Anis",
    nameUrdu: "میر انیس",
    tagline: "Marsiya poet of Lucknow — Karbala elegies (Phase 2: bibliography + seed corpus)",
    status: "in-progress",
  },
];

export const usePoetModules = () => {
  const enabled = useState<boolean>("additional-modules-enabled", () => false);

  const getStorage = () => useNuxtApp().$storage;

  const load = () => {
    if (!import.meta.client) return;
    enabled.value = getStorage()?.get(STORAGE_KEY, false) ?? false;
  };

  const setEnabled = (value: boolean) => {
    enabled.value = value;
    if (import.meta.client) getStorage()?.set(STORAGE_KEY, value);
  };

  const getModule = (slug: string) => POET_MODULES.find((m) => m.slug === slug);

  return { enabled, load, setEnabled, modules: POET_MODULES, getModule };
};
