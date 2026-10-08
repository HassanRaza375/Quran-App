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
import mismatchDecisions from "./fixtures/wajibatMismatchDecisions.json";

// Display holds from the mismatch triage (decision B1): ruling|marja' -> which version is hidden.
const HOLD_STATUSES = new Set(["hidden-pending-review", "persian-decided-pending-review"]);
const HOLDS = new Map<string, string>();
for (const [key, rec] of Object.entries(mismatchDecisions as Record<string, { status: string; hold?: string }>)) {
  if (HOLD_STATUSES.has(rec.status) && rec.hold) HOLDS.set(key.split("|").slice(0, 2).join("|"), rec.hold);
}
const heldWith = (hold: string) => [...HOLDS].filter(([, h]) => h === hold).map(([k]) => k);

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
        // An Urdu-only ruling (P19) has a single official text, so its one citation serves both.
        if (!entry.urduOnly) expect(entry.urSource?.title).not.toBe(entry.source.title);
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

  it("Khamenei's Rules entries: English from the 2023 Rules, official Urdu from book 197, checked against the Persian (R1, R6, R11)", () => {
    const entries = WAJIBAT_RULINGS.flatMap((r) => r.rulings).filter((m) => m.marjaId === "khamenei" && m.source.title === "The Rules on Prayer & Fasting 2023");
    expect(entries.length).toBe(200);
    const withUrdu = entries.filter((e) => e.text.ur);
    const noUrdu = entries.filter((e) => !e.text.ur);
    // Without Urdu: the three R11 cases, plus Urdu held back by the mismatch triage (B1).
    const urduWithheld = noUrdu.filter((e) => !/held back/.test(e.urduNote ?? ""));
    const urduHeld = noUrdu.filter((e) => /held back/.test(e.urduNote ?? ""));
    expect(withUrdu.length + urduHeld.length).toBe(197);
    for (const e of urduHeld) expect(e.urSource).toBeUndefined();
    for (const e of entries) {
      expect(e.source.url).toMatch(/^https:\/\/www\.leader\.ir\/en\/book\/241\?sn=\d+$/);
      // Every pair was read against the Persian original, which is never displayed (R11).
      expect(e.persianSource!.title).toBe("رساله نماز و روزه");
      expect(e.persianSource!.url).toMatch(/^https:\/\/www\.leader\.ir\/fa\/book\/180\/1\?sn=\d+$/);
    }
    for (const e of withUrdu) {
      expect(e.urSource!.title).toBe("نماز اور روزه کی احکام");
      expect(e.urSource!.reference).toMatch(/^مسئلہ \d+(، \d+)?$/);
      expect(e.urSource!.url).toMatch(/^https:\/\/www\.leader\.ir\/ur\/book\/197\/1\?sn=\d+$/);
    }
    // Urdu differs from the Persian here, so only the English (which matches it) is shown.
    expect(urduWithheld.map((e) => e.source.reference).sort()).toEqual(["265.", "390.", "588."]);
    for (const e of urduWithheld) expect(e.urduNote).toMatch(/differs from the Persian original/);
  });

  it("R11: where the English differs from the Persian original the English is withheld and the official Urdu is what is shown", () => {
    const all = WAJIBAT_RULINGS.flatMap((r) => r.rulings).filter((m) => m.englishWithheld !== undefined);
    // English held back by the mismatch triage (B1) is a separate, reversible kind of withholding.
    const held = all.filter((e) => /^Held for review/.test(e.englishWithheld!));
    const withheld = all.filter((e) => !/^Held for review/.test(e.englishWithheld!));
    expect(held.length).toBe(heldWith("hide-en").length);
    for (const e of held) expect(e.text.ur).toBeTruthy();
    expect(withheld.map((e) => e.source.reference).sort()).toEqual(["190.", "221.", "364.", "394.", "465.", "711.", "89."].sort());
    for (const e of withheld) {
      expect(e.marjaId).toBe("khamenei");
      expect(e.text.ur).toBeTruthy();
      expect(e.urSource).toBeTruthy();
      expect(e.persianSource).toBeTruthy();
    }
    // 711: the Persian and Urdu say only "by caution"; the English's "obligatory" is not in the Persian.
    const imam = getMarjaRuling(getRulingById("imamconditions")!, "khamenei")!;
    expect(imam.note).toMatch(/without stating whether it is obligatory or recommended/);
    // Footnote-only differences: the English body is a verbatim excerpt without the footnote.
    for (const id of ["fajrtime", "qiblaeffort"]) {
      const e = getMarjaRuling(getRulingById(id)!, "khamenei")!;
      expect(e.excerpt).toBe(true);
      expect(e.text.en).not.toContain("\n* ");
      expect(e.text.ur).toContain("\n* ");
      expect(e.note).toMatch(/footnote differs from the Persian original/);
    }
  });

  it("Khamenei's supplementary Q&A salat entries: own Q numbers, compared with the 2023 Rules, his followers only (P13, R7)", () => {
    const supp = WAJIBAT_RULINGS.filter((r) => r.supplementary);
    expect(supp.length).toBe(61);
    expect(supp.filter((r) => r.rulings[0]!.text.ur).length).toBe(60);
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

  it("Phase 4a: the doubts, ṣalāt al-iḥtiyāṭ and sajdat al-sahw topics quote each marja's whole chapter", () => {
    const topics = ["doubts", "ihtiyatprayer", "sahwforgotten"];
    const salat = WAJIBAT_DATASET.categories.find((c) => c.id === "salat")!;
    for (const t of topics) expect(salat.topicIds).toContain(t);
    const entries = WAJIBAT_RULINGS.filter((r) => topics.includes(r.topicId) && !r.supplementary).flatMap((r) => r.rulings);
    const num = (e: { source: { reference: string } }) => Number(e.source.reference.match(/\d+/)![0]);
    // Sistani: every ruling of the chapter (Islamic Laws 1151–1257), each exactly once.
    const sis = entries.filter((e) => e.marjaId === "sistani").map(num).sort((a, b) => a - b);
    expect(sis).toEqual(Array.from({ length: 107 }, (_, i) => 1151 + i));
    // Khamenei: Rules on Prayer & Fasting 346–406, minus four restatements within the same book.
    const kh = entries.filter((e) => e.marjaId === "khamenei").map(num).sort((a, b) => a - b);
    const restated = [361, 365, 374, 377];
    expect(kh).toEqual(Array.from({ length: 61 }, (_, i) => 346 + i).filter((n) => !restated.includes(n)));
    // Revised (*) rulings compared with the Urdu one by one (P6): 1220* lags, 1222* matches.
    const s1220 = getMarjaRuling(getRulingById("doubtsupposition")!, "sistani")!;
    expect(s1220.urduEditionLag).toBe(true);
    expect(s1220.text.ur).toBeUndefined();
    // 1222* matches the Urdu; it has Urdu unless the mismatch triage holds it back (B1).
    const held1222 = HOLDS.get("sahwcases|sistani") === "hide-ur";
    expect(!!getMarjaRuling(getRulingById("sahwcases")!, "sistani")!.text.ur).toBe(!held1222);
  });

  it("P15: Khamenei's Rules 465 (mistranslated in the English edition) shows the Persian-matching official Urdu, not the English", () => {
    const leisure = getRulingById("qasrleisure")!;
    const e = getMarjaRuling(leisure, "khamenei")!;
    expect(e.source.reference).toBe("465.");
    expect(e.englishWithheld).toMatch(/P15/);
    expect(e.urSource!.reference).toBe("مسئلہ 466");
    expect(e.text.ur).toContain("قصر");        // "…the prayer is shortened"
    expect(e.persianSource!.reference).toBe("مسأله 466");
    // Sistani's ruling on the same point is unaffected.
    expect(getMarjaRuling(leisure, "sistani")).toBeTruthy();
  });

  it("seeAlso only points from a marja' with no entry to a same-topic ruling that has his entry", () => {
    const withSeeAlso = WAJIBAT_RULINGS.filter((r) => r.seeAlso?.length);
    expect(withSeeAlso.length).toBeGreaterThan(0);
    for (const r of withSeeAlso) {
      for (const s of r.seeAlso!) {
        expect(getMarjaRuling(r, s.marjaId)).toBeUndefined();
        const target = getRulingById(s.rulingId)!;
        expect(target.topicId).toBe(r.topicId);
        expect(getMarjaRuling(target, s.marjaId)).toBeTruthy();
      }
    }
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

  it("flags a seeAlso that points at a ruling without that marja's entry", () => {
    const data = clone();
    const r = data.rulings.find((x) => x.id === "doubttakbir")!;
    r.seeAlso = [{ marjaId: "sistani", rulingId: "doubtkinds" }];
    expect(messages(data)).toContain('seeAlso target "doubtkinds" has no entry for sistani');
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
  it("flags withheld English without the Urdu, the Persian check, or on a non-Khamenei marja' (R11)", () => {
    const data = clone();
    const e = getMarjaRuling(data.rulings.find((x) => x.id === "qasrleisure")!, "khamenei")!;
    delete e.text.ur; delete e.urSource; delete e.persianSource;
    const msgs = messages(data);
    expect(msgs).toContain("englishWithheld entries must carry the official Urdu text with its citation (the English is not shown)");
    expect(msgs).toContain("englishWithheld entries must cite the Persian original they were decided against (decision R11)");
    const sis = clone();
    const s0 = getMarjaRuling(sis.rulings.find((x) => x.id === "qibladirection")!, "sistani")!;
    s0.englishWithheld = "x";
    expect(messages(sis)).toContain("englishWithheld applies to Khamenei only: his English and Urdu are both translations of the Persian (decision R11)");
  });

  it("flags a guided-prayer step that quotes withheld English", () => {
    const data = clone();
    const step = data.procedures.find((p) => p.marjaId === "khamenei")!.steps[0]!;
    const target = getMarjaRuling(data.rulings.find((x) => x.id === step.rulingId)!, "khamenei")!;
    target.englishWithheld = "x";
    expect(messages(data).some((m) => m.includes("which is withheld or does not exist (decisions R11, P19)"))).toBe(true);
  });
});
