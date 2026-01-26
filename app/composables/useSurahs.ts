import { SurahsService } from "~/services/surahs.service";
export const useSurahs = () => {
  const getAll = async () => {
    return await SurahsService.getAllSurahs();
  };
  const getOne = async (chapterNo: number) => {
    return await SurahsService.getOneSurah(chapterNo);
  };

  return {
    getAll,
    getOne,
  };
};
