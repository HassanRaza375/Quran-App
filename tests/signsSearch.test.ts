import { describe, expect, it } from "vitest";
import { filterBySignClassification, filterBySignEvent, filterBySignPerson, parseExactReference, searchSigns } from "../app/utils/signsSearch";
import type { QuranSign } from "../app/data/quranSigns";

const make = (overrides: Partial<QuranSign>): QuranSign => ({
  id: "test",
  title: "Test Sign",
  arabicTitle: "آية اختبار",
  classification: "miracle",
  occurrenceType: "bounded",
  sourceBasis: "quran_explicit",
  description: "A test description.",
  passage: { id: "p1", surahNumber: 21, ayahStart: 68, ayahEnd: 70, source: "quran", verificationStatus: "verified" },
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("34:12")).toEqual({ surahNumber: 34, ayahNumber: 12 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Salih")).toBeNull();
  });
});

describe("searchSigns", () => {
  const signs = [
    make({ id: "a", title: "The She-Camel of Salih", description: "Given to Thamud." }),
    make({ id: "b", title: "Musa's Staff", description: "Turns into a serpent.", passage: { id: "p2", surahNumber: 20, ayahStart: 17, ayahEnd: 21, source: "quran", verificationStatus: "verified" } }),
  ];

  it("returns all signs for an empty query", () => {
    expect(searchSigns(signs, "")).toHaveLength(2);
  });

  it("matches by title (case-insensitive)", () => {
    expect(searchSigns(signs, "she-camel").map((s) => s.id)).toEqual(["a"]);
  });

  it("matches by description text", () => {
    expect(searchSigns(signs, "serpent").map((s) => s.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against the primary passage", () => {
    expect(searchSigns(signs, "20:19").map((s) => s.id)).toEqual(["b"]);
  });

  it("resolves an exact surah:ayah reference against a parallel passage", () => {
    const withParallel = [make({ id: "c", parallelPassages: [{ id: "pp1", surahNumber: 26, ayahStart: 45, ayahEnd: 45, source: "quran", verificationStatus: "verified" }] })];
    expect(searchSigns(withParallel, "26:45").map((s) => s.id)).toEqual(["c"]);
  });

  it("matches Arabic title text (tashkeel-insensitive)", () => {
    const arabicSigns = [make({ id: "d", arabicTitle: "نَاقَةُ صَالِح" })];
    expect(searchSigns(arabicSigns, "ناقة صالح").map((s) => s.id)).toEqual(["d"]);
  });
});

describe("filterBySignClassification", () => {
  const signs = [
    make({ id: "a", classification: "miracle" }),
    make({ id: "b", classification: "divine_aid" }),
    make({ id: "c", classification: "punishment_sign" }),
  ];

  it("returns all for 'all'", () => {
    expect(filterBySignClassification(signs, "all")).toHaveLength(3);
  });

  it("filters to an exact classification match", () => {
    expect(filterBySignClassification(signs, "divine_aid").map((s) => s.id)).toEqual(["b"]);
  });
});

describe("filterBySignPerson", () => {
  const signs = [
    make({ id: "a", personIds: ["musa", "harun"] }),
    make({ id: "b", personIds: ["sulaiman"] }),
  ];

  it("filters to signs involving the given person id", () => {
    expect(filterBySignPerson(signs, "musa").map((s) => s.id)).toEqual(["a"]);
  });

  it("returns an empty array when no sign involves the given person", () => {
    expect(filterBySignPerson(signs, "ibrahim")).toEqual([]);
  });
});

describe("filterBySignEvent", () => {
  const signs = [
    make({ id: "a", eventIds: ["musacalling", "magiciansconvert"] }),
    make({ id: "b", eventIds: ["battlebadr"] }),
  ];

  it("filters to signs linked to the given event id", () => {
    expect(filterBySignEvent(signs, "musacalling").map((s) => s.id)).toEqual(["a"]);
  });
});
