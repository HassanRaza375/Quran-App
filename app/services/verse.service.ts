export const VerseService = {
  getVerseByNumber(surahNo: number, ayahNo: number) {
    const { $api } = useNuxtApp();
    return $api(`/${surahNo}/${ayahNo}.json`);
  },
};
