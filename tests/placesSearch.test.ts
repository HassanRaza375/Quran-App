import { describe, expect, it } from "vitest";
import { filterByPlaceType, parseExactReference, searchPlaces } from "../app/utils/placesSearch";
import type { QuranPlace } from "../app/data/quranPlaces";

const make = (overrides: Partial<QuranPlace>): QuranPlace => ({
  id: "test",
  name: "Test City",
  arabicName: "مدينة اختبار",
  placeType: "city",
  identificationBasis: "quran_explicit",
  shortDescription: "A test city for unit tests.",
  directMentions: [{ surahNumber: 3, ayahNumber: 96 }],
  relatedPassages: [{ id: "test-p1", surahNumber: 3, ayahStart: 96, ayahEnd: 100, source: "quran", verificationStatus: "verified" }],
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("3:96")).toEqual({ surahNumber: 3, ayahNumber: 96 });
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Makkah")).toBeNull();
  });
});

describe("searchPlaces", () => {
  const places = [
    make({ id: "a", name: "Makkah", arabicName: "بكة", themes: ["Sanctuary"] }),
    make({ id: "b", name: "Badr", arabicName: "بدر", placeType: "battlefield", themes: ["Victory"] }),
  ];

  it("returns all places for an empty query", () => {
    expect(searchPlaces(places, "")).toHaveLength(2);
  });

  it("matches by name (case-insensitive)", () => {
    expect(searchPlaces(places, "badr").map((p) => p.id)).toEqual(["b"]);
  });

  it("matches by theme text", () => {
    expect(searchPlaces(places, "sanctuary").map((p) => p.id)).toEqual(["a"]);
  });

  it("resolves an exact surah:ayah reference", () => {
    expect(searchPlaces(places, "3:96").map((p) => p.id).sort()).toEqual(["a", "b"]);
  });

  it("falls back to empty when no exact reference matches", () => {
    expect(searchPlaces(places, "99:1")).toHaveLength(0);
  });
});

describe("filterByPlaceType", () => {
  const places = [
    make({ id: "a", placeType: "city" }),
    make({ id: "b", placeType: "mountain" }),
    make({ id: "c", placeType: "battlefield" }),
  ];

  it("returns all places for 'all'", () => {
    expect(filterByPlaceType(places, "all")).toHaveLength(3);
  });

  it("filters to an exact placeType match", () => {
    expect(filterByPlaceType(places, "mountain").map((p) => p.id)).toEqual(["b"]);
  });
});
