export const JuzService = {
  getJuzByNumber(juzNo: number) {
    const { $api2 } = useNuxtApp();
    return $api2(`/juz/${juzNo}/quran-uthmani`);
  },
};
