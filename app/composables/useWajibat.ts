// Thin read-only access to the Wajibat dataset for pages/components. All
// real logic lives in the pure app/utils/wajibat*.ts helpers (unit-tested).
import {
  MARAJI,
  WAJIBAT_CATEGORIES,
  WAJIBAT_DATASET,
  getCategoryById,
  getGlossaryTermById,
  getMarjaById,
  getMarjaRuling,
  getRulingById,
  getDecisionTreeById,
  getTopicById,
  isRulingVisibleFor,
  TREE_REVIEWS,
} from "~/data/wajibat";
import type { MarjaId, Ruling, WajibatTopic } from "~/data/wajibat/types";
import { searchWajibat } from "~/utils/wajibatSearch";
import { isHelperVisible } from "~/utils/wajibatReview";
import { ensureWajibatDataCached } from "~/composables/useFiqhOfflineCache";

export const useWajibat = () => {
  // Fire-and-forget: every /fiqh page calls useWajibat(), so this is where
  // "visiting a category keeps it available offline" (R8) actually happens.
  // See useFiqhOfflineCache.ts for why this can't just be a passive
  // service-worker runtimeCaching rule.
  if (import.meta.client) ensureWajibatDataCached();

  const categories = [...WAJIBAT_CATEGORIES].sort((a, b) => a.order - b.order);

  const topicsFor = (categoryId: string): WajibatTopic[] =>
    (getCategoryById(categoryId)?.topicIds ?? [])
      .map((id) => getTopicById(id))
      .filter((t): t is WajibatTopic => !!t);

  /** A topic's rulings as followers of `marjaId` see them (other maraji' supplementary Q&A hidden). */
  const rulingsFor = (topic: WajibatTopic, marjaId?: MarjaId | null): Ruling[] =>
    topic.rulingIds
      .map((id) => getRulingById(id))
      .filter((r): r is Ruling => !!r && isRulingVisibleFor(r, marjaId));

  /** Decision helpers of a topic that may be shown: fully reviewed, or the dev flag is on (decision A7). */
  const helpersFor = (topic: WajibatTopic, marjaId?: MarjaId | null) => {
    const dev = !!useRuntimeConfig().public.wajibatShowUnreviewedHelpers;
    return (topic.decisionTreeIds ?? [])
      .map((id) => getDecisionTreeById(id))
      .filter((t) => !!t && !!marjaId && t.marjaId === marjaId && isHelperVisible(t, TREE_REVIEWS, dev));
  };

  const search = (query: string, marjaId?: MarjaId | null) => searchWajibat(WAJIBAT_DATASET, query, marjaId);

  return {
    maraji: MARAJI,
    categories,
    glossary: WAJIBAT_DATASET.glossary,
    getCategoryById,
    getTopicById,
    getGlossaryTermById,
    getMarjaById,
    getMarjaRuling,
    topicsFor,
    rulingsFor,
    helpersFor,
    search,
  };
};
