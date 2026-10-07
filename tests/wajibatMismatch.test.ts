// Decision A1: automated mismatch check over the whole dataset. Every difference in numbers, ordinal
// words or negation words between the language versions of a ruling is reported, and a person
// decides each one (tests/fixtures/wajibatMismatchDecisions.json). The test run requires:
//  - the TypeScript check and scripts/wajibat/mismatch.py to agree on every English/Urdu pair
//    (so neither can drift, and the fixture is refreshed whenever the dataset changes);
//  - every reported mismatch to have a decision entry with a valid status (a new, unlisted mismatch fails).
// "pending" is a valid status: the report lists them for a person to decide.
import { describe, expect, it } from "vitest";
import { WAJIBAT_RULINGS } from "../app/data/wajibat";
import { compareVersions, signals } from "../app/utils/wajibatMismatch";
import fixture from "./fixtures/wajibatMismatches.json";
import decisions from "./fixtures/wajibatMismatchDecisions.json";

const STATUSES = new Set(["pending", "accepted", "fix", "withhold", "decided"]);
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
    const py = Object.fromEntries(rows.filter((r) => r.pair === "en-ur").map((r) => [r.key, r.kinds]));
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
