// Peoples & Nations — directory/search state (Phase 2). Mirrors
// usePersons.ts's shape (per MODULE_BLUEPRINT.md's Phase 0 foundation:
// reuse the useState + $storage pattern, not a new state-management
// approach). No passage-queue/"play all" composable here — Phase 2's own
// UX checklist doesn't ask for one, and individual reference/passage cards
// already carry their own per-ayah play button via the reused
// AyahReferenceCard/RelatedPassageCard components.
import { QURAN_COMMUNITIES, getCommunityById } from "~/data/quranPeoples";
import { getPersonById } from "~/data/quranPersons";
import { surahLabel } from "~/composables/usePersons";
import {
  filterByCommunityType,
  groupDirectMentionsBySurah,
  groupRelatedPassagesBySurah,
  searchCommunities,
  type CommunityTypeFilter,
} from "~/utils/peoplesSearch";

export const usePeoples = () => {
  const query = useState<string>("peoples-search-query", () => "");
  const communityType = useState<CommunityTypeFilter>("peoples-type-filter", () => "all");

  const filteredCommunities = computed(() => {
    const byType = filterByCommunityType(QURAN_COMMUNITIES, communityType.value);
    return searchCommunities(byType, query.value);
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setCommunityType = (t: CommunityTypeFilter) => {
    communityType.value = t;
  };
  const resetFilters = () => {
    query.value = "";
    communityType.value = "all";
  };

  /** Resolves a relationship's personId against the Persons module — falsy
   * `href` when the target isn't in that dataset, same discipline as
   * usePersons().resolveRelated (the UI renders those as plain text). */
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

  return {
    communities: QURAN_COMMUNITIES,
    query,
    communityType,
    filteredCommunities,
    setQuery,
    setCommunityType,
    resetFilters,
    getCommunityById,
    resolveAssociatedPerson,
    groupDirectMentionsBySurah,
    groupRelatedPassagesBySurah,
  };
};

/** Sequential "play this passage" queue, built on the same shared global
 * audio player as usePersonPassageQueue — reusing that composable directly
 * was considered, but its useState keys ("persons-passage-queue" etc.) and
 * its exported name would be misleading when actually playing Peoples &
 * Nations content, so this is a small parallel composable following the
 * identical mechanism (per MODULE_BLUEPRINT.md Phase 0: "a small per-module
 * 'play all' queue composable built on [useAudioPlayer's] endedAt tick,
 * exactly as usePersonPassageQueue does"), not a second audio player. */
export const useCommunityPassageQueue = () => {
  const { play, pause, playing, currentUrl, endedAt, nowPlaying } = useAudioPlayer();
  const { getVerse } = useVerse();

  const queue = useState("communities-passage-queue", () => []);
  const queueIndex = useState("communities-passage-queue-index", () => -1);
  const queueLabel = useState("communities-passage-queue-label", () => "");

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
