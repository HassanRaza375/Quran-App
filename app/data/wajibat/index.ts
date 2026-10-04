// Aggregated Wajibat dataset + lookups. Rulings are split per category
// (./rulings/*.ts) so later phases can lazy-load them per category (spec
// Phase 10); for now every category's file is small enough to import eagerly.
import type { Ruling, WajibatCategory, WajibatTopic, GlossaryTerm, MarjaId, MarjaRuling, Procedure, Recitation } from "./types";
import { WAJIBAT_CATEGORIES } from "./categories";
import { WAJIBAT_TOPICS } from "./topics";
import { WAJIBAT_GLOSSARY } from "./glossary";
import { WAJIBAT_RECITATIONS } from "./recitations";
import { FOUNDATIONS_RULINGS } from "./rulings/foundations";
import { TAHARAT_RULINGS } from "./rulings/taharat";
import { TAHARAT_PROCEDURES } from "./procedures/taharat";
import { SALAT_RULINGS } from "./rulings/salat";
import { SALAT_PROCEDURES } from "./procedures/salat";

export * from "./types";
export { MARAJI, getMarjaById, isMarjaId } from "./marja";
export { WAJIBAT_CATEGORIES, WAJIBAT_TOPICS, WAJIBAT_GLOSSARY, WAJIBAT_RECITATIONS };

export const WAJIBAT_RULINGS: Ruling[] = [...FOUNDATIONS_RULINGS, ...TAHARAT_RULINGS, ...SALAT_RULINGS];
export const WAJIBAT_PROCEDURES: Procedure[] = [...TAHARAT_PROCEDURES, ...SALAT_PROCEDURES];

export interface WajibatDataset {
  categories: WajibatCategory[];
  topics: WajibatTopic[];
  rulings: Ruling[];
  glossary: GlossaryTerm[];
  procedures: Procedure[];
  recitations: Recitation[];
}

export const WAJIBAT_DATASET: WajibatDataset = {
  categories: WAJIBAT_CATEGORIES,
  topics: WAJIBAT_TOPICS,
  rulings: WAJIBAT_RULINGS,
  glossary: WAJIBAT_GLOSSARY,
  procedures: WAJIBAT_PROCEDURES,
  recitations: WAJIBAT_RECITATIONS,
};

export const getCategoryById = (id: string) => WAJIBAT_CATEGORIES.find((c) => c.id === id);
export const getTopicById = (id: string) => WAJIBAT_TOPICS.find((t) => t.id === id);
export const getRulingById = (id: string) => WAJIBAT_RULINGS.find((r) => r.id === id);
export const getGlossaryTermById = (id: string) => WAJIBAT_GLOSSARY.find((g) => g.id === id);
export const getProcedureById = (id: string) => WAJIBAT_PROCEDURES.find((p) => p.id === id);
export const getRecitationById = (id: string) => WAJIBAT_RECITATIONS.find((r) => r.id === id);

/** The chosen marja's entry for a ruling, or undefined. Deliberately has no
 * fallback to another marja' (decision P1 / spec §2 consequences). */
export const getMarjaRuling = (ruling: Ruling, marjaId: MarjaId): MarjaRuling | undefined =>
  ruling.rulings.find((r) => r.marjaId === marjaId);
