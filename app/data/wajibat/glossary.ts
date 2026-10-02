// Wajibat glossary. `definition.en` is cut verbatim (by script) from the
// Glossary of al-Sistani's *Islamic Laws* (4th ed., sistani.org PDF,
// downloaded 2026-09-25). `arabic`/`urdu` are the app's standard spellings of
// the term itself (labels, not definitions). Urdu definitions are not added:
// the official Urdu book's glossary has not been matched term-by-term yet.
import type { GlossaryTerm } from "./types";

export const WAJIBAT_GLOSSARY: GlossaryTerm[] = [
  {
    id: "wajib",
    term: "wājib",
    arabic: "واجب",
    urdu: "واجب",
    definition: {
      en: "obligatory"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "haram",
    term: "ḥarām",
    arabic: "حرام",
    urdu: "حرام",
    definition: {
      en: "unlawful; prohibited"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mustahab",
    term: "mustaḥabb",
    arabic: "مستحب",
    urdu: "مستحب",
    definition: {
      en: "(sing. of mustaḥabbāt) recommended"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "makruh",
    term: "makrūh",
    arabic: "مکروہ",
    urdu: "مکروہ",
    definition: {
      en: "(sing. of makrūhāt) disapproved"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mubah",
    term: "mubāḥ",
    arabic: "مباح",
    urdu: "مباح",
    definition: {
      en: "(1) permissible (2) not usurped"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mujtahid",
    term: "mujtahid",
    arabic: "مجتهد",
    urdu: "مجتہد",
    definition: {
      en: "jurist; someone who has attained the level of ijtihād, qualifying him to be an authority in Islamic law"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "marja",
    term: "marjaʿ",
    arabic: "مرجع",
    urdu: "مرجع",
    definition: {
      en: "(sing. of marājiʿ) a jurist who has the necessary qualifications to be followed in matters of Islamic jurisprudence; a source of emulation in these matters"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "taqlid",
    term: "taqlīd",
    arabic: "تقليد",
    urdu: "تقلید",
    definition: {
      en: "following a jurist"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "muqallid",
    term: "muqallid",
    arabic: "مقلد",
    urdu: "مقلد",
    definition: {
      en: "a follower of a jurist in matters of Islamic law"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mukallaf",
    term: "mukallaf",
    arabic: "مكلف",
    urdu: "مکلف",
    definition: {
      en: "a duty-bound person; someone who is legally obliged to fulfil religious duties"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "baligh",
    term: "bāligh",
    arabic: "بالغ",
    urdu: "بالغ",
    definition: {
      en: "someone who is of the age of legal responsibility; a major"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "bulugh",
    term: "bulūgh",
    arabic: "بلوغ",
    urdu: "بلوغ",
    definition: {
      en: "age of legal responsibility"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "adil",
    term: "ʿādil",
    arabic: "عادل",
    urdu: "عادل",
    definition: {
      en: "a dutiful person, i.e. someone who does the things that are obligatory for him and refrains from doing the things that are unlawful for him; just; possessing moral probity"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "alam",
    term: "aʿlam",
    arabic: "أعلم",
    urdu: "اعلم",
    definition: {
      en: "the most learned mujtahid, i.e. the mujtahid who is most capable of understanding the law of Allah from among all the mujtahids of his time"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ihtiyat",
    term: "iḥtiyāṭ",
    arabic: "احتياط",
    urdu: "احتیاط",
    definition: {
      en: "precaution"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ihtiyatlazim",
    term: "al‑iḥtiyāṭ al‑lāzim",
    arabic: "الاحتياط اللازم",
    urdu: "احتیاط لازم",
    definition: {
      en: "necessary precaution (this is the same as al‑iḥtiyāṭ al‑wājib)"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ihtiyatmustahab",
    term: "al‑iḥtiyāṭ al‑mustaḥabb",
    arabic: "الاحتياط المستحب",
    urdu: "احتیاط مستحب",
    definition: {
      en: "recommended precaution"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mumayyiz",
    term: "mumayyiz",
    arabic: "مميز",
    urdu: "ممیز",
    definition: {
      en: "someone who is able to discern between right and wrong; a discerning minor"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "usuldin",
    term: "uṣūl al‑dīn",
    arabic: "أصول الدين",
    urdu: "اصول دین",
    definition: {
      en: "fundamentals of religion"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "kurr",
    term: "kurr",
    arabic: "كر",
    urdu: "کر",
    definition: {
      en: "a quantity of water greater or equal to approximately 384 litres"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "qalil",
    term: "qalīl",
    arabic: "قليل",
    urdu: "قلیل",
    definition: {
      en: "water that does not gush from the earth and is less than kurr"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mutlaq",
    term: "muṭlaq",
    arabic: "مطلق",
    urdu: "مطلق",
    definition: {
      en: "unmixed water"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mudaf",
    term: "muḍāf",
    arabic: "مضاف",
    urdu: "مضاف",
    definition: {
      en: "mixed water"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "najis",
    term: "najis",
    arabic: "نجس",
    urdu: "نجس",
    definition: {
      en: "impure"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "tahir",
    term: "ṭāhir",
    arabic: "طاهر",
    urdu: "طاہر",
    definition: {
      en: "pure"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "istibra",
    term: "istibrāʾ",
    arabic: "استبراء",
    urdu: "استبراء",
    definition: {
      en: "(1) the process of clearing the male urethra of urine after urinating"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "wudu",
    term: "wuḍūʾ",
    arabic: "وضوء",
    urdu: "وضو",
    definition: {
      en: "ablution"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "jabirah",
    term: "jabīrah",
    arabic: "جبيرة",
    urdu: "جبیرہ",
    definition: {
      en: "something with which a wound or a break in a bone is bandaged, or the medication that is applied to a wound"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "tartib",
    term: "tartīb",
    arabic: "ترتيب",
    urdu: "ترتیب",
    definition: {
      en: "sequence"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "muwalah",
    term: "muwālāh",
    arabic: "موالاة",
    urdu: "موالات",
    definition: {
      en: "close succession"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ghusl",
    term: "ghusl",
    arabic: "غسل",
    urdu: "غسل",
    definition: {
      en: "ritual bathing"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "junub",
    term: "junub",
    arabic: "جنب",
    urdu: "جنب",
    definition: {
      en: "someone in the state of janābah"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "janabah",
    term: "janābah",
    arabic: "جنابة",
    urdu: "جنابت",
    definition: {
      en: "ritual impurity"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "hayd",
    term: "ḥayḍ",
    arabic: "حيض",
    urdu: "حیض",
    definition: {
      en: "menstruation; period"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "istihadah",
    term: "istiḥāḍah",
    arabic: "استحاضة",
    urdu: "استحاضہ",
    definition: {
      en: "irregular blood discharge"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "nifas",
    term: "nifās",
    arabic: "نفاس",
    urdu: "نفاس",
    definition: {
      en: "lochia, i.e. blood discharge after childbirth"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "tayammum",
    term: "tayammum",
    arabic: "تيمم",
    urdu: "تیمم",
    definition: {
      en: "dry ablution"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "rukn",
    term: "rukn",
    arabic: "ركن",
    urdu: "رکن",
    definition: {
      en: "(sing. of arkān) elemental component of an act of worship"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "rakah",
    term: "rakʿah",
    arabic: "ركعة",
    urdu: "رکعت",
    definition: {
      en: "a unit of the prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "qiraah",
    term: "qirāʾah",
    arabic: "قراءة",
    urdu: "قرأت",
    definition: {
      en: "recitation"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ruku",
    term: "rukūʿ",
    arabic: "ركوع",
    urdu: "رکوع",
    definition: {
      en: "bowing position in the prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "sajdah",
    term: "sajdah",
    arabic: "سجدة",
    urdu: "سجدہ",
    definition: {
      en: "prostration"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "tashahhud",
    term: "tashahhud",
    arabic: "تشهد",
    urdu: "تشہد",
    definition: {
      en: "testifying"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "salam",
    term: "salām",
    arabic: "سلام",
    urdu: "سلام",
    definition: {
      en: "salutation"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "qunut",
    term: "qunūt",
    arabic: "قنوت",
    urdu: "قنوت",
    definition: {
      en: "the act of supplicating in prayers with the hands placed in front of the face"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "adhan",
    term: "adhān",
    arabic: "أذان",
    urdu: "اذان",
    definition: {
      en: "call to prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "iqamah",
    term: "iqāmah",
    arabic: "إقامة",
    urdu: "اقامت",
    definition: {
      en: "call to stand up for prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "qibla",
    term: "qibla",
    arabic: "قبلة",
    urdu: "قبلہ",
    definition: {
      en: "direction towards the Kaʿbah in Mecca"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "qasr",
    term: "qaṣr",
    arabic: "قصر",
    urdu: "قصر",
    definition: {
      en: "shortened prayers of a traveller"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "tamam",
    term: "tamām",
    arabic: "تمام",
    urdu: "تمام",
    definition: {
      en: "complete form of the prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "qada",
    term: "qaḍāʾ",
    arabic: "قضاء",
    urdu: "قضا",
    definition: {
      en: "(1) making up a religious duty that was not performed in its prescribed time"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ada",
    term: "adāʾ",
    arabic: "أداء",
    urdu: "ادا",
    definition: {
      en: "accomplishment of a religious duty within its prescribed time, as opposed to qaḍāʾ"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "jamaah",
    term: "jamāʿah",
    arabic: "جماعة",
    urdu: "جماعت",
    definition: {
      en: "congregation"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mamum",
    term: "maʾmūm",
    arabic: "مأموم",
    urdu: "ماموم",
    definition: {
      en: "someone who follows an imam in congregational prayers"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "watan",
    term: "waṭan",
    arabic: "وطن",
    urdu: "وطن",
    definition: {
      en: "home town"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "turbah",
    term: "turbah",
    arabic: "تربة",
    urdu: "تربت",
    definition: {
      en: "a piece of earth or clay on which one places his forehead when prostrating"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "niyyah",
    term: "niyyah",
    arabic: "نية",
    urdu: "نیت",
    definition: {
      en: "intention"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "takbiratalihram",
    term: "takbīrat al‑iḥrām",
    arabic: "تكبيرة الإحرام",
    urdu: "تکبیرۃ الاحرام",
    definition: {
      en: "saying ‘allāhu akbar’ at the beginning of the prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "taqibat",
    term: "taʿqībāt",
    arabic: "تعقيبات",
    urdu: "تعقیبات",
    definition: {
      en: "supplications after prayers"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "mubtilat",
    term: "mubṭilāt",
    arabic: "مبطلات",
    urdu: "مبطلات",
    definition: {
      en: "things that invalidate"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "zawal",
    term: "zawāl",
    arabic: "زوال",
    urdu: "زوال",
    definition: {
      en: "the time after midday when the sun begins to decline"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "nafilah",
    term: "nāfilah",
    arabic: "نافلة",
    urdu: "نافلہ",
    definition: {
      en: "the supererogatory prayer"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "furada",
    term: "furādā",
    arabic: "فرادى",
    urdu: "فرادیٰ",
    definition: {
      en: "performing an act of worship on one’s own, as opposed to in jamāʿah"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "salatalayat",
    term: "ṣalāt al‑āyāt",
    arabic: "صلاة الآيات",
    urdu: "نماز آیات",
    definition: {
      en: "the prayer of signs"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "jahr",
    term: "jahr",
    arabic: "جهر",
    urdu: "جہر",
    definition: {
      en: "pronouncing the recitation (qirāʾah) of prayers aloud, as opposed to whispering it (ikhfāt)"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  },
  {
    id: "ikhfat",
    term: "ikhfāt",
    arabic: "إخفات",
    urdu: "اخفات",
    definition: {
      en: "whispering the recitation (qirāʾah) of prayers, as opposed to pronouncing it aloud (jahr)"
    },
    source: {
      title: "Islamic Laws (4th edition)",
      reference: "Glossary",
      url: "https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf"
    }
  }
];
