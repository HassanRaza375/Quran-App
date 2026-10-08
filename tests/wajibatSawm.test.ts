// Phase 5: Sawm (fasting) and zakāt al-fiṭrah. Checks that every ruling of the two source ranges is
// present exactly once, that the Urdu follows the rules of the module (P6, R1, R11), that the three
// editions of Khamenei's Rules are paired by their real numbers, and that the topics are wired up.
import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET, WAJIBAT_RULINGS, getCategoryById, getMarjaRuling, getRulingById, getTopicById } from "../app/data/wajibat";
import { searchWajibat } from "../app/utils/wajibatSearch";

const SAWM_TOPICS = ["sawmwho", "sawmexempt", "sawmniyyah", "sawmmubtilat", "sawmjanabah", "sawmtimes", "sawmkaffarah", "sawmonlyqada", "sawmqada", "sawmtravel", "sawmmonth", "sawmtypes", "zakatfitrah"];
const inTopics = (ids: string[]) => WAJIBAT_RULINGS.filter((r) => ids.includes(r.topicId));
// the rulings quoted from the two main books (Khamenei's supplementary Q&A entries are tested separately)
const entriesOf = (marjaId: string, ids = SAWM_TOPICS) => inTopics(ids).filter((r) => !r.supplementary).flatMap((r) => r.rulings.filter((e) => e.marjaId === marjaId));
const num = (ref: string) => parseInt(ref.replace(/\D/g, ""), 10);

describe("Phase 5: the Sawm category", () => {
  it("lists its 13 topics, each of which exists, belongs to it and has rulings", () => {
    const cat = getCategoryById("sawm")!;
    expect(cat.topicIds).toEqual(SAWM_TOPICS);
    for (const id of SAWM_TOPICS) {
      const t = getTopicById(id)!;
      expect(t.categoryId).toBe("sawm");
      expect(t.rulingIds.length).toBeGreaterThan(0);
      for (const rid of t.rulingIds) expect(getRulingById(rid)!.topicId).toBe(id);
    }
  });

  it("quotes every Sistani ruling of the fasting chapter (1529-1718) and of zakāt al-fiṭrah (2003-2044)", () => {
    const refs = entriesOf("sistani").map((e) => num(e.source.reference));
    const whole = new Set(refs);
    for (let n = 1529; n <= 1718; n++) expect(whole.has(n), `Ruling ${n}`).toBe(true);
    for (let n = 2003; n <= 2044; n++) expect(whole.has(n), `Ruling ${n}`).toBe(true);
    // Ruling 1662 is quoted twice, as two verbatim excerpts (doubting maghrib / doubting dawn); nothing else repeats
    const dup = refs.filter((n, i) => refs.indexOf(n) !== i);
    expect(dup).toEqual([1662]);
    const excerpts = entriesOf("sistani").filter((e) => num(e.source.reference) === 1662);
    expect(excerpts.every((e) => e.excerpt)).toBe(true);
  });

  it("quotes every Khamenei ruling of the fasting chapter (787-981) exactly once, from The Rules on Prayer & Fasting 2023", () => {
    const entries = entriesOf("khamenei");
    const refs = entries.map((e) => num(e.source.reference));
    expect(refs.length).toBe(195);
    expect(new Set(refs).size).toBe(195);
    for (let n = 787; n <= 981; n++) expect(refs).toContain(n);
    for (const e of entries) {
      expect(e.source.title).toBe("The Rules on Prayer & Fasting 2023");
      expect(e.verification).toBe("A");
    }
  });

  it("pairs each Khamenei ruling with the same ruling in the official Urdu and the Persian original, by number", () => {
    const by = new Map(entriesOf("khamenei").map((e) => [num(e.source.reference), e]));
    // Urdu follows the English order (+2); the Persian is +2 except 880 (= Persian 902) and 881-900 (+1)
    const expectNums = (n: number) => ({ ur: n + 2, fa: n === 880 ? 902 : n >= 881 && n <= 900 ? n + 1 : n + 2 });
    for (const n of [787, 817, 879, 880, 881, 886, 887, 893, 900, 901, 911, 912, 981]) {
      const e = by.get(n)!;
      const want = expectNums(n);
      expect(e.persianSource!.reference, `K${n} Persian`).toBe(`مسأله ${want.fa}`);
      // Urdu is withheld on rows held by the mismatch triage (B1); then there is no urSource to check
      if (e.urSource) expect(e.urSource.reference, `K${n} Urdu`).toBe(`مسئلہ ${want.ur}`);
    }
    // the Urdu reference is the Urdu edition's own number, never the Persian one, in the shifted range
    const k880 = by.get(880)!;
    expect(k880.persianSource!.reference).toBe("مسأله 902");
    const k887 = by.get(887)!;
    expect(k887.persianSource!.reference).toBe("مسأله 888");
    expect(k887.urSource?.reference ?? "مسئلہ 889").toBe("مسئلہ 889");
  });

  it("quotes Khamenei's Urdu footnote on the right ruling (879 and 883)", () => {
    const k879 = getMarjaRuling(getRulingById("sawmkaffwhen")!, "khamenei")!;
    const k883 = getMarjaRuling(getRulingById("sawmkaffvow")!, "khamenei")!;
    // The Urdu of 879 once carried the footnote that belongs to 883 (vow kaffārah: ten poor people, three days).
    if (k879.text.ur) expect(k879.text.ur).not.toContain("نذر کا کفارہ");
    if (k883.text.ur) expect(k883.text.ur).toContain("نذر کا کفارہ");
  });

  it("Khamenei's supplementary Q&A fasting entries: own Q numbers, compared with the 2023 Rules, his followers only (P13, R7)", () => {
    const supp = WAJIBAT_RULINGS.filter((r) => r.supplementary && SAWM_TOPICS.includes(r.topicId));
    expect(supp.length).toBe(41);
    for (const r of supp) {
      const e = r.rulings[0]!;
      expect(r.rulings).toHaveLength(1);
      expect(r.supplementary!.marjaId).toBe("khamenei");
      expect(e.format).toBe("qa");
      expect(e.source.title).toBe("Practical Laws of Islam");
      const q = num(e.source.reference);
      expect(q).toBeGreaterThanOrEqual(741);
      expect(q).toBeLessThanOrEqual(846);
      // the Urdu book numbers its questions as the English ones + 4 (when the Urdu is shown)
      if (e.urSource) expect(num(e.urSource.reference)).toBe(q + 4);
      expect(e.note).toMatch(/not a translation/);
      // every Rules ruling it agrees with is a fasting ruling (787-981) that the dataset quotes
      for (const c of r.supplementary!.agreesWith) {
        expect(c.title).toBe("The Rules on Prayer & Fasting 2023");
        const n = num(c.reference);
        expect(n).toBeGreaterThanOrEqual(787);
        expect(n).toBeLessThanOrEqual(981);
      }
      // hidden from everyone else
      expect(getMarjaRuling(r, "sistani")).toBeUndefined();
    }
  });

  it("revised (*) Sistani rulings of Phase 5 have no Urdu: the older Urdu edition lags (decision P6)", () => {
    for (const n of [1537, 1542, 1562, 1584, 1694, 1699, 2016]) {
      const e = entriesOf("sistani").find((x) => num(x.source.reference) === n)!;
      expect(e.source.reference).toBe(`Ruling ${n}*`);
      expect(e.text.ur).toBeUndefined();
      expect(e.urduEditionLag).toBe(true);
    }
  });

  it("zakāt al-fiṭrah has 42 Sistani entries and none for Khamenei, whose books do not state it", () => {
    const rs = inTopics(["zakatfitrah"]);
    expect(rs.length).toBe(42);
    for (const r of rs) {
      expect(r.rulings.map((e) => e.marjaId)).toEqual(["sistani"]);
      expect(getMarjaRuling(r, "khamenei")).toBeUndefined();
    }
  });

  it("points a marja' to the ruling that holds a point only when that ruling is in the same topic and has his entry", () => {
    for (const r of inTopics(SAWM_TOPICS)) {
      for (const s of r.seeAlso ?? []) {
        const target = getRulingById(s.rulingId)!;
        expect(target.topicId, r.id).toBe(r.topicId);
        expect(getMarjaRuling(target, s.marjaId), `${r.id} -> ${s.rulingId}`).toBeDefined();
        expect(getMarjaRuling(r, s.marjaId), r.id).toBeUndefined();
      }
    }
  });

  it("flags a difference between the maraji' only where both have an entry", () => {
    for (const r of inTopics(SAWM_TOPICS).filter((x) => x.differsBetweenMaraji)) {
      expect(getMarjaRuling(r, "sistani"), r.id).toBeDefined();
      expect(getMarjaRuling(r, "khamenei"), r.id).toBeDefined();
    }
  });

  it("collapses women-specific rulings and shows today's dawn and maghrib from the Prayer Times feature", () => {
    for (const id of ["sawmhaydfast", "sawmpregnant", "sawmbreastfeeding", "sawmgirls", "sawmhaydbefore"]) expect(getRulingById(id)!.sensitive).toBe(true);
    expect(getTopicById("sawmtimes")!.liveTool).toBe("sawm");
  });

  it("Qur'anic basis cards name fasting in their own words (decision R2)", () => {
    const basis = (id: string) => (WAJIBAT_DATASET.topics.find((t) => t.id === id)!.quranicBasis ?? []).map((q) => `${q.surahNumber}:${q.ayahNumber}`);
    expect(basis("sawmwho")).toEqual(["2:183", "2:185"]);
    expect(basis("sawmtimes")).toEqual(["2:187"]);
    expect(basis("sawmniyyah")).toEqual([]);
  });

  it("search finds the fasting topics and rulings", () => {
    const k = searchWajibat(WAJIBAT_DATASET, "kaffārah", "sistani");
    expect(k.rulings.some((r) => r.id === "sawmkaffwhen")).toBe(true);
    expect(k.topics.some((t) => t.id === "sawmkaffarah")).toBe(true);
    const f = searchWajibat(WAJIBAT_DATASET, "fiṭrah", "khamenei");
    expect(f.topics.some((t) => t.id === "zakatfitrah")).toBe(true);
    expect(f.rulings.some((r) => r.id === "fitrahdependants")).toBe(true);
    expect(searchWajibat(WAJIBAT_DATASET, "iftar").glossary.some((g) => g.id === "iftar")).toBe(true);
  });
});
