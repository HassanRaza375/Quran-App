// Prophets & Qur'anic Persons — dataset types + data.
// See prophets-quran-feature.md for the full product spec this implements
// (Phase 1-5 UI/integration work is complete — see MODULE_BLUEPRINT.md
// Module 17). This file is the CONTENT layer: prophets and selected named/
// title-based HUMAN figures mentioned in the Qur'an — 38 people (the 25
// traditionally named prophets + 13 other named/title-based figures), each
// verified against this app's own live Quran search API
// (alquran.cloud, Arabic `quran-simple` edition) at authoring time.
//
// This is NOT a claim of covering every individual mentioned in the Qur'an.
// Known, deliberate exclusions:
//   - Unnamed-but-identifiable individuals (e.g. Pharaoh's wife, the
//     believing man of Pharaoh's family, Al-Khidr) are out of scope for this
//     release — a candidate list for future expansion exists separately.
//   - Named NON-HUMAN beings (the angels Harut and Marut, 2:102; Iblis) are
//     out of scope — this feature is scoped to human Qur'anic persons.
//   - 'Imran is a deliberate omission, not an oversight: his name occurs
//     only in genitive/possessive constructions ("family of 'Imran," "wife
//     of 'Imran," "Maryam, daughter of 'Imran") with no independent
//     narrative or action attributed to him, so he has no person-focused
//     role for this feature to build a profile around.
//
// Verification method (see MODULE_BLUEPRINT.md for the full write-up):
// the search API does root/substring matching, not whole-word matching, so
// every raw result was passed through a whole-word normalizer (stripping
// tashkeel, unifying alef/ya/ta-marbuta forms, accounting for common
// single-letter prefixes and the accusative-case trailing alef) and then,
// for any name that could also be a common Arabic word — "Hud" (also
// "Jewish"), "Salih" (also the adjective "righteous"), "Yahya" (also the
// verb "gives life"), "Zayd" (also a common verb root meaning "increase")
// — every remaining match was read in full and hand-classified, since
// automated whole-word matching cannot distinguish true homographs.
// `directMentions` below reflects the verified result: EVERY ayah where the
// person's name/title is explicitly present, not a curated subset — see
// MODULE_BLUEPRINT.md Module 17 for the full audit report (counts
// before/after, rejected false positives, etc.).

export type PrimaryCategory =
  | "prophet"
  | "woman"
  | "man"
  | "ruler_leader"
  | "companion"
  | "family_relative"
  | "other";

export type PersonType =
  | "prophet"
  | "messenger"
  | "prophet_and_messenger"
  | "quranic_person"
  | "title_based_person";

export type ChronologyStatus = "strong" | "traditional" | "uncertain" | "unknown";

export type SourceType = "quran" | "authentic_hadith" | "traditional_account";

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

export type PersonRelationship = {
  personId: string;
  relationshipType: string;
  sourceType: SourceType;
  verificationStatus: "verified" | "traditional" | "uncertain";
};

export type KeyLesson = {
  text: string;
  quranReferences: QuranReference[];
  status: "quran_derived";
};

export type SourceReference = {
  type: SourceType;
  citation: string;
  note?: string;
};

export type QuranPerson = {
  id: string;

  name: string;
  arabicName: string;
  alternateNames?: string[];

  primaryCategory: PrimaryCategory;
  secondaryCategories?: PrimaryCategory[];

  personType: PersonType;

  honorific?: {
    short?: string;
    arabic?: string;
  };

  shortDescription: string;
  detailedDescription?: string;

  themes?: string[];

  chronology?: {
    label?: string;
    order?: number;
    status: ChronologyStatus;
  };

  directMentions: QuranReference[];
  relatedPassages: RelatedPassage[];
  relationships?: PersonRelationship[];
  keyLessons?: KeyLesson[];
  sources?: SourceReference[];
  statusNotes?: string[];
};

const asRef = (surahNumber: number, ayahNumber: number): QuranReference => ({ surahNumber, ayahNumber });

export const QURAN_PERSONS: QuranPerson[] = [
  // ============================================================
  // The 25 traditionally named prophets, in the standard
  // (traditional, not Qur'an-explicit) chronological sequence.
  // ============================================================
  {
    id: "adam",
    name: "Adam",
    arabicName: "آدم",
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "The first human being, created and taught by Allah, whose test in the Garden and repentance are recounted across several surahs.",
    detailedDescription:
      "Adam is described as created directly by Allah and taught 'the names of all things.' The angels are commanded to prostrate to him; Iblis refuses out of arrogance. Adam and his wife are placed in the Garden, tested regarding one tree, and after their fall and sincere repentance, Allah accepts their repentance and they are sent to the earth.",
    themes: ["Creation", "Repentance", "Trial", "Forgiveness", "Human origin"],
    chronology: { label: "First human / first prophet", order: 1, status: "traditional" },
    directMentions: [
      asRef(2, 31), asRef(2, 33), asRef(2, 34), asRef(2, 35), asRef(2, 37),
      asRef(3, 33), asRef(3, 59), asRef(5, 27), asRef(7, 11), asRef(7, 19),
      asRef(7, 26), asRef(7, 27), asRef(7, 31), asRef(7, 35), asRef(7, 172),
      asRef(17, 61), asRef(17, 70), asRef(18, 50), asRef(19, 58), asRef(20, 115),
      asRef(20, 116), asRef(20, 117), asRef(20, 120), asRef(20, 121), asRef(36, 60),
    ],
    relatedPassages: [
      {
        id: "adam-baqarah-creation",
        surahNumber: 2, ayahStart: 30, ayahEnd: 39,
        title: "Creation and the Trial in the Garden",
        description: "Adam's creation, the angels' prostration, Iblis's refusal, the trial regarding the tree, the fall, and the acceptance of repentance.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "adam-araf-temptation",
        surahNumber: 7, ayahStart: 11, ayahEnd: 25,
        title: "Iblis's Temptation and the Descent to Earth",
        description: "A parallel, more detailed account of Iblis's refusal, his vow to mislead humanity, and Adam and his wife being sent down.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "adam-taha-warning",
        surahNumber: 20, ayahStart: 115, ayahEnd: 123,
        title: "The Covenant, the Slip, and Guidance for Descendants",
        description: "Adam's earlier covenant, being forgotten, Satan's whispering, and Allah's promise of guidance for whoever follows it.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "isa", relationshipType: "ancestor", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Sincere repentance restores nearness to Allah, even after a serious mistake.", quranReferences: [asRef(2, 37)], status: "quran_derived" },
      { text: "Arrogance in the face of a divine command is the root of Iblis's fall.", quranReferences: [asRef(2, 34), asRef(7, 12)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:30-39; Al-A'raf 7:11-25; Ta-Ha 20:115-123" }],
    statusNotes: [
      "The Qur'an does not attach the word 'nabi' (prophet) directly next to Adam's name; his status as the first prophet is the standard position of Islamic tradition/hadith rather than an explicit Qur'anic label.",
    ],
  },

  {
    id: "idris",
    name: "Idris",
    arabicName: "إدريس",
    alternateNames: ["Enoch"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet described in the Qur'an as truthful and raised to a high station, mentioned in only two ayahs with very little narrative detail given.",
    detailedDescription:
      "The Qur'an names Idris twice: once calling him 'truthful, a prophet' and describing him as 'raised to a high station,' and once listing him alongside Isma'il and Dhul-Kifl as among the patient. No story or timeframe is narrated for him in the Qur'an itself.",
    themes: ["Truthfulness", "Patience", "Elevated station"],
    chronology: { label: "Traditionally placed before Nuh", order: 2, status: "traditional" },
    directMentions: [asRef(19, 56), asRef(21, 85)],
    relatedPassages: [],
    keyLessons: [
      { text: "He is described as truthful and patient, with no additional narrative attached — his standing is affirmed without elaboration.", quranReferences: [asRef(19, 56), asRef(21, 85)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Maryam 19:56-57; Al-Anbiya 21:85" }],
    statusNotes: [
      "The Qur'an gives no narrative for Idris beyond these two ayahs. His identification with the Biblical Enoch and his placement before Nuh in the traditional prophetic sequence are traditional, not Qur'an-explicit.",
    ],
  },

  {
    id: "nuh",
    name: "Nuh",
    arabicName: "نوح",
    alternateNames: ["Noah"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet of Allah who called his people to worship Allah alone for a very long time and remained steadfast despite prolonged rejection, before the Flood.",
    detailedDescription:
      "Nuh preached to his people night and day, in public and in private, calling them away from idol worship. Only a small number believed. He is commanded to build the Ark; his people mock him, the Flood comes, and those who reject him — including, pointedly, one of his own sons — are not saved. Surah Nuh (71) is named for him and records his prayer and his people's specific idols.",
    themes: ["Patience", "Da'wah", "Flood", "Tawhid", "Steadfastness"],
    chronology: { label: "Early prophetic period", order: 3, status: "traditional" },
    directMentions: [
      asRef(3, 33), asRef(4, 163), asRef(6, 84), asRef(7, 59), asRef(7, 69),
      asRef(9, 70), asRef(10, 71), asRef(11, 25), asRef(11, 32), asRef(11, 36),
      asRef(11, 42), asRef(11, 45), asRef(11, 46), asRef(11, 48), asRef(11, 89),
      asRef(14, 9), asRef(17, 3), asRef(17, 17), asRef(19, 58), asRef(21, 76),
      asRef(22, 42), asRef(23, 23), asRef(25, 37), asRef(26, 105), asRef(26, 106),
      asRef(26, 116), asRef(29, 14), asRef(33, 7), asRef(37, 75), asRef(37, 79),
      asRef(38, 12), asRef(40, 5), asRef(40, 31), asRef(42, 13), asRef(50, 12),
      asRef(51, 46), asRef(53, 52), asRef(54, 9), asRef(57, 26), asRef(66, 10),
      asRef(71, 1), asRef(71, 21), asRef(71, 26),
    ],
    relatedPassages: [
      {
        id: "nuh-hud-flood",
        surahNumber: 11, ayahStart: 25, ayahEnd: 49,
        title: "The Ark, the Flood, and His Son",
        description: "Nuh's call, his people's rejection, the building of the Ark, the Flood, and his son who refused to board.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "nuh-muminun-mission",
        surahNumber: 23, ayahStart: 23, ayahEnd: 30,
        title: "Nuh's Mission and the Ark",
        description: "A concise retelling of his mission, his people's response, and the command to build the Ark.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "nuh-surah-nuh",
        surahNumber: 71, ayahStart: 1, ayahEnd: 28,
        title: "Surah Nuh — His Prayer and His People",
        description: "An entire surah in Nuh's voice: his night-and-day preaching, his people's idols, and his final prayer.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "ibrahim", relationshipType: "ancestor", sourceType: "traditional_account", verificationStatus: "traditional" },
    ],
    keyLessons: [
      { text: "Patience in calling people to Allah, even across a very long span of time.", quranReferences: [asRef(29, 14)], status: "quran_derived" },
      { text: "Steadfastness despite near-total rejection.", quranReferences: [asRef(11, 25), asRef(11, 32)], status: "quran_derived" },
      { text: "Family relation does not itself guarantee salvation — sincere belief does.", quranReferences: [asRef(11, 45), asRef(11, 46)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Hud 11:25-49; Al-Mu'minun 23:23-30; Surah Nuh 71:1-28" }],
  },

  {
    id: "hud",
    name: "Hud",
    arabicName: "هود",
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet sent to the people of 'Aad, who called them away from idol worship; they rejected him and were destroyed by a violent wind.",
    detailedDescription:
      "Hud is described as 'their brother' sent to the tribe of 'Aad, a people known for their great strength and monumental buildings. He calls them to worship Allah alone; they accuse him of foolishness and refuse to abandon their idols. He and the believers with him are saved, and 'Aad is destroyed.",
    themes: ["Da'wah to one's own people", "Rejection of idolatry", "Destruction of 'Aad"],
    chronology: { label: "Traditionally placed after Nuh, before Ibrahim", order: 4, status: "traditional" },
    directMentions: [
      asRef(7, 65), asRef(11, 50), asRef(11, 53), asRef(11, 58), asRef(11, 60),
      asRef(11, 89), asRef(26, 124),
    ],
    relatedPassages: [
      {
        id: "hud-araf-mission",
        surahNumber: 7, ayahStart: 65, ayahEnd: 72,
        title: "Hud's Mission to 'Aad",
        description: "Hud calls 'Aad to worship Allah alone; their rejection and the people's destruction.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "hud-hud-narrative",
        surahNumber: 11, ayahStart: 50, ayahEnd: 60,
        title: "The Fuller Account in Surah Hud",
        description: "Hud's call, 'Aad's refusal and mockery, and Allah's rescue of Hud and the believers.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "hud-shuara-account",
        surahNumber: 26, ayahStart: 123, ayahEnd: 140,
        title: "'Aad's Rejection in Surah Ash-Shu'ara",
        description: "A further account of Hud's warning against 'Aad's pride in their buildings and strength.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "Worldly strength and achievement offer no protection against consequences for rejecting truth.", quranReferences: [asRef(7, 69)], status: "quran_derived" },
      { text: "A prophet calls his own people even when it invites their scorn, asking no reward for it.", quranReferences: [asRef(26, 127)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-A'raf 7:65-72; Hud 11:50-60; Ash-Shu'ara 26:123-140" }],
    statusNotes: [
      "The Arabic search string for Hud (هود) also matches the unrelated word for 'Jewish' (هُودًا) in several ayahs (e.g. 2:111, 2:135, 2:140) — those were manually excluded from Direct Mentions after reading each ayah in full; they are not about this prophet.",
    ],
  },

  {
    id: "salih",
    name: "Salih",
    arabicName: "صالح",
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet sent to the people of Thamud, given the miraculous she-camel as a sign; they hamstrung it in defiance and were destroyed.",
    detailedDescription:
      "Salih, 'their brother,' is sent to Thamud, who carved dwellings from the mountains. He is explicitly described as 'sent from his Lord' (7:75). Allah gives them a she-camel as a clear sign, with instructions to let it graze freely and not harm it; they hamstring it out of defiance, and a violent seizure destroys them, sparing Salih and the believers.",
    themes: ["Signs and miracles", "Defiance", "Destruction of Thamud"],
    chronology: { label: "Traditionally placed after Hud, before Ibrahim", order: 5, status: "traditional" },
    directMentions: [
      asRef(7, 73), asRef(7, 75), asRef(7, 77), asRef(11, 61), asRef(11, 62),
      asRef(11, 66), asRef(11, 89), asRef(26, 142), asRef(27, 45),
    ],
    relatedPassages: [
      {
        id: "salih-araf-camel",
        surahNumber: 7, ayahStart: 73, ayahEnd: 79,
        title: "Salih and the She-Camel",
        description: "Salih's mission to Thamud, the she-camel given as a sign, and their defiance and destruction.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "salih-hud-narrative",
        surahNumber: 11, ayahStart: 61, ayahEnd: 68,
        title: "The Fuller Account in Surah Hud",
        description: "Salih's call, the people's rejection and plot against him, and Thamud's destruction.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "salih-shuara-account",
        surahNumber: 26, ayahStart: 141, ayahEnd: 159,
        title: "Thamud's Rejection in Surah Ash-Shu'ara",
        description: "Salih's warning, the sign of the she-camel, and the people's defiant hamstringing of it.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "A clear, tangible sign does not guarantee belief when a people are determined to reject it.", quranReferences: [asRef(7, 77)], status: "quran_derived" },
      { text: "He is explicitly described as 'sent' (mursal) from his Lord — his prophethood is not merely claimed but affirmed in the text.", quranReferences: [asRef(7, 75)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-A'raf 7:73-79; Hud 11:61-68; Ash-Shu'ara 26:141-159" }],
    statusNotes: [
      "صالح (Salih) is also the common Arabic adjective for 'righteous/good,' used dozens of times in the Qur'an in phrases like 'believed and did righteous deeds' (āmanū wa 'amilū ṣāliḥan). Every one of the ~40 raw search matches was read in full; only the 9 listed above are genuinely about this prophet — the rest are the adjective and were excluded.",
    ],
  },

  {
    id: "ibrahim",
    name: "Ibrahim",
    arabicName: "إبراهيم",
    alternateNames: ["Abraham"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet described in the Qur'an as a friend of Allah (Khalil), known for confronting idolatry — including his own father's — and for raising the House at Makkah with his son Isma'il.",
    detailedDescription:
      "Ibrahim publicly reasons with his father and people against idol worship, breaks their idols, and is thrown into a fire that Allah commands to be 'cool and safe' for him. He is tried with the command to sacrifice his son and submits; the sacrifice is redeemed. He and Isma'il raise the foundations of the Ka'bah and pray for Makkah and its people.",
    themes: ["Tawhid", "Sacrifice", "Trial", "Idol-breaking", "Building the Ka'bah"],
    chronology: { label: "Early-to-middle prophetic period", order: 6, status: "traditional" },
    directMentions: [
      asRef(2, 124), asRef(2, 125), asRef(2, 126), asRef(2, 127), asRef(2, 130),
      asRef(2, 132), asRef(2, 133), asRef(2, 135), asRef(2, 136), asRef(2, 140),
      asRef(2, 258), asRef(2, 260), asRef(3, 33), asRef(3, 65), asRef(3, 67),
      asRef(3, 68), asRef(3, 84), asRef(3, 95), asRef(3, 97), asRef(4, 54),
      asRef(4, 125), asRef(4, 163), asRef(6, 74), asRef(6, 75), asRef(6, 83),
      asRef(6, 161), asRef(9, 70), asRef(9, 114), asRef(11, 69), asRef(11, 74),
      asRef(11, 75), asRef(11, 76), asRef(12, 6), asRef(12, 38), asRef(14, 35),
      asRef(15, 51), asRef(16, 120), asRef(16, 123), asRef(19, 41), asRef(19, 46),
      asRef(19, 58), asRef(21, 51), asRef(21, 60), asRef(21, 62), asRef(21, 69),
      asRef(22, 26), asRef(22, 43), asRef(22, 78), asRef(26, 69), asRef(29, 16),
      asRef(29, 31), asRef(33, 7), asRef(37, 83), asRef(37, 104), asRef(37, 109),
      asRef(38, 45), asRef(42, 13), asRef(43, 26), asRef(51, 24), asRef(53, 37),
      asRef(57, 26), asRef(60, 4), asRef(87, 19),
    ],
    relatedPassages: [
      {
        id: "ibrahim-baqarah-house",
        surahNumber: 2, ayahStart: 124, ayahEnd: 141,
        title: "The Covenant and Raising the House",
        description: "Ibrahim's trials, the covenant, and raising the foundations of the Ka'bah with Isma'il.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "ibrahim-anbiya-fire",
        surahNumber: 21, ayahStart: 51, ayahEnd: 73,
        title: "Breaking the Idols and the Fire",
        description: "Ibrahim reasoning against idolatry, breaking the idols, and being cast into — and saved from — the fire.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "ibrahim-saffat-sacrifice",
        surahNumber: 37, ayahStart: 83, ayahEnd: 113,
        title: "The Trial of Sacrifice",
        description: "Ibrahim's vision, his son's willing submission, the redemption of the sacrifice, and the promise of Ishaq.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "ismail", relationshipType: "father", sourceType: "quran", verificationStatus: "verified" },
      { personId: "ishaq", relationshipType: "father", sourceType: "quran", verificationStatus: "verified" },
      { personId: "nuh", relationshipType: "descendant", sourceType: "traditional_account", verificationStatus: "traditional" },
      { personId: "lut", relationshipType: "contemporary", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Willingness to stand alone against inherited falsehood, even from one's own father.", quranReferences: [asRef(19, 42), asRef(19, 46)], status: "quran_derived" },
      { text: "Complete submission to Allah's command, even in the hardest trial.", quranReferences: [asRef(37, 102), asRef(37, 103)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:124-141; Al-Anbiya 21:51-73; As-Saffat 37:83-113" }],
    statusNotes: [
      "Which son was to be sacrificed (As-Saffat 37:99-113) is not named in that passage. It is not included as a related passage under Isma'il's own entry for that reason — see Isma'il's statusNotes.",
    ],
  },

  {
    id: "lut",
    name: "Lut",
    arabicName: "لوط",
    alternateNames: ["Lot"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet and contemporary of Ibrahim, sent to a people condemned in the Qur'an for an act of sexual immorality 'no one in the worlds' had committed before them.",
    detailedDescription:
      "Lut warns his people against their practice; they threaten to expel him. Angelic messengers visit him in human form (the same messengers who had just given Ibrahim glad tidings), his people press upon his house, and the town is overturned and struck with a shower of stones — sparing Lut and his believing family, but not his wife, who is not saved.",
    themes: ["Warning", "Rejection", "Divine punishment", "Family and belief"],
    chronology: { label: "Contemporary of Ibrahim", order: 7, status: "traditional" },
    directMentions: [
      asRef(6, 86), asRef(7, 80), asRef(11, 70), asRef(11, 74), asRef(11, 77),
      asRef(11, 81), asRef(11, 89), asRef(15, 59), asRef(15, 61), asRef(21, 71),
      asRef(21, 74), asRef(22, 43), asRef(26, 160), asRef(26, 161), asRef(26, 167),
      asRef(27, 54), asRef(27, 56), asRef(29, 26), asRef(29, 28), asRef(29, 32),
      asRef(29, 33), asRef(37, 133), asRef(38, 13), asRef(50, 13), asRef(54, 33),
      asRef(54, 34), asRef(66, 10),
    ],
    relatedPassages: [
      {
        id: "lut-hud-messengers",
        surahNumber: 11, ayahStart: 69, ayahEnd: 83,
        title: "The Messengers and the Overturned Town",
        description: "The angelic messengers visit Ibrahim, then Lut; his people's response, and the town's destruction.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "lut-araf-people",
        surahNumber: 7, ayahStart: 80, ayahEnd: 84,
        title: "Warning His People",
        description: "Lut's warning and his people's practice, described as unprecedented among the worlds.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "lut-ankabut-account",
        surahNumber: 29, ayahStart: 28, ayahEnd: 35,
        title: "The Account in Surah Al-Ankabut",
        description: "Lut's rebuke of his people and the messengers' arrival to carry out the sentence.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "ibrahim", relationshipType: "contemporary", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "A spouse's unbelief, even within a prophet's own household, does not itself grant salvation.", quranReferences: [asRef(66, 10)], status: "quran_derived" },
      { text: "He believed and followed Ibrahim's message before his own separate mission is described.", quranReferences: [asRef(29, 26)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Hud 11:69-83; Al-A'raf 7:80-84; Al-Ankabut 29:28-35" }],
    statusNotes: [
      "Lut's traditional identification as Ibrahim's nephew (son of his brother Haran) is a traditional account, not stated in the Qur'an text itself — only shown here as 'contemporary,' which 29:26 directly supports.",
    ],
  },

  {
    id: "ismail",
    name: "Isma'il",
    arabicName: "إسماعيل",
    alternateNames: ["Ishmael"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son of Ibrahim, described as 'true to his promise' and a prophet and messenger, who helped his father raise the foundations of the Ka'bah.",
    detailedDescription:
      "Isma'il is named repeatedly alongside Ibrahim and Ishaq as one of the patriarchs whose religion the believers are told to follow, and explicitly raises the foundations of the House with his father (2:127). Surah Maryam separately praises him for keeping his promises and commanding his family to prayer and charity.",
    themes: ["Obedience", "Building the Ka'bah", "Keeping promises"],
    chronology: { label: "Son of Ibrahim", order: 8, status: "traditional" },
    directMentions: [
      asRef(2, 125), asRef(2, 127), asRef(2, 133), asRef(2, 136), asRef(2, 140),
      asRef(3, 84), asRef(4, 163), asRef(6, 86), asRef(14, 39), asRef(19, 54),
      asRef(21, 85), asRef(38, 48),
    ],
    relatedPassages: [
      {
        id: "ismail-baqarah-house",
        surahNumber: 2, ayahStart: 124, ayahEnd: 129,
        title: "Raising the House with His Father",
        description: "Isma'il helps Ibrahim raise the foundations of the Ka'bah and both pray for Makkah and its people.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "ismail-maryam-promise",
        surahNumber: 19, ayahStart: 54, ayahEnd: 55,
        title: "True to His Promise",
        description: "Isma'il praised for keeping his word and commanding his family to prayer and charity.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "ibrahim", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Keeping one's word is singled out for praise as a defining trait.", quranReferences: [asRef(19, 54)], status: "quran_derived" },
      { text: "Serving a shared mission alongside a parent — raising the House together with Ibrahim — is presented without any account of resistance.", quranReferences: [asRef(2, 127)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:124-129; Maryam 19:54-55" }],
    statusNotes: [
      "Which of Ibrahim's sons was to be sacrificed (As-Saffat 37:99-113) is not named in the Qur'an text. The majority traditional view holds it was Isma'il; a minority (and much non-Muslim tradition) holds Ishaq. That passage is intentionally not listed as a Related Passage under either son's entry to avoid presenting a disputed identification as settled — it remains only under Ibrahim's own entry, unattributed.",
    ],
  },

  {
    id: "ishaq",
    name: "Ishaq",
    arabicName: "إسحاق",
    alternateNames: ["Isaac"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son of Ibrahim, given as glad tidings after Isma'il, and explicitly named a prophet 'among the righteous.'",
    detailedDescription:
      "Ishaq's birth is announced to Ibrahim's household as glad tidings, followed immediately by the further glad tidings of his own son Ya'qub (11:71). He is repeatedly listed alongside Ibrahim, Isma'il, and Ya'qub as one of the patriarchs, and 37:112 explicitly calls him 'a prophet from among the righteous.'",
    themes: ["Prophetic lineage", "Glad tidings", "Blessing"],
    chronology: { label: "Son of Ibrahim, father of Ya'qub", order: 9, status: "traditional" },
    directMentions: [
      asRef(2, 133), asRef(2, 136), asRef(2, 140), asRef(3, 84), asRef(4, 163),
      asRef(6, 84), asRef(11, 71), asRef(12, 6), asRef(12, 38), asRef(14, 39),
      asRef(19, 49), asRef(21, 72), asRef(29, 27), asRef(37, 112), asRef(37, 113),
      asRef(38, 45),
    ],
    relatedPassages: [
      {
        id: "ishaq-hud-tidings",
        surahNumber: 11, ayahStart: 69, ayahEnd: 73,
        title: "Glad Tidings to Ibrahim's Household",
        description: "The angelic messengers give Ibrahim's wife glad tidings of Ishaq, and after him, Ya'qub.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "ishaq-saffat-blessing",
        surahNumber: 37, ayahStart: 112, ayahEnd: 113,
        title: "Named a Prophet, Blessed",
        description: "Ishaq explicitly named a prophet among the righteous, and blessed along with his descendants.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "ibrahim", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
      { personId: "yaqub", relationshipType: "father", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Prophethood is described as continuing through his descendants, not ending with him.", quranReferences: [asRef(29, 27)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Hud 11:69-73; As-Saffat 37:112-113" }],
  },

  {
    id: "yaqub",
    name: "Ya'qub",
    arabicName: "يعقوب",
    alternateNames: ["Jacob", "Israel"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son of Ishaq, father of Yusuf and his eleven brothers, whose grief over Yusuf and eventual reunion with him are told in Surah Yusuf.",
    detailedDescription:
      "Ya'qub instructs his sons to worship the one God on his deathbed (2:132-133). His grief over the loss of Yusuf — weeping until his eyes turn white with sorrow, yet never despairing of Allah's mercy — and the family's eventual reunion form the emotional center of Surah Yusuf's closing chapters.",
    themes: ["Grief and patience", "Trust in Allah", "Family", "Prophetic instruction"],
    chronology: { label: "Son of Ishaq, father of Yusuf", order: 10, status: "traditional" },
    directMentions: [
      asRef(2, 132), asRef(2, 133), asRef(2, 136), asRef(2, 140), asRef(3, 84),
      asRef(4, 163), asRef(6, 84), asRef(11, 71), asRef(12, 6), asRef(12, 38),
      asRef(12, 68), asRef(19, 6), asRef(19, 49), asRef(21, 72), asRef(29, 27),
      asRef(38, 45),
    ],
    relatedPassages: [
      {
        id: "yaqub-baqarah-instruction",
        surahNumber: 2, ayahStart: 132, ayahEnd: 133,
        title: "His Final Instruction to His Sons",
        description: "Ya'qub instructs his sons on his deathbed to hold to the worship of the one God.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "yaqub-yusuf-grief",
        surahNumber: 12, ayahStart: 84, ayahEnd: 87,
        title: "Grief Over Yusuf",
        description: "Ya'qub's sorrow at Yusuf's loss, his eyes turning white with grief, and his refusal to despair of Allah's mercy.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "yaqub-yusuf-reunion",
        surahNumber: 12, ayahStart: 93, ayahEnd: 100,
        title: "Reunion with Yusuf",
        description: "Ya'qub's sight restored and the family reunited in Egypt.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "ishaq", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
      { personId: "yusuf", relationshipType: "father", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "'Do not despair of the mercy of Allah' — grief and faith are shown together, not as opposites.", quranReferences: [asRef(12, 87)], status: "quran_derived" },
      { text: "He counsels patience described as 'beautiful patience' (sabrun jamil) — enduring without complaint directed at people.", quranReferences: [asRef(12, 83)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:132-133; Surah Yusuf 12:84-100" }],
  },

  {
    id: "yusuf",
    name: "Yusuf",
    arabicName: "يوسف",
    alternateNames: ["Joseph"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son of Ya'qub whose full story — betrayal by his brothers, slavery, temptation, imprisonment, and rise to authority in Egypt — is told as one continuous narrative in Surah Yusuf, 'the best of stories.'",
    detailedDescription:
      "Yusuf's dream of eleven stars, the sun and the moon prostrating to him draws his brothers' jealousy; they cast him into a well. Sold into slavery in Egypt, he resists the wife of his master's temptation, is imprisoned, interprets dreams, and is eventually placed in charge of Egypt's stores. The story closes with his reunion and reconciliation with his father and brothers.",
    themes: ["Patience", "Trust in Allah", "Forgiveness", "Chastity", "Family reconciliation"],
    chronology: { label: "Son of Ya'qub, generations before Musa", order: 11, status: "traditional" },
    directMentions: [
      asRef(6, 84), asRef(12, 4), asRef(12, 7), asRef(12, 8), asRef(12, 9),
      asRef(12, 10), asRef(12, 11), asRef(12, 17), asRef(12, 21), asRef(12, 29),
      asRef(12, 46), asRef(12, 51), asRef(12, 56), asRef(12, 58), asRef(12, 69),
      asRef(12, 76), asRef(12, 77), asRef(12, 80), asRef(12, 84), asRef(12, 85),
      asRef(12, 87), asRef(12, 89), asRef(12, 90), asRef(12, 94), asRef(12, 99),
      asRef(40, 34),
    ],
    relatedPassages: [
      {
        id: "yusuf-dream-betrayal",
        surahNumber: 12, ayahStart: 4, ayahEnd: 20,
        title: "The Dream and the Betrayal",
        description: "Yusuf's dream, his brothers' jealousy, and being cast into the well.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "yusuf-egypt-temptation",
        surahNumber: 12, ayahStart: 21, ayahEnd: 35,
        title: "Egypt and the Temptation",
        description: "Yusuf's upbringing in Egypt and resisting the wife of al-Aziz.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "yusuf-prison-interpretation",
        surahNumber: 12, ayahStart: 36, ayahEnd: 57,
        title: "Prison and Dream Interpretation",
        description: "His imprisonment, interpreting fellow prisoners' and then the king's dreams, and his rise to authority.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
      {
        id: "yusuf-reunion",
        surahNumber: 12, ayahStart: 58, ayahEnd: 101,
        title: "Reunion and Reconciliation",
        description: "His brothers' journeys to Egypt, the test with Bin-yamin, and the final reunion with his father Ya'qub.",
        storyOrder: 4, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "yaqub", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
      { personId: "ibrahim", relationshipType: "descendant", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Trials endured with patience can be followed by a position of great responsibility and mercy toward those who wronged you.", quranReferences: [asRef(12, 90), asRef(12, 92)], status: "quran_derived" },
      { text: "Seeking refuge in Allah is the real defense against temptation.", quranReferences: [asRef(12, 23), asRef(12, 24)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Surah Yusuf 12:4-101" }],
    statusNotes: [
      "Prophetic status is the settled scholarly position and is implied by the Qur'an (e.g. 40:34), though the word 'nabi' is not attached directly next to his name in the ayahs listed above.",
    ],
  },

  {
    id: "ayyub",
    name: "Ayyub",
    arabicName: "أيوب",
    alternateNames: ["Job"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet tried with severe hardship, remembered above all for calling on Allah without complaint and being restored with mercy.",
    detailedDescription:
      "Ayyub calls on his Lord: 'Adversity has touched me, and You are the Most Merciful of the merciful.' Allah responds, removes his affliction, and restores to him his family and the like of them besides, as a mercy and a reminder. The Qur'an does not itself detail the nature or duration of his affliction.",
    themes: ["Patience in hardship", "Sincere supplication", "Mercy and restoration"],
    chronology: { label: "Descendant of Ibrahim", order: 12, status: "traditional" },
    directMentions: [asRef(4, 163), asRef(6, 84), asRef(21, 83), asRef(38, 41)],
    relatedPassages: [
      {
        id: "ayyub-anbiya-supplication",
        surahNumber: 21, ayahStart: 83, ayahEnd: 84,
        title: "His Supplication and Its Answer",
        description: "Ayyub's call to his Lord in adversity and Allah's removal of his affliction.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "ayyub-sad-restoration",
        surahNumber: 38, ayahStart: 41, ayahEnd: 44,
        title: "Restoration as a Mercy",
        description: "A parallel account of his affliction and Allah's mercy, restoring his family and giving him a means to keep his oath.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "His supplication in hardship names Allah's mercy first, not his own suffering.", quranReferences: [asRef(21, 83)], status: "quran_derived" },
      { text: "Restoration is described explicitly as a mercy and 'a reminder for the worshippers,' not simply a reward.", quranReferences: [asRef(21, 84)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Anbiya 21:83-84; Sad 38:41-44" }],
    statusNotes: [
      "The Qur'an does not narrate the details, cause, or duration of Ayyub's affliction that are found in extra-Qur'anic and Biblical tradition — only what is in the two passages above is treated as established here.",
    ],
  },

  {
    id: "shuayb",
    name: "Shu'ayb",
    arabicName: "شعيب",
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet sent to the people of Madyan, calling them to honest dealing in trade — to give full measure and weight and not defraud people of their due.",
    detailedDescription:
      "Shu'ayb, 'their brother,' calls Madyan to worship Allah alone and to stop cheating in weights and measures and causing corruption after the earth's reform. His people threaten to expel him and those who believe with him; they are struck by a punishment, while Shu'ayb and the believers are saved.",
    themes: ["Honest trade and dealing", "Social justice", "Rejection and rescue"],
    chronology: { label: "Traditionally near the era of Musa", order: 13, status: "traditional" },
    directMentions: [
      asRef(7, 85), asRef(7, 88), asRef(7, 90), asRef(7, 92), asRef(11, 84),
      asRef(11, 87), asRef(11, 91), asRef(11, 94), asRef(26, 177), asRef(29, 36),
    ],
    relatedPassages: [
      {
        id: "shuayb-araf-mission",
        surahNumber: 7, ayahStart: 85, ayahEnd: 93,
        title: "Calling Madyan to Honest Trade",
        description: "Shu'ayb's call for fair dealing, his people's rejection, and their destruction.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "shuayb-hud-narrative",
        surahNumber: 11, ayahStart: 84, ayahEnd: 95,
        title: "The Fuller Account in Surah Hud",
        description: "Shu'ayb's warning, the people's threats, and the seizure that overtakes them.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "Fair economic dealing — full measure, full weight — is presented as a matter of faith, not merely commerce.", quranReferences: [asRef(7, 85)], status: "quran_derived" },
      { text: "Reform after corruption is described as a good, not something to be undone for gain.", quranReferences: [asRef(7, 85)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-A'raf 7:85-93; Hud 11:84-95" }],
    statusNotes: [
      "Shu'ayb's traditional identification as Musa's father-in-law (the 'righteous old man' of Al-Qasas 28:23-28, whom the Qur'an does not name) is a traditional/disputed association, not stated in the Qur'an text — not included here as a relationship for that reason.",
    ],
  },

  {
    id: "musa",
    name: "Musa",
    arabicName: "موسى",
    alternateNames: ["Moses"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet and messenger — explicitly called both in the Qur'an (19:51) — sent to Pharaoh, given the Torah, and whose confrontation with Pharaoh and the Exodus are the most frequently retold narrative in the Qur'an.",
    detailedDescription:
      "Raised in Pharaoh's own household, Musa flees Egypt after an accidental killing, receives prophethood at the burning bush in the valley of Tuwa, and is sent back to Pharaoh with his brother Harun. After Pharaoh's repeated refusal and the drowning of his army, Musa leads the Israelites out of Egypt, receives the Torah, and later deals with the incident of the golden calf.",
    themes: ["Prophethood", "Confronting tyranny", "Exodus", "Revelation", "Trust in Allah"],
    chronology: { label: "Generations after Yusuf, in Egypt", order: 14, status: "traditional" },
    directMentions: [
      asRef(2, 51), asRef(2, 53), asRef(2, 54), asRef(2, 55), asRef(2, 60),
      asRef(2, 61), asRef(2, 67), asRef(2, 87), asRef(2, 92), asRef(2, 108),
      asRef(2, 136), asRef(2, 246), asRef(2, 248), asRef(3, 84), asRef(4, 153),
      asRef(4, 164), asRef(5, 20), asRef(5, 22), asRef(5, 24), asRef(6, 84),
      asRef(6, 91), asRef(6, 154), asRef(7, 103), asRef(7, 104), asRef(7, 115),
      asRef(7, 117), asRef(7, 122), asRef(7, 127), asRef(7, 128), asRef(7, 131),
      asRef(7, 134), asRef(7, 138), asRef(7, 142), asRef(7, 143), asRef(7, 144),
      asRef(7, 148), asRef(7, 150), asRef(7, 154), asRef(7, 155), asRef(7, 159),
      asRef(7, 160), asRef(10, 75), asRef(10, 77), asRef(10, 80), asRef(10, 81),
      asRef(10, 83), asRef(10, 84), asRef(10, 87), asRef(10, 88), asRef(11, 17),
      asRef(11, 96), asRef(11, 110), asRef(14, 5), asRef(14, 6), asRef(14, 8),
      asRef(17, 2), asRef(17, 101), asRef(18, 60), asRef(18, 66), asRef(19, 51),
      asRef(20, 9), asRef(20, 11), asRef(20, 17), asRef(20, 19), asRef(20, 36),
      asRef(20, 40), asRef(20, 49), asRef(20, 57), asRef(20, 61), asRef(20, 65),
      asRef(20, 67), asRef(20, 70), asRef(20, 77), asRef(20, 83), asRef(20, 86),
      asRef(20, 88), asRef(20, 91), asRef(21, 48), asRef(22, 44), asRef(23, 45),
      asRef(23, 49), asRef(25, 35), asRef(26, 10), asRef(26, 43), asRef(26, 45),
      asRef(26, 48), asRef(26, 52), asRef(26, 61), asRef(26, 63), asRef(26, 65),
      asRef(27, 7), asRef(27, 9), asRef(27, 10), asRef(28, 3), asRef(28, 7),
      asRef(28, 10), asRef(28, 15), asRef(28, 18), asRef(28, 19), asRef(28, 20),
      asRef(28, 29), asRef(28, 30), asRef(28, 31), asRef(28, 36), asRef(28, 37),
      asRef(28, 38), asRef(28, 43), asRef(28, 44), asRef(28, 48), asRef(28, 76),
      asRef(29, 39), asRef(32, 23), asRef(33, 7), asRef(33, 69), asRef(37, 114),
      asRef(37, 120), asRef(40, 23), asRef(40, 26), asRef(40, 27), asRef(40, 37),
      asRef(40, 53), asRef(41, 45), asRef(42, 13), asRef(43, 46), asRef(46, 12),
      asRef(46, 30), asRef(51, 38), asRef(53, 36), asRef(61, 5), asRef(79, 15),
      asRef(87, 19),
    ],
    relatedPassages: [
      {
        id: "musa-qasas-early-life",
        surahNumber: 28, ayahStart: 3, ayahEnd: 28,
        title: "Early Life, Exile, and Madyan",
        description: "Musa's birth and rescue from Pharaoh's household, the accidental killing, flight to Madyan, and his marriage.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "musa-taha-calling",
        surahNumber: 20, ayahStart: 9, ayahEnd: 36,
        title: "The Calling at Tuwa",
        description: "The burning bush, the call to prophethood, the miracles of the staff and the hand, and Musa's request for Harun to be sent with him.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "musa-shuara-confrontation",
        surahNumber: 26, ayahStart: 10, ayahEnd: 68,
        title: "Confronting Pharaoh and the Exodus",
        description: "Musa and Harun before Pharaoh, the contest with the magicians, and the crossing of the sea.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
      {
        id: "musa-taha-calf",
        surahNumber: 20, ayahStart: 83, ayahEnd: 98,
        title: "The Golden Calf",
        description: "Musa's return from the mountain to find his people worshipping the calf, and his confrontation of Harun and Samiri.",
        storyOrder: 4, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "harun", relationshipType: "brother", sourceType: "quran", verificationStatus: "verified" },
      { personId: "firaun", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
      { personId: "haman", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
      { personId: "qarun", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
      { personId: "samiri", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Allah's help can arrive at the point of complete apparent hopelessness ('Indeed, with me is my Lord; He will guide me').", quranReferences: [asRef(26, 62)], status: "quran_derived" },
      { text: "A prophet is explicitly described as both messenger and prophet, showing these are related but distinguishable ranks.", quranReferences: [asRef(19, 51)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Qasas 28:3-43; Ta-Ha 20:9-98; Ash-Shu'ara 26:10-68" }],
  },

  {
    id: "harun",
    name: "Harun",
    arabicName: "هارون",
    alternateNames: ["Aaron"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Musa's older brother, granted prophethood and sent with him as a helper — 'more fluent than me in speech' — to Pharaoh.",
    detailedDescription:
      "At Musa's request at the burning bush, Harun is sent with him as a helper and made a prophet in his own right. He is left in charge of the Israelites while Musa goes to the mountain, and is unable to prevent them from worshipping the golden calf in his absence, though he had warned them.",
    themes: ["Support and partnership", "Prophethood", "The golden calf"],
    chronology: { label: "Brother of Musa, sent with him", order: 15, status: "traditional" },
    directMentions: [
      asRef(2, 248), asRef(4, 163), asRef(6, 84), asRef(7, 122), asRef(7, 142),
      asRef(10, 75), asRef(19, 28), asRef(19, 53), asRef(20, 30), asRef(20, 70),
      asRef(20, 90), asRef(20, 92), asRef(21, 48), asRef(23, 45), asRef(25, 35),
      asRef(26, 13), asRef(26, 48), asRef(28, 34), asRef(37, 114), asRef(37, 120),
    ],
    relatedPassages: [
      {
        id: "harun-taha-request",
        surahNumber: 20, ayahStart: 29, ayahEnd: 36,
        title: "Musa's Request for a Helper",
        description: "Musa asks that Harun be appointed a minister and helper alongside him.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "harun-taha-calf",
        surahNumber: 20, ayahStart: 90, ayahEnd: 94,
        title: "Left in Charge During the Golden Calf",
        description: "Harun's warning to the people and Musa's confrontation of him on returning from the mountain.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "musa", relationshipType: "brother", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "He is explicitly granted prophethood 'from Our mercy' alongside his brother, not merely as an assistant.", quranReferences: [asRef(19, 53)], status: "quran_derived" },
      { text: "Being left in a position of responsibility does not guarantee the outcome — the people's choice to disobey is their own.", quranReferences: [asRef(20, 90), asRef(20, 92)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Ta-Ha 20:29-36; Ta-Ha 20:90-94" }],
  },

  {
    id: "dhulkifl",
    name: "Dhul-Kifl",
    arabicName: "ذو الكفل",
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Named twice in the Qur'an among the patient and the excellent, with no narrative or story given for him at all.",
    detailedDescription:
      "Dhul-Kifl ('the one with a double portion/pledge') appears only in two brief list-mentions, grouped with Isma'il and Idris as among the patient (21:85) and with Isma'il and Al-Yasa' as among the excellent (38:48). The Qur'an gives no account of his life, era, or deeds beyond this.",
    themes: ["Patience", "Excellence"],
    chronology: { status: "unknown" },
    directMentions: [asRef(21, 85), asRef(38, 48)],
    relatedPassages: [],
    keyLessons: [
      { text: "He is affirmed among the patient and excellent with no further detail — a reminder that recognition in the Qur'an does not always come with a narrative.", quranReferences: [asRef(21, 85), asRef(38, 48)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Anbiya 21:85; Sad 38:48" }],
    statusNotes: [
      "Whether Dhul-Kifl was a prophet is debated among scholars; the majority view (reflected here) counts him as one based on his placement in these two lists alongside named prophets, but this is not stated as explicitly as it is for some others. His identity, era, and any narrative beyond the two ayahs above are unknown from the Qur'an text.",
    ],
  },

  {
    id: "dawud",
    name: "Dawud",
    arabicName: "داوود",
    alternateNames: ["David"],
    primaryCategory: "prophet",
    secondaryCategories: ["ruler_leader"],
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet given the Zabur (Psalms), made a 'khalifah' (successor/steward) on earth, whose voice the mountains and birds joined in glorification, and who judged between two litigants who tested him.",
    detailedDescription:
      "Dawud is given great favor: iron is made soft for him, mountains and birds glorify Allah with him, and he judges with wisdom. Two disputants climb into his private chamber to test him with a case about ninety-nine ewes; realizing he has judged hastily, he seeks Allah's forgiveness and turns to Him. He is also explicitly named the father of Sulaiman, who inherits from him.",
    themes: ["Prophethood and kingship", "Judgment and self-correction", "Gratitude"],
    chronology: { label: "Given the Zabur; father of Sulaiman", order: 17, status: "traditional" },
    directMentions: [
      asRef(2, 251), asRef(4, 163), asRef(5, 78), asRef(6, 84), asRef(17, 55),
      asRef(21, 78), asRef(21, 79), asRef(27, 15), asRef(27, 16), asRef(34, 10),
      asRef(34, 13), asRef(38, 17), asRef(38, 22), asRef(38, 24), asRef(38, 26),
      asRef(38, 30),
    ],
    relatedPassages: [
      {
        id: "dawud-sad-trial",
        surahNumber: 38, ayahStart: 17, ayahEnd: 26,
        title: "The Two Litigants and Self-Correction",
        description: "Dawud tested by two disputants who scale his private chamber, and his turning to Allah after judging hastily.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "dawud-saba-blessings",
        surahNumber: 34, ayahStart: 10, ayahEnd: 11,
        title: "Iron Made Soft, Mountains in Glorification",
        description: "The favor shown to Dawud: mountains and birds glorifying with him, and iron softened for his use.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "dawud-anbiya-judgment",
        surahNumber: 21, ayahStart: 78, ayahEnd: 80,
        title: "Judging the Case of the Field",
        description: "Dawud and Sulaiman judge a dispute over a field grazed by sheep; understanding is given to Sulaiman, wisdom to both.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "sulaiman", relationshipType: "father", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Realizing a hasty judgment and turning immediately to Allah in repentance, rather than defending the error, is held up without qualification.", quranReferences: [asRef(38, 24)], status: "quran_derived" },
      { text: "Great favor (kingship, revelation, mastery over iron) is paired directly with the instruction to 'work righteousness' and be grateful.", quranReferences: [asRef(34, 11)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Sad 38:17-26; Saba 34:10-11; Al-Anbiya 21:78-80" }],
    statusNotes: [
      "The Qur'anic spelling is دَاوُود (Dawud); the alternate spelling داود without the second waw does not occur as this proper name in the verified search — only the form used here was found in Qur'an text.",
    ],
  },

  {
    id: "sulaiman",
    name: "Sulaiman",
    arabicName: "سليمان",
    alternateNames: ["Solomon"],
    primaryCategory: "prophet",
    secondaryCategories: ["ruler_leader"],
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son and heir of Dawud, given command over the wind and the jinn and understanding of the speech of birds — famous for the narrative of the ants, the hoopoe, and the Queen of Sheba.",
    detailedDescription:
      "Sulaiman inherits from Dawud and gives thanks for being taught the speech of birds. His army of jinn, men, and birds passes a valley of ants; a hoopoe brings news of a people ruled by a queen who worship the sun, and Sulaiman sends her a letter. She visits his court, is shown his throne transported before her arrival and a palace floor of glass she mistakes for water, and submits with him to 'the Lord of the worlds.'",
    themes: ["Gratitude", "Dominion as a trial", "Wisdom", "Da'wah through diplomacy"],
    chronology: { label: "Son of Dawud", order: 18, status: "traditional" },
    directMentions: [
      asRef(2, 102), asRef(4, 163), asRef(6, 84), asRef(21, 78), asRef(21, 79),
      asRef(21, 81), asRef(27, 15), asRef(27, 16), asRef(27, 17), asRef(27, 18),
      asRef(27, 30), asRef(27, 36), asRef(27, 44), asRef(34, 12), asRef(38, 30),
      asRef(38, 34),
    ],
    relatedPassages: [
      {
        id: "sulaiman-naml-narrative",
        surahNumber: 27, ayahStart: 15, ayahEnd: 44,
        title: "The Ants, the Hoopoe, and the Queen",
        description: "Sulaiman's inheritance and gratitude, the valley of ants, the hoopoe's report, and the Queen's visit and submission.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "sulaiman-sad-trial",
        surahNumber: 38, ayahStart: 30, ayahEnd: 40,
        title: "His Trial and Kingdom",
        description: "Sulaiman's trial, his prayer for a kingdom unmatched by any after him, and the wind and devils placed under his command.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "sulaiman-saba-death",
        surahNumber: 34, ayahStart: 12, ayahEnd: 14,
        title: "Command of the Wind, and His Death",
        description: "The wind placed under Sulaiman's command, and his death being discovered only when a worm revealed his staff had been eaten through.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "dawud", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
      { personId: "bilqis", relationshipType: "contemporary", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Extraordinary power and dominion are met with thanks — 'this is from the favor of my Lord, to test me whether I will be grateful' — not pride.", quranReferences: [asRef(27, 40)], status: "quran_derived" },
      { text: "Persuasion through reasoned invitation (his letter and diplomacy) rather than force is the method shown for bringing a ruling queen to Tawhid.", quranReferences: [asRef(27, 44)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "An-Naml 27:15-44; Sad 38:30-40; Saba 34:12-14" }],
  },

  {
    id: "ilyas",
    name: "Ilyas",
    arabicName: "إلياس",
    alternateNames: ["Elijah"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A messenger sent to his people to call them away from worshipping Ba'l, explicitly counted 'among the messengers.'",
    detailedDescription:
      "Ilyas calls his people: 'Will you not fear Allah? Do you call upon Ba'l and leave the best of creators?' They deny him, except for sincere servants of Allah among them, and he is remembered well among later generations.",
    themes: ["Rejection of idolatry", "Steadfast calling", "Being remembered well"],
    chronology: { label: "Traditionally placed after Sulaiman", order: 19, status: "traditional" },
    directMentions: [asRef(6, 85), asRef(37, 123)],
    relatedPassages: [
      {
        id: "ilyas-saffat-mission",
        surahNumber: 37, ayahStart: 123, ayahEnd: 132,
        title: "Calling His People Away from Ba'l",
        description: "Ilyas's call to his people, their rejection except a few, and his being remembered well among later generations.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "He is explicitly counted 'among the messengers' (37:123) despite his very brief appearance in the text.", quranReferences: [asRef(37, 123)], status: "quran_derived" },
      { text: "Peace is invoked upon him by name, and he is described as being left 'among later generations' — remembered well.", quranReferences: [asRef(37, 129), asRef(37, 130)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "As-Saffat 37:123-132" }],
  },

  {
    id: "alyasa",
    name: "Al-Yasa'",
    arabicName: "اليسع",
    alternateNames: ["Elisha"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Named twice in the Qur'an in short lists of the excellent and favored, with no narrative given for him at all.",
    detailedDescription:
      "Al-Yasa' appears only in two list-mentions: grouped with Isma'il, Yunus, and Lut as those Allah favored above the worlds (6:86), and with Isma'il and Dhul-Kifl as among the excellent (38:48). No story, era, or deed is narrated for him in the Qur'an.",
    themes: ["Being favored", "Excellence"],
    chronology: { status: "unknown" },
    directMentions: [asRef(6, 86), asRef(38, 48)],
    relatedPassages: [],
    keyLessons: [
      { text: "Like Dhul-Kifl, he is affirmed by name and placement among the excellent with no accompanying story — recognition here does not depend on a narrative.", quranReferences: [asRef(6, 86), asRef(38, 48)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-An'am 6:86; Sad 38:48" }],
    statusNotes: [
      "No narrative, era, or deed is given for Al-Yasa' in the Qur'an beyond these two list-mentions. Traditional accounts identifying him as Ilyas's successor are not Qur'an-explicit.",
    ],
  },

  {
    id: "yunus",
    name: "Yunus",
    arabicName: "يونس",
    alternateNames: ["Jonah", "Dhun-Nun"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "A prophet who left his people in anger before receiving Allah's permission, was swallowed by a great fish, and was saved after glorifying Allah in its depths.",
    detailedDescription:
      "Yunus departs from his people in distress and boards a ship; cast into the sea, he is swallowed by a great fish. In its darkness he cries out, 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers' — and is saved, cast onto a shore and given a plant for shade. His people, uniquely among those who rejected a prophet, are described as having later believed and been spared punishment.",
    themes: ["Distress and supplication", "Allah's mercy", "A people who repented in time"],
    chronology: { label: "Sent to Nineveh", order: 21, status: "traditional" },
    directMentions: [asRef(4, 163), asRef(6, 86), asRef(10, 98), asRef(37, 139)],
    relatedPassages: [
      {
        id: "yunus-saffat-fish",
        surahNumber: 37, ayahStart: 139, ayahEnd: 148,
        title: "The Great Fish and His Supplication",
        description: "Yunus fleeing in the laden ship, being swallowed by the fish, his supplication in its depths, and his rescue.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "yunus-anbiya-account",
        surahNumber: 21, ayahStart: 87, ayahEnd: 88,
        title: "The Account in Surah Al-Anbiya",
        description: "A parallel, shorter account of Yunus's distress, his supplication, and Allah's answer.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "His supplication in extremity — affirming Allah's oneness and his own wrongdoing — is presented as a model prayer of distress.", quranReferences: [asRef(21, 87)], status: "quran_derived" },
      { text: "His people are named as the sole example of a community whose belief, coming after initially rejecting a prophet, was accepted and spared punishment.", quranReferences: [asRef(10, 98)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "As-Saffat 37:139-148; Al-Anbiya 21:87-88" }],
    statusNotes: [
      "Yunus's departure is described as leaving 'in anger' without his Lord's permission (21:87), a point the Qur'an itself raises about him distinct from most other prophets' accounts.",
    ],
  },

  {
    id: "zakariyya",
    name: "Zakariyya",
    arabicName: "زكريا",
    alternateNames: ["Zechariah"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Maryam's guardian in the Temple, who prayed for a child in his old age and was given glad tidings of Yahya.",
    detailedDescription:
      "Zakariyya takes charge of Maryam's upbringing; finding provision with her beyond season prompts his own prayer for an heir despite his old age and his wife's barrenness. He is given glad tidings of Yahya and asks for a sign, which is that he will not speak to people for three nights though he is not mute.",
    themes: ["Sincere private supplication", "Old age and hope", "Guardianship"],
    chronology: { label: "Guardian of Maryam, father of Yahya", order: 22, status: "traditional" },
    directMentions: [asRef(3, 37), asRef(3, 38), asRef(6, 85), asRef(19, 2), asRef(19, 7), asRef(21, 89)],
    relatedPassages: [
      {
        id: "zakariyya-imran-guardianship",
        surahNumber: 3, ayahStart: 37, ayahEnd: 41,
        title: "Guardian of Maryam and His Prayer for a Son",
        description: "Zakariyya's care of Maryam, his prayer for an heir, and the sign given to him.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "zakariyya-maryam-mercy",
        surahNumber: 19, ayahStart: 2, ayahEnd: 15,
        title: "The Mercy Shown to Zakariyya",
        description: "His private call to his Lord, the glad tidings of Yahya, and the sign of three days' silence.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "yahya", relationshipType: "father", sourceType: "quran", verificationStatus: "verified" },
      { personId: "maryam", relationshipType: "other", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "His prayer is described as a private, quiet call — 'a call in secret' — held up as a model of sincere supplication.", quranReferences: [asRef(19, 3)], status: "quran_derived" },
      { text: "Seeing Allah's unseasonal provision for Maryam directly moves him to ask boldly for what seems impossible for himself.", quranReferences: [asRef(3, 37), asRef(3, 38)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Aal-i-Imran 3:37-41; Maryam 19:2-15" }],
  },

  {
    id: "yahya",
    name: "Yahya",
    arabicName: "يحيى",
    alternateNames: ["John the Baptist"],
    primaryCategory: "prophet",
    personType: "prophet",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son of Zakariyya, given the Scripture with vigor in childhood, described as dutiful to his parents and never 'a disobedient tyrant.'",
    detailedDescription:
      "Yahya is given as glad tidings to Zakariyya, with a name — the Qur'an notes — no one had been given before him. He is given wisdom while still a boy, along with compassion and purity, and is described as devout, dutiful to his parents, and free of arrogance or disobedience.",
    themes: ["Righteousness from a young age", "Dutifulness to parents", "Purity"],
    chronology: { label: "Son of Zakariyya, contemporary of Isa's early life", order: 23, status: "traditional" },
    directMentions: [asRef(3, 39), asRef(6, 85), asRef(19, 7), asRef(19, 12), asRef(21, 90)],
    relatedPassages: [
      {
        id: "yahya-maryam-childhood",
        surahNumber: 19, ayahStart: 7, ayahEnd: 15,
        title: "Named, and Given Wisdom as a Boy",
        description: "The announcement of Yahya's birth and name, and the qualities of piety and dutifulness given to him from childhood.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "zakariyya", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Righteousness and wisdom are described as given to him already in boyhood, not only as an adult achievement.", quranReferences: [asRef(19, 12)], status: "quran_derived" },
      { text: "He is explicitly described as dutiful to his parents and 'not a disobedient tyrant.'", quranReferences: [asRef(19, 14)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Maryam 19:7-15" }],
    statusNotes: [
      "يحيى (Yahya) is spelled identically to the common Arabic verb 'he lives/gives life,' used dozens of times in the Qur'an (e.g. 'Allah gives life and causes death'). Every raw search match was read in full; only the 5 listed above are genuinely the proper name — the rest are the verb and were excluded.",
    ],
  },

  {
    id: "isa",
    name: "Isa",
    arabicName: "عيسى",
    alternateNames: ["Jesus", "Al-Masih", "Ibn Maryam"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "AS", arabic: "عليه السلام" },
    shortDescription:
      "Son of Maryam, described as a messenger of Allah and His word conveyed to Maryam, given the Gospel (Injil) and clear miracles by Allah's permission.",
    detailedDescription:
      "Isa's birth is announced to Maryam by an angel; he is born without a father, by Allah's command 'Be, and it is.' He speaks in the cradle, is given the Injil, and performs miracles — healing the blind and the leper, and giving life to the dead — explicitly 'by Allah's permission' (bi-idhnillah) in every instance. The Qur'an states he was not killed or crucified but was raised up to Allah, and rejects the ascription of divinity to him.",
    themes: ["Miracles by Allah's permission", "Message of Tawhid", "Maryam's household", "Rejection of divinity claims"],
    chronology: { label: "Descendant of Ibrahim, before Muhammad ﷺ", order: 24, status: "traditional" },
    directMentions: [
      asRef(2, 87), asRef(2, 136), asRef(2, 253), asRef(3, 45), asRef(3, 52),
      asRef(3, 55), asRef(3, 59), asRef(3, 84), asRef(4, 157), asRef(4, 163),
      asRef(4, 171), asRef(5, 46), asRef(5, 78), asRef(5, 110), asRef(5, 112),
      asRef(5, 114), asRef(5, 116), asRef(6, 85), asRef(19, 34), asRef(33, 7),
      asRef(42, 13), asRef(43, 63), asRef(57, 27), asRef(61, 6), asRef(61, 14),
    ],
    relatedPassages: [
      {
        id: "isa-imran-annunciation",
        surahNumber: 3, ayahStart: 33, ayahEnd: 51,
        title: "The Annunciation and Early Miracles",
        description: "Maryam's family, the announcement of Isa's birth, and his early miracles and mission to the Children of Israel.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "isa-maryam-birth",
        surahNumber: 19, ayahStart: 16, ayahEnd: 34,
        title: "The Birth Narrative",
        description: "Maryam's seclusion, the birth of Isa, and his speaking in the cradle in her defense.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "isa-maidah-dialogue",
        surahNumber: 5, ayahStart: 110, ayahEnd: 120,
        title: "The Day-of-Judgment Dialogue",
        description: "Allah's dialogue with Isa disavowing any claim that he told people to worship him and his mother as gods.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "maryam", relationshipType: "mother", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Every miracle performed is explicitly attributed to Allah's permission, not to Isa's own power.", quranReferences: [asRef(3, 49), asRef(5, 110)], status: "quran_derived" },
      { text: "Isa himself, per the Qur'an, disavows any claim that he asked to be worshipped.", quranReferences: [asRef(5, 116), asRef(5, 117)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Aal-i-Imran 3:33-51; Maryam 19:16-34; Al-Ma'idah 5:110-120" }],
    statusNotes: [
      "3:59 compares Isa's creation to Adam's ('like the example of Adam... He created him from dust') as a rebuttal to claims of divinity, not as a statement of lineage/ancestry — an 'ancestor' relationship to Adam is not listed here for that reason, and because it would be trivially true of every person in this dataset rather than something distinctive the Qur'an states about Isa specifically.",
    ],
  },

  {
    id: "muhammad",
    name: "Muhammad",
    arabicName: "محمد",
    alternateNames: ["Ahmad", "Al-Mustafa"],
    primaryCategory: "prophet",
    personType: "prophet_and_messenger",
    honorific: { short: "ﷺ", arabic: "صلى الله عليه وسلم" },
    shortDescription:
      "The final prophet and messenger, described in the Qur'an as the 'seal of the prophets,' sent as a mercy to all creation.",
    detailedDescription:
      "The Qur'an refers to Muhammad by name in only four places, using titles and pronouns elsewhere. He is described as unlettered, sent as a mercy to the worlds, and as the seal (final) of the prophets — after whom no further prophet is sent.",
    themes: ["Finality of prophethood", "Mercy to creation", "Excellent example", "Revelation of the Qur'an"],
    chronology: { label: "Final prophet, 6th-7th century CE", order: 25, status: "strong" },
    directMentions: [asRef(3, 144), asRef(33, 40), asRef(47, 2), asRef(48, 29)],
    relatedPassages: [
      {
        id: "muhammad-ahzab-example",
        surahNumber: 33, ayahStart: 21, ayahEnd: 21,
        title: "The Excellent Example",
        description: "Muhammad described as an excellent example for whoever hopes for Allah and the Last Day.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "muhammad-tawbah-concern",
        surahNumber: 9, ayahStart: 128, ayahEnd: 129,
        title: "Concern for the Believers",
        description: "A description of the Prophet's grief over his people's hardship and his gentleness toward the believers.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "abulahab", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "He is described as the seal of the prophets — the finality of his prophethood is stated explicitly.", quranReferences: [asRef(33, 40)], status: "quran_derived" },
      { text: "His character is held up as a model ('an excellent pattern') rather than only his teaching.", quranReferences: [asRef(33, 21)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Aal-i-Imran 3:144; Al-Ahzab 33:40; Muhammad 47:2; Al-Fath 48:29" }],
    statusNotes: [
      "This seed entry intentionally stays close to the four ayahs that name him directly; his fuller biography (seerah) draws heavily on hadith and traditional accounts not included in this V1 dataset.",
    ],
  },

  // ============================================================
  // Other named / title-based Qur'anic persons (not among the 25
  // prophets).
  // ============================================================
  {
    id: "maryam",
    name: "Maryam",
    arabicName: "مريم",
    alternateNames: ["Mary"],
    primaryCategory: "woman",
    secondaryCategories: ["family_relative"],
    personType: "quranic_person",
    honorific: { short: "AS", arabic: "عليها السلام" },
    shortDescription:
      "Mother of Isa, the only woman named directly in the Qur'an, and the only person after whom a surah is named. Held up as an example of chastity and devotion.",
    detailedDescription:
      "Dedicated to the service of the Temple by her mother before her birth, Maryam is raised under the care of Zakariyya. An angel announces to her the birth of Isa; she withdraws to a remote place, and the Qur'an describes her distress and Allah's provision for her during the birth. She is held up in the Qur'an, alongside the wife of Pharaoh, as an example for the believers.",
    themes: ["Chastity", "Devotion", "Trust in Allah", "Motherhood"],
    chronology: { label: "Contemporary of Zakariyya, mother of Isa", order: 6, status: "traditional" },
    directMentions: [
      asRef(2, 87), asRef(2, 253), asRef(3, 36), asRef(3, 37), asRef(3, 42),
      asRef(3, 43), asRef(3, 44), asRef(3, 45), asRef(4, 156), asRef(4, 157),
      asRef(4, 171), asRef(5, 17), asRef(5, 46), asRef(5, 72), asRef(5, 75),
      asRef(5, 78), asRef(5, 110), asRef(5, 112), asRef(5, 114), asRef(5, 116),
      asRef(9, 31), asRef(19, 16), asRef(19, 27), asRef(19, 34), asRef(23, 50),
      asRef(33, 7), asRef(43, 57), asRef(57, 27), asRef(61, 6), asRef(61, 14),
      asRef(66, 12),
    ],
    relatedPassages: [
      {
        id: "maryam-imran-family",
        surahNumber: 3, ayahStart: 33, ayahEnd: 47,
        title: "Her Family and Upbringing",
        description: "The family of Imran, Maryam's dedication to the Temple, and the annunciation of Isa's birth.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "maryam-surah-birth",
        surahNumber: 19, ayahStart: 16, ayahEnd: 34,
        title: "The Birth of Isa",
        description: "Her withdrawal to a remote place, the birth of Isa, and Isa speaking in the cradle to defend her.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "maryam-tahrim-example",
        surahNumber: 66, ayahStart: 12, ayahEnd: 12,
        title: "Held Up as an Example",
        description: "Maryam described as one who guarded her chastity and believed in her Lord's words, given as an example for the believers.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "isa", relationshipType: "son", sourceType: "quran", verificationStatus: "verified" },
      { personId: "zakariyya", relationshipType: "other", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Complete trust in Allah's provision in a moment of extreme difficulty and isolation.", quranReferences: [asRef(19, 24), asRef(19, 25)], status: "quran_derived" },
      { text: "Guarding one's chastity is directly linked in the Qur'an to her being honored as an example.", quranReferences: [asRef(66, 12)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Aal-i-Imran 3:33-47; Maryam 19:16-34; At-Tahrim 66:12" }],
    statusNotes: [
      "Maryam is not considered a prophet in mainstream Islamic scholarship; she is honored with the same 'AS' honorific used for prophets by widespread convention, reflected here per the feature spec's own example.",
    ],
  },

  {
    id: "luqman",
    name: "Luqman",
    arabicName: "لقمان",
    primaryCategory: "other",
    secondaryCategories: ["man"],
    personType: "title_based_person",
    shortDescription:
      "A wise man given wisdom (hikmah) by Allah, remembered for the counsel he gave his son — recorded across several ayahs of Surah Luqman.",
    detailedDescription:
      "Surah Luqman (31) is named for him. The Qur'an records a sequence of advice he gives his son: warning against associating partners with Allah, gratitude to parents, awareness that Allah knows all things however small, establishing prayer, enjoining good, patience, and warnings against arrogance.",
    themes: ["Wisdom", "Parental advice", "Tawhid", "Humility", "Gratitude"],
    chronology: { status: "unknown" },
    directMentions: [asRef(31, 12), asRef(31, 13)],
    relatedPassages: [
      {
        id: "luqman-advice",
        surahNumber: 31, ayahStart: 12, ayahEnd: 19,
        title: "Luqman's Advice to His Son",
        description: "The wisdom given to Luqman, and his sequence of counsel to his son on faith, gratitude, prayer, and humility.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "Associating partners with Allah is named as a 'great injustice,' the first point of his advice.", quranReferences: [asRef(31, 13)], status: "quran_derived" },
      { text: "Gentleness in speech and gait, and avoiding arrogance, are given as concrete, everyday counsel.", quranReferences: [asRef(31, 18), asRef(31, 19)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Luqman 31:12-19" }],
    statusNotes: [
      "Whether Luqman was a prophet is not established in the Qur'an. The predominant scholarly view holds he was a righteous, wise man (hakim) rather than a prophet — reflected here by personType 'title_based_person', not 'prophet'.",
    ],
  },

  {
    id: "firaun",
    name: "Fir'aun",
    arabicName: "فرعون",
    alternateNames: ["Pharaoh"],
    primaryCategory: "ruler_leader",
    personType: "quranic_person",
    shortDescription:
      "The tyrant king of Egypt in Musa's era, who claimed divinity and enslaved the Israelites, drowned while pursuing them at the sea.",
    detailedDescription:
      "Fir'aun is described as having 'transgressed' and exalted himself above his people, killing their sons and enslaving their women, and ultimately claiming 'I am your lord, most high.' He rejects Musa's signs, pursues the Israelites after their departure, and drowns; the Qur'an states his body was preserved as 'a sign for those who succeed him.'",
    themes: ["Tyranny and arrogance", "Rejection of clear signs", "Downfall"],
    chronology: { label: "Contemporary of Musa, pre-Exodus Egypt", status: "traditional" },
    directMentions: [
      asRef(2, 49), asRef(2, 50), asRef(3, 11), asRef(7, 103), asRef(7, 104),
      asRef(7, 109), asRef(7, 113), asRef(7, 123), asRef(7, 127), asRef(7, 130),
      asRef(7, 137), asRef(7, 141), asRef(8, 52), asRef(8, 54), asRef(10, 75),
      asRef(10, 79), asRef(10, 83), asRef(10, 88), asRef(10, 90), asRef(11, 97),
      asRef(14, 6), asRef(17, 101), asRef(17, 102), asRef(20, 24), asRef(20, 43),
      asRef(20, 60), asRef(20, 78), asRef(20, 79), asRef(23, 46), asRef(26, 11),
      asRef(26, 16), asRef(26, 23), asRef(26, 41), asRef(26, 44), asRef(26, 53),
      asRef(27, 12), asRef(28, 3), asRef(28, 4), asRef(28, 6), asRef(28, 8),
      asRef(28, 9), asRef(28, 32), asRef(28, 38), asRef(29, 39), asRef(38, 12),
      asRef(40, 24), asRef(40, 26), asRef(40, 28), asRef(40, 29), asRef(40, 36),
      asRef(40, 37), asRef(40, 45), asRef(40, 46), asRef(43, 46), asRef(43, 51),
      asRef(44, 17), asRef(44, 31), asRef(50, 13), asRef(51, 38), asRef(54, 41),
      asRef(66, 11), asRef(69, 9), asRef(73, 15), asRef(73, 16), asRef(79, 17),
      asRef(85, 18), asRef(89, 10),
    ],
    relatedPassages: [
      {
        id: "firaun-naziat-defiance",
        surahNumber: 79, ayahStart: 15, ayahEnd: 26,
        title: "Musa's Mission to Him and His Defiance",
        description: "Musa sent to Fir'aun, his claim to supreme lordship, and his seizure as an example.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
      {
        id: "firaun-ghafir-tower",
        surahNumber: 40, ayahStart: 36, ayahEnd: 46,
        title: "The Command to Build a Tower",
        description: "Fir'aun's command to Haman to build a tower to 'look upon the God of Musa,' and his eventual drowning.",
        storyOrder: 2, source: "quran", verificationStatus: "verified",
      },
      {
        id: "firaun-yunus-drowning",
        surahNumber: 10, ayahStart: 90, ayahEnd: 92,
        title: "Drowning and a Late Declaration of Belief",
        description: "Fir'aun's belief declared only as he is drowning, rejected as too late, and his body preserved as a sign.",
        storyOrder: 3, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "musa", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
      { personId: "haman", relationshipType: "supporter", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "A last-minute declaration of belief made only once punishment is unavoidable is explicitly rejected as too late.", quranReferences: [asRef(10, 90), asRef(10, 91)], status: "quran_derived" },
      { text: "Political and military power offered no protection once Allah's decree came.", quranReferences: [asRef(44, 25), asRef(44, 29)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "An-Nazi'at 79:15-26; Ghafir 40:36-46; Yunus 10:90-92" }],
    statusNotes: [
      "Fir'aun ('Pharaoh') is a title, not a proper name — the Qur'an never names this ruler individually, and this entry does not identify him with any specific historical Egyptian pharaoh, since the Qur'an itself does not.",
    ],
  },

  {
    id: "haman",
    name: "Haman",
    arabicName: "هامان",
    primaryCategory: "ruler_leader",
    personType: "quranic_person",
    shortDescription:
      "A minister and close supporter of Fir'aun, named alongside him and Qarun as among those who rejected Musa despite the clear signs he brought.",
    detailedDescription:
      "Haman is grouped with Fir'aun as a co-conspirator and is the one Fir'aun orders to build a tower of baked clay so he can 'look upon the God of Musa' — a request the Qur'an frames as arrogant mockery. He shares in Fir'aun's fate.",
    themes: ["Complicity in tyranny", "Rejection of clear signs"],
    chronology: { label: "Official under Fir'aun, contemporary of Musa", status: "traditional" },
    directMentions: [asRef(28, 6), asRef(28, 8), asRef(28, 38), asRef(29, 39), asRef(40, 24), asRef(40, 36)],
    relatedPassages: [
      {
        id: "haman-ghafir-tower",
        surahNumber: 40, ayahStart: 36, ayahEnd: 37,
        title: "Ordered to Build the Tower",
        description: "Fir'aun's command to Haman to build a tower to reach and 'look upon the God of Musa.'",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "firaun", relationshipType: "supporter", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Supporting a tyrant's project, even in a technical or administrative role, is treated in the Qur'an as shared culpability, not a neutral position.", quranReferences: [asRef(28, 38)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Ghafir 40:36-37" }],
    statusNotes: [
      "The Qur'an does not detail Haman's specific office or role beyond being ordered to build the tower; 'minister' is a common description in tafsir literature (a traditional account), not a title the Qur'an itself uses for him.",
    ],
  },

  {
    id: "qarun",
    name: "Qarun",
    arabicName: "قارون",
    alternateNames: ["Korah"],
    primaryCategory: "other",
    secondaryCategories: ["man"],
    personType: "quranic_person",
    shortDescription:
      "An extremely wealthy man 'of the people of Musa' who grew arrogant over his riches, claiming they were earned by his own knowledge, before being swallowed by the earth.",
    detailedDescription:
      "Qarun oppresses his own people through his wealth and refuses the advice to spend in charity and not to be corrupt, attributing his fortune to knowledge he alone possesses. Those who had wished for his position quickly reconsider once he and his home are made to sink into the earth.",
    themes: ["Arrogance over wealth", "False self-sufficiency", "Sudden downfall"],
    chronology: { label: "Of Musa's own people, contemporary of Musa", status: "traditional" },
    directMentions: [asRef(28, 76), asRef(28, 79), asRef(29, 39), asRef(40, 24)],
    relatedPassages: [
      {
        id: "qarun-qasas-downfall",
        surahNumber: 28, ayahStart: 76, ayahEnd: 82,
        title: "His Wealth, Arrogance, and Downfall",
        description: "Qarun's immense wealth, his arrogance and the advice given to him, and his being swallowed by the earth.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "musa", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Attributing success solely to one's own knowledge or effort, with no acknowledgment of Allah, is directly named as his error.", quranReferences: [asRef(28, 78)], status: "quran_derived" },
      { text: "Those who envied his position are shown reversing that view within the same passage, once the outcome is seen.", quranReferences: [asRef(28, 82)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Qasas 28:76-82" }],
    statusNotes: [
      "Qarun is explicitly described as being 'of the people of Musa' (28:76) despite opposing him — belonging to the same community as a prophet is shown as no guarantee of righteousness.",
    ],
  },

  {
    id: "talut",
    name: "Talut",
    arabicName: "طالوت",
    alternateNames: ["Saul"],
    primaryCategory: "ruler_leader",
    personType: "quranic_person",
    shortDescription:
      "A man appointed king over the Israelites by Allah's choice, whose army was tested at a river before facing Jalut's forces.",
    detailedDescription:
      "When the Israelites ask their (unnamed) prophet for a king, they object to Talut on the grounds of wealth and lineage; the prophet responds that Allah has chosen him and increased him in knowledge and stature. Talut tests his army at a river — only those who do not drink freely from it remain with him — and this smaller, tested force goes on to face Jalut.",
    themes: ["Divine selection over worldly standing", "Testing and discipline", "Small numbers, strong faith"],
    chronology: { label: "Israelite king; the Qur'an places this narrative shortly before Dawud's era (2:251)", status: "strong" },
    directMentions: [asRef(2, 247), asRef(2, 249)],
    relatedPassages: [
      {
        id: "talut-baqarah-narrative",
        surahNumber: 2, ayahStart: 246, ayahEnd: 251,
        title: "Talut's Appointment and the Test at the River",
        description: "The Israelites' request for a king, Talut's appointment, the test at the river, and the confrontation with Jalut in which Dawud kills him.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "Fitness for leadership is tied here to knowledge and physical capacity granted by Allah, not to wealth or lineage.", quranReferences: [asRef(2, 247)], status: "quran_derived" },
      { text: "A small, disciplined group is explicitly said to be able to overcome a much larger one 'by Allah's permission.'", quranReferences: [asRef(2, 249)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:246-251" }],
    statusNotes: [
      "Neither the prophet who addresses the Israelites in this passage nor Talut's identification with the Biblical Saul is named in the Qur'an text — the identification with Saul is a traditional/scholarly reading, not a Qur'anic statement.",
    ],
  },

  {
    id: "jalut",
    name: "Jalut",
    arabicName: "جالوت",
    alternateNames: ["Goliath"],
    primaryCategory: "ruler_leader",
    personType: "quranic_person",
    shortDescription:
      "The opposing commander whose forces faced Talut's army, killed by Dawud — the only place in the Qur'an where Dawud's own name and Jalut's meet.",
    detailedDescription:
      "Jalut and his soldiers confront Talut's tested, much smaller force. The believers pray for steadfastness and firm footing; by Allah's permission they defeat Jalut's army, and Dawud kills Jalut. Allah then gives Dawud kingship and wisdom.",
    themes: ["Opposition overcome by faith", "Steadfastness in battle"],
    chronology: { label: "Opposing commander defeated by Dawud (2:251)", status: "strong" },
    directMentions: [asRef(2, 249), asRef(2, 250), asRef(2, 251)],
    relatedPassages: [
      {
        id: "jalut-baqarah-battle",
        surahNumber: 2, ayahStart: 249, ayahEnd: 251,
        title: "The Battle and Dawud's Victory",
        description: "The confrontation between Talut's and Jalut's forces, the believers' prayer for steadfastness, and Dawud's killing of Jalut.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "talut", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
      { personId: "dawud", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "The believers' prayer before the clash asks specifically for steadfastness and firm feet, not simply for victory.", quranReferences: [asRef(2, 250)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:249-251" }],
    statusNotes: [
      "Jalut's identification with the Biblical Goliath is a traditional/scholarly reading; the Qur'an gives no physical description or further biographical detail beyond this passage.",
    ],
  },

  {
    id: "abulahab",
    name: "Abu Lahab",
    arabicName: "أبي لهب",
    primaryCategory: "man",
    secondaryCategories: ["family_relative"],
    personType: "quranic_person",
    shortDescription:
      "A vocal opponent of Muhammad ﷺ, condemned by name in the short Surah Al-Masad, along with his wife, for his hostility to the Prophet's message.",
    detailedDescription:
      "Surah Al-Masad (111), five ayahs long, condemns Abu Lahab: his wealth and gains will not save him; he will be in a fire of flame, and his wife — described as carrying firewood, with a rope of palm fibre around her neck — with him. It is the only surah naming an opponent of the Prophet directly.",
    themes: ["Open opposition to the message", "Wealth offering no protection"],
    chronology: { label: "Contemporary of Muhammad ﷺ, early Makkan period", status: "strong" },
    directMentions: [asRef(111, 1)],
    relatedPassages: [
      {
        id: "abulahab-masad-surah",
        surahNumber: 111, ayahStart: 1, ayahEnd: 5,
        title: "Surah Al-Masad",
        description: "The entire short surah condemning Abu Lahab and his wife for their opposition to the Prophet.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "muhammad", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
      { personId: "muhammad", relationshipType: "other", sourceType: "traditional_account", verificationStatus: "traditional" },
    ],
    keyLessons: [
      { text: "Neither wealth nor what he had 'earned' is described as offering him any protection.", quranReferences: [asRef(111, 2)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Surah Al-Masad 111:1-5" }],
    statusNotes: [
      "Abu Lahab's identity as Muhammad's paternal uncle is well-established historical/seerah record, not stated in the Qur'an text itself — the surah condemns him by his by-name (Abu Lahab, 'father of flame') without stating the family relationship. That second relationship entry is marked traditional_account for this reason.",
      "The Qur'an's own spelling is the genitive 'Abi Lahab' (as it appears after the preposition in 111:1); 'Abu Lahab' is the conventional independent-form name used here and throughout Islamic literature.",
    ],
  },

  {
    id: "bilqis",
    name: "Bilqis",
    arabicName: "بلقيس",
    alternateNames: ["Queen of Sheba"],
    primaryCategory: "woman",
    secondaryCategories: ["ruler_leader"],
    personType: "quranic_person",
    shortDescription:
      "A ruling queen whose people worshipped the sun, visited by Sulaiman's letter and court, who ultimately submits with him to the Lord of the worlds — though the Qur'an never actually gives her this name.",
    detailedDescription:
      "A hoopoe reports to Sulaiman a people ruled by a woman, given 'all things,' with a great throne, who worship the sun instead of Allah. Sulaiman sends her a letter; she consults her council and, wary of the cost of conflict, sends a gift instead, which Sulaiman refuses. She visits his court, is shown her own throne transported ahead of her and a glass floor she mistakes for water, and declares: 'My Lord, I have wronged myself, and I submit with Sulaiman to Allah, Lord of the worlds.'",
    themes: ["Wise counsel and consultation", "Recognizing truth over pride", "Submission to Allah"],
    chronology: { label: "Contemporary of Sulaiman (name traditional, not given in the Qur'an text)", status: "traditional" },
    directMentions: [],
    relatedPassages: [
      {
        id: "bilqis-naml-narrative",
        surahNumber: 27, ayahStart: 22, ayahEnd: 44,
        title: "The Hoopoe's Report and Her Submission",
        description: "The hoopoe's news of her kingdom, Sulaiman's letter, her council's counsel, her visit to his court, and her declaration of submission to Allah.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "sulaiman", relationshipType: "contemporary", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "She consults her council before deciding and openly states that kings 'ruin a city' when they conquer it by force — a preference for measured judgment over pride is shown before her conversion, not only after.", quranReferences: [asRef(27, 32), asRef(27, 34)], status: "quran_derived" },
      { text: "Recognizing and correcting one's own error is stated in her own words: 'I have wronged myself.'", quranReferences: [asRef(27, 44)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "An-Naml 27:22-44" }],
    statusNotes: [
      "IMPORTANT: The name 'Bilqis' does NOT appear anywhere in the Qur'an — verified directly against this app's live search API, which returned zero matches. The Qur'an refers to her only via pronouns and titles ('a woman ruling them,' 'she who has a great throne'). The name comes from traditional/tafsir literature, not the Qur'an text. Because of this, `directMentions` is correctly empty for her — she has a Related Passage (her story) but no Direct Mentions (her name/title as such is never used), which is exactly the distinction this feature is built to preserve, not a data-entry gap.",
      "The alternate name 'Queen of Sheba' is a hybrid: 'Sheba' (Saba') IS a place the Qur'an itself names — the hoopoe reports coming 'from Sheba with certain news' (27:22, using the app's own translation wording), and Saba' is also the name of Surah 34 — but the Qur'an never pairs that place-name with a ruler's personal name or the title 'Queen of Sheba' itself; it only describes 'a woman ruling them' (27:23). So 'Sheba' as a place is Qur'an-supported, while 'Queen of Sheba' as her specific title/epithet, like 'Bilqis,' is a traditional convention (also found in the Bible, 1 Kings 10) layered onto that place-name, not a Qur'anic statement.",
    ],
  },

  // ============================================================
  // Coverage-audit additions — 4 more named/title-based human
  // figures meeting the same inclusion bar already used above
  // (a personal name or a Qur'an-given title, not a scholarly
  // gloss). See MODULE_BLUEPRINT.md Module 17 for the audit that
  // identified these as material gaps against the existing 34.
  // ============================================================
  {
    id: "samiri",
    name: "As-Samiri",
    arabicName: "السامري",
    primaryCategory: "other",
    secondaryCategories: ["man"],
    personType: "quranic_person",
    shortDescription:
      "The individual the Qur'an names as having led the Israelites astray with the golden calf during Musa's absence at the mountain.",
    detailedDescription:
      "While Musa is at the mountain receiving the Torah, Allah tells him his people have been tested and 'As-Samiri has led them astray' (20:85). The people explain they were carrying the community's jewellery and 'so did As-Samiri' — casting it in (20:87) — producing a calf that lowed. On his return, Musa confronts As-Samiri directly; his reply is 'I saw what they did not see, so I took a handful from the trace of the messenger, then I cast it — so did my soul entice me' (20:96). Musa exiles him with the sentence 'there is no touching' (lā misās) and a promise of a reckoning to come (20:97).",
    themes: ["Leading others astray", "Deception", "Exile as consequence"],
    chronology: { label: "Contemporary of Musa and Harun, during the wilderness period", status: "traditional" },
    directMentions: [asRef(20, 85), asRef(20, 87), asRef(20, 95)],
    relatedPassages: [
      {
        id: "samiri-taha-calf",
        surahNumber: 20, ayahStart: 85, ayahEnd: 97,
        title: "As-Samiri and the Golden Calf",
        description: "His introduction as the one who misled the people, the people's account of the jewellery and the calf, and Musa's direct confrontation and sentence.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "musa", relationshipType: "opponent", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Even within a community following a true prophet, a single deceptive individual can lead many astray once a leader's back is turned.", quranReferences: [asRef(20, 85)], status: "quran_derived" },
      { text: "When confronted, he offers only his own reasoning and impulse as justification, not any claim of divine sanction.", quranReferences: [asRef(20, 96)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Ta-Ha 20:83-98" }],
    statusNotes: [
      "'As-Samiri' (السامري) is the Qur'an's own designation for this individual — most commentators read it as denoting his tribe or place of origin (a form meaning roughly 'the Samaritan') rather than a personal given name. The Qur'an provides no other name for him, and none is invented here.",
      "Traditional tafsir offers further accounts of his background, the exact nature of what he 'took from the trace of the messenger' (20:96), and his fate beyond the lā misās exile stated in 20:97 — those extra-Qur'anic details are not included here.",
    ],
  },

  {
    id: "zayd",
    name: "Zayd",
    arabicName: "زيد",
    primaryCategory: "companion",
    personType: "quranic_person",
    honorific: { short: "RA", arabic: "رضي الله عنه" },
    shortDescription:
      "A companion of Muhammad ﷺ named directly in the Qur'an — the only Companion referred to by personal name anywhere in the text — in the context of the ruling that adopted sons are not treated as biological sons.",
    detailedDescription:
      "The Qur'an names Zayd once (33:37): Muhammad ﷺ tells him 'keep your wife,' Zayd nonetheless divorces her, and Muhammad ﷺ then marries her — establishing in a concrete case the general ruling, stated just before it in the same surah (33:4-5), that 'adopted sons' are not real sons and do not carry a real son's legal restrictions. Zayd's fuller identity — 'Zayd ibn Harithah,' a freed slave and adopted son of Muhammad ﷺ, later a prominent companion and military commander killed at the Battle of Mu'tah — comes from hadith and seerah (historical biography) literature, not the Qur'an text itself.",
    themes: ["Abolition of adoption's legal fiction", "Obedience in a personally difficult matter", "The only Companion named in the Qur'an"],
    chronology: { label: "Contemporary of Muhammad ﷺ, Madinan period", status: "strong" },
    directMentions: [asRef(33, 37)],
    relatedPassages: [
      {
        id: "zayd-ahzab-ruling",
        surahNumber: 33, ayahStart: 36, ayahEnd: 40,
        title: "The Ruling on Adopted Sons and Zayd's Marriage",
        description: "The general ruling that adopted sons are not real sons, the specific episode of Zayd's marriage and divorce, and Muhammad ﷺ's marriage to his former wife establishing the ruling in practice.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    relationships: [
      { personId: "muhammad", relationshipType: "other", sourceType: "quran", verificationStatus: "verified" },
      { personId: "muhammad", relationshipType: "other", sourceType: "traditional_account", verificationStatus: "traditional" },
    ],
    keyLessons: [
      { text: "The Qur'an dismantles adoption's legal fiction through this very episode — an 'adopted son' is not treated as a biological son for a matter like marriage eligibility.", quranReferences: [asRef(33, 4), asRef(33, 37)], status: "quran_derived" },
      { text: "He is described as someone Allah and the Prophet had both shown favor to — his standing is affirmed directly in the text, not left to inference.", quranReferences: [asRef(33, 37)], status: "quran_derived" },
    ],
    sources: [
      { type: "quran", citation: "Al-Ahzab 33:36-40" },
      { type: "traditional_account", citation: "Seerah and hadith literature (e.g. Ibn Ishaq, Sahih al-Bukhari)", note: "His fuller name 'Zayd ibn Harithah,' his status as a freed slave and adopted son of Muhammad ﷺ, and his later life and death at the Battle of Mu'tah are historical/traditional record, not stated in the Qur'an text." },
    ],
    statusNotes: [
      "The Qur'an names him only as 'Zayd' (33:37) — it does not give his father's name, tribal lineage, or state outright that he was Muhammad ﷺ's adopted son; those details come from hadith and seerah literature, not the Qur'an text itself.",
      "By the same verified whole-word search used throughout this dataset, he is the only Companion of Muhammad ﷺ referred to by personal name anywhere in the Qur'an — every other companion is referenced only by pronoun, title, or group description ('those with him,' 'the Ansar,' etc.).",
    ],
  },

  {
    id: "dhulqarnayn",
    name: "Dhul-Qarnayn",
    arabicName: "ذو القرنين",
    primaryCategory: "ruler_leader",
    personType: "title_based_person",
    shortDescription:
      "A righteous, divinely empowered ruler given the Qur'anic title 'Dhul-Qarnayn' ('the Two-Horned One'), whose journeys to the setting and rising points of the sun and building of a barrier against Gog and Magog are told as one complete account in Surah Al-Kahf.",
    detailedDescription:
      "Asked about by name, the Prophet ﷺ is told to relate his account (18:83). Established with power and means on earth (18:84), Dhul-Qarnayn journeys to where the sun sets among a people he is told to either punish or treat well (18:86), then to where it rises upon a people with no shelter from it (18:90), then to a place between two mountains where a people threatened by Gog and Magog ask for a barrier (18:93-94). He builds it from iron and molten copper, declines their offered payment, and attributes the achievement to his Lord's mercy, foretelling that it will eventually be leveled (18:95-98).",
    themes: ["Divinely granted power used justly", "Journeys to the ends of the earth", "Protecting the vulnerable", "Attributing success to Allah's mercy"],
    chronology: { status: "uncertain" },
    directMentions: [asRef(18, 83), asRef(18, 86), asRef(18, 94)],
    relatedPassages: [
      {
        id: "dhulqarnayn-kahf-narrative",
        surahNumber: 18, ayahStart: 83, ayahEnd: 98,
        title: "The Complete Account of Dhul-Qarnayn",
        description: "The full narrative: being asked about him, his journeys to the setting- and rising-places of the sun, his encounter with a people threatened by Gog and Magog, and his building of the barrier.",
        storyOrder: 1, source: "quran", verificationStatus: "verified",
      },
    ],
    keyLessons: [
      { text: "Given extraordinary means and power on earth, he uses it to protect a vulnerable people and explicitly declines their offered payment, rather than to exploit them.", quranReferences: [asRef(18, 94), asRef(18, 95)], status: "quran_derived" },
      { text: "The finished barrier's success is attributed explicitly to his Lord's mercy, not his own skill or resources, and he foretells its eventual end rather than claiming permanence.", quranReferences: [asRef(18, 98)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Kahf 18:83-98" }],
    statusNotes: [
      "Whether Dhul-Qarnayn was a prophet is not established in the Qur'an. The predominant scholarly view holds he was a righteous ruler granted extraordinary means, not a prophet, though the question has not been treated as fully settled by all scholars — that uncertainty is preserved here rather than resolved, which is also why personType is 'title_based_person' rather than 'prophet.'",
      "'Dhul-Qarnayn' ('the Two-Horned One') is the Qur'an's own title for him (18:83); the Qur'an does not give him a personal name. Historical and traditional scholarship has proposed identifying him with figures such as Cyrus the Great of Persia or Alexander the Great — these are disputed scholarly/historical identifications, not stated in the Qur'an text, and are not treated as settled fact here; no single identification is asserted.",
      "The places and peoples in his journeys are described in the Qur'an's own phenomenological language (where the sun 'appeared to set,' where it 'rose upon' a people) and are not mapped here onto any specific modern geography.",
    ],
  },

  {
    id: "uzair",
    name: "Uzair",
    arabicName: "عزير",
    alternateNames: ["Ezra"],
    primaryCategory: "other",
    secondaryCategories: ["man"],
    personType: "quranic_person",
    shortDescription:
      "A figure named once in the Qur'an in the context of a specific theological claim: that some Jews called him 'the son of Allah' — a claim the Qur'an firmly rejects, alongside the parallel Christian claim about Isa.",
    detailedDescription:
      "The Qur'an names Uzair exactly once, reporting and rejecting the claim that he was 'the son of Allah,' set directly alongside the equivalent Christian claim about al-Masih (9:30). No narrative, era, or role is given for him beyond this single theological statement. Uzair is traditionally identified with the Biblical Ezra; a minority of scholars have held he may have been a prophet, though this is not the majority position and is not itself a Qur'anic statement.",
    themes: ["Rejection of divine-sonship claims", "Tawhid"],
    chronology: { status: "unknown" },
    directMentions: [asRef(9, 30)],
    relatedPassages: [],
    keyLessons: [
      { text: "The Qur'an rejects the divine-sonship claim attached to him with the same firmness applied to the parallel claim about Isa — a consistent principle of Tawhid, not directed at one group alone.", quranReferences: [asRef(9, 30)], status: "quran_derived" },
    ],
    sources: [
      { type: "quran", citation: "At-Tawbah 9:30" },
      { type: "traditional_account", citation: "Later tafsir generally identifies him with the Biblical Ezra; a minority opinion holds he was a prophet.", note: "Neither the identification nor the prophetic-status claim is stated in the Qur'an text." },
    ],
    statusNotes: [
      "The Qur'an does not call Uzair a prophet, and this entry does not present him as one. The majority scholarly position holds he was not a prophet; a minority opinion has argued he may have been — that is a labeled scholarly discussion, not a Qur'anic statement.",
      "The Qur'an gives no biography, era, or narrative for Uzair beyond the single statement at 9:30. His identification with the Biblical Ezra and any biographical detail beyond 9:30 are extra-Qur'anic.",
    ],
  },
];

export const getPersonById = (id: string): QuranPerson | undefined =>
  QURAN_PERSONS.find((p) => p.id === id);
