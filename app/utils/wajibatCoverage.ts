// Sourcing coverage per marja' per topic (spec §7.3): how many of a topic's
// rulings have an entry for each marja', at which verification level, and
// how many carry official Urdu text. Feeds the phase summaries in
// wajibat_progress_log.md and the dev-only coverage view.
import type { WajibatDataset } from "~/data/wajibat";
import type { MarjaId, VerificationLevel } from "~/data/wajibat/types";

export interface TopicCoverage {
  topicId: string;
  marjaId: MarjaId;
  total: number;
  sourced: number;
  missingRulingIds: string[];
  byLevel: Record<VerificationLevel, number>;
  withUrdu: number;
  englishOnlyRulingIds: string[];
}

export const computeCoverage = (data: WajibatDataset, marjaIds: MarjaId[]): TopicCoverage[] => {
  const out: TopicCoverage[] = [];
  for (const topic of data.topics) {
    const rulings = topic.rulingIds
      .map((id) => data.rulings.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => !!r);
    for (const marjaId of marjaIds) {
      const row: TopicCoverage = {
        topicId: topic.id,
        marjaId,
        total: rulings.length,
        sourced: 0,
        missingRulingIds: [],
        byLevel: { A: 0, B: 0, D: 0 },
        withUrdu: 0,
        englishOnlyRulingIds: [],
      };
      for (const r of rulings) {
        const entry = r.rulings.find((m) => m.marjaId === marjaId);
        if (!entry) {
          row.missingRulingIds.push(r.id);
          continue;
        }
        row.sourced++;
        row.byLevel[entry.verification]++;
        if (entry.text.ur?.trim()) row.withUrdu++;
        else row.englishOnlyRulingIds.push(r.id);
      }
      out.push(row);
    }
  }
  return out;
};

/** Totals across all topics for one marja'. */
export const summarizeCoverage = (rows: TopicCoverage[], marjaId: MarjaId) => {
  const mine = rows.filter((r) => r.marjaId === marjaId);
  return {
    marjaId,
    total: mine.reduce((n, r) => n + r.total, 0),
    sourced: mine.reduce((n, r) => n + r.sourced, 0),
    withUrdu: mine.reduce((n, r) => n + r.withUrdu, 0),
    byLevel: {
      A: mine.reduce((n, r) => n + r.byLevel.A, 0),
      B: mine.reduce((n, r) => n + r.byLevel.B, 0),
      D: mine.reduce((n, r) => n + r.byLevel.D, 0),
    },
  };
};
