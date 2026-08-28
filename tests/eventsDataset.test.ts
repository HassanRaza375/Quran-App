// Verifies the Events seed dataset against real Quran structure and against
// the Persons/Peoples/Places/Stories/Themes/Duas datasets it cross-links —
// mirrors tests/duasDataset.test.ts's pattern for Phase 7.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_EVENTS, getEventById } from "../app/data/quranEvents";
import { validateEventDataset, validateEvent } from "../app/utils/eventsValidate";

const surahs = surahList.map((s: { surahNo: number; totalAyah: number }) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_EVENTS dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds and cross-module ids", () => {
    const issues = validateEventDataset(QURAN_EVENTS, surahs);
    expect(issues).toEqual([]);
  });

  it("has 40 events", () => {
    expect(QURAN_EVENTS.length).toBe(40);
  });

  it("every event has a unique, non-empty id", () => {
    const ids = QURAN_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every category is one of the 14 defined values", () => {
    const valid = new Set([
      "creation", "birth", "migration", "journey", "confrontation", "battle",
      "miracle", "trial", "rescue", "destruction", "revelation", "covenant",
      "worship", "communal_transformation",
    ]);
    for (const e of QURAN_EVENTS) expect(valid.has(e.category)).toBe(true);
  });

  it("every sourceBasis is one of the 4 defined values", () => {
    const valid = new Set(["quran_explicit", "quran_context", "traditional", "disputed"]);
    for (const e of QURAN_EVENTS) expect(valid.has(e.sourceBasis)).toBe(true);
  });

  it("every chronologyStatus is one of the 4 defined values", () => {
    const valid = new Set(["strong", "traditional", "uncertain", "unknown"]);
    for (const e of QURAN_EVENTS) expect(valid.has(e.chronologyStatus)).toBe(true);
  });

  it("every event has at least one Qur'an reference", () => {
    for (const e of QURAN_EVENTS) expect(e.passage).toBeDefined();
  });

  it("flags an out-of-range passage as invalid (validator sanity check)", () => {
    const bad = {
      id: "test-bad",
      title: "Test",
      arabicTitle: "تست",
      category: "trial" as const,
      sourceBasis: "quran_explicit" as const,
      chronologyStatus: "unknown" as const,
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 999, source: "quran" as const, verificationStatus: "verified" as const },
    };
    const issues = validateEvent(bad, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("flags a duplicate event id across the dataset", () => {
    const dup = [...QURAN_EVENTS, { ...QURAN_EVENTS[0] }];
    const issues = validateEventDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate event id"))).toBe(true);
  });

  it("flags an unresolvable personId", () => {
    const bad = {
      id: "test-bad2",
      title: "Test",
      arabicTitle: "تست",
      category: "trial" as const,
      sourceBasis: "quran_explicit" as const,
      chronologyStatus: "unknown" as const,
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      personIds: ["not-a-real-person"],
    };
    const issues = validateEvent(bad, surahs);
    expect(issues.some((i) => i.message.includes("does not resolve to a Persons-module entry"))).toBe(true);
  });

  it("flags an unresolvable relatedEventId", () => {
    const bad = {
      id: "test-bad3",
      title: "Test",
      arabicTitle: "تست",
      category: "trial" as const,
      sourceBasis: "quran_explicit" as const,
      chronologyStatus: "unknown" as const,
      description: "test",
      passage: { id: "p1", surahNumber: 1, ayahStart: 1, ayahEnd: 1, source: "quran" as const, verificationStatus: "verified" as const },
      relatedEventIds: ["not-a-real-event"],
    };
    const issues = validateEvent(bad, surahs, new Set(QURAN_EVENTS.map((e) => e.id).concat("test-bad3")));
    expect(issues.some((i) => i.message.includes("relatedEventIds"))).toBe(true);
  });

  it("uses personIds (not communityIds) for Persons-module group entities — the recurring bug from earlier phases", () => {
    const groupIds = new Set(["hawariyyun", "sahara", "yusufbrothers", "ashabalkahf", "ashabalukhdud", "ashabalfil"]);
    for (const e of QURAN_EVENTS) {
      for (const cid of e.communityIds ?? []) expect(groupIds.has(cid)).toBe(false);
    }
  });

  it("the Exodus and Sea Crossing event covers Aal Fir'aun's destruction — no separate duplicate event exists", () => {
    const ids = new Set(QURAN_EVENTS.map((e) => e.id));
    expect(ids.has("exoduscrossing")).toBe(true);
    expect(ids.has("aalfiraundestruction")).toBe(false);
    expect(ids.has("firaundrowning")).toBe(false);
  });

  it("does not create separate Events for Stories with no internal episode structure (documented boundary exclusion)", () => {
    const ids = new Set(QURAN_EVENTS.map((e) => e.id));
    expect(ids.has("peopleofthecave")).toBe(false);
    expect(ids.has("peopleofthetrench")).toBe(false);
    expect(ids.has("peopleoftheelephant")).toBe(false);
    expect(ids.has("nightjourney")).toBe(false);
    expect(ids.has("isranightjourney")).toBe(false);
  });

  it("does not name the Battle of Uhud — insufficiently Qur'an-grounded per this phase's own audit", () => {
    const titles = QURAN_EVENTS.map((e) => e.title.toLowerCase());
    expect(titles.some((t) => t.includes("uhud"))).toBe(false);
  });

  it("does not title an event 'Hudaybiyyah' — the pledge is Qur'an-explicit, the site name is traditional", () => {
    const dua = getEventById("pledgeunderthetree");
    expect(dua).toBeDefined();
    expect(dua?.title.toLowerCase()).not.toContain("hudaybiyyah");
    const ids = new Set(QURAN_EVENTS.map((e) => e.id));
    expect(ids.has("hudaybiyyah")).toBe(false);
  });

  it("the sacrifice trial does not assert which son was sacrificed", () => {
    const event = getEventById("sacrificetrial");
    expect(event?.description.toLowerCase()).not.toContain("isma'il");
    expect(event?.description.toLowerCase()).not.toContain("ishaq");
  });

  it("no event is categorized as eschatological — deferred to a future module per this phase's instructions", () => {
    const eschatologicalTitles = ["trumpet", "resurrection day", "gathering", "day of judgment"];
    for (const e of QURAN_EVENTS) {
      for (const t of eschatologicalTitles) expect(e.title.toLowerCase()).not.toContain(t);
    }
  });
});
