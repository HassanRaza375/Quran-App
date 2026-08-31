// Commands & Prohibitions — directory/search state (Phase 9). Mirrors
// useSigns.ts's shape.
import { QURAN_COMMANDS, getCommandById } from "~/data/quranCommands";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";
import { getStoryById } from "~/data/quranStories";
import { getThemeById } from "~/data/quranThemes";
import { getDuaById } from "~/data/quranDuas";
import { getEventById } from "~/data/quranEvents";
import { getSignById } from "~/data/quranSigns";
import {
  filterByCommandType,
  filterByCommandPerson,
  searchCommands,
  type CommandTypeFilter,
} from "~/utils/commandsSearch";

export const useCommands = () => {
  const query = useState<string>("commands-search-query", () => "");
  const type = useState<CommandTypeFilter>("commands-type-filter", () => "all");
  const personFilter = useState<string | null>("commands-person-filter", () => null);

  const filteredCommands = computed(() => {
    let list = filterByCommandType(QURAN_COMMANDS, type.value);
    list = searchCommands(list, query.value);
    if (personFilter.value) list = filterByCommandPerson(list, personFilter.value);
    return list;
  });

  const setQuery = (q: string) => {
    query.value = q;
  };
  const setType = (t: CommandTypeFilter) => {
    type.value = t;
  };
  const setPersonFilter = (personId: string | null) => {
    personFilter.value = personId;
  };
  const resetFilters = () => {
    query.value = "";
    type.value = "all";
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

  const resolveSign = (signId: string) => {
    const target = getSignById(signId);
    if (target) return { name: target.title, href: `/signs/${target.id}` };
    return { name: signId, href: null };
  };

  return {
    commands: QURAN_COMMANDS,
    query,
    type,
    personFilter,
    filteredCommands,
    setQuery,
    setType,
    setPersonFilter,
    resetFilters,
    getCommandById,
    resolvePerson,
    resolveCommunity,
    resolvePlace,
    resolveStory,
    resolveTheme,
    resolveDua,
    resolveEvent,
    resolveSign,
  };
};
