// Shared Qur'an-citation primitives, reused across every content-catalog
// module of the Qur'anic Knowledge Platform (see
// quranic_knowledge_platform_phased_plan.md and MODULE_BLUEPRINT.md's
// "Qur'anic Knowledge Platform — Shared Foundation (Phase 0)" section).
//
// Originally defined inline in app/data/quranPersons.ts (Module 17 / Phase
// 1). Phase 0 deliberately left them there — "extract into a shared
// location the first time a second module needs them" — rather than
// pre-emptively generalizing with only one consumer. Phase 2 (Peoples &
// Nations) is that second consumer, so the extraction happens now.
// quranPersons.ts re-exports these unchanged so no existing import breaks.
export type QuranReference = {
  surahNumber: number;
  ayahNumber?: number;
  ayahStart?: number;
  ayahEnd?: number;
  contentId?: string;
};

export type RelatedPassage = {
  id: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  title?: string;
  description?: string;
  storyOrder?: number;
  source: "quran";
  verificationStatus: "verified";
};

export type SourceType = "quran" | "authentic_hadith" | "traditional_account";

export type SourceReference = {
  type: SourceType;
  citation: string;
  note?: string;
};

export const asRef = (surahNumber: number, ayahNumber: number): QuranReference => ({ surahNumber, ayahNumber });
