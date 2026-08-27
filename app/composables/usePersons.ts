// Prophets & Qur'anic Persons — directory/search/detail state.
// Implements prophets-quran-feature.md Phase 1 + Phase 2 scope (see
// MODULE_BLUEPRINT.md Module 17). Wraps the pure helpers in
// app/utils/personsSearch.ts with reactive state, matching this app's usual
// composable shape (useState + $storage for anything persisted).
import surahList from "~/assets/data/surah.json";
import { QURAN_PERSONS, getPersonById } from "~/data/quranPersons";
import {
  filterByCategory,
  groupDirectMentionsBySurah,
  groupRelatedPassagesBySurah,
  searchPersons,
  sortRelatedPassagesForStoryView,
  type CategoryFilter,
} from "~/utils/personsSearch";

/** `surahNo` -> `{ surahName, surahNameArabicLong, totalAyah }`, used to label
 * references without hardcoding surah names into the person dataset (per
 * prophets-quran-feature.md §18: "Do not hardcode complete Quran text..."
 * extended here to metadata too — reuse the app's existing surah list). */
export const getSurahMeta = (surahNo: number) => surahList.find((s) => s.surahNo === surahNo);
export const surahLabel = (surahNo: number) => {
  const meta = getSurahMeta(surahNo);
  return meta ? `${meta.surahName} (${surahNo})` : `Surah ${surahNo}`;
};

export const usePersons = () => {
  const query = useState<string>("persons-search-query", () => "");
  const category = useState<CategoryFilter>("persons-category-filter", () => "all");

  const filteredPersons = computed(() => {
    const byCategory = filterByCategory(QURAN_PERSONS, category.value);
    return searchPersons(byCategory, query.value);
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setCategory = (c: CategoryFilter) => {
    category.value = c;
  };
  const resetFilters = () => {
    query.value = "";
    category.value = "all";
  };

  /** Resolves a relationship's personId to a display name — falsy `href` when
   * the target isn't in this seed dataset yet (see personsValidate.ts note):
   * the caller should render those as plain text, not a link. */
  const resolveRelated = (personId: string) => {
    const target = getPersonById(personId);
    return {
      name: target?.name ?? personId,
      href: target ? `/persons/${target.id}` : null,
    };
  };

  return {
    persons: QURAN_PERSONS,
    query,
    category,
    filteredPersons,
    setQuery,
    setCategory,
    resetFilters,
    getPersonById,
    resolveRelated,
    groupDirectMentionsBySurah,
    groupRelatedPassagesBySurah,
    sortRelatedPassagesForStoryView,
  };
};

/** Sequential "Play all passages" queue (prophets-quran-feature.md §12),
 * built on the shared global audio player rather than a second player —
 * relies on useAudioPlayer's `endedAt` tick to auto-advance. */
export const usePersonPassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState<{ surahNo: number; ayahNo: number }[]>("persons-passage-queue", () => []);
  const queueIndex = useState<number>("persons-passage-queue-index", () => -1);
  const queueLabel = useState<string>("persons-passage-queue-label", () => "");

  const isQueueActive = computed(() => queueIndex.value >= 0 && queueIndex.value < queue.value.length);
  const isQueuePlaying = computed(() => isQueueActive.value && playing.value);

  const stopQueue = () => {
    queue.value = [];
    queueIndex.value = -1;
  };

  const playQueueItem = async (i: number) => {
    const item = queue.value[i];
    if (!item) {
      stopQueue();
      return;
    }
    queueIndex.value = i;
    try {
      const verse = await getVerse(item.surahNo, item.ayahNo);
      const url = verse?.audio?.["1"]?.url;
      if (!url) {
        // Skip ayahs with no available audio rather than stalling the queue.
        await playQueueItem(i + 1);
        return;
      }
      await play(url, {
        type: "ayah",
        surahNo: item.surahNo,
        title: `${queueLabel.value} — ${surahLabel(item.surahNo)} ${item.ayahNo}`,
        subtitle: "Related passage",
      });
    } catch {
      await playQueueItem(i + 1);
    }
  };

  /** Starts playing every ayah across a set of ranges, in order. */
  const playAllPassages = (
    label: string,
    passages: { surahNumber: number; ayahStart: number; ayahEnd: number }[]
  ) => {
    const items: { surahNo: number; ayahNo: number }[] = [];
    for (const p of passages) {
      for (let ayahNo = p.ayahStart; ayahNo <= p.ayahEnd; ayahNo++) {
        items.push({ surahNo: p.surahNumber, ayahNo });
      }
    }
    queueLabel.value = label;
    queue.value = items;
    playQueueItem(0);
  };

  const toggleQueuePlayback = () => {
    if (!isQueueActive.value) return;
    if (playing.value) pause();
    else play(currentUrl.value ?? "", nowPlaying.value ?? undefined);
  };

  watch(endedAt, () => {
    if (!isQueueActive.value) return;
    playQueueItem(queueIndex.value + 1);
  });

  return {
    queue,
    queueIndex,
    isQueueActive,
    isQueuePlaying,
    playAllPassages,
    toggleQueuePlayback,
    stopQueue,
  };
};
