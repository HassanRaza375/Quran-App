// Wajibat & Daily Fiqh (Module 18) — dataset types.
// Spec: wajibat-fiqh-jafari-module.md §7.1, adjusted in Phase 0/1 (see
// wajibat_progress_log.md for every deviation and why).
//
// SOURCE DISCIPLINE — this module's vocabulary is deliberately separate from
// the Knowledge Platform's SourceType / IdentificationBasis
// (app/utils/quranReference.ts). Those answer "how certain is a Qur'anic /
// historical identification"; `VerificationLevel` + `RulingBasis` answer
// "which marja's text does this fiqh ruling rest on, and with what force".
// Same precedent as CommandSourceBasis in app/data/quranCommands.ts.
import type { QuranReference } from "~/utils/quranReference";

export type FiqhId = "jafari"; // extend later: "hanafi" | "shafii" | ...
export type MarjaId = "sistani" | "khamenei" | "makarem";
export type Hukm = "wajib" | "haram" | "mustahab" | "makruh" | "mubah";
/** "ihtiyat_unspecified": the source says "caution/precaution" without stating whether it is
 * obligatory or recommended, and the book defines no default (decision P5 / rule R3). Never guessed. */
export type RulingBasis = "fatwa" | "ihtiyat_wajib" | "ihtiyat_mustahab" | "ihtiyat_unspecified";
/** A = checked against the marja's official text; B = reputable secondary
 * source citing the marja'; D = sources disagree (shown only with a disputed
 * notice). "C" (unverified) is never stored — it is excluded from the dataset. */
export type VerificationLevel = "A" | "B" | "D";
export type ContentLang = "en" | "ur";

export interface LocalizedText {
  en: string;
  ur?: string;
}

/** App-written text. Never displayed as a ruling (spec §4.9). */
export interface Explanation {
  kind: "explanation";
  text: LocalizedText;
}

export interface SourceCitation {
  title: string;
  /** Issue/ruling number ("Ruling 12*") or Q&A number ("Q 7"), exactly as the book labels it. */
  reference: string;
  url: string;
}

export interface MarjaBook {
  title: string;
  lang: ContentLang | "ar" | "fa";
  edition?: string;
  url: string;
  pdfUrl?: string;
  numbering: string;
}

export interface Marja {
  id: MarjaId;
  name: LocalizedText;
  officialSite: string;
  /** "pending-sources": selectable in the picker, but no rulings are shown yet
   * (decision P1) — the UI shows a "please refer to his official risala" notice. */
  status: "active" | "pending-sources";
  books: MarjaBook[];
}

export interface WajibatCategory {
  id: string;
  fiqh: FiqhId;
  title: LocalizedText;
  arabicTerm: string;
  icon: string;
  order: number;
  /** Spec §12 phase in which this category's content is scheduled. */
  phase: number;
  summary: Explanation;
  topicIds: string[];
}

export interface WajibatTopic {
  id: string;
  fiqh: FiqhId;
  categoryId: string;
  title: LocalizedText;
  arabicTerm?: string;
  summary: Explanation;
  /** Additional app-written sections (e.g. the list of the five uṣūl). */
  explanations?: { heading: LocalizedText; body: Explanation }[];
  /** Shown via AyahReferenceCard, labelled "Qur'anic basis" — only where a cited source links the ayah to the topic. */
  quranicBasis?: QuranReference[];
  rulingIds: string[];
  /** Step-by-step guides; each belongs to one marja' (the UI shows only the chosen marja's). */
  procedureIds?: string[];
  decisionTreeId?: string;
  relatedTopicIds?: string[];
  glossaryIds?: string[];
  sensitive?: boolean;
  /** Only if a real reviewer exists (Q10). */
  reviewedBy?: { name: string; date: string };
  /** YYYY-MM-DD, local calendar day. */
  lastSourceCheck: string;
}

export interface MarjaRuling {
  marjaId: MarjaId;
  /** "issue" = numbered risala ruling; "qa" = numbered istifta' (question + answer). */
  format: "issue" | "qa";
  /** The question, verbatim, for Q&A-format rulings. */
  question?: LocalizedText;
  /** Verbatim text of the ruling / answer. `ur` only from the marja's official Urdu book (decision R1). */
  text: LocalizedText;
  /** Set only when the source itself states the hukm explicitly — never inferred. */
  hukm?: Hukm;
  basis: RulingBasis;
  /** True when `text` is a verbatim excerpt of a longer numbered ruling. */
  excerpt?: boolean;
  source: SourceCitation;
  /** Citation for `text.ur` / `question.ur` — the Urdu book has its own numbering. Required iff Urdu text exists. */
  urSource?: SourceCitation;
  verification: VerificationLevel;
  /** Why no official Urdu text is shown for this ruling (listed in the phase summary). */
  urduNote?: string;
  /** The official Urdu edition still has the pre-revision text of this ruling (decision P6):
   * Urdu is withheld, and the Urdu view shows URDU_EDITION_LAG_NOTICE instead. */
  urduEditionLag?: boolean;
  note?: string;
}

export interface Ruling {
  id: string;
  topicId: string;
  subject: LocalizedText;
  /** Target: one per marja'. A missing marja' = not sourced yet — the UI never falls back to another marja'. */
  rulings: MarjaRuling[];
  differsBetweenMaraji?: boolean;
  status?: "disputed";
  /** Women-specific / sensitive content: rendered inside a collapsed panel (Q8). */
  sensitive?: boolean;
}

export interface ProcedureStep {
  id: string;
  /** 1..n without gaps (validator). */
  order: number;
  /** App-written short label (explanation, not a ruling). */
  title: LocalizedText;
  /** Verbatim excerpt of the procedure marja's entry in `rulingId` (validator checks it is a substring). */
  instruction: LocalizedText;
  rulingId: string;
  /** Only where the cited ruling states it. */
  hukm?: Hukm;
  isRukn?: boolean;
  note?: string;
}

export interface Procedure {
  id: string;
  topicId: string;
  marjaId: MarjaId;
  title: LocalizedText;
  steps: ProcedureStep[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  arabic?: string;
  urdu?: string;
  definition: LocalizedText;
  /** The book the definition is taken from; absent = app-written explanation. */
  source?: SourceCitation;
}
