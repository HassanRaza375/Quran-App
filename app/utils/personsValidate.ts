// Dataset integrity checks for the Prophets & Qur'anic Persons feature.
// Implements prophets-quran-feature.md §28 ("Verify exact Qur'an references")
// and §27's "must be verified against the actual Qur'an content" rule as an
// automated, repeatable check rather than a one-time manual pass — run by
// tests/personsDataset.test.ts against the live surah.json ayah counts, and
// safe to reuse for any future additions to the dataset.
import type { QuranPerson } from "~/data/quranPersons";

export interface SurahMeta {
  surahNo: number;
  totalAyah: number;
}

export interface ValidationIssue {
  personId: string;
  message: string;
}

const isValidSurah = (surahNumber: number, surahs: SurahMeta[]): SurahMeta | undefined =>
  surahs.find((s) => s.surahNo === surahNumber);

/** Validates one person's Qur'an references against real surah/ayah bounds. */
export const validatePerson = (person: QuranPerson, surahs: SurahMeta[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const push = (message: string) => issues.push({ personId: person.id, message });

  if (!person.id) push("missing id");
  if (!person.name) push("missing name");
  if (!person.arabicName) push("missing arabicName");
  if (!person.shortDescription) push("missing shortDescription");
  if (!person.directMentions.length && !person.relatedPassages.length) {
    push("has neither directMentions nor relatedPassages — must have at least one Qur'an reference");
  }

  for (const ref of person.directMentions) {
    const surah = isValidSurah(ref.surahNumber, surahs);
    if (!surah) {
      push(`directMentions: surah ${ref.surahNumber} does not exist`);
      continue;
    }
    if (ref.ayahNumber == null) {
      push(`directMentions: surah ${ref.surahNumber} entry is missing ayahNumber`);
    } else if (ref.ayahNumber < 1 || ref.ayahNumber > surah.totalAyah) {
      push(
        `directMentions: ${ref.surahNumber}:${ref.ayahNumber} is out of range (surah ${ref.surahNumber} has ${surah.totalAyah} ayahs)`
      );
    }
  }

  // duplicate direct mentions (same surah:ayah listed twice)
  const seen = new Set<string>();
  for (const ref of person.directMentions) {
    const key = `${ref.surahNumber}:${ref.ayahNumber}`;
    if (seen.has(key)) push(`directMentions: duplicate entry ${key}`);
    seen.add(key);
  }

  for (const passage of person.relatedPassages) {
    const surah = isValidSurah(passage.surahNumber, surahs);
    if (!surah) {
      push(`relatedPassages[${passage.id}]: surah ${passage.surahNumber} does not exist`);
      continue;
    }
    if (passage.ayahStart < 1 || passage.ayahEnd > surah.totalAyah) {
      push(
        `relatedPassages[${passage.id}]: range ${passage.ayahStart}-${passage.ayahEnd} is out of bounds (surah ${passage.surahNumber} has ${surah.totalAyah} ayahs)`
      );
    }
    if (passage.ayahStart > passage.ayahEnd) {
      push(`relatedPassages[${passage.id}]: ayahStart (${passage.ayahStart}) is after ayahEnd (${passage.ayahEnd})`);
    }
  }

  return issues;
};

/**
 * Cross-person checks: unique ids only.
 *
 * Deliberately does NOT require `relationships[].personId` to resolve to an
 * existing entry — per prophets-quran-feature.md §14, a relationship may
 * legitimately point at a related person (e.g. Isma'il, Harun) who doesn't
 * have a full profile yet in this seed dataset. The UI is responsible for
 * only linking relationship chips that do resolve, and rendering the rest as
 * plain (unlinked) text — see `resolvedPersonName` in usePersons.ts.
 */
export const validateDataset = (persons: QuranPerson[], surahs: SurahMeta[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const person of persons) {
    if (ids.has(person.id)) {
      issues.push({ personId: person.id, message: `duplicate person id "${person.id}"` });
    }
    ids.add(person.id);
    issues.push(...validatePerson(person, surahs));
  }

  return issues;
};
