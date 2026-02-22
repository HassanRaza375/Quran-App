import { SurahsService } from "~/services/surahs.service";
import surahsJson from "../assets/data/surah.json";

export const useSurahs = () => {
  const getAll = async () => {
    return await SurahsService.getAllSurahs();
  };
  const getOne = async (chapterNo: number) => {
    return await SurahsService.getOneSurah(chapterNo);
  };

  const surahs = surahsJson;

  // search function
  const search = (query: string) => {
    if (!query) return surahs;

    const q = query.toLowerCase();

    return surahs.filter(
      (s: any) =>
        s.surahName.toLowerCase().includes(q) ||
        s.surahNameTranslation.toLowerCase().includes(q) ||
        s.surahNameArabicLong.includes(query) ||
        s.revelationPlace.toLowerCase().includes(q),
    );
  };
  return {
    getAll,
    getOne,
    surahs,
    search,
  };
};
