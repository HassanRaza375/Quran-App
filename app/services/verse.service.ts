export const VerseService = {
  getVerseByNumber(ayahNo: number, surahNo: number) {
    const { $api } = useNuxtApp();
    return $api(`/${surahNo}/${ayahNo}.json`);
  },
};
