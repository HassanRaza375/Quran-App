const STORAGE_KEY = "quran:bookmarks:v1";

// key formats:
// surah:2
// ayah:2:255
// name:1
// sajda:2:206

const makeSurahKey = (surahNo) => `surah:${surahNo}`;
const makeAyahKey = (surahNo, ayahNo) => `ayah:${surahNo}:${ayahNo}`;
const makeNameKey = (id) => `name:${id}`;
const makeSajdaKey = (surahNo, ayahNo) => `sajda:${surahNo}:${ayahNo}`;

export function useBookmarks() {
  const items = useState("bookmarks", () => new Set());

  function getStorage() {
    return useNuxtApp().$storage;
  }

  function load() {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;

    const arr = $storage.get(STORAGE_KEY, []);
    items.value = new Set(arr);

    // ---- optional migration from old surah-only key ----
    const legacy = $storage.get("quran:favorites:surah:v1", []);
    if (Array.isArray(legacy) && legacy.length) {
      legacy.forEach((k) => items.value.add(k));
      $storage.set(STORAGE_KEY, Array.from(items.value));
      $storage.remove("quran:favorites:surah:v1");
    }
  }

  function persist() {
    if (!import.meta.client) return;
    const $storage = getStorage();
    if (!$storage) return;
    $storage.set(STORAGE_KEY, Array.from(items.value));
  }

  function has(key) {
    return items.value.has(key);
  }

  function add(key) {
    items.value.add(key);
    persist();
  }

  function remove(key) {
    items.value.delete(key);
    persist();
  }

  function toggle(key) {
    if (has(key)) remove(key);
    else add(key);
  }

  // ----- Surah helpers -----
  const isSurahBookmarked = (surahNo) => has(makeSurahKey(surahNo));
  const toggleSurah = (surahNo) => toggle(makeSurahKey(surahNo));
  const removeSurah = (surahNo) => remove(makeSurahKey(surahNo));

  // ----- Ayah helpers -----
  const isAyahBookmarked = (surahNo, ayahNo) =>
    has(makeAyahKey(surahNo, ayahNo));
  const toggleAyah = (surahNo, ayahNo) => toggle(makeAyahKey(surahNo, ayahNo));
  const removeAyah = (surahNo, ayahNo) => remove(makeAyahKey(surahNo, ayahNo));

  // ----- Name helpers -----
  const isNameBookmarked = (id) => has(makeNameKey(id));
  const toggleName = (id) => toggle(makeNameKey(id));
  const removeName = (id) => remove(makeNameKey(id));

  // ----- Sajda helpers -----
  const isSajdaBookmarked = (surahNo, ayahNo) =>
    has(makeSajdaKey(surahNo, ayahNo));
  const toggleSajda = (surahNo, ayahNo) =>
    toggle(makeSajdaKey(surahNo, ayahNo));
  const removeSajda = (surahNo, ayahNo) =>
    remove(makeSajdaKey(surahNo, ayahNo));

  const list = computed(() => Array.from(items.value));

  return {
    load,
    list,

    // generic
    has,
    add,
    remove,
    toggle,

    // key makers
    makeSurahKey,
    makeAyahKey,
    makeNameKey,
    makeSajdaKey,

    // surah
    isSurahBookmarked,
    toggleSurah,
    removeSurah,

    // ayah
    isAyahBookmarked,
    toggleAyah,
    removeAyah,

    // name
    isNameBookmarked,
    toggleName,
    removeName,

    // sajda
    isSajdaBookmarked,
    toggleSajda,
    removeSajda,
  };
}
