import { describe, expect, it } from "vitest";
import { filterByThemeCategory, parseExactReference, searchThemes } from "../app/utils/themesSearch";
import type { QuranTheme } from "../app/data/quranThemes";

const make = (overrides: Partial<QuranTheme>): QuranTheme => ({
  id: "test",
  name: "Test Theme",
  arabicName: "موضوع اختبار",
  category: "belief",
  conceptualBasis: "quran_explicit_concept",
  definition: "A test theme.",
  description: "A test theme description.",
  representativePassages: [{ id: "p1", surahNumber: 2, ayahStart: 153, ayahEnd: 153, source: "quran", verificationStatus: "verified" }],
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("2:153")).toEqual({ surahNumber: 2, ayahNumber: 153 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Patience")).toBeNull();
  });
});

describe("searchThemes", () => {
  const themes = [
    make({ id: "a", name: "Patience", arabicName: "الصبر" }),
    make({ id: "b", name: "Gratitude", arabicName: "الشكر", representativePassages: [{ id: "p2", surahNumber: 14, ayahStart: 7, ayahEnd: 7, source: "quran", verificationStatus: "verified" }] }),
  ];

  it("returns all themes for an empty query", () => {
    expect(searchThemes(themes, "")).toHaveLength(2);
  });

  it("matches by name (case-insensitive)", () => {
    expect(searchThemes(themes, "gratitude").map((t) => t.id)).toEqual(["b"]);
  });

  it("matches by definition text", () => {
    const withDef = [make({ id: "c", definition: "Unique definition marker xyzzy" })];
    expect(searchThemes(withDef, "xyzzy").map((t) => t.id)).toEqual(["c"]);
  });

  it("resolves an exact surah:ayah reference against representative passages", () => {
    expect(searchThemes(themes, "2:153").map((t) => t.id)).toEqual(["a"]);
  });
});

describe("filterByThemeCategory", () => {
  const themes = [
    make({ id: "a", category: "belief" }),
    make({ id: "b", category: "character" }),
  ];

  it("returns all for 'all'", () => {
    expect(filterByThemeCategory(themes, "all")).toHaveLength(2);
  });

  it("filters to an exact category match", () => {
    expect(filterByThemeCategory(themes, "character").map((t) => t.id)).toEqual(["b"]);
  });
});
