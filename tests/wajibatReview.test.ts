// Decisions A6/A7: review status per helper path, and the rule that a helper is shown only when
// every one of its paths has a current sign-off (or the dev flag is on).
import { describe, expect, it } from "vitest";
import { TREE_REVIEWS, WAJIBAT_DATASET } from "../app/data/wajibat";
import type { DecisionTree } from "../app/data/wajibat";
import { enumeratePaths, isHelperVisible, pathHash, pathState, summariseReview, type TreeReviews } from "../app/utils/wajibatReview";

const trees = WAJIBAT_DATASET.decisionTrees;
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const signAll = (t: DecisionTree, status: "approved" | "changes-needed" = "approved"): TreeReviews => ({
  [t.id]: Object.fromEntries(enumeratePaths(t).map((p) => [p.id, { hash: pathHash(t, p), status, reviewer: "Reviewer", date: "2026-10-08" }])),
});

describe("helper review paths", () => {
  it("every path has a unique stable id, and the totals match the trees (262 paths)", () => {
    let total = 0;
    for (const t of trees) {
      const ps = enumeratePaths(t);
      expect(new Set(ps.map((p) => p.id)).size).toBe(ps.length);
      total += ps.length;
    }
    expect(total).toBe(262);
  });

  it("the stored sign-offs refer to real trees and paths, with a valid status", () => {
    for (const [treeId, recs] of Object.entries(TREE_REVIEWS)) {
      const t = trees.find((x) => x.id === treeId);
      expect(t, treeId).toBeTruthy();
      const ids = new Set(enumeratePaths(t!).map((p) => p.id));
      for (const [pid, r] of Object.entries(recs)) {
        expect(ids.has(pid), `${treeId}/${pid}`).toBe(true);
        expect(["approved", "changes-needed"]).toContain(r.status);
        expect(r.reviewer.trim().length).toBeGreaterThan(0);
        expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
});

describe("review state and the feature flag", () => {
  const t = trees[0];
  it("nothing is reviewed in an empty record: the helper is hidden unless the dev flag is on", () => {
    expect(pathState(t, enumeratePaths(t)[0], {})).toBe("unreviewed");
    expect(summariseReview(t, {}).fullyReviewed).toBe(false);
    expect(isHelperVisible(t, {}, false)).toBe(false);
    expect(isHelperVisible(t, {}, true)).toBe(true);
  });

  it("a helper is visible only when every path has a current approval", () => {
    const all = signAll(t);
    expect(summariseReview(t, all)).toMatchObject({ approved: enumeratePaths(t).length, fullyReviewed: true });
    expect(isHelperVisible(t, all, false)).toBe(true);
    const one = clone(all);
    const { [enumeratePaths(t)[3].id]: _removed, ...rest } = one[t.id];
    one[t.id] = rest;
    expect(isHelperVisible(t, one, false)).toBe(false);
    expect(summariseReview(t, one).unreviewed).toBe(1);
  });

  it("a path marked 'changes needed' keeps the helper hidden", () => {
    const r = signAll(t);
    const p = enumeratePaths(t)[0];
    r[t.id][p.id].status = "changes-needed";
    expect(pathState(t, p, r)).toBe("changes-needed");
    expect(isHelperVisible(t, r, false)).toBe(false);
  });

  it("editing a path after sign-off makes the sign-off stale and hides the helper again", () => {
    const r = signAll(t);
    const edited = clone(t);
    const leaf = edited.nodes.find((n) => n.outcome?.kind === "ruling")!;
    if (leaf.outcome?.kind === "ruling") leaf.outcome.quotes[0].text += " (edited)";
    expect(isHelperVisible(edited, r, false)).toBe(false);
    expect(summariseReview(edited, r).stale).toBeGreaterThan(0);
  });

  it("the hash changes when a question, an answer label or the outcome changes", () => {
    const base = pathHash(t, enumeratePaths(t)[0]);
    const q = clone(t);
    q.nodes.find((n) => n.id === t.rootId)!.question!.text.en += "?";
    expect(pathHash(q, enumeratePaths(q)[0])).not.toBe(base);
    const o = clone(t);
    o.nodes.find((n) => n.id === t.rootId)!.options![0].label.en += "!";
    expect(pathHash(o, enumeratePaths(o)[0])).not.toBe(base);
  });

  it("the shipped data follows the rule: a helper is visible exactly when all its paths are signed off", () => {
    for (const x of trees) expect(isHelperVisible(x, TREE_REVIEWS, false)).toBe(summariseReview(x, TREE_REVIEWS).fullyReviewed);
  });
});
