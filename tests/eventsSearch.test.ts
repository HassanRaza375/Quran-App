import { describe, expect, it } from "vitest";
import { filterByEventCategory, filterByEventPerson, parseExactReference, searchEvents } from "../app/utils/eventsSearch";
import type { QuranEvent } from "../app/data/quranEvents";

const make = (overrides: Partial<QuranEvent>): QuranEvent => ({
  id: "test",
  title: "Test Event",
  arabicTitle: "حدث اختبار",
  category: "trial",
  sourceBasis: "quran_explicit",
  chronologyStatus: "unknown",
  description: "A test description.",
  passage: { id: "p1", surahNumber: 21, ayahStart: 87, ayahEnd: 87, source: "quran", verificationStatus: "verified" },
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("20:83")).toEqual({ surahNumber: 20, ayahNumber: 83 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Badr")).toBeNull();
  });
});

describe("searchEvents", () => {
  const events = [
    make({ id: "a", title: "The Golden Calf", description: "In Musa's absence." }),
    make({ id: "b", title: "Battle of Badr", description: "Victory at Badr.", passage: { id: "p2", surahNumber: 3, ayahStart: 123, ayahEnd: 123, source: "quran", verificationStatus: "verified" } }),
  ];

  it("returns all events for an empty query", () => {
    expect(searchEvents(events, "")).toHaveLength(2);
  });

  it("matches by title (case-insensitive)", () => {
    expect(searchEvents(events, "golden calf").map((e) => e.id)).toEqual(["a"]);
  });

  it("matches by description text", () => {
    expect(searchEvents(events, "victory").map((e) => e.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against the primary passage", () => {
    expect(searchEvents(events, "3:123").map((e) => e.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against a parallel passage", () => {
    const withParallel = [make({ id: "c", parallelPassages: [{ id: "pp1", surahNumber: 8, ayahStart: 5, ayahEnd: 5, source: "quran", verificationStatus: "verified" }] })];
    expect(searchEvents(withParallel, "8:5").map((e) => e.id)).toEqual(["c"]);
  });
});

describe("filterByEventCategory", () => {
  const events = [
    make({ id: "a", category: "battle" }),
    make({ id: "b", category: "miracle" }),
  ];

  it("returns all for 'all'", () => {
    expect(filterByEventCategory(events, "all")).toHaveLength(2);
  });

  it("filters to an exact category match", () => {
    expect(filterByEventCategory(events, "miracle").map((e) => e.id)).toEqual(["b"]);
  });
});

describe("filterByEventPerson", () => {
  const events = [
    make({ id: "a", personIds: ["musa", "harun"] }),
    make({ id: "b", personIds: ["yunus"] }),
  ];

  it("filters to events involving the given person id", () => {
    expect(filterByEventPerson(events, "musa").map((e) => e.id)).toEqual(["a"]);
  });

  it("returns an empty array when no event involves the given person", () => {
    expect(filterByEventPerson(events, "ibrahim")).toEqual([]);
  });
});
