// Aggregated Wajibat dataset + lookups. Rulings are split per category
// (./rulings/*.ts) so later phases can lazy-load them per category (spec
// Phase 10); for now every category's file is small enough to import eagerly.
import type { Ruling, WajibatCategory, WajibatTopic, GlossaryTerm, MarjaId, MarjaRuling, Procedure } from "./types";
import { WAJIBAT_CATEGORIES } from "./categories";
import { WAJIBAT_TOPICS } from "./topics";
import { WAJIBAT_GLOSSARY } from "./glossary";
import { FOUNDATIONS_RULINGS } from "./rulings/foundations";
import { TAHARAT_RULINGS } from "./rulings/taharat";
import { TAHARAT_PROCEDURES } from "./procedures/taharat";

export * from "./types";
export { MARAJI, getMarjaById, isMarjaId } from "./marja";
export { WAJIBAT_CATEGORIES, WAJIBAT_TOPICS, WAJIBAT_GLOSSARY };

export const WAJIBAT_RULINGS: Ruling[] = [...FOUNDATIONS_RULINGS, ...TAHARAT_RULINGS];
export const WAJIBAT_PROCEDURES: Procedure[] = [...TAHARAT_PROCEDURES];

export interface WajibatDataset {
  categories: WajibatCategory[];
  topics: WajibatTopic[];
  rulings: Ruling[];
  glossary: GlossaryTerm[];
  procedures: Procedure[];
}

export const WAJIBAT_DATASET: WajibatDataset = {
  categories: WAJIBAT_CATEGORIES,
  topics: WAJIBAT_TOPICS,
  rulings: WAJIBAT_RULINGS,
  glossary: WAJIBAT_GLOSSARY,
  procedures: WAJIBAT_PROCEDURES,
};

export const getCategoryById = (id: string) => WAJIBAT_CATEGORIES.find((c) => c.id === id);
export const getTopicById = (id: string) => WAJIBAT_TOPICS.find((t) => t.id === id);
export const getRulingById = (id: string) => WAJIBAT_RULINGS.find((r) => r.id === id);
export const getGlossaryTermById = (id: string) => WAJIBAT_GLOSSARY.find((g) => g.id === id);
export const getProcedureById = (id: string) => WAJIBAT_PROCEDURES.find((p) => p.id === id);

/** The chosen marja's entry for a ruling, or undefined. Deliberately has no
 * fallback to another marja' (decision P1 / spec §2 consequences). */
export const getMarjaRuling = (ruling: Ruling, marjaId: MarjaId): MarjaRuling | undefined =>
  ruling.rulings.find((r) => r.marjaId === marjaId);
