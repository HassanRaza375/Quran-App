// Stories — directory/search state (Phase 4). Mirrors usePlaces.ts's shape.
import { QURAN_STORIES, getStoryById } from "~/data/quranStories";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";
import { surahLabel } from "~/composables/usePersons";
import {
  filterByStoryType,
  searchStories,
  type StoryTypeFilter,
} from "~/utils/storiesSearch";

export const useStories = () => {
  const query = useState<string>("stories-search-query", () => "");
  const storyType = useState<StoryTypeFilter>("stories-type-filter", () => "all");

  const filteredStories = computed(() => {
    const byType = filterByStoryType(QURAN_STORIES, storyType.value);
    return searchStories(byType, query.value);
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setStoryType = (t: StoryTypeFilter) => {
    storyType.value = t;
  };
  const resetFilters = () => {
    query.value = "";
    storyType.value = "all";
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

  return {
    stories: QURAN_STORIES,
    query,
    storyType,
    filteredStories,
    setQuery,
    setStoryType,
    resetFilters,
    getStoryById,
    resolvePerson,
    resolveCommunity,
    resolvePlace,
    resolveStory,
  };
};

/** Sequential "play this passage" queue — same rationale as
 * usePlacePassageQueue (Phase 3): a small parallel composable on the same
 * shared global player. Flattens primary + supporting + episode passages
 * into one playable sequence when "Play all" is used at the story level;
 * a single episode/passage can also be queued alone. */
export const useStoryPassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("stories-passage-queue", () => []);
  const queueIndex = useState("stories-passage-queue-index", () => -1);
  const queueLabel = useState("stories-passage-queue-label", () => "");

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
        subtitle: "Story passage",
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
