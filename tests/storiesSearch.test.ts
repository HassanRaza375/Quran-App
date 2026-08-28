import { describe, expect, it } from "vitest";
import { filterByPersonId, filterByStoryType, parseExactReference, searchStories } from "../app/utils/storiesSearch";
import type { QuranStory } from "../app/data/quranStories";

const make = (overrides: Partial<QuranStory>): QuranStory => ({
  id: "test",
  title: "Test Story",
  arabicTitle: "قصة اختبار",
  storyType: "individual_narrative",
  narrativeStatus: "quran_complete",
  shortDescription: "A test story for unit tests.",
  primaryPassages: [{ id: "p1", surahNumber: 12, ayahStart: 4, ayahEnd: 10, source: "quran", verificationStatus: "verified" }],
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("12:4")).toEqual({ surahNumber: 12, ayahNumber: 4 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Yusuf")).toBeNull();
  });
});

describe("searchStories", () => {
  const stories = [
    make({ id: "a", title: "Yusuf", arabicTitle: "يوسف", themes: ["Patience"] }),
    make({ id: "b", title: "Nuh and the Flood", arabicTitle: "نوح", themes: ["Steadfastness"], primaryPassages: [{ id: "p2", surahNumber: 71, ayahStart: 1, ayahEnd: 28, source: "quran", verificationStatus: "verified" }] }),
  ];

  it("returns all stories for an empty query", () => {
    expect(searchStories(stories, "")).toHaveLength(2);
  });

  it("matches by title (case-insensitive)", () => {
    expect(searchStories(stories, "yusuf").map((s) => s.id)).toEqual(["a"]);
  });

  it("matches by theme text", () => {
    expect(searchStories(stories, "steadfastness").map((s) => s.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against primary passages", () => {
    expect(searchStories(stories, "12:5").map((s) => s.id)).toEqual(["a"]);
  });

  it("resolves an exact surah:ayah reference falling inside an episode passage", () => {
    const withEpisode = [
      make({ id: "c", title: "Episode Test", primaryPassages: [{ id: "p3", surahNumber: 18, ayahStart: 60, ayahEnd: 65, source: "quran", verificationStatus: "verified" }], episodes: [{ id: "ep1", title: "Ep", summary: "s", passages: [{ id: "ep1-p1", surahNumber: 18, ayahStart: 71, ayahEnd: 71, source: "quran", verificationStatus: "verified" }] }] }),
    ];
    expect(searchStories(withEpisode, "18:71").map((s) => s.id)).toEqual(["c"]);
  });
});

describe("filterByStoryType", () => {
  const stories = [
    make({ id: "a", storyType: "prophetic_narrative" }),
    make({ id: "b", storyType: "group_narrative" }),
  ];

  it("returns all for 'all'", () => {
    expect(filterByStoryType(stories, "all")).toHaveLength(2);
  });

  it("filters to an exact storyType match", () => {
    expect(filterByStoryType(stories, "group_narrative").map((s) => s.id)).toEqual(["b"]);
  });
});

describe("filterByPersonId", () => {
  const stories = [
    make({ id: "a", personIds: ["musa", "harun"] }),
    make({ id: "b", personIds: ["yusuf"] }),
  ];

  it("filters to stories containing the given person id", () => {
    expect(filterByPersonId(stories, "musa").map((s) => s.id)).toEqual(["a"]);
  });

  it("returns empty for a person id in no story", () => {
    expect(filterByPersonId(stories, "adam")).toHaveLength(0);
  });
});
