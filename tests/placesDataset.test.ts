// Verifies the Places seed dataset against real Quran structure — mirrors
// tests/peoplesDataset.test.ts's pattern for Phase 3's own dataset/validator.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_PLACES, getPlaceById } from "../app/data/quranPlaces";
import { getCommunityById } from "../app/data/quranPeoples";
import { getPersonById } from "../app/data/quranPersons";
import { validatePlaceDataset, validatePlace } from "../app/utils/placesValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_PLACES dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds", () => {
    const issues = validatePlaceDataset(QURAN_PLACES, surahs);
    expect(issues).toEqual([]);
  });

  it("has 16 places", () => {
    expect(QURAN_PLACES.length).toBe(16);
  });

  it("every place has a unique, non-empty id", () => {
    const ids = QURAN_PLACES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every placeType is one of the defined classifications", () => {
    const valid = new Set(["city", "settlement", "region", "mountain", "valley", "land_territory", "body_of_water", "sanctuary_site", "battlefield", "other"]);
    for (const p of QURAN_PLACES) expect(valid.has(p.placeType)).toBe(true);
  });

  it("every identificationBasis is one of the 5 defined values", () => {
    const valid = new Set(["quran_explicit", "quran_context", "traditional", "modern_identification", "disputed"]);
    for (const p of QURAN_PLACES) expect(valid.has(p.identificationBasis)).toBe(true);
  });

  it("has no duplicate direct-mention references within any single place", () => {
    for (const p of QURAN_PLACES) {
      const keys = p.directMentions.map((r) => `${r.surahNumber}:${r.ayahNumber}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("every relationships[].personId resolves to a real Persons-module entry", () => {
    for (const p of QURAN_PLACES) {
      for (const rel of p.relationships ?? []) {
        expect(getPersonById(rel.personId)).toBeDefined();
      }
    }
  });

  it("every associatedCommunityIds entry resolves to a real Peoples & Nations entry", () => {
    for (const p of QURAN_PLACES) {
      for (const cid of p.associatedCommunityIds ?? []) {
        expect(getCommunityById(cid)).toBeDefined();
      }
    }
  });

  it("every relatedPlaceIds entry resolves to a real Place entry (no dangling self-references)", () => {
    for (const p of QURAN_PLACES) {
      for (const pid of p.relatedPlaceIds ?? []) {
        expect(getPlaceById(pid)).toBeDefined();
      }
    }
  });

  it("flags an out-of-range ayah as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      name: "Test",
      arabicName: "تست",
      placeType: "city" as const,
      identificationBasis: "quran_explicit" as const,
      shortDescription: "test",
      directMentions: [{ surahNumber: 1, ayahNumber: 999 }],
      relatedPassages: [],
    };
    const issues = validatePlace(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of range"))).toBe(true);
  });

  it("flags a duplicate place id across the dataset", () => {
    const dup = [...QURAN_PLACES, { ...QURAN_PLACES[0] }];
    const issues = validatePlaceDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate place id"))).toBe(true);
  });

  it("Madyan and Al-Aykah are NOT duplicated as Place entities (documented boundary decision)", () => {
    const placeIds = new Set(QURAN_PLACES.map((p) => p.id));
    expect(placeIds.has("madyan")).toBe(false);
    expect(placeIds.has("ashabalaykah")).toBe(false);
    expect(placeIds.has("alayka")).toBe(false);
  });

  it("Al-Masjid al-Aqsa does not assert Jerusalem as Qur'an-stated (traditional identification disclosed, not the entity's core identificationBasis)", () => {
    const aqsa = getPlaceById("almasjidalaqsa");
    expect(aqsa?.identificationBasis).toBe("quran_explicit");
    expect(aqsa?.statusNotes?.some((n) => n.includes("does not use the word 'Jerusalem'"))).toBe(true);
  });

  it("Iram uses identificationBasis 'disputed'", () => {
    expect(getPlaceById("iram")?.identificationBasis).toBe("disputed");
  });

  it("The Sea and The Cave use identificationBasis 'quran_context', not 'quran_explicit'", () => {
    expect(getPlaceById("thesea")?.identificationBasis).toBe("quran_context");
    expect(getPlaceById("alkahf")?.identificationBasis).toBe("quran_context");
  });
});

describe("Phase 2 -> Phase 3 associatedPlaces migration", () => {
  it("'Ad and Thamud were migrated to structured relatedPlaceIds links", () => {
    const ad = getCommunityById("ad");
    const thamud = getCommunityById("thamud");
    expect(ad?.relatedPlaceIds).toContain("alahqaf");
    expect(thamud?.relatedPlaceIds).toContain("alhijr");
  });

  it("Saba', People of Lut, and People of Yunus were deliberately NOT migrated (no dedicated Place entity created)", () => {
    const saba = getCommunityById("saba");
    const lut = getCommunityById("peopleoflut");
    const yunus = getCommunityById("peopleofyunus");
    expect(saba?.relatedPlaceIds ?? []).toEqual([]);
    expect(lut?.relatedPlaceIds ?? []).toEqual([]);
    expect(yunus?.relatedPlaceIds ?? []).toEqual([]);
  });
});
