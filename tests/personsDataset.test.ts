// Verifies the Prophets & Qur'anic Persons seed dataset against real Quran
// structure (app/assets/data/surah.json) — an automated stand-in for
// prophets-quran-feature.md §28's "Verify exact Qur'an references" workflow
// step, run on every change to app/data/quranPersons.ts.
import { describe, expect, it } from "vitest";
import surahList from "../app/assets/data/surah.json";
import { QURAN_PERSONS, getPersonById } from "../app/data/quranPersons";
import { validateDataset, validatePerson } from "../app/utils/personsValidate";

const surahs = surahList.map((s: any) => ({ surahNo: s.surahNo, totalAyah: s.totalAyah }));

describe("QURAN_PERSONS dataset integrity", () => {
  it("has no validation issues against real surah/ayah bounds", () => {
    const issues = validateDataset(QURAN_PERSONS, surahs);
    expect(issues).toEqual([]);
  });

  it("has all 34 people: the 25 traditional named prophets + 9 other named/title-based figures", () => {
    expect(QURAN_PERSONS.length).toBe(34);
    expect(QURAN_PERSONS.filter((p) => p.primaryCategory === "prophet")).toHaveLength(25);
  });

  it("includes every one of the 25 traditionally named prophets by id", () => {
    const expected = [
      "adam", "idris", "nuh", "hud", "salih", "ibrahim", "lut", "ismail", "ishaq",
      "yaqub", "yusuf", "ayyub", "shuayb", "musa", "harun", "dhulkifl", "dawud",
      "sulaiman", "ilyas", "alyasa", "yunus", "zakariyya", "yahya", "isa", "muhammad",
    ];
    const ids = new Set(QURAN_PERSONS.map((p) => p.id));
    for (const id of expected) expect(ids.has(id)).toBe(true);
  });

  it("every person has a unique, non-empty id", () => {
    const ids = QURAN_PERSONS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.length).toBeGreaterThan(0);
  });

  it("every primaryCategory is one of the spec's defined categories", () => {
    const valid = new Set(["prophet", "woman", "man", "ruler_leader", "companion", "family_relative", "other"]);
    for (const person of QURAN_PERSONS) {
      expect(valid.has(person.primaryCategory)).toBe(true);
    }
  });

  it("every personType is one of the spec's defined types", () => {
    const valid = new Set(["prophet", "messenger", "prophet_and_messenger", "quranic_person", "title_based_person"]);
    for (const person of QURAN_PERSONS) {
      expect(valid.has(person.personType)).toBe(true);
    }
  });

  it("does not attach a prophetic honorific (AS) to a title_based_person", () => {
    // per §5 "Do not attach prophetic honorifics to non-prophets" — Luqman's
    // status is explicitly uncertain (§19 personType), so no honorific here.
    const luqman = getPersonById("luqman");
    expect(luqman?.honorific?.short).toBeUndefined();
  });

  it("gives Muhammad the ﷺ honorific, not AS", () => {
    const muhammad = getPersonById("muhammad");
    expect(muhammad?.honorific?.short).toBe("ﷺ");
  });

  it("every relatedPassage has a strictly non-decreasing ayah range", () => {
    for (const person of QURAN_PERSONS) {
      for (const passage of person.relatedPassages) {
        expect(passage.ayahStart).toBeLessThanOrEqual(passage.ayahEnd);
      }
    }
  });

  it("flags an out-of-range ayah as invalid (validator sanity check)", () => {
    const badPerson = {
      id: "test-bad",
      name: "Test",
      arabicName: "تست",
      primaryCategory: "other" as const,
      personType: "quranic_person" as const,
      shortDescription: "test",
      directMentions: [{ surahNumber: 1, ayahNumber: 999 }],
      relatedPassages: [],
    };
    const issues = validatePerson(badPerson, surahs);
    expect(issues.some((i) => i.message.includes("out of range"))).toBe(true);
  });

  it("flags a duplicate person id across the dataset", () => {
    const dup = [...QURAN_PERSONS, { ...QURAN_PERSONS[0] }];
    const issues = validateDataset(dup, surahs);
    expect(issues.some((i) => i.message.includes("duplicate person id"))).toBe(true);
  });

  it("Bilqis has zero Direct Mentions — her name is not in the Qur'an text, verified against the live search API", () => {
    // A deliberate, documented exception, not a data-entry gap: see her
    // statusNotes. Still must have at least a Related Passage (the story),
    // which validatePerson requires when directMentions is empty.
    const bilqis = getPersonById("bilqis");
    expect(bilqis?.directMentions).toEqual([]);
    expect(bilqis?.relatedPassages.length).toBeGreaterThan(0);
    expect(bilqis?.statusNotes?.some((n) => n.includes("does NOT appear"))).toBe(true);
  });

  it("every relationship's sourceType/verificationStatus is one of the defined values", () => {
    const validSource = new Set(["quran", "authentic_hadith", "traditional_account"]);
    const validVerification = new Set(["verified", "traditional", "uncertain"]);
    for (const person of QURAN_PERSONS) {
      for (const rel of person.relationships ?? []) {
        expect(validSource.has(rel.sourceType)).toBe(true);
        expect(validVerification.has(rel.verificationStatus)).toBe(true);
      }
    }
  });

  it("now that Isma'il, Ishaq, and Harun are full entries, no relationship still needs a STUB_PERSON_LABELS fallback for them", () => {
    // Regression guard for the specific stub->full-entry migration this
    // expansion performed — Ibrahim's/Musa's relationships should resolve
    // to real dataset entries now, not the UI's stub-name fallback map.
    const ids = new Set(QURAN_PERSONS.map((p) => p.id));
    const ibrahim = getPersonById("ibrahim")!;
    const musa = getPersonById("musa")!;
    for (const rel of [...(ibrahim.relationships ?? []), ...(musa.relationships ?? [])]) {
      expect(ids.has(rel.personId)).toBe(true);
    }
  });

  it("has no duplicate direct-mention references within any single person", () => {
    for (const person of QURAN_PERSONS) {
      const keys = person.directMentions.map((r) => `${r.surahNumber}:${r.ayahNumber}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});
