// Signs & Miracles — directory/search state (Phase 8). Mirrors
// useEvents.ts's shape.
import { QURAN_SIGNS, getSignById } from "~/data/quranSigns";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";
import { getStoryById } from "~/data/quranStories";
import { getThemeById } from "~/data/quranThemes";
import { getDuaById } from "~/data/quranDuas";
import { getEventById } from "~/data/quranEvents";
import {
  filterBySignClassification,
  filterBySignPerson,
  searchSigns,
  type SignClassificationFilter,
} from "~/utils/signsSearch";

export const useSigns = () => {
  const query = useState<string>("signs-search-query", () => "");
  const classification = useState<SignClassificationFilter>("signs-classification-filter", () => "all");
  const personFilter = useState<string | null>("signs-person-filter", () => null);

  const filteredSigns = computed(() => {
    let list = filterBySignClassification(QURAN_SIGNS, classification.value);
    list = searchSigns(list, query.value);
    if (personFilter.value) list = filterBySignPerson(list, personFilter.value);
    return list;
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setClassification = (c: SignClassificationFilter) => {
    classification.value = c;
  };
  const setPersonFilter = (personId: string | null) => {
    personFilter.value = personId;
  };
  const resetFilters = () => {
    query.value = "";
    classification.value = "all";
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

  return {
    signs: QURAN_SIGNS,
    query,
    classification,
    personFilter,
    filteredSigns,
    setQuery,
    setClassification,
    setPersonFilter,
    resetFilters,
    getSignById,
    resolvePerson,
    resolveCommunity,
    resolvePlace,
    resolveStory,
    resolveTheme,
    resolveDua,
    resolveEvent,
  };
};
