import { TafsirService } from "~/services/tafsir.service";

export interface TafsirEntry {
  author: string;
  groupVerse: string | null;
  content: string;
}

// Module-scope cache shared across the whole app session — tafsir text is
// large (tens of KB for some entries) and doesn't change, so there's no
// reason to refetch it every time a panel is toggled closed and reopened.
const tafsirCache = new Map<string, TafsirEntry[]>();

export const useTafsir = () => {
  const getTafsir = async (
    surahNo: number,
    ayahNo: number
  ): Promise<TafsirEntry[]> => {
    const key = `${surahNo}_${ayahNo}`;
    if (tafsirCache.has(key)) return tafsirCache.get(key)!;

    const data: any = await TafsirService.getTafsirByAyah(surahNo, ayahNo);
    const tafsirs: TafsirEntry[] = data?.tafsirs || [];
    tafsirCache.set(key, tafsirs);
    return tafsirs;
  };

  return { getTafsir };
};
