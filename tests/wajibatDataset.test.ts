// Verifies the Wajibat (Module 18) dataset: internal references, Qur'an
// references against real surah bounds, and the module's source rules
// (per-marja' entries, official-site citations, Urdu only from official
// Urdu books, no fallback between maraji').
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { MARAJI, WAJIBAT_DATASET, WAJIBAT_RULINGS, getMarjaRuling, getRulingById } from "../app/data/wajibat";
import type { WajibatDataset } from "../app/data/wajibat";
import { validateWajibatDataset } from "../app/utils/wajibatValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));
const clone = (): WajibatDataset => JSON.parse(JSON.stringify(WAJIBAT_DATASET));

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
});
