export const useAyahOfTheDay = () => {
  const ayah = ref<any>(null);
  const loading = ref(false);

  const fetchAyahOfTheDay = async () => {
    loading.value = true;

    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem("ayah-of-day");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
          ayah.value = parsed.data;
          loading.value = false;
          return;
        }
      }

      const surah = Math.floor(Math.random() * 114) + 1;
      const ayahNo = Math.floor(Math.random() * 7) + 1;

      const data: any = await $fetch(
        `https://quranapi.pages.dev/api/${surah}/${ayahNo}.json`,
      );

      ayah.value = {
        arabic: data.arabic1,
        translation: data.translation,
        surah_name: data.surah_name,
        ayah_number: `${surah}:${ayahNo}`,
        urdu: data.urdu,
      };

      localStorage.setItem(
        "ayah-of-day",
        JSON.stringify({ date: today, data: ayah.value }),
      );
    } catch (err) {
      console.error("Ayah fetch failed", err);
    } finally {
      loading.value = false;
    }
  };

  return { ayah, loading, fetchAyahOfTheDay };
};
