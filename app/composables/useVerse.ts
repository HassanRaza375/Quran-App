import { VerseService } from "~/services/verse.service";
export const useVerse = () => {
  const getVerse = async (surahNo: number, ayahNo: number) => {
    try {
      let response;
      response = await VerseService.getVerseByNumber(surahNo, ayahNo);
      return response;
    } catch (err: any) {
      throw createError({
        statusCode: 500,
        statusMessage: err.message,
      });
    }
  };

  return {
    getVerse,
  };
};
