// Pure search over the Wajibat dataset (spec §7.3): topic titles and Arabic
// terms, ruling subjects, and glossary terms/definitions, in English and Urdu.
// Insensitive to Arabic tashkeel and to transliteration diacritics, so
// "ihtiyat" finds "iḥtiyāṭ" and "تقليد" finds "تقلید". Separate from the
// site-wide /search page, same as every other module (Shared Foundation #8).
import type { WajibatDataset } from "~/data/wajibat";
import type { GlossaryTerm, Ruling, WajibatTopic } from "~/data/wajibat/types";

export interface WajibatSearchResults {
  topics: WajibatTopic[];
  rulings: Ruling[];
  glossary: GlossaryTerm[];
}

export const normalizeWajibatText = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Latin diacritics (ḥ → h, ā → a)
    .replace(/[ً-ٰٟۖ-ۭ]/g, "") // Arabic/Urdu tashkeel
    .replace(/[ʿʾ‘’'`ʻʼ]/g, "") // ayn/hamza marks and apostrophes
    .replace(/[يى]/g, "ی") // Arabic ya / alif maqsura → Persian/Urdu ya
    .replace(/ك/g, "ک") // Arabic kaf → Persian/Urdu kaf
    .replace(/[ةۃ]/g, "ہ") // ta marbuta → Urdu he
    .replace(/[‐-―-]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const matches = (query: string, ...fields: (string | undefined)[]) =>
  fields.some((f) => f !== undefined && normalizeWajibatText(f).includes(query));

export const searchWajibat = (data: WajibatDataset, rawQuery: string): WajibatSearchResults => {
  const q = normalizeWajibatText(rawQuery);
  if (!q) return { topics: [], rulings: [], glossary: [] };

  return {
    topics: data.topics.filter((t) => matches(q, t.title.en, t.title.ur, t.arabicTerm, t.summary.text.en)),
    rulings: data.rulings.filter((r) => matches(q, r.subject.en, r.subject.ur)),
    glossary: data.glossary.filter((g) => matches(q, g.term, g.arabic, g.urdu, g.definition.en, g.definition.ur)),
  };
};
