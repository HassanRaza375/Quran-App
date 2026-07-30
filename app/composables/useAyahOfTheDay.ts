const STORAGE_KEY = "ayah-of-day";

export const useAyahOfTheDay = () => {
  const ayah = useState<any>("ayah-of-the-day", () => null);
  const loading = ref(false);

  const getStorage = () => useNuxtApp().$storage;
  const getApi = () => useNuxtApp().$api;

  const pickRandomVerse = async () => {
    const surah = Math.floor(Math.random() * 114) + 1;
    // most surahs have at least 7 ayahs; keeps the pool broad but safe
    const ayahNo = Math.floor(Math.random() * 7) + 1;

    const $api = getApi();
    const data: any = await $api(`/${surah}/${ayahNo}.json`);

    return {
      arabic: data.arabic1,
      translation: data.english,
      surah_name: data.surahNameArabicLong,
      ayah_number: ayahNo,
      surah_number: surah,
      urdu: data.urdu,
    };
  };

  /**
   * @param force When true, always fetches a fresh random ayah instead of
   * reusing today's cached one (used by the manual refresh button).
   */
  const fetchAyahOfTheDay = async (force = false) => {
    loading.value = true;
    const $storage = getStorage();

    try {
      const today = new Date().toISOString().slice(0, 10);

      if (!force && $storage) {
        const saved = $storage.get(STORAGE_KEY, null);
        if (saved?.date === today) {
          ayah.value = saved.data;
          return;
        }
      }

      ayah.value = await pickRandomVerse();
      $storage?.set(STORAGE_KEY, { date: today, data: ayah.value });
    } catch (err) {
      console.error("Ayah fetch failed", err);
    } finally {
      loading.value = false;
    }
  };

  return { ayah, loading, fetchAyahOfTheDay };
};
