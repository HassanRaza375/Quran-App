import { describe, expect, it } from "vitest";
import { QURAN_PERSONS } from "../app/data/quranPersons";
import {
  CATEGORY_FILTERS,
  filterByCategory,
  groupDirectMentionsBySurah,
  groupRelatedPassagesBySurah,
  parseExactReference,
  searchPersons,
  sortRelatedPassagesForStoryView,
} from "../app/utils/personsSearch";

describe("searchPersons", () => {
  it("returns everyone for an empty query", () => {
    expect(searchPersons(QURAN_PERSONS, "")).toHaveLength(QURAN_PERSONS.length);
    expect(searchPersons(QURAN_PERSONS, "   ")).toHaveLength(QURAN_PERSONS.length);
  });

  it("matches by English name, case-insensitively and partially", () => {
    const results = searchPersons(QURAN_PERSONS, "nuh");
    expect(results.map((p) => p.id)).toContain("nuh");
    expect(searchPersons(QURAN_PERSONS, "NUH").map((p) => p.id)).toContain("nuh");
    expect(searchPersons(QURAN_PERSONS, "nu").map((p) => p.id)).toContain("nuh");
  });

  it("matches by Arabic name", () => {
    const results = searchPersons(QURAN_PERSONS, "نوح");
    expect(results.map((p) => p.id)).toContain("nuh");
  });

  it("matches by alternate (English) name", () => {
    const results = searchPersons(QURAN_PERSONS, "moses");
    expect(results.map((p) => p.id)).toContain("musa");
  });

  it("matches by theme", () => {
    const results = searchPersons(QURAN_PERSONS, "patience");
    const ids = results.map((p) => p.id);
    expect(ids).toContain("nuh");
    expect(ids).toContain("yusuf");
  });

  it("matches by primary category", () => {
    const results = searchPersons(QURAN_PERSONS, "woman");
    expect(results.map((p) => p.id)).toContain("maryam");
  });

  it("returns no results for a nonsense query", () => {
    expect(searchPersons(QURAN_PERSONS, "xyzzy-not-a-real-thing")).toHaveLength(0);
  });

  it("resolves an exact surah:ayah reference to the right person(s)", () => {
    // Hud 11:25 is one of Nuh's curated direct mentions.
    const results = searchPersons(QURAN_PERSONS, "11:25");
    expect(results.map((p) => p.id)).toContain("nuh");
  });

  it("resolves an exact reference that falls inside a related passage range, not just a direct mention", () => {
    // Yusuf 12:60 is inside a related-passage range but not a directMentions entry.
    const results = searchPersons(QURAN_PERSONS, "12:60");
    expect(results.map((p) => p.id)).toContain("yusuf");
  });

  it("falls back to text search when an exact reference matches nobody", () => {
    // No curated person references 114:1 (An-Nas) — should not error, just return [].
    const results = searchPersons(QURAN_PERSONS, "114:1");
    expect(results).toEqual([]);
  });
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah string", () => {
    expect(parseExactReference("11:25")).toEqual({ surahNumber: 11, ayahNumber: 25 });
  });

  it("rejects an out-of-range surah number", () => {
    expect(parseExactReference("200:1")).toBeNull();
  });

  it("rejects malformed input", () => {
    expect(parseExactReference("nuh")).toBeNull();
    expect(parseExactReference("11-25")).toBeNull();
    expect(parseExactReference("")).toBeNull();
  });
});

describe("filterByCategory", () => {
  it("'all' returns every person unfiltered", () => {
    expect(filterByCategory(QURAN_PERSONS, "all")).toHaveLength(QURAN_PERSONS.length);
  });

  it("filters strictly by primaryCategory when there's no secondary match", () => {
    const prophets = filterByCategory(QURAN_PERSONS, "prophet");
    expect(prophets.every((p) => p.primaryCategory === "prophet")).toBe(true);
    expect(prophets.map((p) => p.id)).toContain("nuh");
  });

  it("also matches via secondaryCategories, not just primaryCategory", () => {
    // Maryam: primary "woman", secondary includes "family_relative".
    const results = filterByCategory(QURAN_PERSONS, "family_relative");
    expect(results.map((p) => p.id)).toContain("maryam");
  });

  it("every CATEGORY_FILTERS value round-trips through filterByCategory without throwing", () => {
    for (const c of CATEGORY_FILTERS) {
      expect(() => filterByCategory(QURAN_PERSONS, c.value)).not.toThrow();
    }
  });
});

describe("groupDirectMentionsBySurah", () => {
  it("groups Nuh's direct mentions by surah, ascending by surah then ayah", () => {
    const nuh = QURAN_PERSONS.find((p) => p.id === "nuh")!;
    const groups = groupDirectMentionsBySurah(nuh);

    expect(groups.length).toBeGreaterThan(1);
    const surahNumbers = groups.map((g) => g.surahNumber);
    expect(surahNumbers).toEqual([...surahNumbers].sort((a, b) => a - b));

    for (const group of groups) {
      const ayahs = group.references.map((r) => r.ayahNumber);
      expect(ayahs).toEqual([...ayahs].sort((a, b) => (a ?? 0) - (b ?? 0)));
    }
  });

  it("every reference in every group actually belongs to that surah", () => {
    for (const person of QURAN_PERSONS) {
      for (const group of groupDirectMentionsBySurah(person)) {
        expect(group.references.every((r) => r.surahNumber === group.surahNumber)).toBe(true);
      }
    }
  });
});

describe("groupRelatedPassagesBySurah / sortRelatedPassagesForStoryView", () => {
  it("groups related passages by surah", () => {
    const yusuf = QURAN_PERSONS.find((p) => p.id === "yusuf")!;
    const groups = groupRelatedPassagesBySurah(yusuf);
    // All of Yusuf's curated passages are in surah 12.
    expect(groups).toHaveLength(1);
    expect(groups[0].surahNumber).toBe(12);
    expect(groups[0].references).toHaveLength(yusuf.relatedPassages.length);
  });

  it("story view sorts by storyOrder ascending", () => {
    const yusuf = QURAN_PERSONS.find((p) => p.id === "yusuf")!;
    const ordered = sortRelatedPassagesForStoryView(yusuf);
    const orders = ordered.map((p) => p.storyOrder);
    expect(orders).toEqual([...orders].sort((a, b) => (a ?? 0) - (b ?? 0)));
  });

  it("story view does not drop or duplicate any passage", () => {
    for (const person of QURAN_PERSONS) {
      const ordered = sortRelatedPassagesForStoryView(person);
      expect(ordered).toHaveLength(person.relatedPassages.length);
      expect(new Set(ordered.map((p) => p.id)).size).toBe(person.relatedPassages.length);
    }
  });
});
