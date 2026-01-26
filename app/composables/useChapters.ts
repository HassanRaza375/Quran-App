import { ChaptersService } from "~/services/chapters.service";

export const useChapters = () => {
  const getChapter = async (id: number) => {
    return await ChaptersService.getChapterByNumber(id);
  };

  return {
    getChapter,
  };
};
