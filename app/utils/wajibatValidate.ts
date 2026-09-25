// Dataset integrity checks for the Wajibat module (Module 18, spec §7.3).
// Same role as commandsValidate.ts / personsValidate.ts, run by
// tests/wajibatDataset.test.ts. Procedure and decision-tree checks
// (ordered steps, reachable nodes, sourced leaves) arrive with those
// datasets in Phase 2+.
import type { WajibatDataset } from "~/data/wajibat";
import type { Marja, MarjaRuling } from "~/data/wajibat/types";

export interface SurahMeta {
  surahNo: number;
  totalAyah: number;
}

export interface WajibatIssue {
  id: string;
  message: string;
}

const HUKMS = new Set(["wajib", "haram", "mustahab", "makruh", "mubah"]);
const BASES = new Set(["fatwa", "ihtiyat_wajib", "ihtiyat_mustahab", "ihtiyat_unspecified"]);
const LEVELS = new Set(["A", "B", "D"]);
const PANELS = new Set(["persons"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** A level-A citation must point at the marja's own official site. */
const isOfficialUrl = (url: string, marja: Marja): boolean => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const official = new URL(marja.officialSite).hostname.replace(/^www\./, "");
    const alternates: Record<string, string[]> = { khamenei: ["khamenei.ir"], makarem: ["makaremshirazi.net"] };
    return host === official || (alternates[marja.id] ?? []).includes(host);
  } catch {
    return false;
  }
};

const findDuplicates = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

const validateMarjaRuling = (
  entry: MarjaRuling,
  rulingId: string,
  maraji: Marja[],
  push: (id: string, message: string) => void
) => {
  const label = `${rulingId}/${entry.marjaId}`;
  const marja = maraji.find((m) => m.id === entry.marjaId);
  if (!marja) {
    push(label, `unknown marjaId "${entry.marjaId}"`);
    return;
  }
  if (marja.status === "pending-sources") push(label, `${marja.id} is pending sources and must not have rulings yet`);
  if (!entry.text?.en?.trim()) push(label, "missing English text");
  if (entry.hukm !== undefined && !HUKMS.has(entry.hukm)) push(label, `invalid hukm "${entry.hukm}"`);
  if (!BASES.has(entry.basis)) push(label, `invalid basis "${entry.basis}"`);
  if (!LEVELS.has(entry.verification)) push(label, `invalid verification level "${entry.verification}"`);
  if (entry.format !== "issue" && entry.format !== "qa") push(label, `invalid format "${entry.format}"`);
  if (entry.format === "qa" && !entry.question?.en?.trim()) push(label, "Q&A ruling is missing its question");

  const src = entry.source;
  if (!src?.title?.trim() || !src?.reference?.trim() || !src?.url?.trim()) push(label, "source needs title, reference and url");
  else if (entry.verification === "A" && !isOfficialUrl(src.url, marja)) push(label, `level-A source is not on ${marja.officialSite}`);

  // Decision R1: Urdu ruling text only from the marja's official Urdu book, with its own citation.
  const hasUrdu = !!entry.text.ur?.trim() || !!entry.question?.ur?.trim();
  if (hasUrdu) {
    const ur = entry.urSource;
    if (!ur?.title?.trim() || !ur?.reference?.trim() || !ur?.url?.trim()) push(label, "Urdu text without an Urdu source citation");
    else if (!isOfficialUrl(ur.url, marja)) push(label, `Urdu source is not on ${marja.officialSite}`);
    if (entry.format === "qa" && (!entry.text.ur?.trim() || !entry.question?.ur?.trim())) push(label, "Urdu Q&A must have both question and answer");
  } else if (entry.urSource) {
    push(label, "urSource given but no Urdu text");
  }
  if (entry.urduEditionLag && hasUrdu) push(label, "urduEditionLag entries must not carry the outdated Urdu text");
};

export const validateWajibatDataset = (
  data: WajibatDataset,
  maraji: Marja[],
  surahs: SurahMeta[]
): WajibatIssue[] => {
  const issues: WajibatIssue[] = [];
  const push = (id: string, message: string) => issues.push({ id, message });

  const { categories, topics, rulings, glossary } = data;
  for (const [name, list] of [
    ["category", categories.map((c) => c.id)],
    ["topic", topics.map((t) => t.id)],
    ["ruling", rulings.map((r) => r.id)],
    ["glossary", glossary.map((g) => g.id)],
    ["marja", maraji.map((m) => m.id)],
  ] as const) {
    for (const dup of findDuplicates([...list])) push(dup, `duplicate ${name} id`);
    for (const id of list) if (!/^[a-z0-9]+$/.test(id)) push(id, `${name} id must be lowercase ASCII letters/digits only (Shared Foundation #1)`);
  }

  const topicIds = new Set(topics.map((t) => t.id));
  const glossaryIds = new Set(glossary.map((g) => g.id));

  for (const c of categories) {
    if (c.summary?.kind !== "explanation") push(c.id, "category summary must be kind: explanation");
    for (const tid of c.topicIds) {
      const topic = topics.find((t) => t.id === tid);
      if (!topic) push(c.id, `topicIds references unknown topic "${tid}"`);
      else if (topic.categoryId !== c.id) push(c.id, `topic "${tid}" belongs to category "${topic.categoryId}"`);
    }
  }

  for (const t of topics) {
    const cat = categories.find((c) => c.id === t.categoryId);
    if (!cat) push(t.id, `unknown categoryId "${t.categoryId}"`);
    else if (!cat.topicIds.includes(t.id)) push(t.id, `not listed in category "${cat.id}".topicIds`);
    if (t.fiqh !== "jafari") push(t.id, `unsupported fiqh "${t.fiqh}"`);
    if (t.summary?.kind !== "explanation") push(t.id, "summary must be kind: explanation");
    for (const e of t.explanations ?? []) if (e.body?.kind !== "explanation") push(t.id, "explanations must be kind: explanation");
    if (!DATE_RE.test(t.lastSourceCheck)) push(t.id, "lastSourceCheck must be YYYY-MM-DD");
    for (const rid of t.rulingIds) {
      const r = rulings.find((x) => x.id === rid);
      if (!r) push(t.id, `rulingIds references unknown ruling "${rid}"`);
      else if (r.topicId !== t.id) push(t.id, `ruling "${rid}" belongs to topic "${r.topicId}"`);
    }
    for (const rel of t.relatedTopicIds ?? []) if (!topicIds.has(rel)) push(t.id, `relatedTopicIds references unknown topic "${rel}"`);
    for (const g of t.glossaryIds ?? []) if (!glossaryIds.has(g)) push(t.id, `glossaryIds references unknown term "${g}"`);
    for (const ref of t.quranicBasis ?? []) {
      const surah = surahs.find((s) => s.surahNo === ref.surahNumber);
      const ayahs = [ref.ayahNumber, ref.ayahStart, ref.ayahEnd].filter((a): a is number => a !== undefined);
      if (!surah) push(t.id, `quranicBasis: surah ${ref.surahNumber} does not exist`);
      else if (ayahs.length === 0) push(t.id, `quranicBasis: ${ref.surahNumber} has no ayah`);
      else for (const a of ayahs) if (a < 1 || a > surah.totalAyah) push(t.id, `quranicBasis: ${ref.surahNumber}:${a} is out of bounds`);
    }
    for (const n of t.quranicBasisNotes ?? []) {
      const linked = (t.quranicBasis ?? []).some((q) => q.surahNumber === n.surahNumber && q.ayahNumber === n.ayahNumber);
      if (!linked) push(t.id, `quranicBasisNotes: ${n.surahNumber}:${n.ayahNumber} is not one of the topic's basis ayahs`);
      if (n.note?.kind !== "explanation") push(t.id, "quranicBasisNotes: note must be kind: explanation");
      if (!n.quote?.text?.trim() || !n.source?.title?.trim() || !n.source?.urls?.length) push(t.id, "quranicBasisNotes: needs a verbatim quote and a cited source");
    }
    if (t.reviewedBy && (!t.reviewedBy.name || !DATE_RE.test(t.reviewedBy.date))) push(t.id, "reviewedBy needs a name and YYYY-MM-DD date");
  }

  for (const r of rulings) {
    const topic = topics.find((t) => t.id === r.topicId);
    if (!topic) push(r.id, `unknown topicId "${r.topicId}"`);
    else if (!topic.rulingIds.includes(r.id)) push(r.id, `not listed in topic "${topic.id}".rulingIds`);
    if (!r.subject?.en?.trim()) push(r.id, "missing subject");
    if (r.panel !== undefined && !PANELS.has(r.panel)) push(r.id, `unknown panel "${r.panel}"`);
    if (r.panel && r.sensitive) push(r.id, "a ruling can be in the women-specific panel or another panel, not both");
    if (r.rulings.length === 0) push(r.id, "has no marja' entries");
    for (const dup of findDuplicates(r.rulings.map((m) => m.marjaId))) push(r.id, `two entries for marja "${dup}"`);
    const hasD = r.rulings.some((m) => m.verification === "D");
    if (hasD && r.status !== "disputed") push(r.id, "level-D entry requires status: disputed");
    if (!hasD && r.status === "disputed") push(r.id, "status: disputed without a level-D entry");
    for (const m of r.rulings) validateMarjaRuling(m, r.id, maraji, push);
  }

  // Procedures: ordered steps, each quoting its cited ruling verbatim for the same marja'.
  const procedures = data.procedures ?? [];
  for (const dup of findDuplicates(procedures.map((p) => p.id))) push(dup, "duplicate procedure id");
  for (const t of topics) {
    for (const pid of t.procedureIds ?? []) {
      const p = procedures.find((x) => x.id === pid);
      if (!p) push(t.id, `procedureIds references unknown procedure "${pid}"`);
      else if (p.topicId !== t.id) push(t.id, `procedure "${pid}" belongs to topic "${p.topicId}"`);
    }
  }
  for (const p of procedures) {
    if (!/^[a-z0-9]+$/.test(p.id)) push(p.id, "procedure id must be lowercase ASCII letters/digits only (Shared Foundation #1)");
    const topic = topics.find((t) => t.id === p.topicId);
    if (!topic) push(p.id, `unknown topicId "${p.topicId}"`);
    else if (!(topic.procedureIds ?? []).includes(p.id)) push(p.id, `not listed in topic "${topic.id}".procedureIds`);
    const marja = maraji.find((m) => m.id === p.marjaId);
    if (!marja) push(p.id, `unknown marjaId "${p.marjaId}"`);
    else if (marja.status === "pending-sources") push(p.id, `${marja.id} is pending sources and must not have procedures yet`);
    if (p.steps.length === 0) push(p.id, "procedure has no steps");
    p.steps.forEach((s, i) => {
      const label = `${p.id}/${s.id}`;
      if (s.order !== i + 1) push(label, `steps must be ordered 1..n without gaps (expected ${i + 1}, got ${s.order})`);
      if (s.hukm !== undefined && !HUKMS.has(s.hukm)) push(label, `invalid hukm "${s.hukm}"`);
      const ruling = rulings.find((r) => r.id === s.rulingId);
      const entry = ruling?.rulings.find((m) => m.marjaId === p.marjaId);
      if (!ruling) push(label, `rulingId references unknown ruling "${s.rulingId}"`);
      else if (!entry) push(label, `ruling "${s.rulingId}" has no entry for ${p.marjaId}`);
      else {
        if (!s.instruction.en?.trim() || !entry.text.en.includes(s.instruction.en)) push(label, "instruction is not a verbatim excerpt of the cited ruling");
        if (s.instruction.ur && !(entry.text.ur ?? "").includes(s.instruction.ur)) push(label, "Urdu instruction is not a verbatim excerpt of the cited ruling");
      }
    });
    for (const dup of findDuplicates(p.steps.map((s) => s.id))) push(p.id, `duplicate step id "${dup}"`);
  }

  for (const g of glossary) {
    if (!g.term?.trim() || !g.definition?.en?.trim()) push(g.id, "glossary term needs term and English definition");
  }

  return issues;
};
