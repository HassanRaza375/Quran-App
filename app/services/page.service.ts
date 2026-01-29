export const PageService = {
  getPageByNumber(pageNo: number) {
    const { $api2 } = useNuxtApp();
    return $api2(`http://api.alquran.cloud/v1/page/${pageNo}/quran-uthmani`);
  },
};
