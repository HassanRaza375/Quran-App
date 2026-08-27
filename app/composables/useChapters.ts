import { ChaptersService } from "~/services/chapters.service";

// Module-level (not per-composable-call) so concurrent requests for the same
// still-uncached surah — e.g. several AyahReferenceCard instances for one
// Surah's Direct Mentions group all mounting at once — share one real network
// request instead of each firing its own before the first one's IndexedDB
// write has landed. Same "module-scope cache" convention as
// useTafsir.ts's tafsirCache / useQuranDB.ts's dbPromise.
const inFlight = new Map<number, ReturnType<typeof ChaptersService.getChapterByNumber>>();

export const useChapters = () => {
  const { getChapter: getCachedChapter, setChapter: setCachedChapter } = useQuranDB();

  const getChapter = async (id: number) => {
    // IndexedDB doesn't exist during SSR, and — critically — awaiting
    // anything at all here before calling the API service (which reads
    // `useNuxtApp()` internally) loses Nuxt's synchronous SSR request
    // context and throws "[nuxt] instance unavailable". So this whole
    // branch only ever runs client-side, never awaited on the server.
    if (import.meta.client) {
      const cached = await getCachedChapter(id);
      if (cached) return cached;
    }

    let promise = inFlight.get(id);
    if (!promise) {
      promise = ChaptersService.getChapterByNumber(id).finally(() => inFlight.delete(id));
      inFlight.set(id, promise);
    }
    const data = await promise;
    if (import.meta.client) setCachedChapter(id, data); // fire-and-forget
    return data;
  };

  return {
    getChapter,
  };
};
