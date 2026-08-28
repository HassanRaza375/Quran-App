// Verifies the Themes seed dataset against real Quran structure and
// against the Persons/Peoples/Places/Stories datasets it cross-links —
// mirrors tests/storiesDataset.test.ts's pattern for Phase 5.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_THEMES, getThemeById } from "../app/data/quranThemes";
import { validateThemeDataset, validateTheme } from "../app/utils/themesValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_THEMES dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds and cross-module ids", () => {
    const issues = validateThemeDataset(QURAN_THEMES, surahs);
    expect(issues).toEqual([]);
  });

  it("has 42 themes", () => {
    expect(QURAN_THEMES.length).toBe(42);
  });

  it("every theme has a unique, non-empty id", () => {
    const ids = QURAN_THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every category is one of the 6 defined values", () => {
    const valid = new Set(["belief", "worship_spirituality", "character", "moral_warning", "social_civilizational", "trials_human_experience"]);
    for (const t of QURAN_THEMES) expect(valid.has(t.category)).toBe(true);
  });

  it("every conceptualBasis is one of the 3 defined values", () => {
    const valid = new Set(["quran_explicit_concept", "quran_derived_concept", "scholarly_interpretation"]);
    for (const t of QURAN_THEMES) expect(valid.has(t.conceptualBasis)).toBe(true);
  });

  it("no theme lists itself in its own relatedThemeIds", () => {
    for (const t of QURAN_THEMES) {
      expect(t.relatedThemeIds ?? []).not.toContain(t.id);
    }
  });

  it("every theme has both a definition and a description", () => {
    for (const t of QURAN_THEMES) {
      expect(t.definition.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
    }
  });

  it("flags an out-of-range representative passage as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      name: "Test",
      arabicName: "تست",
      category: "belief" as const,
      conceptualBasis: "quran_explicit_concept" as const,
      definition: "test",
      description: "test",
      representativePassages: [{ id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 999, source: "quran" as const, verificationStatus: "verified" as const }],
    };
    const issues = validateTheme(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("flags a self-reference in relatedThemeIds", () => {
    const bad = {
      id: "test-self",
      name: "Test",
      arabicName: "تست",
      category: "belief" as const,
      conceptualBasis: "quran_explicit_concept" as const,
      definition: "test",
      description: "test",
      representativePassages: [{ id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const }],
      relatedThemeIds: ["test-self"],
    };
    const issues = validateTheme(bad, surahs);
    expect(issues.some((i) => i.message.includes("self-reference"))).toBe(true);
  });

  it("flags a duplicate theme id across the dataset", () => {
    const dup = [...QURAN_THEMES, { ...QURAN_THEMES[0] }];
    const issues = validateThemeDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate theme id"))).toBe(true);
  });

  it("flags a relatedThemeIds entry that doesn't resolve within the dataset", () => {
    const withBadRelated = QURAN_THEMES.map((t) =>
      t.id === QURAN_THEMES[0].id ? { ...t, relatedThemeIds: ["this-does-not-exist"] } : t
    );
    const issues = validateThemeDataset(withBadRelated, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to a Theme"))).toBe(true);
  });

  it("Tawhid and Shirk are kept as two separate, cross-linked themes (not merged)", () => {
    const tawhid = getThemeById("tawhid");
    const shirk = getThemeById("shirk");
    expect(tawhid).toBeDefined();
    expect(shirk).toBeDefined();
    expect(tawhid?.relatedThemeIds).toContain("shirk");
  });

  it("Sabr and Tawakkul are kept as two separate themes with the distinction documented", () => {
    const tawakkul = getThemeById("tawakkul");
    expect(tawakkul?.description).toContain("Sabr");
  });

  it("Hypocrisy resolves the Phase 2 Munafiqun deferral as a Theme, not a Peoples & Nations entity", () => {
    const hypocrisy = getThemeById("hypocrisy");
    expect(hypocrisy?.category).toBe("moral_warning");
    expect(hypocrisy?.statusNotes?.some((n) => n.includes("Phase 2"))).toBe(true);
  });

  it("documented merges are not duplicated as separate themes", () => {
    const ids = new Set(QURAN_THEMES.map((t) => t.id));
    // Day of Judgment, The Unseen, Dua, Ihsan(separate), Trustworthiness,
    // Mockery, Backbiting, Envy, Sin, Marriage, Trade, Poverty, Conflict,
    // Peace, Tests, Temptation, Fear, Grief, Death should not exist as
    // their own separate theme ids.
    for (const mergedId of [
      "dayofjudgment", "theunseen", "dua", "ihsan", "trustworthiness", "mockery",
      "backbiting", "envy", "sin", "marriage", "trade", "poverty", "conflict",
      "peace", "tests", "temptation", "fear", "grief", "death",
    ]) {
      expect(ids.has(mergedId)).toBe(false);
    }
  });
});
