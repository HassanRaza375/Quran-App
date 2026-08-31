// Verifies the Signs & Miracles seed dataset against real Quran structure
// and against the Persons/Peoples/Places/Stories/Themes/Duas/Events
// datasets it cross-links — mirrors tests/eventsDataset.test.ts's pattern
// for Phase 8.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_SIGNS, getSignById } from "../app/data/quranSigns";
import { QURAN_EVENTS, getEventById } from "../app/data/quranEvents";
import { validateSignDataset, validateSign } from "../app/utils/signsValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_SIGNS dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds and cross-module ids", () => {
    const issues = validateSignDataset(QURAN_SIGNS, surahs, QURAN_EVENTS);
    expect(issues).toEqual([]);
  });

  it("has exactly 14 signs (the approved audited set)", () => {
    expect(QURAN_SIGNS.length).toBe(14);
  });

  it("every sign has a unique, non-empty id", () => {
    const ids = QURAN_SIGNS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every classification is one of the 5 defined values", () => {
    const valid = new Set(["sign", "miracle", "divine_aid", "punishment_sign", "extraordinary_event"]);
    for (const s of QURAN_SIGNS) expect(valid.has(s.classification)).toBe(true);
  });

  it("every occurrenceType is one of the 2 defined values", () => {
    const valid = new Set(["bounded", "recurring"]);
    for (const s of QURAN_SIGNS) expect(valid.has(s.occurrenceType)).toBe(true);
  });

  it("all 14 current entries are occurrenceType 'bounded' (no recurring entries in this batch)", () => {
    for (const s of QURAN_SIGNS) expect(s.occurrenceType).toBe("bounded");
  });

  it("every sourceBasis is a valid IdentificationBasis value", () => {
    const valid = new Set(["quran_explicit", "quran_context", "traditional", "modern_identification", "disputed"]);
    for (const s of QURAN_SIGNS) expect(valid.has(s.sourceBasis)).toBe(true);
  });

  it("all 14 current entries use sourceBasis 'quran_explicit'", () => {
    for (const s of QURAN_SIGNS) expect(s.sourceBasis).toBe("quran_explicit");
  });

  it("no sign has a chronology field — chronology is carried only by linked Events", () => {
    for (const s of QURAN_SIGNS) {
      expect((s as unknown as Record<string, unknown>).chronologyStatus).toBeUndefined();
      expect((s as unknown as Record<string, unknown>).relativeChronology).toBeUndefined();
    }
  });

  it("flags an out-of-range passage as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      title: "Test",
      arabicTitle: "تست",
      classification: "miracle" as const,
      occurrenceType: "bounded" as const,
      sourceBasis: "quran_explicit" as const,
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 999, source: "quran" as const, verificationStatus: "verified" as const },
    };
    const issues = validateSign(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("flags a duplicate sign id across the dataset", () => {
    const dup = [...QURAN_SIGNS, { ...QURAN_SIGNS[0] }];
    const issues = validateSignDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate sign id"))).toBe(true);
  });

  it("flags an unresolvable eventId", () => {
    const bad = {
      id: "test-bad2",
      title: "Test",
      arabicTitle: "تست",
      classification: "miracle" as const,
      occurrenceType: "bounded" as const,
      sourceBasis: "quran_explicit" as const,
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      eventIds: ["not-a-real-event"],
    };
    const issues = validateSign(bad, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to an Events entry"))).toBe(true);
  });

  it("flags a non-reciprocal eventIds link (Event exists but doesn't list this sign back)", () => {
    const bad = {
      id: "test-bad3",
      title: "Test",
      arabicTitle: "تست",
      classification: "miracle" as const,
      occurrenceType: "bounded" as const,
      sourceBasis: "quran_explicit" as const,
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      eventIds: ["yunusfish"],
    };
    const issues = validateSign(bad, surahs);
    expect(issues.some((i) => i.message.includes("does not reciprocate"))).toBe(true);
  });

  it("uses personIds (not communityIds) for Persons-module group entities — the recurring bug from earlier phases", () => {
    const groupIds = new Set(["hawariyyun", "sahara", "yusufbrothers", "ashabalkahf", "ashabalukhdud", "ashabalfil"]);
    for (const s of QURAN_SIGNS) {
      for (const cid of s.communityIds ?? []) expect(groupIds.has(cid)).toBe(false);
    }
  });

  describe("verified Event relationships (from the approved audit)", () => {
    const expectedLinks: Record<string, string[]> = {
      musastaff: ["musacalling", "magiciansconvert"],
      musahand: ["musacalling"],
      musaplagues: ["confrontpharaoh"],
      seasplitting: ["exoduscrossing"],
      salihcamel: ["thamuddestruction"],
      ibrahimfiresign: ["ibrahimfire"],
      isamiraclessign: ["isamiracles"],
      isacradlespeech: ["isabirth"],
      tablesign: ["tablefromheaven"],
      sulaimancreatures: ["sabavisit"],
      badrangels: ["battlebadr"],
      ahzabwind: ["siegeconfederates"],
    };

    for (const [signId, eventIds] of Object.entries(expectedLinks)) {
      it(`${signId} links to ${eventIds.join(", ")}`, () => {
        expect(getSignById(signId)?.eventIds).toEqual(expect.arrayContaining(eventIds));
        expect(getSignById(signId)?.eventIds?.length).toBe(eventIds.length);
      });
    }

    it("Sulaiman's Wind and Jinn entries have no eventIds — no Event was fabricated for them", () => {
      expect(getSignById("sulaimanwind")?.eventIds).toBeUndefined();
      expect(getSignById("sulaimanjinn")?.eventIds).toBeUndefined();
    });
  });

  describe("reciprocal signIds on Events (Phase 7 dataset, Phase 8 additive-only edit)", () => {
    const expectedReciprocal: Record<string, string[]> = {
      musacalling: ["musastaff", "musahand"],
      magiciansconvert: ["musastaff"],
      confrontpharaoh: ["musaplagues"],
      exoduscrossing: ["seasplitting"],
      thamuddestruction: ["salihcamel"],
      ibrahimfire: ["ibrahimfiresign"],
      isamiracles: ["isamiraclessign"],
      isabirth: ["isacradlespeech"],
      tablefromheaven: ["tablesign"],
      sabavisit: ["sulaimancreatures"],
      battlebadr: ["badrangels"],
      siegeconfederates: ["ahzabwind"],
    };

    for (const [eventId, signIds] of Object.entries(expectedReciprocal)) {
      it(`Event "${eventId}" reciprocates with signIds ${signIds.join(", ")}`, () => {
        expect(getEventById(eventId)?.signIds).toEqual(expect.arrayContaining(signIds));
        expect(getEventById(eventId)?.signIds?.length).toBe(signIds.length);
      });
    }

    it("no other Event was given a signIds field", () => {
      const eventsWithSigns = QURAN_EVENTS.filter((e) => e.signIds?.length).map((e) => e.id).sort();
      expect(eventsWithSigns).toEqual(Object.keys(expectedReciprocal).sort());
    });
  });

  describe("excluded candidates remain absent (documented scope decisions)", () => {
    it("does not include Splitting of the Moon", () => {
      const titles = QURAN_SIGNS.map((s) => s.title.toLowerCase());
      expect(titles.some((t) => t.includes("moon"))).toBe(false);
    });

    it("does not include Dawud's iron or mountains/birds glorifying with him", () => {
      const ids = new Set(QURAN_SIGNS.map((s) => s.id));
      expect(ids.has("dawudiron")).toBe(false);
      expect(ids.has("dawudmountains")).toBe(false);
      const titles = QURAN_SIGNS.map((s) => s.title.toLowerCase());
      expect(titles.some((t) => t.includes("iron"))).toBe(false);
    });

    it("does not include a separate virgin-birth sign", () => {
      const titles = QURAN_SIGNS.map((s) => s.title.toLowerCase());
      expect(titles.some((t) => t.includes("virgin"))).toBe(false);
    });

    it("does not include a third staff/serpent entry", () => {
      const staffRelated = QURAN_SIGNS.filter((s) => s.title.toLowerCase().includes("staff"));
      expect(staffRelated.length).toBe(1);
    });

    it("has zero recurring cosmic-sign entries", () => {
      expect(QURAN_SIGNS.filter((s) => s.occurrenceType === "recurring").length).toBe(0);
    });

    it("has zero entries using classification 'sign' or 'extraordinary_event' in this initial batch", () => {
      expect(QURAN_SIGNS.filter((s) => s.classification === "sign").length).toBe(0);
      expect(QURAN_SIGNS.filter((s) => s.classification === "extraordinary_event").length).toBe(0);
    });
  });
});
