// Verifies the Stories seed dataset against real Quran structure and
// against the Persons/Peoples/Places datasets it cross-links — mirrors
// tests/placesDataset.test.ts's pattern for Phase 4's own dataset/validator.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_STORIES, getStoryById } from "../app/data/quranStories";
import { validateStoryDataset, validateStory } from "../app/utils/storiesValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_STORIES dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds and cross-module ids", () => {
    const issues = validateStoryDataset(QURAN_STORIES, surahs);
    expect(issues).toEqual([]);
  });

  it("has 21 stories", () => {
    expect(QURAN_STORIES.length).toBe(21);
  });

  it("every story has a unique, non-empty id", () => {
    const ids = QURAN_STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every storyType is one of the defined classifications", () => {
    const valid = new Set(["prophetic_narrative", "individual_narrative", "group_narrative", "communal_narrative", "journey_narrative"]);
    for (const s of QURAN_STORIES) expect(valid.has(s.storyType)).toBe(true);
  });

  it("every narrativeStatus is one of the 3 defined values", () => {
    const valid = new Set(["quran_complete", "quran_primary_traditional_expansion", "quran_fragmentary"]);
    for (const s of QURAN_STORIES) expect(valid.has(s.narrativeStatus)).toBe(true);
  });

  it("every lesson's basis is one of the 3 defined values", () => {
    const valid = new Set(["quran_explicit", "derived_thematic", "traditional_interpretation"]);
    for (const s of QURAN_STORIES) {
      for (const lesson of s.lessons ?? []) expect(valid.has(lesson.basis)).toBe(true);
    }
  });

  it("every episode has a unique id within its own parent story", () => {
    for (const s of QURAN_STORIES) {
      const ids = (s.episodes ?? []).map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("every episode has at least one passage", () => {
    for (const s of QURAN_STORIES) {
      for (const ep of s.episodes ?? []) expect(ep.passages.length).toBeGreaterThan(0);
    }
  });

  it("flags an out-of-range episode passage as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      title: "Test",
      arabicTitle: "تست",
      storyType: "individual_narrative" as const,
      narrativeStatus: "quran_complete" as const,
      shortDescription: "test",
      primaryPassages: [{ id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const }],
      episodes: [{ id: "ep1", title: "Bad episode", summary: "x", passages: [{ id: "ep1-p1", surahNumber: 1, ayahStart: 1, ayahEnd: 999, source: "quran" as const, verificationStatus: "verified" as const }] }],
    };
    const issues = validateStory(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("flags a duplicate story id across the dataset", () => {
    const dup = [...QURAN_STORIES, { ...QURAN_STORIES[0] }];
    const issues = validateStoryDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate story id"))).toBe(true);
  });

  it("flags a relatedStoryIds entry that doesn't resolve within the dataset", () => {
    const withBadRelated = QURAN_STORIES.map((s) =>
      s.id === QURAN_STORIES[0].id ? { ...s, relatedStoryIds: ["this-does-not-exist"] } : s
    );
    const issues = validateStoryDataset(withBadRelated, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to a Story"))).toBe(true);
  });

  it("Musa's narrative is split into 3 distinct stories (Pharaoh, Bani Isra'il, Khidr), not one mega-story", () => {
    expect(getStoryById("musaandpharaoh")).toBeDefined();
    expect(getStoryById("musaandbaniisrael")).toBeDefined();
    expect(getStoryById("musaandkhidr")).toBeDefined();
  });

  it("Ibrahim's narrative is ONE story with 4 episodes, not 4 separate stories", () => {
    const ibrahim = getStoryById("ibrahimnarrative");
    expect(ibrahim?.episodes?.length).toBe(4);
    expect(getStoryById("ibrahimandidols")).toBeUndefined();
    expect(getStoryById("ibrahimandthefire")).toBeUndefined();
  });

  it("The Night Journey discloses the Mi'raj as hadith-based, not Qur'anic narration", () => {
    const story = getStoryById("thenightjourney");
    expect(story?.narrativeStatus).toBe("quran_primary_traditional_expansion");
    expect(story?.sources?.some((s) => s.type === "authentic_hadith")).toBe(true);
  });

  it("The Two Gardens parable and Sabbath-breakers are NOT duplicated as Stories (documented exclusions)", () => {
    const ids = new Set(QURAN_STORIES.map((s) => s.id));
    expect(ids.has("gardenmen")).toBe(false);
    expect(ids.has("thetwogardens")).toBe(false);
    expect(ids.has("sabbathbreakers")).toBe(false);
  });
});
