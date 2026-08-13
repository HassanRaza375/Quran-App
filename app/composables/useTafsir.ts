import { TafsirService } from "~/services/tafsir.service";

export interface TafsirEntry {
  author: string;
  groupVerse: string | null;
  content: string;
}

// In-memory, session-only — avoids even the IndexedDB round-trip when a
// panel is repeatedly toggled closed/open within the same page view.
// IndexedDB (below) is what makes this survive across page reloads.
const tafsirCache = new Map<string, TafsirEntry[]>();

export const useTafsir = () => {
  const { getTafsir: getCachedTafsir, setTafsir: setCachedTafsir } = useQuranDB();

  const getTafsir = async (
    surahNo: number,
    ayahNo: number
  ): Promise<TafsirEntry[]> => {
    const key = `${surahNo}_${ayahNo}`;
    if (tafsirCache.has(key)) return tafsirCache.get(key)!;

    // Same SSR caveat as useChapters: only check IndexedDB client-side, and
    // never await anything before the API call while server-rendering, or
    // `useNuxtApp()` inside TafsirService loses its request context.
    if (import.meta.client) {
      const cached = await getCachedTafsir(key);
      if (cached) {
        tafsirCache.set(key, cached);
        return cached;
      }
    }

    const data: any = await TafsirService.getTafsirByAyah(surahNo, ayahNo);
    const tafsirs: TafsirEntry[] = data?.tafsirs || [];
    tafsirCache.set(key, tafsirs);
    if (import.meta.client) setCachedTafsir(key, tafsirs); // fire-and-forget
    return tafsirs;
  };

  return { getTafsir };
};
