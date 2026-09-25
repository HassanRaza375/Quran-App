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
    relatedTopicIds: ["taqlid", "haydistihadanifas"],
    glossaryIds: ["bulugh", "baligh", "mukallaf", "mumayyiz"],
    lastSourceCheck: "2026-09-25",
  },

  // ---------------------------- Taharat (Phase 2) ----------------------------
  // Qur'anic basis (decision R2): an ayah is linked only where its own text names
  // the act — 5:6 (washing the face and arms, wiping the head and feet; "if you are
  // junub, purify yourselves"; tayammum) and 4:43 ("until you bathe"; tayammum).
  // Checked against the app's Qur'an text (quranapi.pages.dev) on 2026-09-25.
  {
    id: "water",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Water and its types", ur: "پانی کے احکام" },
    arabicTerm: "المياه",
    summary: explain(
      "Water is either unmixed (muṭlaq), which can purify and be used for wuḍūʾ and ghusl, or mixed (muḍāf), which cannot. Unmixed water is further divided by quantity and source (kurr, qalīl, flowing, rain and well water), which decides whether it becomes impure on contact with an impurity."
    ),
    rulingIds: ["watertypes", "kurrdefinition", "kurrimpurity", "kurrdoubt", "qalilwater", "flowingwater", "tapwater", "rainwater", "mixedwateruse", "waterchangedbyimpurity", "waterpuritydoubt"],
    relatedTopicIds: ["najasat", "mutahhirat", "wudu"],
    glossaryIds: ["kurr", "qalil", "mutlaq", "mudaf"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "najasat",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Impurities (najāsāt)", ur: "نجاسات" },
    arabicTerm: "النجاسات",
    summary: explain(
      "Certain things are intrinsically impure (najis). This topic covers what they are, how impurity is established, and how it transfers from one thing to another."
    ),
    rulingIds: ["tennajasat", "urinefaeces", "birddroppings", "semen", "corpse", "deadskin", "importedleather", "blood", "dogpig", "wineintoxicants", "alcohol", "establishingimpurity", "purityimpuritydoubt", "impuritytransfer", "wetnessdoubt", "quranimpure", "eatingimpure", "personsnotbelieving", "personsghulat", "personsrejecting", "personsahlalkitab", "personsnonkitabi", "personschild", "personsunknown", "personsabusingimams"],
    relatedTopicIds: ["mutahhirat", "water"],
    glossaryIds: ["najis", "tahir"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "mutahhirat",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Purifiers (muṭahhirāt)", ur: "مطہرات" },
    arabicTerm: "المطهرات",
    summary: explain(
      "The things that make an impure object pure again: water, earth, the sun, transformation and others. This topic covers the most common ones and how to wash impure things and utensils."
    ),
    rulingIds: ["twelvemutahhirat", "waterconditions", "utensilwashing", "immersionkurr", "urinequalilwater", "otherimpurityqalil", "intrinsicremoval", "washingmachine", "earthpurifies", "asphalt", "sunpurifies", "istihala", "islampurifies", "purityestablished", "goldsilverutensils"],
    relatedTopicIds: ["najasat", "water"],
    glossaryIds: ["najis", "tahir", "kurr", "qalil"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "istinja",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "The toilet and istinjāʾ", ur: "بیت الخلاء کے احکام" },
    arabicTerm: "أحكام التخلي",
    summary: explain(
      "What is obligatory and what is recommended when using the toilet: covering, facing the qibla, purifying the urinary outlet and the anus, and istibrāʾ."
    ),
    rulingIds: ["coveringprivateparts", "toiletqibla", "toiletprohibitedplaces", "anuswateronly", "urinaryoutlet", "anuswithwater", "anuswithstone", "anusthreetimes", "istinjadoubt", "istibra", "dischargesmadhi", "istibradoubt", "istibrawomen"],
    relatedTopicIds: ["najasat", "wudu"],
    glossaryIds: ["istibra"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "wudu",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Wuḍūʾ (ablution)", ur: "وضو" },
    arabicTerm: "الوضوء",
    summary: explain(
      "Wuḍūʾ is washing the face and arms and wiping the head and feet, in order and without a break. This topic covers how it is done, its conditions, what invalidates it, and doubts about it."
    ),
    quranicBasis: [{ surahNumber: 5, ayahNumber: 6 }],
    // Decision P9: the app's default translation renders 5:6 as "wash your feet". The clause
    // below was checked verbatim in two independent online copies of al-Mīzān (2026-09-25).
    quranicBasisNotes: [
      {
        surahNumber: 5,
        ayahNumber: 6,
        note: explain(
          "Ja'fari fiqh reads this ayah as wiping (masḥ) the feet, not washing them: Ṭabāṭabāʾī concludes in al-Mīzān that the ayah conveys the obligation of washing the face and hands, and wiping the head and feet."
        ),
        quote: { text: "وفهمت من الكلام وجوب غسل الوجه واليدين، ومسح الرأس والرجلين", lang: "ar" },
        source: {
          title: "al-Mīzān fī Tafsīr al-Qurʾān (Ṭabāṭabāʾī)",
          reference: "vol. 5, pp. 187–199, commentary on 5:6",
          urls: [
            "https://almerja.com/reading.php?idm=73433",
            "https://www.greattafsirs.com/Tafsir_Library.aspx?QuranAyat_Home=1&MadhabNo=4&TafsirNo=56&SoraNo=5&AyahNo=6&LanguageID=1",
          ],
        },
      },
    ],
    rulingIds: ["wuduobligatoryacts", "wuduface", "wududirection", "wuduarms", "wuduwashingcount", "wuduhead", "wuduheadarea", "wudufeet", "wudusocks", "wuduimmersive", "wuduwaterimpure", "wuduusurpedwater", "wuduintention", "wudusequence", "wudusuccession", "wuduobstruction", "wududoubtvoid", "wududoubtperformed", "wududoubtafterprayer", "wuduwhenwajib", "touchingquran", "wuduinvalidators", "jabirauncovered", "jabiracovered"],
    procedureIds: ["wudusistani"],
    relatedTopicIds: ["ghusl", "tayammum", "istinja"],
    glossaryIds: ["wudu", "jabirah", "tartib", "muwalah"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "ghusl",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Ghusl (ritual bath)", ur: "غسل" },
    arabicTerm: "الغسل",
    summary: explain(
      "Ghusl is washing the whole body with the intention of ghusl, either in sequence (head and neck first, then the body) or by immersion. This topic covers janābah, the ghusl for janābah and its conditions, and the ghusl for touching a corpse."
    ),
    quranicBasis: [
      { surahNumber: 5, ayahNumber: 6 },
      { surahNumber: 4, ayahNumber: 43 },
    ],
    rulingIds: ["becomingjunub", "semensigns", "womenjanabah", "junubunlawful", "ghusljanabahobligatory", "ghusltypes", "ghusltartibi", "ghuslirtimasi", "ghuslgradual", "ghuslwholebody", "ghuslobstruction", "ghuslhair", "ghusldoubt", "ghusleventduring", "ghuslseveral", "ghuslreplaceswudu", "ghuslmassmayyit"],
    procedureIds: ["ghusltartibisistani", "ghuslirtimasisistani"],
    relatedTopicIds: ["wudu", "haydistihadanifas", "tayammum"],
    glossaryIds: ["ghusl", "junub", "janabah"],
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "haydistihadanifas",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Ḥayḍ, istiḥāḍah and nifās", ur: "حیض، استحاضہ اور نفاس" },
    arabicTerm: "الحيض والاستحاضة والنفاس",
    summary: explain(
      "Rulings on menstruation (ḥayḍ), irregular bleeding (istiḥāḍah) and post-natal bleeding (nifās): how each is recognised, and what it means for prayer, fasting and ghusl. The rulings are shown in full, inside a collapsed section."
    ),
    rulingIds: ["istihadablood", "istihadatypes", "istihadaslight", "istihadamedium", "istihadaexcessive", "haydblood", "haydduration", "haydunlawful", "haydghusl", "haydprayers", "haydfast", "haydpostponing", "haydpregnancy", "haydcategories", "haydspotting", "haydcontraceptive", "nifasdefinition", "nifasduration", "nifasrulings", "menopause"],
    relatedTopicIds: ["ghusl", "bulugh"],
    glossaryIds: ["hayd", "istihadah", "nifas"],
    sensitive: true,
    lastSourceCheck: "2026-09-25",
  },
  {
    id: "tayammum",
    fiqh: "jafari",
    categoryId: "taharat",
    title: { en: "Tayammum (dry ablution)", ur: "تیمم" },
    arabicTerm: "التيمم",
    summary: explain(
      "Tayammum replaces wuḍūʾ or ghusl when water cannot be used: when there is none, when using it is harmful, or when time is too short. This topic covers when it is allowed, what it may be performed on, how it is done, and what invalidates it."
    ),
    quranicBasis: [
      { surahNumber: 5, ayahNumber: 6 },
      { surahNumber: 4, ayahNumber: 43 },
    ],
    rulingIds: ["tayammumnoaccess", "tayammumharm", "tayammumhardship", "tayammumshorttime", "tayammumsurfaces", "tayammumgypsum", "tayammumpure", "tayammumobligatory", "tayammumcomplete", "tayammumdirection", "tayammumexcuseends", "tayammuminvalidators", "tayammuminsteadofghusl", "tayammumneither"],
    procedureIds: ["tayammumsistani", "tayammumkhamenei"],
    relatedTopicIds: ["wudu", "ghusl"],
    glossaryIds: ["tayammum"],
    lastSourceCheck: "2026-09-25",
  },
];
