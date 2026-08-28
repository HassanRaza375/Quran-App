// Themes — directory/search state (Phase 5). Mirrors useStories.ts's shape.
import { QURAN_THEMES, getThemeById } from "~/data/quranThemes";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";
import { getStoryById } from "~/data/quranStories";
import { surahLabel } from "~/composables/usePersons";
import {
  filterByThemeCategory,
  searchThemes,
  type ThemeCategoryFilter,
} from "~/utils/themesSearch";

export const useThemes = () => {
  const query = useState<string>("themes-search-query", () => "");
  const category = useState<ThemeCategoryFilter>("themes-category-filter", () => "all");

  const filteredThemes = computed(() => {
    const byCategory = filterByThemeCategory(QURAN_THEMES, category.value);
    return searchThemes(byCategory, query.value);
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setCategory = (c: ThemeCategoryFilter) => {
    category.value = c;
  };
  const resetFilters = () => {
    query.value = "";
    category.value = "all";
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

  return {
    themes: QURAN_THEMES,
    query,
    category,
    filteredThemes,
    setQuery,
    setCategory,
    resetFilters,
    getThemeById,
    resolvePerson,
    resolveCommunity,
    resolvePlace,
    resolveStory,
    resolveTheme,
  };
};

/** Sequential "play this passage" queue — same rationale as
 * useStoryPassageQueue (Phase 4): a small parallel composable on the same
 * shared global player, not a second audio system. */
export const useThemePassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("themes-passage-queue", () => []);
  const queueIndex = useState("themes-passage-queue-index", () => -1);
  const queueLabel = useState("themes-passage-queue-label", () => "");

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
        subtitle: "Theme passage",
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
