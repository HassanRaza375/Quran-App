// Verifies the Duas seed dataset against real Quran structure and against
// the Persons/Peoples/Places/Stories/Themes datasets it cross-links —
// mirrors tests/themesDataset.test.ts's pattern for Phase 6.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_DUAS, getDuaById } from "../app/data/quranDuas";
import { validateDuaDataset, validateDua } from "../app/utils/duasValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_DUAS dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds and cross-module ids", () => {
    const issues = validateDuaDataset(QURAN_DUAS, surahs);
    expect(issues).toEqual([]);
  });

  it("has 38 duas", () => {
    expect(QURAN_DUAS.length).toBe(38);
  });

  it("every dua has a unique, non-empty id", () => {
    const ids = QURAN_DUAS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every sourceBasis is one of the 3 defined values", () => {
    const valid = new Set(["quran_explicit", "quran_narrative", "quran_instruction"]);
    for (const d of QURAN_DUAS) expect(valid.has(d.sourceBasis)).toBe(true);
  });

  it("every category is one of the 14 defined values", () => {
    const valid = new Set([
      "forgiveness", "guidance", "protection", "mercy", "family", "provision", "patience",
      "gratitude", "knowledge", "worship", "repentance", "help", "faith", "hereafter",
    ]);
    for (const d of QURAN_DUAS) expect(valid.has(d.category)).toBe(true);
  });

  it("every dua with speakerType 'person' has a resolvable personId and no speakerLabel", () => {
    for (const d of QURAN_DUAS) {
      if (d.speakerType === "person") {
        expect(d.personId).toBeDefined();
        expect(d.speakerLabel).toBeUndefined();
      }
    }
  });

  it("every dua with a generic speakerType has a speakerLabel and no personId", () => {
    for (const d of QURAN_DUAS) {
      if (d.speakerType !== "person") {
        expect(d.speakerLabel).toBeDefined();
        expect(d.personId).toBeUndefined();
      }
    }
  });

  it("every isPartialAyah:true dua has a segmentNote", () => {
    for (const d of QURAN_DUAS) {
      if (d.isPartialAyah) expect(d.segmentNote?.length).toBeGreaterThan(0);
    }
  });

  it("flags an out-of-range passage as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      title: "Test",
      arabicTitle: "تست",
      sourceBasis: "quran_explicit" as const,
      category: "forgiveness" as const,
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 999, source: "quran" as const, verificationStatus: "verified" as const },
      isPartialAyah: false,
      context: "test",
      askingFor: "test",
      speakerType: "believers_general" as const,
      speakerLabel: "test",
    };
    const issues = validateDua(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("flags speaker inconsistency: speakerType 'person' without personId", () => {
    const bad = {
      id: "test-bad2",
      title: "Test",
      arabicTitle: "تست",
      sourceBasis: "quran_explicit" as const,
      category: "forgiveness" as const,
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      isPartialAyah: false,
      context: "test",
      askingFor: "test",
      speakerType: "person" as const,
    };
    const issues = validateDua(bad, surahs);
    expect(issues.some((i) => i.message.includes("personId is not set"))).toBe(true);
  });

  it("flags a duplicate dua id across the dataset", () => {
    const dup = [...QURAN_DUAS, { ...QURAN_DUAS[0] }];
    const issues = validateDuaDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate dua id"))).toBe(true);
  });

  it("Zakariyya's prayer for a son is one entry with 2 parallel passages, not 3 separate entries", () => {
    const dua = getDuaById("zakariyyasonprayer");
    expect(dua?.parallelPassages?.length).toBe(2);
    const ids = new Set(QURAN_DUAS.map((d) => d.id));
    expect(ids.has("zakariyyasonprayer2")).toBe(false);
  });

  it("the dua of Yunus is correctly marked isPartialAyah with a segmentNote", () => {
    const dua = getDuaById("yunusindarkness");
    expect(dua?.isPartialAyah).toBe(true);
    expect(dua?.segmentNote).toContain("lā ilāha illā anta");
  });

  it("Muhammad's Qur'an-instruction duas use sourceBasis 'quran_instruction', not 'quran_explicit'", () => {
    for (const id of ["muhammadentryexitprayer", "muhammadknowledgeprayer", "muhammadrefugeprayer", "muhammadmercyprayer"]) {
      expect(getDuaById(id)?.sourceBasis).toBe("quran_instruction");
    }
  });

  it("Pharaoh's magicians' dua uses the existing Persons-module group id, not a new community entity", () => {
    const dua = getDuaById("saharaconversionprayer");
    expect(dua?.speakerType).toBe("person");
    expect(dua?.personId).toBe("sahara");
  });

  it("Ya'qub's 12:86 statement is NOT included as a separate dua (documented boundary exclusion)", () => {
    const ids = new Set(QURAN_DUAS.map((d) => d.id));
    expect(ids.has("yaqubgriefstatement")).toBe(false);
  });
});
