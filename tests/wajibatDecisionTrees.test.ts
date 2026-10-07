// Phase 4b: the decision helpers (prayer doubts and wuḍūʾ, per marja'). Decisions P17 (questions only
// describe the situation, each option names the ruling it rests on, tests check every branch),
// R11/P19 (withheld and Urdu-only text), R12 ("I'm not sure" always leads to the risala pointer).
import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET, getDecisionTreeById, getRulingById, MARAJI } from "../app/data/wajibat";
import type { DecisionNode, DecisionTree } from "../app/data/wajibat";
import { validateWajibatDataset } from "../app/utils/wajibatValidate";
import surahList from "../app/assets/data/surah.json";

const nfc = (s: string) => s.normalize("NFC");
const trees = WAJIBAT_DATASET.decisionTrees;
const byId = (t: DecisionTree) => new Map(t.nodes.map((n) => [n.id, n]));

interface Step { node: DecisionNode; via?: { label: string; basedOn: string[] } }
/** Every root-to-outcome path, following every option and every "I'm not sure". */
const allPaths = (t: DecisionTree): Step[][] => {
  const nodes = byId(t);
  const out: Step[][] = [];
  const go = (id: string, acc: Step[], via?: Step["via"]) => {
    const node = nodes.get(id)!;
    const path = [...acc, { node, via }];
    if (node.outcome) { out.push(path); return; }
    for (const o of node.options ?? []) go(o.nextId, path, { label: o.label.en, basedOn: o.basedOn.map((b) => b.rulingId) });
    go(node.notSureId!, path, { label: "I'm not sure", basedOn: [] });
  };
  go(t.rootId, []);
  return out;
};

/** Follow a scripted answer (option label substrings) from the root; returns the outcome node. */
const run = (t: DecisionTree, answers: string[]): DecisionNode => {
  const nodes = byId(t);
  let node = nodes.get(t.rootId)!;
  for (const a of answers) {
    const o = (node.options ?? []).find((x) => x.label.en.includes(a));
    expect(o, `no option containing "${a}" at ${node.id}`).toBeTruthy();
    node = nodes.get(o!.nextId)!;
  }
  expect(node.outcome, `${node.id} should be an outcome`).toBeTruthy();
  return node;
};
const quoted = (n: DecisionNode) => (n.outcome?.kind === "ruling" ? n.outcome.quotes.map((q) => nfc(q.text)).join("\n") : "");

describe("decision helpers: structure", () => {
  it("passes the dataset validator", () => {
    const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));
    expect(validateWajibatDataset(WAJIBAT_DATASET, MARAJI, surahs)).toEqual([]);
  });

  it("has a doubts helper and a wuḍūʾ helper for each of Sistani and Khamenei", () => {
    for (const id of ["sistanidoubts", "khameneidoubts", "sistaniwudu", "khameneiwudu"]) expect(getDecisionTreeById(id), id).toBeTruthy();
    expect(trees.map((t) => t.marjaId).sort()).toEqual(["khamenei", "khamenei", "sistani", "sistani"]);
  });

  it("has no helper for Makarem (no sources yet, decision P1)", () => {
    expect(trees.filter((t) => t.marjaId === "makarem")).toEqual([]);
  });
});

describe.each(trees.map((t) => [t.id, t] as const))("decision helper %s", (_id, tree) => {
  const paths = allPaths(tree);

  it("walks to an outcome along every path", () => {
    expect(paths.length).toBeGreaterThan(10);
    for (const p of paths) expect(p[p.length - 1].node.outcome).toBeTruthy();
  });

  it("offers \"I'm not sure\" on every question and it always ends at the risala pointer (R12)", () => {
    const nodes = byId(tree);
    for (const n of tree.nodes.filter((x) => x.question)) {
      const ns = nodes.get(n.notSureId!);
      expect(ns?.outcome?.kind, n.id).toBe("refer");
    }
    for (const p of paths.filter((x) => x[x.length - 1].via?.label === "I'm not sure")) {
      expect(p[p.length - 1].node.outcome?.kind).toBe("refer");
    }
    expect(tree.risala.url).toMatch(/^https:\/\//);
  });

  it("follows the rulings its options are based on: every quoted ruling is named by an option on the path (P17c)", () => {
    for (const p of paths) {
      const leaf = p[p.length - 1].node;
      if (leaf.outcome?.kind !== "ruling") continue;
      const basis = new Set(p.flatMap((s) => s.via?.basedOn ?? []));
      for (const q of leaf.outcome.quotes) {
        expect(basis.has(q.rulingId), `${tree.id}: leaf ${leaf.id} quotes ${q.rulingId}, which no option on the path is based on (${[...basis].join(", ")})`).toBe(true);
      }
      // the last choice made must itself rest on a ruling the answer quotes
      const lastBasis = p[p.length - 1].via!.basedOn;
      expect(leaf.outcome.quotes.some((q) => lastBasis.includes(q.rulingId)), `${leaf.id}: no quote comes from the last option's ruling`).toBe(true);
    }
  });

  it("quotes only this marja's own text, in the right language (R11, P19)", () => {
    for (const n of tree.nodes) {
      if (n.outcome?.kind !== "ruling") continue;
      for (const q of n.outcome.quotes) {
        const e = getRulingById(q.rulingId)?.rulings.find((m) => m.marjaId === tree.marjaId);
        expect(e, `${n.id}/${q.rulingId}`).toBeTruthy();
        expect(nfc(e!.text[q.lang] ?? "")).toContain(nfc(q.text));
        if (e!.englishWithheld !== undefined || e!.urduOnly) expect(q.lang).toBe("ur");
      }
    }
  });

  it("asks only about the user's situation and never states a ruling (P17a)", () => {
    const RULINGISH = /\b(must|should|obligatory|forbidden|haram|not allowed|permitted|not necessary|is valid|is invalid|dismiss)\b/i;
    for (const n of tree.nodes.filter((x) => x.question)) {
      expect(n.question!.text.en, n.id).not.toMatch(RULINGISH);
      for (const o of n.options!) expect(o.label.en, `${n.id}/${o.id}`).not.toMatch(RULINGISH);
    }
  });

  it("every ruling outcome says what it says: the verdict phrases occur in its quotes", () => {
    for (const n of tree.nodes) {
      if (n.outcome?.kind !== "ruling") continue;
      for (const v of n.outcome.verdictPhrases) expect(quoted(n)).toContain(nfc(v));
    }
  });
});

describe("decision helpers: golden scenarios", () => {
  const S = getDecisionTreeById("sistanidoubts")!;
  const K = getDecisionTreeById("khameneidoubts")!;
  const SW = getDecisionTreeById("sistaniwudu")!;
  const KW = getDecisionTreeById("khameneiwudu")!;

  it("Sistani: three or four rakʿahs, equal → ṣalāt al-iḥtiyāṭ one standing or two sitting", () => {
    const n = run(S, ["How many rakʿahs I have prayed", "Four", "Both are equally", "Between three and four"]);
    expect(quoted(n)).toContain("one rakʿah of ṣalāt al‑iḥtiyāṭ in a standing position or two rakʿahs in a sitting position");
  });

  it("Sistani: two or three after starting the second sajdah → three, one more rakʿah, then one standing rakʿah of iḥtiyāṭ; before it → invalid", () => {
    expect(quoted(run(S, ["How many rakʿahs I have prayed", "Four", "Both are equally", "Between two and three", "Yes"]))).toContain("one rakʿah of ṣalāt al‑iḥtiyāṭ in a standing position");
    expect(quoted(run(S, ["How many rakʿahs I have prayed", "Four", "Both are equally", "Between two and three", "No"]))).toContain("his prayer is invalid");
  });

  it("Sistani: four or five while standing → sit, tashahhud and salām", () => {
    expect(quoted(run(S, ["How many rakʿahs I have prayed", "Four", "Both are equally", "Between four and five", "standing"]))).toContain("he must sit down, say tashahhud and the salām");
  });

  it("Sistani: a leaning of more than fifty percent follows the leaning, no iḥtiyāṭ", () => {
    expect(quoted(run(S, ["How many rakʿahs I have prayed", "Four", "I lean"]))).toContain("is the same as the rule concerning certainty");
  });

  it("Sistani: two-rakʿah and three-rakʿah prayers with a doubt about the number are invalid", () => {
    expect(quoted(run(S, ["How many rakʿahs I have prayed", "Two"]))).toContain("invalidate prayers");
    expect(quoted(run(S, ["How many rakʿahs I have prayed", "Three"]))).toContain("three rakʿahs");
  });

  it("Sistani: a doubt after the time has ended whether I prayed → not necessary to pray", () => {
    expect(quoted(run(S, ["Whether I have prayed", "its time has ended, and I doubt whether I prayed it"]))).toContain("it is not necessary for him to perform that prayer");
    expect(quoted(run(S, ["Whether I have prayed", "still within its time"]))).toContain("he must perform it");
  });

  it("Sistani: a doubt about an act: before the next act perform it, after it dismiss", () => {
    expect(quoted(run(S, ["Whether I did an act", "An act that is not a rukn", "No, I have not started"]))).toContain("he must perform it");
    expect(quoted(run(S, ["Whether I did an act", "An act that is not a rukn", "Yes, I have started"]))).toContain("he must dismiss his doubt");
  });

  it("Khamenei: three or four, equal → one standing or two sitting caution prayer, quoted from the Urdu (English withheld, R11)", () => {
    const n = run(K, ["How many rakʿahs I have prayed", "Four", "Both are equally", "Between three and four"]);
    expect(n.outcome?.kind === "ruling" && n.outcome.quotes.every((q) => q.lang === "ur")).toBe(true);
    expect(quoted(n)).toContain("ایک رکعت یا بیٹھ کر دو رکعت نماز احتیاط");
  });

  it("Khamenei: two or three before the second sajdah ends → invalid (English issue 362)", () => {
    expect(quoted(run(K, ["How many rakʿahs I have prayed", "Four", "Both are equally", "Between two and three", "No"]))).toContain("before finishing the second sajdah");
  });

  it("Khamenei: no counterpart for Sistani's 'can't tell if I lean' branch, so it is not offered", () => {
    const q = K.nodes.find((n) => n.id === "kdk4")!;
    expect(q.options!.some((o) => o.label.en.includes("can't tell"))).toBe(false);
  });

  it("Sistani wuḍūʾ: doubt during prayer → perform wuḍūʾ and the prayer again; doubt void → still valid", () => {
    expect(quoted(run(SW, ["not sure whether I performed", "During the prayer"]))).toContain("perform the prayer again");
    expect(quoted(run(SW, ["has become void", "No"]))).toContain("still being valid");
  });

  it("Sistani wuḍūʾ: sleep → eyes do not see and ears do not hear", () => {
    expect(quoted(run(SW, ["whether something invalidates", "I slept"]))).toContain("eyes do not see and one’s ears do not hear");
  });

  it("Khamenei wuḍūʾ: the treatise answers are Urdu-only and the English entry is never quoted (P19)", () => {
    const n = run(KW, ["not sure whether I performed", "Before the prayer"]);
    expect(n.outcome?.kind === "ruling" && n.outcome.quotes.every((q) => q.lang === "ur")).toBe(true);
    expect(quoted(n)).toContain("وضو کرنا چاہئے");
    const e = getRulingById("wududoubtperformed")!.rulings.find((m) => m.marjaId === "khamenei")!;
    expect(e.urduOnly).toBe(true);
    expect(e.text.en).toBe("");
  });

  it("Khamenei wuḍūʾ: a doubt after performing wuḍūʾ quotes his Q&A (English)", () => {
    expect(quoted(run(KW, ["has become void"]))).toContain("No attention should be paid to doubt");
  });

  it("every helper's root \"I'm not sure\" leads to a refer outcome naming the marja's own risala", () => {
    for (const t of trees) {
      const root = byId(t).get(t.rootId)!;
      const ns = byId(t).get(root.notSureId!)!;
      expect(ns.outcome?.kind).toBe("refer");
      expect(t.risala.book.length).toBeGreaterThan(5);
    }
  });
});
