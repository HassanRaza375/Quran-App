export const ChaptersService = {
  getChapterByNumber(chNo: number) {
    const { $api } = useNuxtApp();
    return $api(`/${chNo}.json`);
  },
};
