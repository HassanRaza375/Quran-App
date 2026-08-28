// Events — directory/search state (Phase 7). Mirrors useDuas.ts's shape.
import { QURAN_EVENTS, getEventById } from "~/data/quranEvents";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";
import { getStoryById } from "~/data/quranStories";
import { getThemeById } from "~/data/quranThemes";
import { getDuaById } from "~/data/quranDuas";
import { surahLabel } from "~/composables/usePersons";
import {
  filterByEventCategory,
  filterByEventPerson,
  searchEvents,
  type EventCategoryFilter,
} from "~/utils/eventsSearch";

export const useEvents = () => {
  const query = useState<string>("events-search-query", () => "");
  const category = useState<EventCategoryFilter>("events-category-filter", () => "all");
  const personFilter = useState<string | null>("events-person-filter", () => null);

  const filteredEvents = computed(() => {
    let list = filterByEventCategory(QURAN_EVENTS, category.value);
    list = searchEvents(list, query.value);
    if (personFilter.value) list = filterByEventPerson(list, personFilter.value);
    return list;
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setCategory = (c: EventCategoryFilter) => {
    category.value = c;
  };
  const setPersonFilter = (personId: string | null) => {
    personFilter.value = personId;
  };
  const resetFilters = () => {
    query.value = "";
    category.value = "all";
    personFilter.value = null;
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

  const resolveDua = (duaId: string) => {
    const target = getDuaById(duaId);
    if (target) return { name: target.title, href: `/duas/${target.id}` };
    return { name: duaId, href: null };
  };

  const resolveEvent = (eventId: string) => {
    const target = getEventById(eventId);
    if (target) return { name: target.title, href: `/events/${target.id}` };
    return { name: eventId, href: null };
  };

  /** How many Events reference a given Person id — used by
   * PropheticTimeline.vue's small additive "N related events" link, so
   * the timeline itself never needs to import the Events dataset logic
   * beyond this one count. */
  const eventCountForPerson = (personId: string): number =>
    QURAN_EVENTS.filter((e) => e.personIds?.includes(personId)).length;

  return {
    events: QURAN_EVENTS,
    query,
    category,
    personFilter,
    filteredEvents,
    setQuery,
    setCategory,
    setPersonFilter,
    resetFilters,
    getEventById,
    resolvePerson,
    resolveCommunity,
    resolvePlace,
    resolveStory,
    resolveTheme,
    resolveDua,
    resolveEvent,
    eventCountForPerson,
  };
};

/** Sequential "play this passage" queue — same rationale as
 * useDuaPassageQueue (Phase 6): a small parallel composable on the same
 * shared global player, not a second audio system. */
export const useEventPassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("events-passage-queue", () => []);
  const queueIndex = useState("events-passage-queue-index", () => -1);
  const queueLabel = useState("events-passage-queue-label", () => "");

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
        subtitle: "Event passage",
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
