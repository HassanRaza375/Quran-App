import { describe, expect, it } from "vitest";
import { validateDataset, validatePerson, type SurahMeta } from "../app/utils/personsValidate";

const surahs: SurahMeta[] = [
  { surahNo: 1, totalAyah: 7 },
  { surahNo: 11, totalAyah: 123 },
  { surahNo: 12, totalAyah: 111 },
];

const basePerson = () => ({
  id: "p1",
  name: "Test Person",
  arabicName: "شخص",
  primaryCategory: "other" as const,
  personType: "quranic_person" as const,
  shortDescription: "A test person.",
  directMentions: [{ surahNumber: 11, ayahNumber: 25 }],
  relatedPassages: [],
});

describe("validatePerson", () => {
  it("passes a well-formed person with no issues", () => {
    expect(validatePerson(basePerson(), surahs)).toEqual([]);
  });

  it("flags missing required fields", () => {
    const person = { ...basePerson(), name: "", arabicName: "", shortDescription: "" };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message === "missing name")).toBe(true);
    expect(issues.some((i) => i.message === "missing arabicName")).toBe(true);
    expect(issues.some((i) => i.message === "missing shortDescription")).toBe(true);
  });

  it("flags a person with no Quran references at all", () => {
    const person = { ...basePerson(), directMentions: [], relatedPassages: [] };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("neither directMentions nor relatedPassages"))).toBe(true);
  });

  it("flags a direct mention referencing a nonexistent surah", () => {
    const person = { ...basePerson(), directMentions: [{ surahNumber: 999, ayahNumber: 1 }] };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("does not exist"))).toBe(true);
  });

  it("flags a direct mention with an ayah number beyond the surah's length", () => {
    // Surah 1 (Al-Faatiha) has 7 ayahs.
    const person = { ...basePerson(), directMentions: [{ surahNumber: 1, ayahNumber: 8 }] };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("out of range"))).toBe(true);
  });

  it("flags a direct mention missing ayahNumber", () => {
    const person = { ...basePerson(), directMentions: [{ surahNumber: 11 }] };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("missing ayahNumber"))).toBe(true);
  });

  it("flags duplicate direct mentions", () => {
    const person = {
      ...basePerson(),
      directMentions: [
        { surahNumber: 11, ayahNumber: 25 },
        { surahNumber: 11, ayahNumber: 25 },
      ],
    };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("duplicate entry"))).toBe(true);
  });

  it("flags a related passage with an inverted range", () => {
    const person = {
      ...basePerson(),
      relatedPassages: [
        { id: "rp1", surahNumber: 12, ayahStart: 50, ayahEnd: 10, source: "quran" as const, verificationStatus: "verified" as const },
      ],
    };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("is after ayahEnd"))).toBe(true);
  });

  it("flags a related passage range that overruns the surah's ayah count", () => {
    const person = {
      ...basePerson(),
      relatedPassages: [
        { id: "rp1", surahNumber: 12, ayahStart: 1, ayahEnd: 500, source: "quran" as const, verificationStatus: "verified" as const },
      ],
    };
    const issues = validatePerson(person, surahs);
    expect(issues.some((i) => i.message.includes("out of bounds"))).toBe(true);
  });

  it("accepts a valid related passage with no other issues", () => {
    const person = {
      ...basePerson(),
      directMentions: [],
      relatedPassages: [
        { id: "rp1", surahNumber: 12, ayahStart: 4, ayahEnd: 20, source: "quran" as const, verificationStatus: "verified" as const },
      ],
    };
    expect(validatePerson(person, surahs)).toEqual([]);
  });
});

describe("validateDataset", () => {
  it("passes a set of persons with unique ids and no issues", () => {
    const persons = [basePerson(), { ...basePerson(), id: "p2" }];
    expect(validateDataset(persons, surahs)).toEqual([]);
  });

  it("flags duplicate person ids", () => {
    const persons = [basePerson(), { ...basePerson() }];
    const issues = validateDataset(persons, surahs);
    expect(issues.some((i) => i.message.includes('duplicate person id "p1"'))).toBe(true);
  });

  it("does NOT flag a relationship pointing at a person id outside the dataset", () => {
    // Intentional per prophets-quran-feature.md §14 — a relationship may name
    // a related person who doesn't have a full profile yet (e.g. Harun).
    const person = {
      ...basePerson(),
      relationships: [{ personId: "someone-not-in-dataset", relationshipType: "brother", sourceType: "quran" as const, verificationStatus: "verified" as const }],
    };
    expect(validateDataset([person], surahs)).toEqual([]);
  });
});
