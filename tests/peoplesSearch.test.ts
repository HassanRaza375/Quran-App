import { describe, expect, it } from "vitest";
import {
  filterByCommunityType,
  parseExactReference,
  searchCommunities,
} from "../app/utils/peoplesSearch";
import type { QuranCommunity } from "../app/data/quranPeoples";

const make = (overrides: Partial<QuranCommunity>): QuranCommunity => ({
  id: "test",
  name: "Test Nation",
  arabicName: "أمة اختبار",
  communityType: "nation",
  identificationBasis: "quran_explicit",
  shortDescription: "A test nation for unit tests.",
  directMentions: [{ surahNumber: 11, ayahNumber: 50 }],
  relatedPassages: [{ id: "test-p1", surahNumber: 11, ayahStart: 50, ayahEnd: 60, source: "quran", verificationStatus: "verified" }],
  ...overrides,
});

describe("parseExactReference", () => {
  it("parses a valid surah:ayah reference", () => {
    expect(parseExactReference("11:50")).toEqual({ surahNumber: 11, ayahNumber: 50 });
  });
  it("rejects an out-of-range surah number", () => {
    expect(parseExactReference("200:1")).toBeNull();
  });
  it("returns null for a non-reference query", () => {
    expect(parseExactReference("Thamud")).toBeNull();
  });
});

describe("searchCommunities", () => {
  const communities = [
    make({ id: "a", name: "'Ad", arabicName: "عاد", themes: ["Arrogance"] }),
    make({ id: "b", name: "Thamud", arabicName: "ثمود", themes: ["A sign defied"] }),
  ];

  it("returns all communities for an empty query", () => {
    expect(searchCommunities(communities, "")).toHaveLength(2);
  });

  it("matches by name (case-insensitive)", () => {
    const result = searchCommunities(communities, "thamud");
    expect(result.map((c) => c.id)).toEqual(["b"]);
  });

  it("matches by theme text", () => {
    const result = searchCommunities(communities, "arrogance");
    expect(result.map((c) => c.id)).toEqual(["a"]);
  });

  it("resolves an exact surah:ayah reference against directMentions", () => {
    const result = searchCommunities(communities, "11:50");
    expect(result.map((c) => c.id).sort()).toEqual(["a", "b"]);
  });

  it("resolves an exact surah:ayah reference falling inside a relatedPassages range", () => {
    const result = searchCommunities(communities, "11:55");
    expect(result.map((c) => c.id).sort()).toEqual(["a", "b"]);
  });

  it("falls back to text search when no exact reference matches", () => {
    const result = searchCommunities(communities, "99:1");
    expect(result).toHaveLength(0);
  });
});

describe("filterByCommunityType", () => {
  const communities = [
    make({ id: "a", communityType: "tribe" }),
    make({ id: "b", communityType: "nation" }),
    make({ id: "c", communityType: "religious_community" }),
  ];

  it("returns all communities for 'all'", () => {
    expect(filterByCommunityType(communities, "all")).toHaveLength(3);
  });

  it("filters to an exact communityType match", () => {
    const result = filterByCommunityType(communities, "nation");
    expect(result.map((c) => c.id)).toEqual(["b"]);
  });
});
