export interface ReadingProgress {
  surahNo: number;
  ayahNo: number;
  surahName: string;
  surahNameArabic: string;
  totalAyah: number;
  updatedAt: number;
}

const STORAGE_KEY = "quran:reading-progress:v1";

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
    const readSoFar = await getAbsoluteAyahPosition(progress.value.surahNo, progress.value.ayahNo);
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
