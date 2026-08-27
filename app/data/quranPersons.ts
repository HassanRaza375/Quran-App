// Prophets & Qur'anic Persons — dataset types + seed data.
// See prophets-quran-feature.md for the full product spec this implements
// (Phase 1 + Phase 2 scope only — no Family Tree / bookmark-person / resume
// state / Timeline yet, see MODULE_BLUEPRINT.md Module 17).
//
// This is a SMALL, CURATED SEED DATASET, not a claim of completeness. Every
// `directMentions` entry below was cross-checked against this app's own
// live Quran search API (alquran.cloud, Arabic `quran-simple` edition) at
// authoring time, but each person's list is a representative subset, not
// an exhaustive list of every occurrence of their name. Extend it — don't
// treat card mention-counts as the true total occurrence count in the Quran.

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
      asRef(3, 33), asRef(3, 59), asRef(7, 11), asRef(7, 19), asRef(7, 26),
      asRef(20, 115), asRef(20, 116), asRef(20, 117), asRef(20, 120), asRef(20, 121),
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
      {
        text: "Sincere repentance restores nearness to Allah, even after a serious mistake.",
        quranReferences: [asRef(2, 37)],
        status: "quran_derived",
      },
      {
        text: "Arrogance in the face of a divine command is the root of Iblis's fall, in contrast to Adam's humility.",
        quranReferences: [asRef(2, 34), asRef(7, 12)],
        status: "quran_derived",
      },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:30-39; Al-A'raf 7:11-25; Ta-Ha 20:115-123" }],
    statusNotes: [
      "The Qur'an does not attach the word 'nabi' (prophet) directly next to Adam's name; his status as the first prophet is the standard position of Islamic tradition/hadith rather than an explicit Qur'anic label.",
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
    chronology: { label: "Early prophetic period", order: 2, status: "traditional" },
    directMentions: [
      asRef(7, 59), asRef(7, 69), asRef(10, 71), asRef(11, 25), asRef(11, 32),
      asRef(11, 36), asRef(11, 42), asRef(11, 45), asRef(11, 46), asRef(11, 48),
      asRef(23, 23), asRef(26, 105), asRef(26, 106), asRef(71, 1), asRef(71, 21),
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
    chronology: { label: "Early-to-middle prophetic period", order: 3, status: "traditional" },
    directMentions: [
      asRef(2, 124), asRef(2, 125), asRef(2, 126), asRef(2, 127), asRef(2, 130),
      asRef(2, 133), asRef(2, 135), asRef(2, 136), asRef(3, 33), asRef(3, 65),
      asRef(3, 67), asRef(3, 68), asRef(6, 74), asRef(6, 75), asRef(6, 161),
      asRef(21, 51), asRef(21, 60), asRef(21, 62), asRef(21, 69),
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
    ],
    keyLessons: [
      { text: "Willingness to stand alone against inherited falsehood, even from one's own father.", quranReferences: [asRef(19, 42), asRef(19, 46)], status: "quran_derived" },
      { text: "Complete submission to Allah's command, even in the hardest trial.", quranReferences: [asRef(37, 102), asRef(37, 103)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Baqarah 2:124-141; Al-Anbiya 21:51-73; As-Saffat 37:83-113" }],
    statusNotes: [
      "Isma'il and Ishaq are named in this seed dataset for relationship purposes but are not yet given their own full entries.",
    ],
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
    chronology: { label: "Descendant of Ibrahim, generations before Musa", order: 4, status: "traditional" },
    directMentions: [
      asRef(6, 84), asRef(12, 4), asRef(12, 7), asRef(12, 8), asRef(12, 9),
      asRef(12, 21), asRef(12, 29), asRef(12, 46), asRef(12, 51), asRef(12, 58),
      asRef(12, 69), asRef(12, 90), asRef(12, 99), asRef(40, 34),
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
    chronology: { label: "Generations after Yusuf, in Egypt", order: 5, status: "traditional" },
    directMentions: [
      asRef(2, 51), asRef(2, 53), asRef(7, 103), asRef(7, 142), asRef(20, 9),
      asRef(20, 11), asRef(20, 17), asRef(20, 36), asRef(20, 40), asRef(20, 83),
      asRef(26, 10), asRef(28, 3), asRef(28, 7), asRef(28, 29), asRef(28, 30),
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
    ],
    keyLessons: [
      { text: "Allah's help can arrive at the point of complete apparent hopelessness ('Indeed, with me is my Lord; He will guide me').", quranReferences: [asRef(26, 62)], status: "quran_derived" },
      { text: "A prophet is explicitly described as both messenger and prophet, showing these are related but distinguishable ranks.", quranReferences: [asRef(19, 51)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Al-Qasas 28:3-43; Ta-Ha 20:9-98; Ash-Shu'ara 26:10-68" }],
    statusNotes: ["Harun is named here for the sibling relationship but does not yet have his own full entry."],
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
    chronology: { label: "Descendant of Ibrahim, before Muhammad ﷺ", order: 6, status: "traditional" },
    directMentions: [
      asRef(2, 87), asRef(2, 136), asRef(2, 253), asRef(3, 45), asRef(3, 52),
      asRef(3, 55), asRef(3, 59), asRef(4, 157), asRef(4, 163), asRef(4, 171),
      asRef(5, 46), asRef(5, 110), asRef(5, 112), asRef(19, 34), asRef(61, 6),
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
      { personId: "adam", relationshipType: "ancestor", sourceType: "quran", verificationStatus: "verified" },
    ],
    keyLessons: [
      { text: "Every miracle performed is explicitly attributed to Allah's permission, not to Isa's own power.", quranReferences: [asRef(3, 49), asRef(5, 110)], status: "quran_derived" },
      { text: "Isa himself, per the Qur'an, disavows any claim that he asked to be worshipped.", quranReferences: [asRef(5, 116), asRef(5, 117)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Aal-i-Imran 3:33-51; Maryam 19:16-34; Al-Ma'idah 5:110-120" }],
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
    chronology: { label: "Final prophet, 6th-7th century CE", order: 7, status: "strong" },
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
    keyLessons: [
      { text: "He is described as the seal of the prophets — the finality of his prophethood is stated explicitly.", quranReferences: [asRef(33, 40)], status: "quran_derived" },
      { text: "His character is held up as a model ('an excellent pattern') rather than only his teaching.", quranReferences: [asRef(33, 21)], status: "quran_derived" },
    ],
    sources: [{ type: "quran", citation: "Aal-i-Imran 3:144; Al-Ahzab 33:40; Muhammad 47:2; Al-Fath 48:29" }],
    statusNotes: [
      "This seed entry intentionally stays close to the four ayahs that name him directly; his fuller biography (seerah) draws heavily on hadith and traditional accounts not included in this V1 dataset.",
    ],
  },

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
      asRef(3, 36), asRef(3, 37), asRef(3, 42), asRef(3, 43), asRef(3, 44),
      asRef(3, 45), asRef(4, 156), asRef(4, 157), asRef(19, 16), asRef(19, 27),
      asRef(19, 34), asRef(23, 50), asRef(66, 12),
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
];

export const getPersonById = (id: string): QuranPerson | undefined =>
  QURAN_PERSONS.find((p) => p.id === id);
