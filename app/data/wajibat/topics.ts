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
    rulingIds: ["wuduobligatoryacts", "wuduface", "wududirection", "wuduarms", "wuduwashingcount", "wuduhead", "wuduheadarea", "wudufeet", "wudusocks", "wuduimmersive", "wuduwaterimpure", "wuduusurpedwater", "wuduintention", "wudusequence", "wudusuccession", "wuduobstruction", "wududoubtvoid", "wududoubtperformed", "wududoubtafterprayer", "wududoubtduring", "wuduorderunknown", "wuduvoidtime", "wuduunaware", "wuduexcessive", "wuduwhenwajib", "touchingquran", "wuduinvalidators", "jabirauncovered", "jabiracovered"],
    procedureIds: ["wudusistani"],
    decisionTreeIds: ["sistaniwudu", "khameneiwudu"],
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

  // ---------------------------- Salat (Phase 3) ----------------------------
  {
    id: "dailyprayers",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "The obligatory prayers", ur: "واجب نمازیں" },
    arabicTerm: "الصلوات الواجبة",
    summary: explain(
      "Which prayers are obligatory, and the five daily prayers with the number of rakʿahs in each."
    ),
    rulingIds: ["obligatoryprayers", "dailyrakat", "importanceofprayer", "khqa337"],
    relatedTopicIds: ["prayertimes", "guidedprayers"],
    glossaryIds: ["rakah", "nafilah"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "prayertimes",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Prayer times", ur: "اوقات نماز" },
    arabicTerm: "مواقيت الصلاة",
    summary: explain(
      "When each daily prayer may be performed, the shared and specific times of ẓuhr/ʿaṣr and maghrib/ʿishāʾ, and the order between them. Today's times are shown live from the app's Prayer Times feature; nothing is recalculated here."
    ),
    liveTool: "prayertimes",
    rulingIds: ["zuhrasrtime", "khqa361", "maghribishatime", "fajrtime", "khqa350", "missedbymidnight", "certaintyoftime", "khqa358", "onerakahintime", "khqa348", "prayingearly", "orderzuhrasr", "khqa360"],
    relatedTopicIds: ["dailyprayers", "qibla"],
    glossaryIds: ["zawal", "ada", "qada"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "qibla",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Qibla", ur: "قبلہ" },
    arabicTerm: "القبلة",
    summary: explain(
      "Facing the Kaʿbah in prayer and what to do when its direction is uncertain. The app's Qibla tool shows the direction from your location."
    ),
    liveTool: "qibla",
    rulingIds: ["qibladirection", "qiblaeffort", "qiblaeffortqa", "qiblanomeans", "khqa364", "qiblanomeansqa", "qiblarecommended"],
    relatedTopicIds: ["prayertimes", "placeofprayer"],
    glossaryIds: ["qibla"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "clothing",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Covering and clothing in prayer", ur: "نماز گزار کا لباس" },
    arabicTerm: "لباس المصلي",
    summary: explain(
      "What men and women must cover in prayer, and the conditions of the clothing: pure, not usurped, not from a non-slaughtered or ḥarām-meat animal, and no gold or pure silk for men."
    ),
    rulingIds: ["coveringmen", "coveringwomen", "khqa435", "coveringintentional", "clothingconditions", "clothingpure", "impureunaware", "khqa428", "impurityexemptions", "woundblood", "usurpedclothing", "nonslaughtered", "haramanimal", "khqa439", "goldmen", "goldjewellerymen", "khqa440", "khqa443", "silkmen", "silkwomen", "khqa429"],
    relatedTopicIds: ["placeofprayer", "najasat"],
    glossaryIds: ["najis", "tahir"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "placeofprayer",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "The place of prayer", ur: "نماز کی جگہ" },
    arabicTerm: "مكان المصلي",
    summary: explain(
      "Conditions of the place where one prays: permitted to use, still, and the rules on mosques."
    ),
    rulingIds: ["usurpedplace", "khqa382", "stillplace", "vehicleprayer", "khqa386", "khqa723", "aheadofgrave", "menwomengap", "khqa372", "insidekaba", "mosquevirtue", "khqa384", "mosqueimpure"],
    relatedTopicIds: ["clothing", "sajdahplace"],
    glossaryIds: [],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "adhaniqamah",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Adhān and iqāmah", ur: "اذان و اقامت" },
    arabicTerm: "الأذان والإقامة",
    summary: explain(
      "The call to prayer and the call to stand for prayer: their status, wording and conditions."
    ),
    rulingIds: ["adhanrecommended", "adhanwording", "shahadathalithah", "khqa454", "adhancongregation", "adhanafter", "iqamahstanding"],
    relatedTopicIds: ["obligatoryparts"],
    glossaryIds: ["adhan", "iqamah"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "obligatoryparts",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "The obligatory parts of prayer", ur: "واجبات نماز" },
    arabicTerm: "واجبات الصلاة",
    summary: explain(
      "The eleven obligatory parts of the prayer, which of them are elemental (rukn), and the rulings on intention, takbīrat al-iḥrām and standing."
    ),
    rulingIds: ["elevencomponents", "rukns", "intention", "intentionspecified", "riya", "takbir", "takbirstill", "qiyam", "qiyamstill", "unabletostand", "khqa455"],
    relatedTopicIds: ["qiraah", "rukusujud", "tashahhudsalam", "guidedprayers"],
    glossaryIds: ["rukn", "niyyah", "takbiratalihram"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "qiraah",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Recitation in prayer", ur: "قرأت" },
    arabicTerm: "القراءة",
    summary: explain(
      "Reciting al-Ḥamd and another surah, reciting aloud or quietly, and what is recited in the third and fourth rakʿahs."
    ),
    rulingIds: ["fatihasurah", "khqa473", "shorttimesurah", "forgotrecitation", "sajdahsurahs", "ikhlaskafirun", "aloudmen", "khqa456", "aloudsubhmaghrib", "aloudwomen", "khqa469", "aloudmistake", "correctrecitation", "khqa465", "thirdfourthrakah", "khqa481", "thirdfourthquiet"],
    relatedTopicIds: ["obligatoryparts", "rukusujud"],
    glossaryIds: ["qiraah", "jahr", "ikhfat"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "rukusujud",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Rukūʿ and sajdah", ur: "رکوع و سجدہ" },
    arabicTerm: "الركوع والسجود",
    summary: explain(
      "Bowing and prostrating: how they are done, their dhikr, stillness, and what happens if one is forgotten."
    ),
    rulingIds: ["ruku", "rukudhikr", "rukusajdahdhikrqa", "rukustill", "afterruku", "forgotruku", "twosajdahs", "sevenparts", "sajdahrukn", "sajdahdhikr", "dhikrwording", "betweensajdahs", "sajdahheight", "sajdahbarrier", "khqa489", "turbahpure"],
    relatedTopicIds: ["sajdahplace", "obligatoryparts"],
    glossaryIds: ["ruku", "sajdah", "rukn"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "sajdahplace",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "What sajdah may be performed on", ur: "سجدہ کی جگہ" },
    arabicTerm: "ما يصح السجود عليه",
    summary: explain(
      "Earth and what grows from it that is neither eaten nor worn, and the obligatory sajdahs of the Qur'an."
    ),
    rulingIds: ["sajdahearth", "khqa493", "sajdahfodder", "sajdahbuilding", "khqa487", "sajdahpaper", "sajdahbest", "sajdahnothing", "sajdahtaqiyyah", "sajdahforother", "quransajdah", "khqa498"],
    relatedTopicIds: ["rukusujud", "placeofprayer"],
    glossaryIds: ["turbah", "sajdah"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "tashahhudsalam",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Tashahhud, salām, order and qunūt", ur: "تشہد، سلام اور قنوت" },
    arabicTerm: "التشهد والسلام والقنوت",
    summary: explain(
      "Tashahhud and salām, keeping the parts of the prayer in sequence and in close succession, qunūt, and the supplications after prayer."
    ),
    rulingIds: ["tashahhud", "tashahhudforgot", "salam", "salamforgot", "tartib", "muwalat", "qunut", "qunutdhikr", "taqibat"],
    relatedTopicIds: ["obligatoryparts", "guidedprayers"],
    glossaryIds: ["tashahhud", "salam", "qunut", "tartib", "muwalah", "taqibat"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "mubtilat",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Things that invalidate the prayer", ur: "مبطلات نماز" },
    arabicTerm: "مبطلات الصلاة",
    summary: explain(
      "What breaks the prayer, replying to a greeting during prayer, and when a prayer may or must be broken."
    ),
    rulingIds: ["mubtilatlist", "turningface", "speaking", "replyingsalam", "khqa510", "laughing", "khqa503", "eatingdrinking", "amin", "khqa501", "breakingprayer", "breakingnecessity"],
    relatedTopicIds: ["obligatoryparts"],
    glossaryIds: ["mubtilat"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "doubts",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Doubts in prayer", ur: "شکیات نماز" },
    arabicTerm: "الشكوك في الصلاة",
    summary: explain(
      "Doubting whether you prayed, whether you did a part of the prayer, or how many rakʿahs you have prayed: which doubts invalidate the prayer, which are dismissed, and which are valid and how to act on them."
    ),
    rulingIds: ["doubtkinds", "doubtprayeritself", "doubtsinvalidating", "doubtinvalidthink", "doubtrakahhow", "doubtsvalid", "doubtsupposition", "doubtsuppositionchange", "doubtsuppositionunsure", "doubtvaliddontbreak", "doubtvalidrestart", "doubtknowsnextstage", "doubtafterprayerunsure", "doubtsajdahandrakah", "doubtbeforetashahhud", "doubtforgotsajdahstanding", "doubtchanges", "doubtafterprayertwo", "doubtafterprayerkind", "doubtsdismissedlist", "doubtpartgeneral", "khqa514", "doubttakbir", "doubtfatiha", "doubtsurah", "doubtverse", "doubtcorrectness", "doubtruku", "doubtrukn", "doubtrising", "doubtsittingprayer", "doubtrepeated", "doubtremembermissing", "doubtsalam", "doubtaftersalam", "khqa517", "doubtaftersalaminvalid", "doubtaftertime", "doubtzuhrasr", "doubtmaghribisha", "excessivedoubter", "excessiveact", "khqa516", "excessivepart", "excessiveprayer", "excessiveplace", "excessiveunsure", "excessiverukn", "excessivenonrukn", "doubtimam", "doubtmustahabnumber", "doubtmustahabrukn", "doubtmustahabpart", "khqa515", "doubtmustahabsupposition", "doubtmustahabsahw", "doubtmustahabprayed", "doubtotherprayers"],
    decisionTreeIds: ["sistanidoubts", "khameneidoubts"],
    relatedTopicIds: ["ihtiyatprayer", "sahwforgotten", "mubtilat"],
    glossaryIds: ["shakk", "shakkiyyat", "zann", "kathiralshakk", "rakah", "rukn"],
    lastSourceCheck: "2026-10-07",
  },
  {
    id: "ihtiyatprayer",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "The precautionary prayer (ṣalāt al-iḥtiyāṭ)", ur: "نماز احتیاط" },
    arabicTerm: "صلاة الاحتياط",
    summary: explain(
      "The prayer some valid doubts about the number of rakʿahs call for after the salām: how it is performed, and what to do if you find out more before, during or after it."
    ),
    rulingIds: ["ihtiyatmethod", "ihtiyatrecitation", "ihtiyatnotneeded", "ihtiyatfewer", "ihtiyatsame", "ihtiyatless", "ihtiyatmore", "ihtiyattwothreefour", "ihtiyatremembersduring", "ihtiyatremembersthree", "ihtiyatdifferentshortfall", "ihtiyatdoubtperformed", "ihtiyatadded", "ihtiyatdoubtpart", "ihtiyatdoubtnumber", "ihtiyatnosahw", "ihtiyatdoubtaftersalam", "ihtiyatforgot", "ihtiyatorder", "ihtiyatsitting", "ihtiyatcannotstand", "ihtiyatcanstand", "khqa520"],
    relatedTopicIds: ["doubts", "sahwforgotten"],
    glossaryIds: ["salatalihtiyat", "shakk", "rakah"],
    lastSourceCheck: "2026-10-07",
  },
  {
    id: "sahwforgotten",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Sajdat al-sahw and forgotten parts", ur: "سجدۂ سہو اور بھولے ہوئے اجزاء" },
    arabicTerm: "سجدتا السهو",
    summary: explain(
      "The two prostrations for inadvertence and when they are due, making up a forgotten sajdah or tashahhud, and leaving out or adding parts of the prayer."
    ),
    rulingIds: ["sahwcases", "sahwtalking", "sahwsounds", "sahwrecitedagain", "khqa521", "sahwonemistake", "sahwtasbihat", "sahwsalampart", "sahwsalamall", "forgotbeforeruku", "forgotafterruku", "khqa519", "forgotsajdahqada", "forgottashahhudqada", "forgotnonrukn", "khqa518", "sahwintentional", "sahwdoubtobligatory", "sahwdoubttwofour", "sahwonemissed", "sahwmethod", "qadaconditions", "qadanosalam", "qadaseveral", "qadasajdahtashahhud", "qadasajdahorder", "qadainvalidator", "qadalastrakah", "qadasahwbetween", "qadasajdahortashahhud", "qadadoubtforgot", "qadadoubtremembered", "qadasahwboth", "qadadoubtdone", "omitintentional", "omitignorance", "omitwudu", "omittwosajdahs", "omitlastsajdahs", "omitrakahbefore", "omitrakahafter", "omitsajdahsafter", "omittimeqibla"],
    relatedTopicIds: ["doubts", "ihtiyatprayer", "obligatoryparts"],
    glossaryIds: ["sajdatalsahw", "sajdah", "tashahhud", "rukn"],
    lastSourceCheck: "2026-10-07",
  },
  {
    id: "travellerprayer",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "The traveller's prayer", ur: "نماز مسافر" },
    arabicTerm: "صلاة المسافر",
    summary: explain(
      "When a traveller shortens the four-rakʿah prayers to two (qaṣr): the distance, intention, purpose of the journey, the permitted limit, and what ends the journey."
    ),
    rulingIds: ["qasrintro", "khqa637", "qasrconditions", "khqa638", "qasrdistance", "qasrkm", "qasrdistancestart", "qasrintention", "qasrsinful", "qasrleisure", "qasrjob", "khqa641", "qasrlimit", "khqa674", "qasrwatan", "qasrtendays", "qasrthirtydays", "khqa671", "qasrfourplaces", "qasrignorance"],
    relatedTopicIds: ["qadaprayers"],
    glossaryIds: ["qasr", "tamam", "watan"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "qadaprayers",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Qaḍāʾ (missed) prayers", ur: "قضا نمازیں" },
    arabicTerm: "قضاء الصلاة",
    summary: explain(
      "Making up missed prayers, their order, and the eldest son's duty for his parents' missed prayers."
    ),
    rulingIds: ["qadaobligation", "qadanotdelay", "qadaorder", "khqa531", "qadaunknownnumber", "khqa536", "qadanafilah", "qadaliving", "eldestson", "khqa540", "eldestsonwho"],
    relatedTopicIds: ["travellerprayer", "dailyprayers"],
    glossaryIds: ["qada", "ada"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "jamaah",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Congregational prayer", ur: "نماز جماعت" },
    arabicTerm: "صلاة الجماعة",
    summary: explain(
      "The basics of praying in congregation: which prayers, the conditions of the imam, what the follower recites, and joining late."
    ),
    rulingIds: ["jamaahvirtue", "jamaahneglect", "khqa607", "jamaahwhichprayers", "imamconditions", "followerrecites", "khqa577", "followerquietprayers", "khqa563", "takbirbeforeimam", "joiningruku", "followerahead", "khqa574", "womenimam", "khqa594"],
    relatedTopicIds: ["otherprayers"],
    glossaryIds: ["jamaah", "mamum", "furada"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "otherprayers",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Other obligatory prayers", ur: "دیگر واجب نمازیں" },
    arabicTerm: "الصلوات الواجبة الأخرى",
    summary: explain(
      "The prayer of signs (ṣalāt al-āyāt), the Eid prayers, and the Friday prayer."
    ),
    rulingIds: ["ayatcauses", "khqa707", "ayatmethod", "ayatshort", "ayatruku", "eidstatus", "khqa631", "eidtime", "fridayprayer", "khqa605", "fridaybest", "khqa622", "fridayzuhr", "khqa629"],
    relatedTopicIds: ["jamaah", "dailyprayers"],
    glossaryIds: ["salatalayat"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "guidedprayers",
    fiqh: "jafari",
    categoryId: "salat",
    title: { en: "Guided prayers (step by step)", ur: "نماز کا طریقہ" },
    arabicTerm: "كيفية الصلاة",
    summary: explain(
      "Step-by-step ṣubḥ (2 rakʿahs), maghrib (3) and ẓuhr (4) prayers according to your marja'. Each step quotes the ruling it rests on, and rukn steps are marked. Recitations are shown as text only."
    ),
    procedureIds: ["fajrsistani", "maghribsistani", "zuhrsistani", "fajrkhamenei", "maghribkhamenei", "zuhrkhamenei"],
    rulingIds: [],
    relatedTopicIds: ["obligatoryparts", "qiraah", "rukusujud", "tashahhudsalam"],
    glossaryIds: ["rukn", "rakah"],
    lastSourceCheck: "2026-10-02",
  },
  {
    id: "sawmwho",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Who must fast", ur: "روزہ واجب ہونے اور صحیح ہونے کی شرائط" },
    arabicTerm: "الصوم",
    summary: explain(
      "The conditions under which fasting in the month of Ramadan becomes obligatory, and how they apply to a child who reaches bulūgh, a girl who has just reached bulūgh, a sick person who recovers during the day and a disbeliever who becomes a Muslim."
    ),
    quranicBasis: [{ surahNumber: 2, ayahNumber: 183 }, { surahNumber: 2, ayahNumber: 185 }],
    rulingIds: ["sawmconditions", "sawmwhonot", "sawmbulugh", "sawmgirls", "sawmkafir", "sawmsickrecovers"],
    relatedTopicIds: ["sawmexempt", "sawmniyyah", "bulugh"],
    glossaryIds: ["sawm", "baligh", "bulugh", "mukallaf"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmexempt",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Illness, harm, old age, pregnancy and breastfeeding", ur: "وہ لوگ جن پر روزہ واجب نہیں ہے" },
    summary: explain(
      "When fasting is not obligatory because it is harmful or very hard, and the fidyah and qaḍāʾ that follow for someone who is ill, elderly, pregnant or breastfeeding."
    ),
    quranicBasis: [{ surahNumber: 2, ayahNumber: 185 }],
    rulingIds: ["sawmharm", "khqa751", "khqa753", "sawmdoctor", "khqa744", "khqa749", "khqa750", "sawmharmafter", "sawmthirst", "sawmthirstextreme", "sawmweakness", "sawmold", "sawmoldafter", "sawmpregnant", "khqa741", "sawmbreastfeeding", "khqa743", "sawmpregnantdelay", "sawmfidyahwho", "sawmfidyahamount"],
    relatedTopicIds: ["sawmwho", "sawmqada"],
    glossaryIds: ["sawm", "fidyah", "mudd", "qada"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmniyyah",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "The intention for the fast", ur: "نیت" },
    arabicTerm: "نية الصوم",
    summary: explain(
      "What the intention for a fast is, the nights and times at which it may be made, specifying the kind of fast, and what follows when it is forgotten, delayed or doubted."
    ),
    rulingIds: ["sawmrequires", "sawmintentwhat", "sawmintentnight", "sawmintentlatest", "sawmintentkind", "sawmintentduty", "sawmintentother", "sawmintentsleep", "sawmintentnone", "sawmintentdeliberate", "sawmintentforgot", "sawmintentday", "sawmintentunconscious", "sawmintentintoxicated", "sawmintentassigned", "sawmintentfree", "sawmintentrecommended", "sawmdoubtday", "sawmdoubtdayfound", "sawmintentcontinue", "sawmintentreturn", "khqa754", "sawmintentbreak"],
    relatedTopicIds: ["sawmwho", "sawmmubtilat"],
    glossaryIds: ["niyyah", "sawm", "qada", "kaffarah", "nadhr", "rajaa", "madhimmah"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmmubtilat",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "What invalidates the fast", ur: "مبطلات روزہ" },
    arabicTerm: "مفطرات الصوم",
    summary: explain(
      "Eating and drinking, sexual intercourse, discharging semen, ascribing falsehood to Allah and the Imams, thick dust and smoke, immersing the head in water, enema and vomiting: what each book says invalidates the fast, what it excuses, and the acts it disapproves of."
    ),
    quranicBasis: [{ surahNumber: 2, ayahNumber: 187 }],
    rulingIds: ["sawmlist", "sawmeating", "sawmeatingdawn", "sawmeatingforgot", "sawminjections", "khqa763", "sawmspray", "khqa758", "sawmpills", "khqa764", "khqa765", "sawmsublingual", "sawmteeth", "khqa760", "sawmtoothpick", "sawmsaliva", "sawmmucus", "sawmbleeding", "khqa755", "khqa761", "sawmbleedingsaliva", "khqa759", "sawmtasting", "sawmintercourse", "sawmintercoursepartial", "sawmintercoursedoubt", "sawmintercourseforgot", "sawmmasturbation", "sawmcourtship", "sawmcourtshipno", "sawminvoluntary", "khqa782", "sawmwetdreamsleep", "sawmwetdreamwake", "sawmwetdreamurinate", "sawmwetdreamresidue", "sawmwetdreamghusl", "sawmlying", "sawmlyingreport", "sawmlyingbelief", "sawmlyingtrue", "sawmlyingfabricated", "sawmlyingask", "sawmlyingrepent", "sawmdust", "khqa796", "sawmdustthin", "sawmdustcare", "sawmsmoke", "khqa756", "khqa757", "sawmdustdoubt", "sawmdustforgot", "sawmhead", "sawmheadbody", "sawmheadhalf", "sawmheadhair", "sawmheaddoubt", "sawmheadfell", "sawmshower", "sawmenema", "sawmvomit", "sawmvomitnight", "sawmvomitsick", "sawmswallowed", "sawmswallowedforgot", "sawmburpcertain", "sawmburp", "sawmintentional", "khqa793", "sawmrepeat", "sawmforced", "sawmforcedplace", "sawmdoubtdone", "sawmmakruh"],
    relatedTopicIds: ["sawmjanabah", "sawmkaffarah", "sawmonlyqada"],
    glossaryIds: ["sawm", "mubtilat", "junub", "qada", "kaffarah"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmjanabah",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Janābah, ḥayḍ and nifās and the fast" },
    summary: explain(
      "Remaining in janābah, or in ḥayḍ or nifās, until the time of dawn: the ghusl and tayammum, sleeping while junub, forgetting the ghusl, and a woman's fast when her ḥayḍ or nifās begins or ends."
    ),
    rulingIds: ["sawmjunubonpurpose", "sawmjunubqada", "sawmjunubother", "sawmjunubtayammum", "sawmjunubforgot", "khqa779", "sawmjunubmake", "sawmjunubmaketayammum", "khqa772", "sawmjunubsleepknow", "sawmjunubsleepprobable", "sawmjunubsleepexpect", "sawmjunubsleepunmindful", "sawmjunubsleepagain", "sawmjunubsleepsecond", "sawmjunubfirstsleep", "sawmjunubdoubt", "sawmjunubwetdream", "sawmjunubwetdreamqada", "sawmhaydfast", "sawmhaydstops", "sawmhaydbegins", "sawmhaydbefore", "sawmhaydtayammum", "sawmhaydtime", "sawmhaydnear", "sawmhaydforgot", "sawmhaydnegligent", "sawmistihadah", "sawmcorpse"],
    relatedTopicIds: ["sawmmubtilat", "ghusl", "haydistihadanifas", "tayammum"],
    glossaryIds: ["junub", "janabah", "hayd", "nifas", "ghusl", "tayammum", "sawm"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmtimes",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Dawn, maghrib and breaking the fast" },
    summary: explain(
      "When the fast begins and ends: doubting the dawn, doubting maghrib, breaking the fast too early, and praying before breaking the fast. Today's dawn and maghrib times are shown from the app's Prayer Times feature."
    ),
    quranicBasis: [{ surahNumber: 2, ayahNumber: 187 }],
    rulingIds: ["sawmdawndoubt", "sawmdawninvestigate", "sawmmaghribdoubt", "sawmmaghribwrong", "sawmmaghribcloud", "sawmprayerfirst", "sawmabstain"],
    liveTool: "sawm",
    relatedTopicIds: ["prayertimes", "sawmmubtilat"],
    glossaryIds: ["sawm", "iftar", "maghrib", "qada"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmkaffarah",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Kaffārah for breaking the fast", ur: "عمداً افطار کرنے کا کفارہ" },
    arabicTerm: "كفارة الصوم",
    summary: explain(
      "When kaffārah is due in addition to qaḍāʾ, the kinds of kaffārah and how to give them, and cases that affect it: several acts in a day, spouses, travelling after breaking the fast, and delay."
    ),
    rulingIds: ["sawmkaffwhen", "sawmkaffignorance", "khqa813", "sawmkaffharam", "sawmkafftypes", "sawmkaffunable", "sawmkaffable", "sawmkaffmonths", "sawmkaffmonthsstart", "sawmkaffmonthsbreak", "sawmkaffmonthsexcuse", "sawmkaffsixty", "sawmkaffsixtyhow", "sawmkaffpoor", "sawmkaffunlawful", "khqa780", "sawmkaffallah", "sawmkaffseveral", "khqa790", "sawmkaffthen", "sawmkaffmixed", "sawmkaffburp", "sawmkaffvow", "sawmkaffmaghribword", "sawmkaffjourney", "sawmkaffexcuse", "sawmkaffwrongday", "sawmkaffshawwal", "sawmkaffspouses", "khqa766", "sawmkaffcompelhusband", "sawmkaffcompelwife", "sawmkaffasleep", "sawmkaffcompelother", "sawmkaffcompeltraveller", "sawmkaffdelay", "sawmkaffnoadd", "sawmkaffqadaorder", "khqa803"],
    relatedTopicIds: ["sawmonlyqada", "sawmqada"],
    glossaryIds: ["kaffarah", "qada", "mudd", "faqir", "sawm"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmonlyqada",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "When only qaḍāʾ is due", ur: "وہ صورتیں جن میں روزے کی صرف قضا واجب ہے" },
    summary: explain(
      "Cases in which a fast must be made up but no kaffārah is due, including mistakes about dawn or maghrib and gargling."
    ),
    rulingIds: ["sawmonlyqadalist", "sawmonlyqadaforgot", "khqa769", "sawmonlyqadaallowed", "sawmgargle", "sawmgargleunintended", "sawmswallowother", "sawmgarglemuch"],
    relatedTopicIds: ["sawmkaffarah", "sawmqada"],
    glossaryIds: ["qada", "kaffarah", "sawm"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmqada",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Making up missed fasts (qaḍāʾ) and the fidyah", ur: "قضا روزے کے احکام" },
    arabicTerm: "قضاء الصوم",
    summary: explain(
      "Who must make up missed fasts and who need not, when they must be made up, breaking a qaḍāʾ fast, and what the kaffārah of delay and the fidyah are, including a deceased parent's fasts."
    ),
    quranicBasis: [{ surahNumber: 2, ayahNumber: 185 }],
    rulingIds: ["sawmqadainsane", "sawmqadakafir", "sawmqadaunconscious", "sawmqadadrunk", "sawmqadadrunkpart", "sawmqadadrunkany", "sawmqadahayd", "sawmqadadeath", "sawmqadacount", "sawmqadaorder", "sawmqadaintention", "sawmqadabreak", "sawmqadabreakafter", "sawmqadadead", "sawmqadaable", "sawmqadaillness", "sawmqadaanother", "sawmqadatravel", "sawmqadaweak", "sawmqadadelayed", "sawmqadashortage", "sawmqadaillnessyears", "sawmqadamudd", "sawmqadadelayyears", "khqa799", "sawmqadadelayamount", "sawmqadadelayignorance", "khqa809", "sawmqadaintentionalmiss", "sawmqadaintentionalrepeat", "sawmqadaparents", "sawmqadaparentspurpose", "sawmqadaparentsother"],
    relatedTopicIds: ["sawmexempt", "sawmkaffarah"],
    glossaryIds: ["qada", "fidyah", "kaffarah", "mudd", "faqir", "sawm"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmtravel",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Fasting and travel", ur: "مسافر کے روزے کے احکام" },
    arabicTerm: "صوم المسافر",
    summary: explain(
      "Whether a traveller fasts, setting out or arriving during the day, vowed and recommended fasts on a journey, a journey of sin, and a traveller who did not know the ruling."
    ),
    quranicBasis: [{ surahNumber: 2, ayahNumber: 185 }],
    rulingIds: ["sawmtravelnofast", "sawmtravelcannot", "sawmtravelallowed", "sawmtravelassigned", "sawmtravelvow", "sawmtravelrecommended", "sawmtravelmedina", "sawmtravelplaces", "sawmtravelsin", "sawmtravelsinchange", "sawmtravelsinafternoon", "sawmtravelunaware", "sawmtravelunawareterms", "sawmtravelunawareshari", "sawmtravelforgot", "sawmtraveldepart", "sawmtravelbreak", "khqa794", "sawmtravelarrive", "sawmtravelarriveafter", "sawmtravelfull"],
    relatedTopicIds: ["travellerprayer", "sawmqada"],
    glossaryIds: ["qasr", "tamam", "watan", "hadd", "nadhr", "sawm"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmmonth",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Establishing the first of the month", ur: "پہلی تاریخ ثابت ہونے کے طریقے" },
    arabicTerm: "ثبوت الهلال",
    summary: explain(
      "How the first of a lunar month is established, such as by sighting the crescent, testimony, the passing of thirty days or a jurist's ruling, and what to do when it is doubtful whether it is Ramadan or Shawwāl."
    ),
    rulingIds: ["sawmmonthways", "khqa844", "sawmmonthevening", "sawmmonthequipment", "khqa831", "sawmmoonshape", "khqa841", "sawmmonthastronomers", "sawmmonthhakim", "khqa839", "sawmmonthhakimcountry", "khqa840", "sawmmonthhorizon", "khqa834", "khqa836", "sawmmonthgovernment", "sawmmonthmedia", "khqa832", "sawmmonthnotestablished", "khqa833", "sawmmonthshawwaldoubt", "sawmmonthshawwal", "sawmmonthprisoner"],
    relatedTopicIds: ["sawmtimes", "sawmtypes"],
    glossaryIds: ["sawm"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "sawmtypes",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Obligatory, forbidden, disapproved and recommended fasts", ur: "روزے کی قسمیں" },
    summary: explain(
      "The kinds of fast and which days or situations fall under each, a recommended fast while owing qaḍāʾ, and the rights of a husband or parents over a recommended fast."
    ),
    rulingIds: ["sawmkinds", "sawmobligatory", "sawmharam", "sawmharamother", "sawmharamwife", "sawmharamchild", "sawmharamchildday", "sawmdisapproved", "sawmrecommended", "sawmrecommendedbreak", "sawmrecommendedqada", "sawmrecommendedqadaunaware", "sawmrecommendedqadaunsure", "sawmrecommendedqadaforgot"],
    relatedTopicIds: ["sawmniyyah", "sawmqada"],
    glossaryIds: ["sawm", "wajib", "haram", "makruh", "mustahab", "qada"],
    lastSourceCheck: "2026-10-08",
  },
  {
    id: "zakatfitrah",
    fiqh: "jafari",
    categoryId: "sawm",
    title: { en: "Zakāt al-fiṭrah", ur: "زکوٰۃ فطرہ" },
    arabicTerm: "زكاة الفطرة",
    summary: explain(
      "Zakāt al-fiṭrah, given at the end of Ramadan: who must give it, for whom, to whom, in what, and when. Only Sistani's rulings are included for now: Khamenei's official books do not state them, so his followers are pointed to his office."
    ),
    rulingIds: ["fitrahwho", "fitrahpoor", "fitrahdependants", "fitrahdependanttown", "fitrahguestbefore", "fitrahguestafter", "fitrahinsane", "fitrahbeforesunset", "fitrahaftersunset", "fitrahconvert", "fitrahonesaa", "fitrahbirth", "fitrahmove", "fitrahother", "fitrahowngive", "fitrahsayyid", "fitrahbreastfed", "fitrahunlawful", "fitrahhired", "fitrahdeath", "fitrahrecipients", "fitrahchild", "fitrahnotdutiful", "fitrahsin", "fitrahless", "fitrahhalf", "fitrahmixed", "fitrahrelatives", "fitrahnotpoor", "fitrahclaim", "fitrahintention", "fitrahearly", "fitrahsoil", "fitrahdefective", "fitrahitems", "fitrahprayer", "fitrahsetaside", "fitrahlate", "fitrahuse", "fitrahworth", "fitrahperish", "fitrahtransfer"],
    relatedTopicIds: ["sawmtypes"],
    glossaryIds: ["zakatfitrah", "saa", "faqir", "sawm"],
    lastSourceCheck: "2026-10-08",
  },
];
