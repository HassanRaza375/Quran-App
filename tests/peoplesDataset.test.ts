// Verifies the Peoples & Nations seed dataset against real Quran structure
// (app/assets/data/surah.json) — mirrors tests/personsDataset.test.ts's
// pattern for Module 17, applied to Phase 2's own dataset/validator.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_COMMUNITIES, getCommunityById } from "../app/data/quranPeoples";
import { validateCommunityDataset, validateCommunity } from "../app/utils/peoplesValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_COMMUNITIES dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds", () => {
    const issues = validateCommunityDataset(QURAN_COMMUNITIES, surahs);
    expect(issues).toEqual([]);
  });

  it("has 14 entities", () => {
    expect(QURAN_COMMUNITIES.length).toBe(14);
  });

  it("every entity has a unique, non-empty id", () => {
    const ids = QURAN_COMMUNITIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every communityType is one of the defined classifications", () => {
    const valid = new Set(["nation", "tribe", "community", "religious_community", "historical_population", "narrative_group"]);
    for (const c of QURAN_COMMUNITIES) expect(valid.has(c.communityType)).toBe(true);
  });

  it("every identificationBasis is one of the defined values", () => {
    const valid = new Set(["quran_explicit", "quran_context", "traditional", "disputed"]);
    for (const c of QURAN_COMMUNITIES) expect(valid.has(c.identificationBasis)).toBe(true);
  });

  it("every relatedPassage has a strictly non-decreasing ayah range", () => {
    for (const c of QURAN_COMMUNITIES) {
      for (const passage of c.relatedPassages) {
        expect(passage.ayahStart).toBeLessThanOrEqual(passage.ayahEnd);
      }
    }
  });

  it("has no duplicate direct-mention references within any single entity", () => {
    for (const c of QURAN_COMMUNITIES) {
      const keys = c.directMentions.map((r) => `${r.surahNumber}:${r.ayahNumber}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("every relationship's sourceType/verificationStatus is one of the defined values", () => {
    const validSource = new Set(["quran", "authentic_hadith", "traditional_account"]);
    const validVerification = new Set(["verified", "traditional", "uncertain"]);
    for (const c of QURAN_COMMUNITIES) {
      for (const rel of c.relationships ?? []) {
        expect(validSource.has(rel.sourceType)).toBe(true);
        expect(validVerification.has(rel.verificationStatus)).toBe(true);
      }
    }
  });

  it("every relationship target resolvable in this test's context is at least a non-empty string id", () => {
    for (const c of QURAN_COMMUNITIES) {
      for (const rel of c.relationships ?? []) {
        expect(rel.personId.length).toBeGreaterThan(0);
      }
    }
  });

  it("flags an out-of-range ayah as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      name: "Test",
      arabicName: "تست",
      communityType: "tribe" as const,
      identificationBasis: "quran_explicit" as const,
      shortDescription: "test",
      directMentions: [{ surahNumber: 1, ayahNumber: 999 }],
      relatedPassages: [],
    };
    const issues = validateCommunity(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of range"))).toBe(true);
  });

  it("flags an invalid communityType", () => {
    const bad = {
      id: "test-bad-type",
      name: "Test",
      arabicName: "تست",
      communityType: "not_a_real_type" as any,
      identificationBasis: "quran_explicit" as const,
      shortDescription: "test",
      directMentions: [{ surahNumber: 1, ayahNumber: 1 }],
      relatedPassages: [],
    };
    const issues = validateCommunity(bad, surahs);
    expect(issues.some((i) => i.message.includes("invalid communityType"))).toBe(true);
  });

  it("flags a duplicate community id across the dataset", () => {
    const dup = [...QURAN_COMMUNITIES, { ...QURAN_COMMUNITIES[0] }];
    const issues = validateCommunityDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate community id"))).toBe(true);
  });

  it("Ashab al-Aykah and Madyan are kept as two separate, cross-referenced entities (documented boundary decision)", () => {
    const madyan = getCommunityById("madyan");
    const aykah = getCommunityById("ashabalaykah");
    expect(madyan).toBeDefined();
    expect(aykah).toBeDefined();
    expect(madyan?.statusNotes?.some((n) => n.includes("Aykah"))).toBe(true);
    expect(aykah?.statusNotes?.some((n) => n.toLowerCase().includes("divided") || n.includes("Madyan"))).toBe(true);
  });

  it("Sabbath-breakers uses identificationBasis 'quran_context', not 'quran_explicit' (the documented distinction)", () => {
    const sabbath = getCommunityById("sabbathbreakers");
    expect(sabbath?.identificationBasis).toBe("quran_context");
  });

  it("no entity from People & Groups (Persons module) is duplicated here", () => {
    const overlapIds = ["ashabalkahf", "ashabalukhdud", "ashabalfil", "hawariyyun", "sahara", "yusufbrothers", "gardenmen"];
    const communityIds = new Set(QURAN_COMMUNITIES.map((c) => c.id));
    for (const id of overlapIds) expect(communityIds.has(id)).toBe(false);
  });
});
