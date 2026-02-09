export const VerseService = {
  getVerseByNumber(ayahNo: number, surahNo: number) {
    const { $api2 } = useNuxtApp();
    return $api2(`/${surahNo}/${ayahNo}.json`);
  },
};
