import { JuzService } from "~/services/juz.service";
export const useJuz = () => {
  const getJuz = async (id) => {
    let response;
    response = await JuzService.getJuzByNumber(id);
    const ayahs = response?.data?.ayahs;

    if (!Array.isArray(ayahs)) {
      throw createError({
        statusCode: 500,
        statusMessage: "Unexpected API response format",
      });
    }
    // Group ayahs by surah
    const groupedBySurah = {};

    for (const ayah of ayahs) {
      const surahName = ayah.surah.name;

      if (!groupedBySurah[surahName]) {
        groupedBySurah[surahName] = {
          surah: ayah.surah,
          ayahs: [],
        };
      }

      groupedBySurah[surahName].ayahs.push(ayah);
    }

    return {
      juz: response.data.number,
      surahs: groupedBySurah,
    };
  };

  return {
    getJuz,
  };
};
