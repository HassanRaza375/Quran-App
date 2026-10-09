// Display holds from the mismatch triage (decision B1): a held ruling shows only a pointer to his book;
// held Urdu is replaced by the notice; held English shows the official Urdu; nothing leaks to the other marja'.
import { BASES, cardText, checker, gotoTopic, newContext, squash } from "./lib.mjs";

export default async function run({ browser, data }) {
  const t = checker("holds");
  const topicOf = new Map(data.topics.flatMap((tp) => tp.rulingIds.map((id) => [id, tp])));
  const pointer = data.rulings.filter((r) => r.rulings.some((e) => e.marjaId === "khamenei" && e.referToRisala));
  t.ok(pointer.length === 21, `21 rulings held with a pointer (got ${pointer.length})`);
  const kh = await newContext(browser, { marja: "khamenei" });
  const si = await newContext(browser, { marja: "sistani" });
  const [pk, ps] = [await kh.newPage(), await si.newPage()];
  for (const r of pointer) {
    const tp = topicOf.get(r.id);
    const e = r.rulings.find((x) => x.marjaId === "khamenei");
    await gotoTopic(pk, BASES.off, tp.categoryId, tp.id);
    const card = await cardText(pk, r.id);
    t.ok(/held for review/i.test(card), `${r.id}: Khamenei sees the held notice`);
    t.ok(card.includes(e.source.reference), `${r.id}: the notice cites ${e.source.reference}`);
    t.ok(!e.text.en || !card.includes(squash(e.text.en).slice(0, 60)), `${r.id}: his text is not shown`);
  }
  // held Sistani Urdu: in Urdu mode the card says so and shows no Urdu ruling text
  const heldUr = data.rulings.filter((r) => r.rulings.some((e) => e.marjaId === "sistani" && /held back/.test(e.urduNote ?? ""))).slice(0, 6);
  t.ok(heldUr.length > 0, "there are Sistani rulings with held Urdu");
  const ur = await newContext(browser, { marja: "sistani", lang: "ur" });
  const pu = await ur.newPage();
  for (const r of heldUr) {
    const tp = topicOf.get(r.id);
    await gotoTopic(pu, BASES.off, tp.categoryId, tp.id);
    const card = await cardText(pu, r.id);
    t.ok(/held back/.test(card), `${r.id}: the held-Urdu notice is shown`);
    t.ok(card.includes(squash(r.rulings.find((x) => x.marjaId === "sistani").text.en).slice(0, 50)), `${r.id}: the English is shown instead`);
  }
  // held Khamenei English: the Urdu is what is shown, with the notice
  const heldEn = data.rulings.filter((r) => r.rulings.some((e) => e.marjaId === "khamenei" && /^Held for review/.test(e.englishWithheld ?? "") && !e.referToRisala)).slice(0, 6);
  t.ok(heldEn.length > 0, "there are Khamenei rulings with held English");
  for (const r of heldEn) {
    const tp = topicOf.get(r.id);
    const e = r.rulings.find((x) => x.marjaId === "khamenei");
    await gotoTopic(pk, BASES.off, tp.categoryId, tp.id);
    const card = await cardText(pk, r.id);
    t.ok(!card.includes(squash(e.text.en).slice(0, 50)), `${r.id}: the held English is not shown`);
    t.ok(card.includes(squash(e.text.ur).slice(0, 25)), `${r.id}: the official Urdu is shown`);
  }
  // Sistani never sees Khamenei's holds
  for (const r of pointer.slice(0, 5)) {
    const tp = topicOf.get(r.id);
    await gotoTopic(ps, BASES.off, tp.categoryId, tp.id);
    const card = await cardText(ps, r.id);
    t.ok(!/held for review/i.test(card), `${r.id}: Sistani's card is unaffected`);
  }
  for (const c of [kh, si, ur]) await c.close();
  return t;
}
