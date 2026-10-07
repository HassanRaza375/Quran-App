// Verifies the Wajibat (Module 18) dataset: internal references, Qur'an
// references against real surah bounds, and the module's source rules
// (per-marja' entries, official-site citations, Urdu only from official
// Urdu books, no fallback between maraji').
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { MARAJI, WAJIBAT_DATASET, WAJIBAT_RULINGS, getMarjaRuling, getRulingById, isRulingVisibleFor } from "../app/data/wajibat";
import type { WajibatDataset } from "../app/data/wajibat";
import { validateSourceSnapshot, validateWajibatDataset, type SourceSnapshot } from "../app/utils/wajibatValidate";
import { searchWajibat } from "../app/utils/wajibatSearch";
import { computeCoverage } from "../app/utils/wajibatCoverage";
import sourceSnapshot from "./fixtures/wajibatSourceSnapshot.json";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));
const clone = (): WajibatDataset => JSON.parse(JSON.stringify(WAJIBAT_DATASET));
const snapshot = sourceSnapshot as SourceSnapshot;

describe("Wajibat dataset integrity", () => {
  it("has no validation issues", () => {
    expect(validateWajibatDataset(WAJIBAT_DATASET, MARAJI, surahs)).toEqual([]);
  });

  it("covers exactly the three maraji' from the decisions log", () => {
    expect(MARAJI.map((m) => m.id).sort()).toEqual(["khamenei", "makarem", "sistani"]);
  });

  it("has no rulings for Makarem Shirazi until his risala is provided (decision P1)", () => {
    const makaremEntries = WAJIBAT_RULINGS.flatMap((r) => r.rulings).filter((m) => m.marjaId === "makarem");
    expect(makaremEntries).toEqual([]);
    expect(MARAJI.find((m) => m.id === "makarem")?.status).toBe("pending-sources");
  });

  it("never falls back to another marja' when an entry is missing", () => {
    const sistaniOnly = getRulingById("identifyingmujtahid")!;
    expect(getMarjaRuling(sistaniOnly, "sistani")?.marjaId).toBe("sistani");
    expect(getMarjaRuling(sistaniOnly, "khamenei")).toBeUndefined();
    expect(getMarjaRuling(sistaniOnly, "makarem")).toBeUndefined();
  });

  it("every Urdu ruling text carries its own Urdu-book citation (decision R1)", () => {
    for (const entry of WAJIBAT_RULINGS.flatMap((r) => r.rulings)) {
      if (entry.text.ur) {
        expect(entry.urSource?.reference).toBeTruthy();
        expect(entry.urSource?.title).not.toBe(entry.source.title);
      }
    }
  });

  it("labels an undefined 'caution' as unspecified, never as wajib/mustahab (decision P5)", () => {
    const q16 = getMarjaRuling(getRulingById("followingthealam")!, "khamenei")!;
    expect(q16.basis).toBe("ihtiyat_unspecified");
    expect(q16.text.en.startsWith("It is a caution")).toBe(true);
  });

  it("withholds outdated Urdu where the Urdu edition lags the revised ruling (decision P6)", () => {
    const r2271 = getMarjaRuling(getRulingById("bulughfacialhair")!, "sistani")!;
    expect(r2271.urduEditionLag).toBe(true);
    expect(r2271.text.ur).toBeUndefined();
  });

  it("Taharat Qur'anic basis cards use only ayahs that name the act (decision R2)", () => {
    const basis = (id: string) => WAJIBAT_DATASET.topics.find((t) => t.id === id)!.quranicBasis;
    expect(basis("wudu")).toEqual([{ surahNumber: 5, ayahNumber: 6 }]);
    expect(basis("ghusl")).toEqual([{ surahNumber: 5, ayahNumber: 6 }, { surahNumber: 4, ayahNumber: 43 }]);
    expect(basis("tayammum")).toEqual([{ surahNumber: 5, ayahNumber: 6 }, { surahNumber: 4, ayahNumber: 43 }]);
    expect(basis("najasat")).toBeUndefined();
  });

  it("every procedure step quotes its cited ruling verbatim for the procedure's marja'", () => {
    expect(WAJIBAT_DATASET.procedures.length).toBeGreaterThan(0);
    for (const p of WAJIBAT_DATASET.procedures)
      for (const s of p.steps) {
        const entry = getMarjaRuling(getRulingById(s.rulingId)!, p.marjaId)!;
        expect(entry.text.en).toContain(s.instruction.en);
      }
  });

  it("women-specific Taharat rulings are all marked sensitive (collapsed, decision Q8)", () => {
    const ids = WAJIBAT_DATASET.topics.find((t) => t.id === "haydistihadanifas")!.rulingIds;
    for (const id of ids) expect(getRulingById(id)!.sensitive).toBe(true);
  });

  it("revised (*) Sistani rulings carry compared Urdu, or say why the Urdu is withheld", () => {
    for (const e of WAJIBAT_RULINGS.flatMap((r) => r.rulings).filter((m) => m.marjaId === "sistani" && m.source.reference.endsWith("*"))) {
      if (e.text.ur) expect(e.urduEditionLag).toBeFalsy();
      else expect(!!e.urduEditionLag || !!e.urduNote).toBe(true);
    }
  });

  it("purity-of-persons rulings sit in their own panel, quoted with no app commentary (decision P8)", () => {
    const ids = WAJIBAT_RULINGS.filter((r) => r.panel === "persons").map((r) => r.id);
    expect(ids).toHaveLength(8);
    for (const id of ids)
      for (const e of getRulingById(id)!.rulings) {
        expect(e.verification).toBe("A");
        expect(e.note ?? "").not.toMatch(/app|explanation/i);
      }
  });

  it("the 5:6 note on wuḍūʾ is an explanation with a verbatim al-Mīzān quote and two source copies (decision P9)", () => {
    const notes = WAJIBAT_DATASET.topics.find((t) => t.id === "wudu")!.quranicBasisNotes!;
    expect(notes).toHaveLength(1);
    expect(notes[0]!.note.kind).toBe("explanation");
    expect(notes[0]!.quote.text).toContain("ومسح الرأس والرجلين");
    expect(notes[0]!.source.urls).toHaveLength(2);
  });

  it("guided prayers have the right number of rakʿahs, rukūʿs and sajdahs for each marja' (Phase 3)", () => {
    const expected: Record<string, number> = { fajr: 2, maghrib: 3, zuhr: 4 };
    for (const marja of ["sistani", "khamenei"])
      for (const [name, rakahs] of Object.entries(expected)) {
        const p = WAJIBAT_DATASET.procedures.find((x) => x.id === `${name}${marja}`)!;
        expect(p.marjaId).toBe(marja);
        const titled = (label: string) => p.steps.filter((s) => s.title.en.endsWith(label)).length;
        expect(titled("Rukūʿ")).toBe(rakahs);
        expect(titled("First sajdah")).toBe(rakahs);
        expect(titled("Tashahhud")).toBe(rakahs === 2 ? 1 : 2);
        expect(p.steps.at(-1)!.title.en).toBe("Salām");
        // rukn steps: intention, takbīr, and one rukūʿ and one sajdah per rakʿah
        expect(p.steps.filter((s) => s.isRukn).length).toBe(2 + 2 * rakahs);
      }
  });

  it("Khamenei's salat entries come from The Rules on Prayer & Fasting 2023 and carry no Urdu (decisions R1, R6)", () => {
    const salatTopics = new Set(WAJIBAT_DATASET.topics.filter((t) => t.categoryId === "salat").map((t) => t.id));
    const entries = WAJIBAT_RULINGS.filter((r) => salatTopics.has(r.topicId)).flatMap((r) => r.rulings).filter((m) => m.marjaId === "khamenei" && m.format === "issue");
    expect(entries.length).toBeGreaterThan(100);
    for (const e of entries) {
      expect(e.source.title).toBe("The Rules on Prayer & Fasting 2023");
      expect(e.source.url).toMatch(/^https:\/\/www\.leader\.ir\/en\/book\/241\?sn=\d+$/);
      expect(e.text.ur).toBeUndefined();
      expect(e.urduNote).toBeTruthy();
    }
  });

  it("Khamenei's supplementary Q&A salat entries: own Q numbers, compared with the 2023 Rules, his followers only (P13, R7)", () => {
    const supp = WAJIBAT_RULINGS.filter((r) => r.supplementary);
    expect(supp.length).toBe(53);
    expect(supp.filter((r) => r.rulings[0]!.text.ur).length).toBe(52);
    for (const r of supp) {
      const e = r.rulings[0]!;
      expect(r.rulings).toHaveLength(1);
      expect(r.supplementary!.marjaId).toBe("khamenei");
      expect(e.format).toBe("qa");
      expect(e.source.title).toBe("Practical Laws of Islam");
      expect(e.source.reference).toMatch(/^Q \d+$/);
      expect(e.source.url).toMatch(/^https:\/\/www\.leader\.ir\/en\/book\/32\/Practical-Laws-of-Islam\?sn=\d+$/);
      if (e.text.ur) expect(e.urSource?.reference).toMatch(/^س \d+$/);
      else expect(e.urduNote).toBeTruthy();
      expect(e.note).toMatch(/not a translation/);
      for (const c of r.supplementary!.agreesWith) {
        expect(c.title).toBe("The Rules on Prayer & Fasting 2023");
        expect(c.url).toMatch(/^https:\/\/www\.leader\.ir\/en\/book\/241\?sn=\d+$/);
      }
    }
    // Q 342 differs from Ruling 223 (stillness in recommended dhikr: flat duty vs obligatory caution) — not shown.
    expect(supp.some((r) => r.rulings[0]!.source.reference === "Q 342")).toBe(false);
  });

  it("a supplementary Q&A entry is hidden from other maraji' — in topics, search and coverage", () => {
    const qa = getRulingById("qiblaeffortqa")!;
    expect(isRulingVisibleFor(qa, "khamenei")).toBe(true);
    expect(isRulingVisibleFor(qa, "sistani")).toBe(false);
    expect(isRulingVisibleFor(qa, null)).toBe(false);
    expect(isRulingVisibleFor(getRulingById("qiblaeffort")!, "sistani")).toBe(true);
    expect(searchWajibat(WAJIBAT_DATASET, "compass", "sistani").rulings.map((r) => r.id)).not.toContain("qiblaeffortqa");
    expect(searchWajibat(WAJIBAT_DATASET, "compass", "khamenei").rulings.map((r) => r.id)).toContain("qiblaeffortqa");
    const rows = computeCoverage(WAJIBAT_DATASET, ["sistani", "khamenei"]).filter((r) => r.topicId === "qibla");
    expect(rows.find((r) => r.marjaId === "sistani")!.missingRulingIds).not.toContain("qiblaeffortqa");
    expect(rows.find((r) => r.marjaId === "khamenei")!.total).toBeGreaterThan(rows.find((r) => r.marjaId === "sistani")!.total);
  });

  it("every quoted text matches the official source it was extracted from (source snapshot)", () => {
    expect(validateSourceSnapshot(WAJIBAT_DATASET, snapshot)).toEqual([]);
    // Every quote is covered: one snapshot unit per text/question per language, plus recitations.
    const quotes = WAJIBAT_RULINGS.flatMap((r) => r.rulings).reduce(
      (n, e) => n + ["en", "ur"].filter((l) => e.text[l as "en"]).length + ["en", "ur"].filter((l) => e.question?.[l as "en"]).length,
      0
    );
    expect(Object.keys(snapshot).length).toBe(quotes + WAJIBAT_DATASET.recitations.length);
  });

  it("the prayer-times and qibla topics show live data from Module 5 rather than any computed times", () => {
    expect(WAJIBAT_DATASET.topics.find((t) => t.id === "prayertimes")!.liveTool).toBe("prayertimes");
    expect(WAJIBAT_DATASET.topics.find((t) => t.id === "qibla")!.liveTool).toBe("qibla");
  });

  it("every ruling is level A", () => {
    for (const entry of WAJIBAT_RULINGS.flatMap((r) => r.rulings)) expect(entry.verification).toBe("A");
  });
});

describe("validateWajibatDataset catches broken data", () => {
  const messages = (data: WajibatDataset) => validateWajibatDataset(data, MARAJI, surahs).map((i) => i.message);

  it("flags two entries for the same marja' in one ruling", () => {
    const data = clone();
    data.rulings[0]!.rulings.push({ ...data.rulings[0]!.rulings[0]! });
    expect(messages(data)).toContain('two entries for marja "sistani"');
  });

  it("flags a Makarem ruling while his sources are pending", () => {
    const data = clone();
    data.rulings[0]!.rulings.push({ ...data.rulings[0]!.rulings[0]!, marjaId: "makarem", source: { title: "x", reference: "1", url: "https://makarem.ir/x" } });
    expect(messages(data).some((m) => m.includes("pending sources"))).toBe(true);
  });

  it("flags Urdu text that has no Urdu citation", () => {
    const data = clone();
    const entry = data.rulings.flatMap((r) => r.rulings).find((m) => m.text.ur)!;
    delete entry.urSource;
    expect(messages(data)).toContain("Urdu text without an Urdu source citation");
  });

  it("flags a level-A source that is not on the marja's official site", () => {
    const data = clone();
    data.rulings[0]!.rulings[0]!.source.url = "https://al-islam.org/some-page";
    expect(messages(data).some((m) => m.startsWith("level-A source is not on"))).toBe(true);
  });

  it("flags a level-D entry without status: disputed", () => {
    const data = clone();
    data.rulings[0]!.rulings[0]!.verification = "D";
    expect(messages(data)).toContain("level-D entry requires status: disputed");
  });

  it("flags an out-of-bounds Qur'an reference", () => {
    const data = clone();
    data.topics[0]!.quranicBasis = [{ surahNumber: 1, ayahNumber: 8 }];
    expect(messages(data)).toContain("quranicBasis: 1:8 is out of bounds");
  });

  it("flags dangling topic/ruling references and non-explanation summaries", () => {
    const data = clone();
    data.topics[0]!.rulingIds.push("doesnotexist");
    (data.topics[0]!.summary as { kind: string }).kind = "ruling";
    const msgs = messages(data);
    expect(msgs).toContain('rulingIds references unknown ruling "doesnotexist"');
    expect(msgs).toContain("summary must be kind: explanation");
  });

  it("flags outdated Urdu text kept on an urduEditionLag entry", () => {
    const data = clone();
    const entry = data.rulings.flatMap((r) => r.rulings).find((m) => m.text.ur && m.urSource)!;
    entry.urduEditionLag = true;
    expect(messages(data).some((m) => m.includes("urduEditionLag"))).toBe(true);
  });

  it("flags a procedure step that is not a verbatim excerpt of its ruling", () => {
    const data = clone();
    data.procedures[0]!.steps[0]!.instruction.en = "Paraphrased by the app";
    expect(messages(data)).toContain("instruction is not a verbatim excerpt of the cited ruling");
  });

  it("flags procedure steps that are out of order", () => {
    const data = clone();
    data.procedures[0]!.steps[1]!.order = 5;
    expect(messages(data).some((m) => m.startsWith("steps must be ordered 1..n"))).toBe(true);
  });

  it("flags hyphenated ids (Shared Foundation #1)", () => {
    const data = clone();
    data.glossary[0]!.id = "ihtiyat-wajib";
    expect(messages(data).some((m) => m.includes("lowercase ASCII"))).toBe(true);
  });
  it("flags a paraphrased ruling text against the source snapshot", () => {
    const data = clone();
    const e = getMarjaRuling(data.rulings.find((r) => r.id === "qiblaeffortqa")!, "khamenei")!;
    e.text.en = "If using a pole or a compass gives certainty about the direction of qiblah, relying on it is correct.";
    expect(validateSourceSnapshot(data, snapshot).map((i) => i.message)).toContain("text differs from its numbered source unit (not verbatim)");
  });

  it("flags Arabic from another book spliced into an English quote (P12)", () => {
    const data = clone();
    const e = getMarjaRuling(data.rulings.find((r) => r.id === "rukudhikr")!, "sistani")!;
    e.text.en = e.text.en.replace("subḥāna", "سُبْحَانَ");
    expect(validateSourceSnapshot(data, snapshot).some((i) => i.id === "rukudhikr|sistani|en|text")).toBe(true);
    expect(messages(data).some((m) => m.includes("arabicInSource"))).toBe(true);
  });

  it("flags a quote with no traceable source unit", () => {
    const data = clone();
    data.rulings[0]!.id = "untraceable";
    expect(validateSourceSnapshot(data, snapshot).some((i) => i.id.startsWith("untraceable|"))).toBe(true);
  });

  it("flags a malformed supplementary entry", () => {
    const data = clone();
    const r = data.rulings.find((x) => x.id === "qiblaeffortqa")!;
    r.rulings.push({ ...getMarjaRuling(data.rulings.find((x) => x.id === "qiblaeffort")!, "sistani")! });
    r.supplementary!.agreesWith = [];
    const msgs = messages(data);
    expect(msgs).toContain("a supplementary ruling holds exactly one entry, for its own marja'");
    expect(msgs).toContain("a supplementary ruling must cite the ruling(s) it was compared with and agrees with");
  });
});
