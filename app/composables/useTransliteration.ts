// Verse-level Qur'an transliteration (Phase 6 / Duas). New composable
// rather than an addition to useVerse.ts — this fetches from a DIFFERENT
// provider (api.alquran.cloud's "en.transliteration" edition) than
// useVerse.ts's quranapi.pages.dev, so folding it into that composable
// would blur what each one actually talks to. Mirrors useSearch.ts's own
// established pattern for calling alquran.cloud directly via `$fetch`
// (must be `https://`, per this app's documented CORS gotcha) rather than
// through the `$api`/`$api2` plugin, which are configured for the OTHER
// two providers. See app/data/quranDuas.ts's own header comment for the
// full sourcing/licensing decision this composable implements — nothing
// fetched here is stored; every call is live, cached only for the
// current render, same as every other piece of Qur'an content in this app.
interface AlQuranCloudAyahResponse {
  code: number;
  data?: { text?: string };
}

const cache = new Map<string, string | null>();

export const useTransliteration = () => {
  const getTransliteration = async (surahNo: number, ayahNo: number): Promise<string | null> => {
    const key = `${surahNo}:${ayahNo}`;
    if (cache.has(key)) return cache.get(key) ?? null;

    try {
      const res = await $fetch<AlQuranCloudAyahResponse>(
        `https://api.alquran.cloud/v1/ayah/${surahNo}:${ayahNo}/en.transliteration`
      );
      const text = res?.data?.text ?? null;
      cache.set(key, text);
      return text;
    } catch {
      cache.set(key, null);
      return null;
    }
  };

  return { getTransliteration };
};
