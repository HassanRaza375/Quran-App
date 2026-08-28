// Dataset integrity checks for the Stories module (Phase 4). Mirrors
// app/utils/placesValidate.ts's pattern (independent file, zero risk to
// earlier phases' validators) plus the checks specific to this module's
// own data shape: episode id uniqueness within a parent (the only
// "integrity" concern that survives choosing an INLINE episode model —
// see quranStories.ts's own architecture-decision header comment for why
// there is no parent/child dangling-reference or circular-hierarchy check
// here: nested episodes have no id-based back-reference to go stale), and
// cross-module id resolution against the Persons/Peoples/Places datasets.
import type { QuranStory, StoryType, NarrativeStatus } from "~/data/quranStories";
import { getPersonById } from "~/data/quranPersons";
import { getCommunityById } from "~/data/quranPeoples";
import { getPlaceById } from "~/data/quranPlaces";

export interface SurahMeta {
  surahNo: number;
  totalAyah: number;
}

export interface ValidationIssue {
  storyId: string;
  message: string;
}

const VALID_STORY_TYPES: StoryType[] = [
  "prophetic_narrative", "individual_narrative", "group_narrative", "communal_narrative", "journey_narrative",
];
const VALID_NARRATIVE_STATUSES: NarrativeStatus[] = [
  "quran_complete", "quran_primary_traditional_expansion", "quran_fragmentary",
];
const VALID_SOURCE_TYPES = ["quran", "authentic_hadith", "traditional_account"];
const VALID_LESSON_BASES = ["quran_explicit", "derived_thematic", "traditional_interpretation"];

const isValidSurah = (surahNumber: number, surahs: SurahMeta[]): SurahMeta | undefined =>
  surahs.find((s) => s.surahNo === surahNumber);

const validatePassageBounds = (
  storyId: string,
  passages: { id: string; surahNumber: number; ayahStart: number; ayahEnd: number }[],
  surahs: SurahMeta[],
  push: (message: string) => void
) => {
  for (const passage of passages) {
    const surah = isValidSurah(passage.surahNumber, surahs);
    if (!surah) {
      push(`passages[${passage.id}]: surah ${passage.surahNumber} does not exist`);
      continue;
    }
    if (passage.ayahStart < 1 || passage.ayahEnd > surah.totalAyah) {
      push(`passages[${passage.id}]: range ${passage.ayahStart}-${passage.ayahEnd} is out of bounds (surah ${passage.surahNumber} has ${surah.totalAyah} ayahs)`);
    }
    if (passage.ayahStart > passage.ayahEnd) {
      push(`passages[${passage.id}]: ayahStart (${passage.ayahStart}) is after ayahEnd (${passage.ayahEnd})`);
    }
  }
};

export const validateStory = (story: QuranStory, surahs: SurahMeta[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const push = (message: string) => issues.push({ storyId: story.id, message });

  if (!story.id) push("missing id");
  if (!story.title) push("missing title");
  if (!story.arabicTitle) push("missing arabicTitle");
  if (!story.shortDescription) push("missing shortDescription");
  if (!VALID_STORY_TYPES.includes(story.storyType)) push(`invalid storyType "${story.storyType}"`);
  if (!VALID_NARRATIVE_STATUSES.includes(story.narrativeStatus)) {
    push(`invalid narrativeStatus "${story.narrativeStatus}"`);
  }
  if (!story.primaryPassages.length) push("must have at least one primary passage");

  validatePassageBounds(story.id, story.primaryPassages, surahs, push);
  validatePassageBounds(story.id, story.supportingPassages ?? [], surahs, push);

  // Episode checks — id uniqueness within this story, and each episode's
  // own passages validated the same as any top-level passage.
  const episodeIds = new Set<string>();
  for (const episode of story.episodes ?? []) {
    if (!episode.id) push("an episode is missing an id");
    if (episodeIds.has(episode.id)) push(`duplicate episode id "${episode.id}" within this story`);
    episodeIds.add(episode.id);
    if (!episode.title) push(`episode "${episode.id}" is missing a title`);
    if (!episode.passages.length) push(`episode "${episode.id}" has no passages`);
    validatePassageBounds(story.id, episode.passages, surahs, push);
  }

  // Cross-module resolution — every id must resolve to a real entity in
  // its target module's dataset (a stronger check than Phase 2/3's
  // "dangling allowed" precedent, justified here because Stories was
  // authored as one complete pass over already-existing modules, not an
  // incrementally-growing seed where forward references are expected).
  for (const personId of story.personIds ?? []) {
    if (!getPersonById(personId)) push(`personIds: "${personId}" does not resolve to a Persons-module entry`);
  }
  for (const communityId of story.communityIds ?? []) {
    if (!getCommunityById(communityId)) push(`communityIds: "${communityId}" does not resolve to a Peoples & Nations entry`);
  }
  for (const placeId of story.placeIds ?? []) {
    if (!getPlaceById(placeId)) push(`placeIds: "${placeId}" does not resolve to a Places entry`);
  }

  for (const lesson of story.lessons ?? []) {
    if (!VALID_LESSON_BASES.includes(lesson.basis)) push(`lessons: invalid basis "${lesson.basis}"`);
    if (!lesson.text) push("a lesson is missing text");
  }

  for (const source of story.sources ?? []) {
    if (!VALID_SOURCE_TYPES.includes(source.type)) push(`sources: invalid type "${source.type}"`);
  }

  return issues;
};

/** Cross-story checks: unique ids, and every relatedStoryIds entry
 * resolves within this same dataset (validated here, not per-story, since
 * it needs the full list). */
export const validateStoryDataset = (stories: QuranStory[], surahs: SurahMeta[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const story of stories) {
    if (ids.has(story.id)) issues.push({ storyId: story.id, message: `duplicate story id "${story.id}"` });
    ids.add(story.id);
    issues.push(...validateStory(story, surahs));
  }

  for (const story of stories) {
    for (const relatedId of story.relatedStoryIds ?? []) {
      if (!ids.has(relatedId)) {
        issues.push({ storyId: story.id, message: `relatedStoryIds: "${relatedId}" does not resolve to a Story in this dataset` });
      }
    }
  }

  return issues;
};
