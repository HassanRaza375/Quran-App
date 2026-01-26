export const SurahsService = {
  getAllSurahs() {
    const { $api } = useNuxtApp();
    return $api("/surah.json");
  },

  getOneSurah(chapterNo: number) {
    const { $api } = useNuxtApp();
    return $api(`/${chapterNo}.json`);
  },
};
