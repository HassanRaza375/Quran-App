// Places — directory/search state (Phase 3). Mirrors usePeoples.ts's shape.
import { QURAN_PLACES, getPlaceById } from "~/data/quranPlaces";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { surahLabel } from "~/composables/usePersons";
import {
  filterByPlaceType,
  groupDirectMentionsBySurah,
  groupRelatedPassagesBySurah,
  searchPlaces,
  type PlaceTypeFilter,
} from "~/utils/placesSearch";

export const usePlaces = () => {
  const query = useState<string>("places-search-query", () => "");
  const placeType = useState<PlaceTypeFilter>("places-type-filter", () => "all");

  const filteredPlaces = computed(() => {
    const byType = filterByPlaceType(QURAN_PLACES, placeType.value);
    return searchPlaces(byType, query.value);
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setPlaceType = (t: PlaceTypeFilter) => {
    placeType.value = t;
  };
  const resetFilters = () => {
    query.value = "";
    placeType.value = "all";
  };

  const resolveAssociatedPerson = (personId: string) => {
    const target = getPersonById(personId);
    if (target) {
      return {
        name: target.honorific?.short ? `${target.name} (${target.honorific.short})` : target.name,
        href: `/persons/${target.id}`,
      };
    }
    return { name: personId, href: null };
  };

  const resolveAssociatedCommunity = (communityId: string) => {
    const target = getCommunityById(communityId);
    if (target) return { name: target.name, href: `/peoples/${target.id}` };
    return { name: communityId, href: null };
  };

  const resolveRelatedPlace = (placeId: string) => {
    const target = getPlaceById(placeId);
    if (target) return { name: target.name, href: `/places/${target.id}` };
    return { name: placeId, href: null };
  };

  return {
    places: QURAN_PLACES,
    query,
    placeType,
    filteredPlaces,
    setQuery,
    setPlaceType,
    resetFilters,
    getPlaceById,
    resolveAssociatedPerson,
    resolveAssociatedCommunity,
    resolveRelatedPlace,
    groupDirectMentionsBySurah,
    groupRelatedPassagesBySurah,
  };
};

/** Sequential "play this passage" queue — same rationale as
 * useCommunityPassageQueue (Phase 2): a small parallel composable built on
 * the same shared global player, not a second audio system. */
export const usePlacePassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("places-passage-queue", () => []);
  const queueIndex = useState("places-passage-queue-index", () => -1);
  const queueLabel = useState("places-passage-queue-label", () => "");

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
        subtitle: "Related passage",
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
