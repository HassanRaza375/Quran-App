// Duas — directory/search state (Phase 6). Mirrors useThemes.ts's shape.
import { QURAN_DUAS, getDuaById } from "~/data/quranDuas";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";
import { getStoryById } from "~/data/quranStories";
import { getThemeById } from "~/data/quranThemes";
import { surahLabel } from "~/composables/usePersons";
import {
  filterByDuaCategory,
  filterByDuaSpeaker,
  searchDuas,
  type DuaCategoryFilter,
} from "~/utils/duasSearch";

export const useDuas = () => {
  const query = useState<string>("duas-search-query", () => "");
  const category = useState<DuaCategoryFilter>("duas-category-filter", () => "all");
  const speakerFilter = useState<string | null>("duas-speaker-filter", () => null);

  const filteredDuas = computed(() => {
    let list = filterByDuaCategory(QURAN_DUAS, category.value);
    list = searchDuas(list, query.value);
    if (speakerFilter.value) list = filterByDuaSpeaker(list, speakerFilter.value);
    return list;
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setCategory = (c: DuaCategoryFilter) => {
    category.value = c;
  };
  const setSpeakerFilter = (personId: string | null) => {
    speakerFilter.value = personId;
  };
  const resetFilters = () => {
    query.value = "";
    category.value = "all";
    speakerFilter.value = null;
  };

  const resolvePerson = (personId: string) => {
    const target = getPersonById(personId);
    if (target) {
      return {
        name: target.honorific?.short ? `${target.name} (${target.honorific.short})` : target.name,
        href: `/persons/${target.id}`,
      };
    }
    return { name: personId, href: null };
  };

  const resolveCommunity = (communityId: string) => {
    const target = getCommunityById(communityId);
    if (target) return { name: target.name, href: `/peoples/${target.id}` };
    return { name: communityId, href: null };
  };

  const resolvePlace = (placeId: string) => {
    const target = getPlaceById(placeId);
    if (target) return { name: target.name, href: `/places/${target.id}` };
    return { name: placeId, href: null };
  };

  const resolveStory = (storyId: string) => {
    const target = getStoryById(storyId);
    if (target) return { name: target.title, href: `/stories/${target.id}` };
    return { name: storyId, href: null };
  };

  const resolveTheme = (themeId: string) => {
    const target = getThemeById(themeId);
    if (target) return { name: target.name, href: `/themes/${target.id}` };
    return { name: themeId, href: null };
  };

  /** Speaker display label for any dua, regardless of speakerType —
   * centralizes the "person vs. generic label" branching so the UI
   * doesn't have to. */
  const speakerDisplay = (dua: { speakerType: string; personId?: string; speakerLabel?: string }) => {
    if (dua.speakerType === "person" && dua.personId) return resolvePerson(dua.personId);
    return { name: dua.speakerLabel ?? "Unknown", href: null };
  };

  return {
    duas: QURAN_DUAS,
    query,
    category,
    speakerFilter,
    filteredDuas,
    setQuery,
    setCategory,
    setSpeakerFilter,
    resetFilters,
    getDuaById,
    resolvePerson,
    resolveCommunity,
    resolvePlace,
    resolveStory,
    resolveTheme,
    speakerDisplay,
  };
};

/** Sequential "play this passage" queue — same rationale as
 * useThemePassageQueue (Phase 5): a small parallel composable on the same
 * shared global player, not a second audio system. */
export const useDuaPassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("duas-passage-queue", () => []);
  const queueIndex = useState("duas-passage-queue-index", () => -1);
  const queueLabel = useState("duas-passage-queue-label", () => "");

  const isQueueActive = computed(() => queueIndex.value >= 0 && queueIndex.value < queue.value.length);
  const isQueuePlaying = computed(() => isQueueActive.value && playing.value);

  const stopQueue = () => {
    queue.value = [];
    queueIndex.value = -1;
  };

  const playQueueItem = async (i) => {
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
        await playQueueItem(i + 1);
        return;
      }
      await play(url, {
        type: "ayah",
        surahNo: item.surahNo,
        title: `${queueLabel.value} — ${surahLabel(item.surahNo)} ${item.ayahNo}`,
        subtitle: "Dua passage",
      });
    } catch {
      await playQueueItem(i + 1);
    }
  };

  const playPassages = (label, passages) => {
    const items = [];
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

  return { queue, queueIndex, isQueueActive, isQueuePlaying, playPassages, toggleQueuePlayback, stopQueue };
};
