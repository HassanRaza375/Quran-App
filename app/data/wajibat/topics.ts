// Wajibat topics. Every `summary`/`explanations` entry is app-written
// explanation (kind: "explanation"). It orients the reader and is never shown
// as a ruling. The rulings themselves live in ./rulings/*.ts, each quoted
// from a marja's own book.
import type { WajibatTopic } from "./types";

const explain = (en: string) => ({ kind: "explanation" as const, text: { en } });

export const WAJIBAT_TOPICS: WajibatTopic[] = [
  {
    id: "taqlid",
    fiqh: "jafari",
    categoryId: "foundations",
    title: { en: "Taqlid — following a marja'", ur: "تقلید" },
    arabicTerm: "التقليد",
    summary: explain(
      "Someone who is not a mujtahid, and who cannot act on precaution, follows the rulings of a qualified mujtahid (their marja'). This topic covers who may be followed, how their rulings are learned, what \"obligatory\" and \"recommended\" precaution mean, and what happens when a marja' passes away."
    ),
    rulingIds: [
      "taqlidoptions",
      "mujtahidconditions",
      "meaningofadil",
      "followingthealam",
      "identifyingmujtahid",
      "obtainingfatwa",
      "ihtiyatwajib",
      "ihtiyatmustahab",
      "deceasedmujtahid",
      "learningrulings",
      "actionswithouttaqlid",
    ],
    relatedTopicIds: ["ahkam", "usuldin"],
    glossaryIds: ["taqlid", "mujtahid", "marja", "muqallid", "mukallaf", "adil", "alam", "ihtiyat", "ihtiyatlazim", "ihtiyatmustahab"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "ahkam",
    fiqh: "jafari",
    categoryId: "foundations",
    title: { en: "The five categories of rulings", ur: "احکام خمسہ" },
    arabicTerm: "الأحكام الخمسة",
    summary: explain(
      "Every act a duty-bound person does falls under one of five rulings. Throughout this module each ruling carries a badge for its category, and for its strength when the marja' states it as a precaution."
    ),
    explanations: [
      {
        heading: { en: "The five rulings" },
        body: explain(
          "Wājib (obligatory): must be done; leaving it is a sin.\nḤarām (unlawful): must be avoided; doing it is a sin.\nMustaḥabb (recommended): rewarded if done, no sin if left.\nMakrūh (disapproved): better avoided, no sin if done.\nMubāḥ (permissible): neither encouraged nor discouraged."
        ),
      },
      {
        heading: { en: "Fatwa and precaution" },
        body: explain(
          "A marja' may state a ruling as a definite fatwa, as an obligatory precaution (iḥtiyāṭ wājib, on which a follower may instead act on the fatwa of the next most learned mujtahid), or as a recommended precaution (iḥtiyāṭ mustaḥabb, which a follower does not have to act on). The marja's own wording of these rules is under Taqlid."
        ),
      },
    ],
    rulingIds: ["mustahabbatrajaan"],
    relatedTopicIds: ["taqlid"],
    glossaryIds: ["wajib", "haram", "mustahab", "makruh", "mubah", "ihtiyatlazim", "ihtiyatmustahab"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "usuldin",
    fiqh: "jafari",
    categoryId: "foundations",
    title: { en: "Fundamentals of religion (overview)", ur: "اصول دین" },
    arabicTerm: "أصول الدين",
    summary: explain(
      "The fundamentals of religion are matters of belief. Unlike the practical laws, they are held through one's own conviction, not by following a marja'. This page is a brief overview only."
    ),
    explanations: [
      {
        heading: { en: "The five fundamentals" },
        body: explain(
          "Tawḥīd: the oneness of Allah.\nʿAdl: divine justice.\nNubuwwah: prophethood.\nImāmah: the imamate.\nQiyāmah: the Day of Resurrection."
        ),
      },
    ],
    rulingIds: ["usulnottaqlid"],
    relatedTopicIds: ["taqlid", "furuaddin"],
    glossaryIds: ["usuldin"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "furuaddin",
    fiqh: "jafari",
    categoryId: "foundations",
    title: { en: "Branches of religion (overview)", ur: "فروع دین" },
    arabicTerm: "فروع الدين",
    summary: explain(
      "The branches of religion are the practical obligations. Each one has its own section in this module; the sections are filled in phase by phase."
    ),
    explanations: [
      {
        heading: { en: "The ten branches" },
        body: explain(
          "Ṣalāh (prayer)\nṢawm (fasting)\nḤajj (pilgrimage)\nZakāt\nKhums\nJihād\nAmr bil-maʿrūf (enjoining good)\nNahy ʿan al-munkar (forbidding evil)\nTawallā (loving the friends of Allah)\nTabarrā (dissociating from the enemies of Allah)"
        ),
      },
    ],
    rulingIds: [],
    relatedTopicIds: ["usuldin", "taqlid"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "bulugh",
    fiqh: "jafari",
    categoryId: "foundations",
    title: { en: "Age of legal responsibility (bulugh)", ur: "بلوغ" },
    arabicTerm: "البلوغ",
    summary: explain(
      "Religious obligations begin at bulugh, the age of legal responsibility. This topic covers its signs for girls and boys and how the age is counted."
    ),
    rulingIds: ["bulughsigns", "bulughlunaryears", "bulughfacialhair", "bleedingbeforenine"],
    relatedTopicIds: ["taqlid"],
    glossaryIds: ["bulugh", "baligh", "mukallaf", "mumayyiz"],
    lastSourceCheck: "2026-09-25",
  },
];
