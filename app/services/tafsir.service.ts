export const TafsirService = {
  getTafsirByAyah(surahNo: number, ayahNo: number) {
    const { $api } = useNuxtApp();
    return $api(`/tafsir/${surahNo}_${ayahNo}.json`);
  },
};
