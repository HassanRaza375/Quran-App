// The app loads the Wajibat data per category (app/data/wajibat/runtime.ts). These tests make sure the
// split loses nothing: the category chunks together hold exactly the full dataset, each ruling sits in the
// chunk of its topic's category, and the one-line ruling index (used by search) matches the data.
import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET } from "../app/data/wajibat";
import { DATA as foundations } from "../app/data/wajibat/chunks/foundations";
import { DATA as taharat } from "../app/data/wajibat/chunks/taharat";
import { DATA as salat } from "../app/data/wajibat/chunks/salat";
import { DATA as sawm } from "../app/data/wajibat/chunks/sawm";
import { WAJIBAT_RULING_INDEX } from "../app/data/wajibat/rulingIndex";
import { searchWajibat } from "../app/utils/wajibatSearch";

const CHUNKS = { foundations, taharat, salat, sawm } as const;
const topicCategory = new Map(WAJIBAT_DATASET.topics.map((t) => [t.id, t.categoryId]));

describe("per-category data chunks", () => {
  it("together hold exactly the full dataset", () => {
    const ids = (xs: { id: string }[]) => xs.map((x) => x.id).sort();
    const all = Object.values(CHUNKS);
    expect(ids(all.flatMap((c) => c.rulings))).toEqual(ids(WAJIBAT_DATASET.rulings));
    expect(ids(all.flatMap((c) => c.procedures))).toEqual(ids(WAJIBAT_DATASET.procedures));
    expect(ids(all.flatMap((c) => c.recitations))).toEqual(ids(WAJIBAT_DATASET.recitations));
    expect(ids(all.flatMap((c) => c.decisionTrees))).toEqual(ids(WAJIBAT_DATASET.decisionTrees));
  });

  it("put every ruling, procedure and helper in the chunk of its topic's category", () => {
    for (const [cat, c] of Object.entries(CHUNKS)) {
      for (const r of c.rulings) expect(topicCategory.get(r.topicId), r.id).toBe(cat);
      for (const t of c.decisionTrees) expect(topicCategory.get(t.topicId), t.id).toBe(cat);
    }
    const topicOfProcedure = new Map(WAJIBAT_DATASET.topics.flatMap((t) => (t.procedureIds ?? []).map((p) => [p, t.categoryId] as const)));
    for (const [cat, c] of Object.entries(CHUNKS)) for (const p of c.procedures) expect(topicOfProcedure.get(p.id), p.id).toBe(cat);
  });

  it("keep every cross-reference inside its own chunk (a page loads one category)", () => {
    for (const [cat, c] of Object.entries(CHUNKS)) {
      const own = new Set(c.rulings.map((r) => r.id));
      for (const r of c.rulings) for (const s of r.seeAlso ?? []) expect(own.has(s.rulingId), `${r.id} -> ${s.rulingId}`).toBe(true);
      for (const p of c.procedures) for (const st of p.steps) expect(own.has(st.rulingId), `${p.id}/${st.id}`).toBe(true);
      for (const t of c.decisionTrees)
        for (const n of t.nodes) if (n.outcome?.kind === "ruling") for (const q of n.outcome.quotes) expect(own.has(q.rulingId), `${t.id}/${n.id}`).toBe(true);
      for (const t of WAJIBAT_DATASET.topics.filter((x) => x.categoryId === cat)) for (const id of t.rulingIds) expect(own.has(id), `${t.id} -> ${id}`).toBe(true);
    }
  });

  it("have a ruling index that matches the data, and search over it matches search over the full data", () => {
    expect(WAJIBAT_RULING_INDEX.length).toBe(WAJIBAT_DATASET.rulings.length);
    for (const [i, r] of WAJIBAT_DATASET.rulings.entries()) {
      const x = WAJIBAT_RULING_INDEX[i]!;
      expect(x.id).toBe(r.id);
      expect(x.topicId).toBe(r.topicId);
      expect(x.subject).toEqual(r.subject);
      expect(x.supplementaryMarja).toBe(r.supplementary?.marjaId);
    }
    const data = { topics: WAJIBAT_DATASET.topics, glossary: WAJIBAT_DATASET.glossary };
    for (const q of ["kaffārah", "wuḍūʾ", "fiṭrah", "qunut", "doubt", "تقلید"]) {
      for (const m of ["sistani", "khamenei", null] as const) {
        const full = searchWajibat({ ...data, rulings: WAJIBAT_DATASET.rulings }, q, m).rulings.map((r) => r.id);
        const idx = searchWajibat({ ...data, rulings: WAJIBAT_RULING_INDEX }, q, m).rulings.map((r) => r.id);
        expect(idx, `${q}/${m}`).toEqual(full);
      }
    }
  });
});
