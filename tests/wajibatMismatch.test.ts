// Decision A1: automated mismatch check over the whole dataset. Every difference in numbers, ordinal
// words or negation words between the language versions of a ruling is reported, and a person
// decides each one (tests/fixtures/wajibatMismatchDecisions.json). The test run requires:
//  - the TypeScript check and scripts/wajibat/mismatch.py to agree on every English/Urdu pair
//    (so neither can drift, and the fixture is refreshed whenever the dataset changes);
//  - every reported mismatch to have a decision entry with a valid status (a new, unlisted mismatch fails).
// "pending" is a valid status: the report lists them for a person to decide.
import { describe, expect, it } from "vitest";
import { WAJIBAT_DATASET, WAJIBAT_RULINGS, getMarjaRuling, getRulingById } from "../app/data/wajibat";
import { compareVersions, signals } from "../app/utils/wajibatMismatch";
import fixture from "./fixtures/wajibatMismatches.json";
import decisions from "./fixtures/wajibatMismatchDecisions.json";

const STATUSES = new Set(["pending", "accepted", "fix", "withhold", "decided", "restored", "needs-human", "low-pending-review", "hidden-pending-review", "persian-decided-pending-review", "held-pending-review"]);
type Row = { key: string; pair: string; severity: string; kinds: { kind: string; severity: string; left: unknown; right: unknown }[] };
const rows = fixture.mismatches as Row[];

const computeEnUr = () => {
  const out: Record<string, Row["kinds"]> = {};
  for (const r of WAJIBAT_RULINGS)
    for (const e of r.rulings)
      for (const field of ["text", "question"] as const) {
        const t = e[field];
        if (t?.en && t?.ur && !e.urduOnly) {
          const found = compareVersions(t.en, "en", t.ur, "ur");
          if (found.length) out[`${r.id}|${e.marjaId}|${field}|en-ur`] = found;
        }
      }
  return out;
};

describe("mismatch signals", () => {
  it("reads numbers, ordinals and negations in all three languages", () => {
    expect(signals("Two rak‘ahs, not three; the 31st day", "en")).toEqual({ numbers: [2, 3], ordinals: [31], negation: 1 });
    expect(signals("دو رکعتیں، تین نہیں، اکتیسویں دن", "ur")).toEqual({ numbers: [2, 3], ordinals: [31], negation: 1 });
    expect(signals("دو رکعت، سه نباید، سی‌ام", "fa")).toEqual({ numbers: [2, 3], ordinals: [30], negation: 1 });
  });
  it("ignores list numbers and ruling references, folds Arabic yeh/kaf", () => {
    expect(signals("1. Wash.\n2. Wipe (see Ruling 413).", "en").numbers).toEqual([]);
    expect(signals("مسئلہ 413 دیکھیں", "ur").numbers).toEqual([]);
  });
  it("flags the two Khamenei slips that reading missed: 'three or four' against 'two or three', and the 31st day against the 30th", () => {
    const m = compareVersions("consider it the 3rd rak‘ah: three or four rak‘ahs", "en", "دو رکعتیں پڑھی ہیں یا تین", "ur");
    expect(m.some((x) => x.kind === "numbers" && x.severity === "high")).toBe(true);
    const d = compareVersions("after the 30th day", "en", "اکتیسویں دن کے بعد", "ur");
    expect(d.some((x) => x.kind === "ordinals" && x.severity === "high")).toBe(true);
  });
  it("flags a negation that appears on one side only", () => {
    expect(compareVersions("It is not necessary", "en", "ضروری ہے", "ur")).toEqual([{ kind: "negation", severity: "high", left: 1, right: 0 }]);
  });
  it("finds no difference between texts that agree", () => {
    expect(compareVersions("He must pray four rak‘ahs.", "en", "اسے چار رکعتیں پڑھنی چاہئیں۔", "ur")).toEqual([]);
  });
});

describe("mismatch report over the whole dataset", () => {
  it("the TypeScript check agrees with the generated report on every English/Urdu pair", () => {
    const ts = computeEnUr();
    // Rows whose Urdu is held back (decision B1) cannot be recomputed from the shipped data: the Urdu is not in it.
    const dec = decisions as Record<string, { status: string; hold?: string }>;
    // The hold hides the Urdu of the whole ruling entry (question and text), so any field's hold covers both fields.
    const urduHeldRulings = new Set(
      Object.keys(dec)
        .filter((k) => ["hidden-pending-review", "persian-decided-pending-review"].includes(dec[k]?.status) && dec[k]?.hold === "hide-ur")
        .map((k) => k.split("|").slice(0, 2).join("|")),
    );
    const heldUrdu = (k: string) => urduHeldRulings.has(k.split("|").slice(0, 2).join("|"));
    const py = Object.fromEntries(rows.filter((r) => r.pair === "en-ur" && !heldUrdu(r.key)).map((r) => [r.key, r.kinds]));
    expect(Object.keys(ts).sort()).toEqual(Object.keys(py).sort());
    for (const k of Object.keys(ts)) expect(JSON.parse(JSON.stringify(ts[k]))).toEqual(py[k]);
  });

  it("every reported mismatch has a decision with a valid status", () => {
    const dec = decisions as Record<string, { status: string }>;
    for (const r of rows) {
      expect(dec[r.key], `no decision entry for ${r.key}`).toBeTruthy();
      expect(STATUSES.has(dec[r.key].status), `${r.key}: bad status`).toBe(true);
    }
    expect(Object.keys(dec).sort()).toEqual(rows.map((r) => r.key).sort());
  });

  it("reports how many mismatches still wait for a person to decide", () => {
    const dec = decisions as Record<string, { status: string }>;
    const pending = Object.values(dec).filter((d) => d.status === "pending").length;
    console.info(`Wajibat mismatches: ${rows.length} flagged, ${pending} pending a decision (see wajibat_mismatch_report.md)`);
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe("safe-default triage and display holds (decision B1)", () => {
  type Dec = { status: string; hold?: string; note?: string };
  const dec = decisions as Record<string, Dec>;
  const HOLD = new Set(["hidden-pending-review", "persian-decided-pending-review", "held-pending-review"]);
  const held = Object.entries(dec).filter(([, d]) => HOLD.has(d.status));

  it("the triage accepts nothing: every automatic status is a hold, a needs-human, or a low-pending-review", () => {
    for (const [k, d] of Object.entries(dec)) {
      if (["hidden-pending-review", "persian-decided-pending-review"].includes(d.status)) expect(["hide-ur", "hide-en"], k).toContain(d.hold);
      else if (d.status === "held-pending-review") expect(d.hold, k).toBe("refer");
      else expect(d.hold, `${k} has a hold but status ${d.status}`).toBeUndefined();
    }
    expect(Object.values(dec).filter((d) => d.status === "pending").length).toBe(0);
  });

  it("Sistani high rows hide the Urdu; Khamenei holds follow the Persian; low rows hold nothing", () => {
    for (const [k, d] of held) {
      const [rid, marja] = k.split("|");
      const row = rows.find((r) => r.key === k)!;
      expect(row.severity, k).toBe("high");
      if (marja === "sistani") expect(d.hold).toBe("hide-ur");
      else expect(row.pair === "en-ur" || row.pair === "en-fa" || row.pair === "ur-fa").toBe(true);
      expect(rid.length).toBeGreaterThan(0);
    }
    for (const r of rows.filter((x) => x.severity === "low")) expect(dec[r.key].status === "low-pending-review" || !HOLD.has(dec[r.key].status), r.key).toBe(true);
  });

  it("all rows of one ruling and marja' carry the same hold", () => {
    const by = new Map<string, Set<string>>();
    for (const [k, d] of held) {
      const g = k.split("|").slice(0, 2).join("|");
      by.set(g, (by.get(g) ?? new Set()).add(d.hold!));
    }
    for (const [g, hs] of by) expect(hs.size, g).toBe(1);
  });

  it("the shipped data follows the holds: held Urdu is absent with its notice, held English is withheld with the Urdu present", () => {
    for (const [k, d] of held) {
      const [rid, marja] = k.split("|");
      const e = getMarjaRuling(getRulingById(rid)!, marja as "sistani" | "khamenei")!;
      expect(e.text.en.length, k).toBeGreaterThan(0);
      if (d.hold === "hide-ur") {
        expect(e.text.ur, k).toBeUndefined();
        expect(e.urSource, k).toBeUndefined();
        expect(e.urduNote, k).toMatch(/held back/);
      } else if (d.hold === "refer") {
        expect(e.referToRisala, k).toMatch(/^Held for review/);
      } else {
        expect(e.englishWithheld, k).toMatch(/^Held for review/);
        expect(e.text.ur, k).toBeTruthy();
        expect(e.persianSource, k).toBeTruthy();
      }
    }
  });

  it("a restored row carries no hold (restoring is a recorded decision with a reviewer and date)", () => {
    for (const [k, d] of Object.entries(dec).filter(([, x]) => x.status === "restored")) {
      expect(d.hold, k).toBeUndefined();
      expect((d as { reviewer?: string }).reviewer, k).toBeTruthy();
    }
  });

  it("a guided-prayer step on a ruling whose English is held back shows a verbatim Urdu excerpt of that ruling instead", () => {
    let n = 0;
    for (const p of WAJIBAT_DATASET.procedures)
      for (const st of p.steps) {
        const e = getMarjaRuling(getRulingById(st.rulingId)!, p.marjaId)!;
        if (e.englishWithheld === undefined) continue;
        n += 1;
        expect(st.instruction.ur, `${p.id}/${st.id}`).toBeTruthy();
        expect(e.text.ur, `${p.id}/${st.id}`).toContain(st.instruction.ur!);
      }
    expect(n).toBeGreaterThan(0); // the third and fourth rakʿah dhikr of Khamenei's zuhr and maghrib prayers
  });

  it("a helper answer on a ruling whose English is held back quotes the Urdu (the eight rulings of the former quoted-English rows)", () => {
    const eight = ["doubtaftersalaminvalid", "doubtimam", "doubtprayeritself", "doubtrepeated", "doubtsdismissedlist", "doubtsupposition", "excessiveact", "thirdfourthrakah"];
    for (const rid of eight) {
      const e = getMarjaRuling(getRulingById(rid)!, "khamenei")!;
      expect(e.englishWithheld, rid).toMatch(/^Held for review/);
    }
    for (const t of WAJIBAT_DATASET.decisionTrees)
      for (const nd of t.nodes)
        if (nd.outcome?.kind === "ruling")
          for (const q of nd.outcome.quotes)
            if (eight.includes(q.rulingId) && t.marjaId === "khamenei") expect(q.lang, `${t.id}/${nd.id}`).toBe("ur");
  });

  it("held-pending-review (a recorded decision) points to his book: the rulings where neither version matches the Persian", () => {
    const refer = [...new Set(held.filter(([, d]) => d.hold === "refer").map(([k]) => k.split("|")[0]))].sort();
    // the earlier eight (decision D1), the thirteen fasting rulings of Phase 5 (decision F2), and the Khums rulings of Phase 6
    // where neither version matches the Persian after the exemption wording was counted as negation (decision H10)
    const earlier = refer.filter((id) => !/^(kq|ks|sk)\d+$/.test(id));
    expect(refer.length - earlier.length).toBeGreaterThan(60);
    expect(
      ["ayatcauses", "doubtkinds", "fridaybest", "maghribishatime", "quransajdah", "tashahhudforgot", "turningface", "zuhrasrtime",
        "sawmdoubtday", "sawmforced", "sawmgirls", "sawmintentrecommended", "sawmjunubsleepsecond", "sawmkaffvow", "sawmqadaable", "sawmqadacount",
        "sawmqadaillness", "sawmqadaparentspurpose", "sawmrecommended", "sawmtravelplaces", "sawmtravelunawareshari"].sort()
    ).toEqual(earlier);
    for (const [k, d] of held.filter(([, x]) => x.hold === "refer")) {
      expect((d as { reviewer?: string }).reviewer, k).toBeTruthy();
      const e = getMarjaRuling(getRulingById(k.split("|")[0])!, "khamenei")!;
      expect(e.referToRisala, k).toBeTruthy();
      expect(e.source.url, k).toMatch(/^https:\/\/www\.leader\.ir\//);
    }
    // nothing quotes a held ruling: no step, no helper answer
    for (const p of WAJIBAT_DATASET.procedures) for (const st of p.steps) expect(refer, `${p.id}/${st.id}`).not.toContain(st.rulingId);
    for (const t of WAJIBAT_DATASET.decisionTrees)
      for (const nd of t.nodes) if (nd.outcome?.kind === "ruling") for (const q of nd.outcome.quotes) expect(refer, `${t.id}/${nd.id}`).not.toContain(q.rulingId);
  });
});
