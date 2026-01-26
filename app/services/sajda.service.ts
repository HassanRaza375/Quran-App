export const SajdaService = {
  getAllSajdas() {
    const { $api2 } = useNuxtApp();
    return $api2("/sajda/quran-uthmani");
  },
};
