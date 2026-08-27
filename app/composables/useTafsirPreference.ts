// Shared "which Tafsir source" preference — same reuse rationale as
// useTranslationPreference.ts: single source of truth for both the main
// Surah reader's inline Tafsir panel and Module 17's AyahReferenceCard.
// Raw localStorage under "tafsirDefaultAuthor" for the same
// backward-compatibility reason (see useTranslationPreference.ts).
export const TAFSIR_AUTHORS = ["Ibn Kathir", "Maarif Ul Quran", "Tazkirul Quran"] as const;
export type TafsirAuthor = (typeof TAFSIR_AUTHORS)[number];

const STORAGE_KEY = "tafsirDefaultAuthor";
const isValidAuthor = (v: unknown): v is TafsirAuthor => (TAFSIR_AUTHORS as readonly string[]).includes(v as string);

export const useTafsirPreference = () => {
  const preferredAuthor = useState<TafsirAuthor | null>("tafsir-preferred-author", () => null);

  const load = () => {
    if (!import.meta.client) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isValidAuthor(saved)) preferredAuthor.value = saved;
  };

  const setPreferredAuthor = (author: TafsirAuthor) => {
    preferredAuthor.value = author;
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, author);
  };

  return { preferredAuthor, load, setPreferredAuthor };
};
