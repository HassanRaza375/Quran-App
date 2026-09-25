import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET } from "../app/data/wajibat";
import type { WajibatDataset } from "../app/data/wajibat";
import { computeCoverage, summarizeCoverage } from "../app/utils/wajibatCoverage";

const tiny: WajibatDataset = {
  categories: [],
  glossary: [],
  topics: [
    {
      id: "t",
      fiqh: "jafari",
      categoryId: "c",
      title: { en: "T" },
      summary: { kind: "explanation", text: { en: "" } },
      rulingIds: ["r1", "r2"],
      lastSourceCheck: "2026-09-25",
    },
  ],
  rulings: [
    {
      id: "r1",
      topicId: "t",
      subject: { en: "one" },
      rulings: [
        { marjaId: "sistani", format: "issue", text: { en: "a", ur: "ا" }, basis: "fatwa", source: { title: "b", reference: "Ruling 1", url: "u" }, verification: "A" },
        { marjaId: "khamenei", format: "qa", question: { en: "q" }, text: { en: "a" }, basis: "fatwa", source: { title: "b", reference: "Q 1", url: "u" }, verification: "B" },
      ],
    },
    {
      id: "r2",
      topicId: "t",
      subject: { en: "two" },
      rulings: [{ marjaId: "sistani", format: "issue", text: { en: "a" }, basis: "fatwa", source: { title: "b", reference: "Ruling 2", url: "u" }, verification: "A" }],
    },
  ],
};

describe("computeCoverage", () => {
  it("counts sourced vs missing rulings per marja', per level, and Urdu availability", () => {
    const rows = computeCoverage(tiny, ["sistani", "khamenei", "makarem"]);
    const s = rows.find((r) => r.marjaId === "sistani")!;
    expect(s).toMatchObject({ total: 2, sourced: 2, missingRulingIds: [], withUrdu: 1, englishOnlyRulingIds: ["r2"], byLevel: { A: 2, B: 0, D: 0 } });
    const k = rows.find((r) => r.marjaId === "khamenei")!;
    expect(k).toMatchObject({ sourced: 1, missingRulingIds: ["r2"], byLevel: { A: 0, B: 1, D: 0 } });
    const m = rows.find((r) => r.marjaId === "makarem")!;
    expect(m).toMatchObject({ sourced: 0, missingRulingIds: ["r1", "r2"] });
  });

  it("summarizes totals across topics", () => {
    const rows = computeCoverage(tiny, ["sistani"]);
    expect(summarizeCoverage(rows, "sistani")).toEqual({ marjaId: "sistani", total: 2, sourced: 2, withUrdu: 1, byLevel: { A: 2, B: 0, D: 0 } });
  });

  it("runs over the real dataset with every Foundations ruling sourced for at least one marja'", () => {
    const rows = computeCoverage(WAJIBAT_DATASET, ["sistani", "khamenei"]);
    const perRuling = new Map<string, number>();
    for (const row of rows) for (const id of WAJIBAT_DATASET.topics.find((t) => t.id === row.topicId)!.rulingIds)
      if (!row.missingRulingIds.includes(id)) perRuling.set(id, (perRuling.get(id) ?? 0) + 1);
    for (const r of WAJIBAT_DATASET.rulings) expect(perRuling.get(r.id) ?? 0).toBeGreaterThan(0);
  });
});
