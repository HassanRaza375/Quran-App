// Phase 6: Khums and Zakat. Every Sistani ruling of both chapters is present once, Khamenei's Q&A book
// "The Rulings of Khums" is paired by its real question numbers, his Q&A that only he answers are shown to
// his followers only (the `audience` field), and nothing about paying (accounts, offices, conversions) is stored.
import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET, WAJIBAT_RULINGS, getCategoryById, getMarjaRuling, getRulingById, getTopicById, isRulingVisibleFor } from "../app/data/wajibat";
import { searchWajibat } from "../app/utils/wajibatSearch";

const KHUMS = getCategoryById("khums")!;
const ZAKAT = getCategoryById("zakat")!;
const inTopics = (ids: string[]) => WAJIBAT_RULINGS.filter((r) => ids.includes(r.topicId));
const num = (ref: string) => parseInt(ref.replace(/\D/g, ""), 10);
const sistaniRefs = (ids: string[]) =>
  inTopics(ids).flatMap((r) => r.rulings.filter((e) => e.marjaId === "sistani" && !r.supplementary)).map((e) => num(e.source.reference));

describe("Phase 6: Khums and Zakat topics", () => {
  it("each category lists existing topics that point back at it and hold rulings", () => {
    expect(KHUMS.topicIds).toHaveLength(14);
    expect(ZAKAT.topicIds).toHaveLength(7); // zakāt al-fiṭrah stays in the Sawm category (Phase 5)
    for (const cat of [KHUMS, ZAKAT]) {
      for (const id of cat.topicIds) {
        const t = getTopicById(id)!;
        expect(t, id).toBeTruthy();
        expect(t.categoryId).toBe(cat.id);
        expect(t.rulingIds.length, id).toBeGreaterThan(0);
        for (const rid of t.rulingIds) expect(getRulingById(rid)!.topicId).toBe(id);
      }
    }
  });

  it("quotes every Sistani khums ruling (1768-1866) and zakat ruling (1871-2002) exactly once", () => {
    const k = sistaniRefs(KHUMS.topicIds);
    for (let n = 1768; n <= 1866; n++) expect(k.filter((x) => x === n), `Ruling ${n}`).toHaveLength(1);
    const z = sistaniRefs(ZAKAT.topicIds);
    for (let n = 1871; n <= 2002; n++) expect(z.filter((x) => x === n), `Ruling ${n}`).toHaveLength(1);
  });

  it("keeps the unnumbered business-goods passage as an excerpt of the 4th edition", () => {
    const r = getRulingById("zkbusiness")!;
    expect(r.topicId).toBe("zakatbusiness");
    expect(getMarjaRuling(r, "sistani")!.text.en).toMatch(/not obligatory for him to give zakat on them\.$/);
  });
});

describe("Phase 6: Khamenei's Rulings of Khums", () => {
  const entries = inTopics(KHUMS.topicIds).flatMap((r) => r.rulings.filter((e) => e.marjaId === "khamenei").map((e) => ({ r, e })));

  const qa = entries.filter(({ e }) => /^Q \d+$/.test(e.source.reference));
  const statements = entries.filter(({ e }) => !/^Q \d+$/.test(e.source.reference));

  it("cites every Q&A entry as 'Q n' of The Rulings of Khums, once, with the Persian original", () => {
    const refs = qa.map(({ e }) => num(e.source.reference));
    expect(new Set(refs).size).toBe(refs.length);
    for (const { e } of qa) {
      expect(e.source.title).toBe("The Rulings of Khums");
      expect(e.persianSource?.reference).toBe(`سؤال ${num(e.source.reference)}`);
      expect(e.source.url).toMatch(/^https:\/\/www\.leader\.ir\/en\/book\//);
    }
    expect(refs.length).toBe(305);
  });

  it("pairs the official Urdu of a Q&A entry by the same question number", () => {
    for (const { e } of qa) if (e.urSource) expect(num(e.urSource.reference)).toBe(num(e.source.reference));
  });

  it("adds the book's unnumbered statements, cited by section and paragraph, and pairs Urdu and Persian only when all three editions line up", () => {
    expect(statements.length).toBe(78);
    let triple = 0;
    for (const { e } of statements) {
      expect(e.source.reference).toMatch(/^Para\. \d+, /);
      expect(e.source.url).toMatch(/^https:\/\/www\.leader\.ir\/en\/book\/261\?sn=\d+$/);
      if (e.urSource) expect(e.persianSource, e.source.reference).toBeTruthy(); // an Urdu text is never shown without its Persian check
      if (e.persianSource) {
        triple++; // all three editions lined up (the Urdu may then be hidden by a display hold)
        expect(e.persianSource.reference).toMatch(/^بند \d+، /);
        if (e.urSource) expect(e.urSource.reference).toMatch(/^فقرہ \d+، /);
      } else expect(e.urduNote).toMatch(/only the English is shown/);
    }
    expect(triple).toBe(26);
  });

  it("shows a question only he answers to his followers alone", () => {
    const only = WAJIBAT_RULINGS.filter((r) => r.audience);
    expect(only.length).toBeGreaterThan(250);
    for (const r of only) {
      expect(r.audience).toBe("khamenei");
      expect(r.rulings).toHaveLength(1);
      expect(isRulingVisibleFor(r, "khamenei")).toBe(true);
      expect(isRulingVisibleFor(r, "sistani")).toBe(false);
    }
  });

  it("finds an audience-only question in search for his followers, not for another marja'", () => {
    const hit = (marja: string) => searchWajibat(WAJIBAT_DATASET, "set of dishes partly used", marja as never).rulings.some((h) => h.id === "kq112");
    expect(hit("khamenei")).toBe(true);
    expect(hit("sistani")).toBe(false);
  });
});

describe("Phase 6: zakāt al-fiṭrah and amounts", () => {
  it("adds no Khamenei zakāt entry (decision G4): his zakāt chapter is not available in English or Urdu", () => {
    const zk = inTopics(ZAKAT.topicIds).filter((r) => r.rulings.some((e) => e.marjaId === "khamenei"));
    expect(zk).toEqual([]);
  });

  it("states amounts exactly as the text does and converts nothing (decision G2)", () => {
    const grain = getMarjaRuling(getRulingById("zk1880")!, "sistani")!.text.en;
    expect(grain).toBeTruthy();
    const all = inTopics(ZAKAT.topicIds.concat(KHUMS.topicIds)).flatMap((r) => r.rulings.map((e) => e.text.en));
    // no "approximately N grams / tola / rupees" is added by the app: the only gram figures are the glossary's own
    for (const t of all) expect(t).not.toMatch(/\b(tola|rupee|PKR|USD)\b/i);
  });

  it("marks only the topics about paying with payLink, and stores no bank or office details", () => {
    const pay = [...KHUMS.topicIds, ...ZAKAT.topicIds].filter((id) => getTopicById(id)!.payLink);
    expect(pay.sort()).toEqual(["khumsdistribution", "zakatgiving", "zakatrecipients"].sort());
    const blob = JSON.stringify(WAJIBAT_RULINGS.filter((r) => ["khumsdistribution", "zakatrecipients", "zakatgiving"].includes(r.topicId)));
    expect(blob).not.toMatch(/\bIBAN\b|account (no|number)|swift/i);
  });
});
