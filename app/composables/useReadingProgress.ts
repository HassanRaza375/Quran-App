export interface ReadingProgress {
  surahNo: number;
  ayahNo: number;
  surahName: string;
  surahNameArabic: string;
  totalAyah: number;
  updatedAt: number;
}

const STORAGE_KEY = "quran:reading-progress:v1";
const TOTAL_QURAN_AYAHS = 6236;

// Cached across the whole app lifetime — surah.json only needs to be
// fetched once to compute cumulative ayah counts for the progress bar.
let prefixSumsPromise: Promise<number[]> | null = null;
const getPrefixSums = () => {
  if (!prefixSumsPromise) {
    prefixSumsPromise = import("~/assets/data/surah.json").then(
      ({ default: list }) => {
        const sums = [0];
        for (const s of list as { totalAyah: number }[]) {
          sums.push(sums[sums.length - 1] + s.totalAyah);
        }
        return sums; // sums[n] = total ayahs across surahs 1..n
      }
    );
  }
  return prefixSumsPromise;
};

export const useReadingProgress = () => {
  const progress = useState<ReadingProgress | null>(
    "reading-progress",
    () => null
  );
  const percent = useState<number>("reading-progress-percent", () => 0);

  const getStorage = () => useNuxtApp().$storage;

  const refreshPercent = async () => {
    if (!progress.value) {
      percent.value = 0;
      return;
    }
    const sums = await getPrefixSums();
    const readSoFar = (sums[progress.value.surahNo - 1] ?? 0) + progress.value.ayahNo;
    percent.value = Math.min(100, Math.round((readSoFar / TOTAL_QURAN_AYAHS) * 100));
  };

  const load = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    progress.value = $storage.get(STORAGE_KEY, null);
    refreshPercent();
  };

  const persist = () => {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    $storage.set(STORAGE_KEY, progress.value);
  };

  const setProgress = (
    surahNo: number,
    ayahNo: number,
    meta: Partial<Pick<ReadingProgress, "surahName" | "surahNameArabic" | "totalAyah">> = {}
  ) => {
    progress.value = {
      surahNo,
      ayahNo,
      surahName: meta.surahName ?? progress.value?.surahName ?? "",
      surahNameArabic: meta.surahNameArabic ?? progress.value?.surahNameArabic ?? "",
      totalAyah: meta.totalAyah ?? progress.value?.totalAyah ?? 0,
      updatedAt: Date.now(),
    };
    persist();
    refreshPercent();
  };

  const clear = () => {
    progress.value = null;
    percent.value = 0;
    persist();
  };

  return {
    progress,
    percent,
    load,
    setProgress,
    clear,
  };
};
