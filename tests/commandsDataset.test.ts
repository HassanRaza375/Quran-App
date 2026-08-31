// Verifies the Commands & Prohibitions seed dataset against real Quran
// structure and against the Persons/Peoples/Places/Stories/Themes/Duas/
// Events/Signs datasets it cross-links — mirrors
// tests/signsDataset.test.ts's pattern for Phase 9.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_COMMANDS, getCommandById } from "../app/data/quranCommands";
import { validateCommandDataset, validateCommand } from "../app/utils/commandsValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_COMMANDS dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds and cross-module ids", () => {
    const issues = validateCommandDataset(QURAN_COMMANDS, surahs);
    expect(issues).toEqual([]);
  });

  it("has exactly 18 entries (the approved dataset)", () => {
    expect(QURAN_COMMANDS.length).toBe(18);
  });

  it("has exactly 9 commands and 9 prohibitions", () => {
    expect(QURAN_COMMANDS.filter((c) => c.type === "command").length).toBe(9);
    expect(QURAN_COMMANDS.filter((c) => c.type === "prohibition").length).toBe(9);
  });

  it("every entry has a unique, non-empty id", () => {
    const ids = QURAN_COMMANDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every type is one of the 2 defined values", () => {
    const valid = new Set(["command", "prohibition"]);
    for (const c of QURAN_COMMANDS) expect(valid.has(c.type)).toBe(true);
  });

  it("every sourceBasis is one of the 4 defined CommandSourceBasis values", () => {
    const valid = new Set(["quran_explicit", "quran_inferred", "derived_ruling", "scholarly_interpretation"]);
    for (const c of QURAN_COMMANDS) expect(valid.has(c.sourceBasis)).toBe(true);
  });

  it("all 18 current entries use sourceBasis 'quran_explicit'", () => {
    for (const c of QURAN_COMMANDS) expect(c.sourceBasis).toBe("quran_explicit");
  });

  it("every entry has a non-empty audience", () => {
    for (const c of QURAN_COMMANDS) expect(c.audience.length).toBeGreaterThan(0);
  });

  it("flags an out-of-range passage as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      title: "Test",
      arabicTitle: "تست",
      type: "command" as const,
      sourceBasis: "quran_explicit" as const,
      audience: "general",
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 999, source: "quran" as const, verificationStatus: "verified" as const },
    };
    const issues = validateCommand(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("flags a duplicate command id across the dataset", () => {
    const dup = [...QURAN_COMMANDS, { ...QURAN_COMMANDS[0] }];
    const issues = validateCommandDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate command id"))).toBe(true);
  });

  it("flags an unresolvable personId", () => {
    const bad = {
      id: "test-bad2",
      title: "Test",
      arabicTitle: "تست",
      type: "command" as const,
      sourceBasis: "quran_explicit" as const,
      audience: "general",
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      personIds: ["not-a-real-person"],
    };
    const issues = validateCommand(bad, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to a Persons-module entry"))).toBe(true);
  });

  it("flags an unresolvable eventId", () => {
    const bad = {
      id: "test-bad3",
      title: "Test",
      arabicTitle: "تست",
      type: "prohibition" as const,
      sourceBasis: "quran_explicit" as const,
      audience: "general",
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      eventIds: ["not-a-real-event"],
    };
    const issues = validateCommand(bad, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to an Events entry"))).toBe(true);
  });

  it("flags an unresolvable signId", () => {
    const bad = {
      id: "test-bad4",
      title: "Test",
      arabicTitle: "تست",
      type: "prohibition" as const,
      sourceBasis: "quran_explicit" as const,
      audience: "general",
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      signIds: ["not-a-real-sign"],
    };
    const issues = validateCommand(bad, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to a Signs & Miracles entry"))).toBe(true);
  });

  it("uses personIds (not communityIds) for Persons-module group entities — the recurring bug from earlier phases", () => {
    const groupIds = new Set(["hawariyyun", "sahara", "yusufbrothers", "ashabalkahf", "ashabalukhdud", "ashabalfil"]);
    for (const c of QURAN_COMMANDS) {
      for (const cid of c.communityIds ?? []) expect(groupIds.has(cid)).toBe(false);
    }
  });

  describe("Theme links (approved overlap boundary)", () => {
    const expectedThemeLinks: Record<string, string> = {
      prayercommand: "prayer",
      zakahcommand: "charity",
      fastingcommand: "fasting",
      justicecommand: "justice",
      remembrancecommand: "dhikr",
      repentancecommand: "tawbah",
      honoringparentscommand: "parents",
      shirkprohibition: "shirk",
      orphanswealthprohibition: "orphans",
    };
    for (const [commandId, themeId] of Object.entries(expectedThemeLinks)) {
      it(`${commandId} links to Theme "${themeId}"`, () => {
        expect(getCommandById(commandId)?.themeIds).toContain(themeId);
      });
    }

    it("entries with no corresponding Theme carry no themeIds", () => {
      const noThemeIds = ["hajjcommand", "keepingpromisescommand", "murderprohibition", "zinaprohibition", "ribaprohibition", "theftprohibition", "backbitingprohibition", "falsetestimonyprohibition", "consumingwealthunjustlyprohibition"];
      for (const id of noThemeIds) expect(getCommandById(id)?.themeIds).toBeUndefined();
    });
  });

  describe("Event links (one-directional, approved)", () => {
    it("hajjcommand links to raisingkabah", () => {
      expect(getCommandById("hajjcommand")?.eventIds).toContain("raisingkabah");
    });
    it("repentancecommand links to gardenfall", () => {
      expect(getCommandById("repentancecommand")?.eventIds).toContain("gardenfall");
    });
    it("shirkprohibition links to ibrahimidolatry", () => {
      expect(getCommandById("shirkprohibition")?.eventIds).toContain("ibrahimidolatry");
    });
  });

  it("has no signIds usage in this initial dataset (no Signs & Miracles candidate was approved for Phase 9)", () => {
    for (const c of QURAN_COMMANDS) expect(c.signIds).toBeUndefined();
  });

  it("has no duaIds usage in this initial dataset", () => {
    for (const c of QURAN_COMMANDS) expect(c.duaIds).toBeUndefined();
  });

  describe("Theft source-note behavior (approved decision)", () => {
    it("Theft keeps sourceBasis quran_explicit with a disclosure note, not a different taxonomy value", () => {
      const theft = getCommandById("theftprohibition");
      expect(theft?.sourceBasis).toBe("quran_explicit");
      expect(theft?.statusNotes?.some((n) => n.toLowerCase().includes("punishment"))).toBe(true);
    });
  });

  describe("Devouring Orphans' Wealth (approved 18th entry)", () => {
    it("uses the approved references and theme", () => {
      const entry = getCommandById("orphanswealthprohibition");
      expect(entry?.type).toBe("prohibition");
      expect(entry?.sourceBasis).toBe("quran_explicit");
      expect(entry?.passage.surahNumber).toBe(4);
      expect(entry?.passage.ayahStart).toBe(10);
      expect(entry?.parallelPassages?.some((p) => p.surahNumber === 4 && p.ayahStart === 2)).toBe(true);
      expect(entry?.themeIds).toContain("orphans");
    });
  });

  describe("excluded candidates remain absent (documented scope decisions)", () => {
    it("does not include Truthfulness", () => {
      const ids = new Set(QURAN_COMMANDS.map((c) => c.id));
      expect(ids.has("truthfulnesscommand")).toBe(false);
      const titles = QURAN_COMMANDS.map((c) => c.title.toLowerCase());
      expect(titles.some((t) => t.includes("truthfulness"))).toBe(false);
    });

    it("does not include Transgression as a standalone entity", () => {
      const ids = new Set(QURAN_COMMANDS.map((c) => c.id));
      expect(ids.has("transgressionprohibition")).toBe(false);
      const titles = QURAN_COMMANDS.map((c) => c.title.toLowerCase());
      expect(titles.some((t) => t.includes("transgression"))).toBe(false);
    });

    it("does not include any Signs & Miracles candidates (e.g. Splitting of the Moon)", () => {
      const titles = QURAN_COMMANDS.map((c) => c.title.toLowerCase());
      expect(titles.some((t) => t.includes("moon"))).toBe(false);
    });

    it("does not include any candidate beyond the approved 18", () => {
      const approvedIds = new Set([
        "prayercommand", "zakahcommand", "fastingcommand", "hajjcommand", "justicecommand",
        "remembrancecommand", "repentancecommand", "honoringparentscommand", "keepingpromisescommand",
        "shirkprohibition", "murderprohibition", "zinaprohibition", "ribaprohibition", "theftprohibition",
        "backbitingprohibition", "falsetestimonyprohibition", "consumingwealthunjustlyprohibition",
        "orphanswealthprohibition",
      ]);
      const actualIds = new Set(QURAN_COMMANDS.map((c) => c.id));
      expect(actualIds).toEqual(approvedIds);
    });
  });
});
