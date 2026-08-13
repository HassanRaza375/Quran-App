import { ChaptersService } from "~/services/chapters.service";

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

    const data = await ChaptersService.getChapterByNumber(id);
    if (import.meta.client) setCachedChapter(id, data); // fire-and-forget
    return data;
  };

  return {
    getChapter,
  };
};
