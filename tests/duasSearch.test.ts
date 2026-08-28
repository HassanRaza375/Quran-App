import { describe, expect, it } from "vitest";
import { filterByDuaCategory, filterByDuaSpeaker, parseExactReference, searchDuas } from "../app/utils/duasSearch";
import type { QuranDua } from "../app/data/quranDuas";

const make = (overrides: Partial<QuranDua>): QuranDua => ({
  id: "test",
  title: "Test Dua",
  arabicTitle: "دعاء اختبار",
  sourceBasis: "quran_explicit",
  category: "forgiveness",
  passage: { id: "p1", surahNumber: 21, ayahStart: 87, ayahEnd: 87, source: "quran", verificationStatus: "verified" },
  isPartialAyah: false,
  context: "A test context.",
  askingFor: "A test request.",
  speakerType: "believers_general",
  speakerLabel: "The believers",
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("21:87")).toEqual({ surahNumber: 21, ayahNumber: 87 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Yunus")).toBeNull();
  });
});

describe("searchDuas", () => {
  const duas = [
    make({ id: "a", title: "The Dua of Yunus", context: "Called from the darkness." }),
    make({ id: "b", title: "Prayer for Knowledge", context: "Increase in knowledge.", passage: { id: "p2", surahNumber: 20, ayahStart: 114, ayahEnd: 114, source: "quran", verificationStatus: "verified" } }),
  ];

  it("returns all duas for an empty query", () => {
    expect(searchDuas(duas, "")).toHaveLength(2);
  });

  it("matches by title (case-insensitive)", () => {
    expect(searchDuas(duas, "yunus").map((d) => d.id)).toEqual(["a"]);
  });

  it("matches by context text", () => {
    expect(searchDuas(duas, "darkness").map((d) => d.id)).toEqual(["a"]);
  });

  it("resolves an exact surah:ayah reference against the primary passage", () => {
    expect(searchDuas(duas, "20:114").map((d) => d.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against a parallel passage", () => {
    const withParallel = [make({ id: "c", parallelPassages: [{ id: "pp1", surahNumber: 3, ayahStart: 38, ayahEnd: 38, source: "quran", verificationStatus: "verified" }] })];
    expect(searchDuas(withParallel, "3:38").map((d) => d.id)).toEqual(["c"]);
  });
});

describe("filterByDuaCategory", () => {
  const duas = [
    make({ id: "a", category: "forgiveness" }),
    make({ id: "b", category: "knowledge" }),
  ];

  it("returns all for 'all'", () => {
    expect(filterByDuaCategory(duas, "all")).toHaveLength(2);
  });

  it("filters to an exact category match", () => {
    expect(filterByDuaCategory(duas, "knowledge").map((d) => d.id)).toEqual(["b"]);
  });
});

describe("filterByDuaSpeaker", () => {
  const duas = [
    make({ id: "a", speakerType: "person", personId: "musa", speakerLabel: undefined }),
    make({ id: "b", speakerType: "person", personId: "yunus", speakerLabel: undefined }),
  ];

  it("filters to duas spoken by the given person id", () => {
    expect(filterByDuaSpeaker(duas, "musa").map((d) => d.id)).toEqual(["a"]);
  });
});
