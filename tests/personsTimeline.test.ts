import { describe, expect, it } from "vitest";
import { QURAN_PERSONS } from "../app/data/quranPersons";
import { buildTimeline } from "../app/utils/personsTimeline";

describe("buildTimeline (against the real seed dataset)", () => {
  const timeline = buildTimeline(QURAN_PERSONS);

  it("orders the mainline by chronology.order ascending", () => {
    const orders = timeline.mainline.map((n) => n.person.chronology?.order);
    expect(orders).toEqual([...orders].sort((a, b) => (a ?? 0) - (b ?? 0)));
    expect(timeline.mainline.map((n) => n.person.id)).toEqual([
      "adam",
      "nuh",
      "ibrahim",
      "yusuf",
      "musa",
      "isa",
      "muhammad",
    ]);
  });

  it("only includes persons with primaryCategory 'prophet' and a chronology.order in the mainline", () => {
    for (const node of timeline.mainline) {
      expect(node.person.primaryCategory).toBe("prophet");
      expect(node.person.chronology?.order).not.toBeUndefined();
    }
  });

  it("does not branch a mainline prophet off another mainline prophet", () => {
    // Ibrahim's own relationships include "nuh", who is mainline — must not appear as a branch.
    const ibrahim = timeline.mainline.find((n) => n.person.id === "ibrahim")!;
    expect(ibrahim.branches.some((b) => b.personId === "nuh")).toBe(false);
  });

  it("attaches Maryam as a branch of Isa (found via Isa's own relationships)", () => {
    const isa = timeline.mainline.find((n) => n.person.id === "isa")!;
    expect(isa.branches.map((b) => b.personId)).toContain("maryam");
  });

  it("attaches stub relationship targets (not full dataset entries) as branches too", () => {
    const ibrahim = timeline.mainline.find((n) => n.person.id === "ibrahim")!;
    const musa = timeline.mainline.find((n) => n.person.id === "musa")!;
    expect(ibrahim.branches.map((b) => b.personId)).toEqual(expect.arrayContaining(["ismail", "ishaq"]));
    expect(musa.branches.map((b) => b.personId)).toContain("harun");
  });

  it("does not list Maryam as unlinked, since she's a branch of Isa", () => {
    expect(timeline.unlinked.map((p) => p.id)).not.toContain("maryam");
  });

  it("lists Luqman as unlinked (no chronology.order, no relationship to any mainline prophet)", () => {
    expect(timeline.unlinked.map((p) => p.id)).toContain("luqman");
  });

  it("every mainline + branch + unlinked person is accounted for exactly once (mainline vs. unlinked)", () => {
    const mainlineIds = new Set(timeline.mainline.map((n) => n.person.id));
    const unlinkedIds = new Set(timeline.unlinked.map((p) => p.id));
    for (const id of mainlineIds) expect(unlinkedIds.has(id)).toBe(false);
    // Every dataset person is either mainline or unlinked-or-a-branch (branches are relationship
    // pointers, not necessarily full dataset entries, so we only assert the mainline/unlinked split).
    expect(mainlineIds.size + timeline.unlinked.length).toBeLessThanOrEqual(QURAN_PERSONS.length);
  });
});

describe("buildTimeline (synthetic edge cases)", () => {
  const prophet = (id: string, order: number, relationships: any[] = []) => ({
    id,
    name: id,
    arabicName: id,
    primaryCategory: "prophet" as const,
    personType: "prophet" as const,
    shortDescription: "",
    chronology: { order, status: "strong" as const },
    directMentions: [],
    relatedPassages: [],
    relationships,
  });

  const nonProphet = (id: string, relationships: any[] = []) => ({
    id,
    name: id,
    arabicName: id,
    primaryCategory: "other" as const,
    personType: "quranic_person" as const,
    shortDescription: "",
    directMentions: [],
    relatedPassages: [],
    relationships,
  });

  it("excludes a prophet with no chronology.order from the mainline (treated as unlinked)", () => {
    const p1 = prophet("a", 1);
    const p2 = { ...prophet("b", 2), chronology: undefined };
    const timeline = buildTimeline([p1, p2]);
    expect(timeline.mainline.map((n) => n.person.id)).toEqual(["a"]);
    expect(timeline.unlinked.map((p) => p.id)).toContain("b");
  });

  it("only reads branches from the prophet's OWN outgoing relationships, not the other person's", () => {
    // "x" claims a relationship to "a", but "a" never names "x" back — should
    // NOT become a branch (that would require inferring/inverting relationshipType,
    // which this function deliberately refuses to do — see file header).
    const p1 = prophet("a", 1);
    const branch = nonProphet("x", [{ personId: "a", relationshipType: "supporter", sourceType: "quran", verificationStatus: "verified" }]);
    const timeline = buildTimeline([p1, branch]);
    expect(timeline.mainline[0].branches.map((b) => b.personId)).not.toContain("x");
    expect(timeline.unlinked.map((p) => p.id)).toContain("x");
  });

  it("does not duplicate a branch when the relationship happens to be recorded on both sides", () => {
    const p1 = prophet("a", 1, [{ personId: "x", relationshipType: "supporter", sourceType: "quran", verificationStatus: "verified" }]);
    const branch = nonProphet("x", [{ personId: "a", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" }]);
    const timeline = buildTimeline([p1, branch]);
    expect(timeline.mainline[0].branches).toHaveLength(1);
    expect(timeline.mainline[0].branches[0].personId).toBe("x");
  });

  it("returns an empty mainline and no crash for an all-unlinked dataset", () => {
    const timeline = buildTimeline([nonProphet("x"), nonProphet("y")]);
    expect(timeline.mainline).toEqual([]);
    expect(timeline.unlinked.map((p) => p.id).sort()).toEqual(["x", "y"]);
  });
});
