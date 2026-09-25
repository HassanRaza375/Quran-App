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
  }
];
