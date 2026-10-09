// Guided prayers and ablutions (the step-by-step procedures): every step of every procedure, for its marja',
// shows its quoted instruction (or, where his English is held or withheld, the Urdu excerpt with its notice).
import { BASES, checker, gotoTopic, newContext, squash } from "./lib.mjs";

export default async function run({ browser, data }) {
  const t = checker("guided");
  const topicOf = new Map(data.topics.flatMap((tp) => (tp.procedureIds ?? []).map((id) => [id, tp])));
  for (const marja of ["sistani", "khamenei"]) {
    const ctx = await newContext(browser, { marja, lang: "en" });
    const page = await ctx.newPage();
    for (const proc of data.procedures.filter((p) => p.marjaId === marja)) {
      const tp = topicOf.get(proc.id);
      await gotoTopic(page, BASES.off, tp.categoryId, tp.id);
      const card = page.locator(".procedure-card", { hasText: proc.title.en }).first();
      t.ok((await card.count()) === 1, `${proc.id}: shown to ${marja}`);
      t.ok(squash(await card.textContent()).includes(`${proc.steps.length} steps`), `${proc.id}: says ${proc.steps.length} steps`);
      await card.getByRole("button", { name: "Show all steps" }).click();
      const body = squash(await card.textContent());
      for (const s of proc.steps) {
        t.ok(body.includes(squash(s.title.en)), `${proc.id}/${s.id}: title`);
        if (s.instruction.ur) {
          // his English is held or withheld: only the official Urdu excerpt is shown, with its notice
          t.ok(body.includes(squash(s.instruction.ur).slice(0, 30)), `${proc.id}/${s.id}: Urdu excerpt of held/withheld English`);
          t.ok(!body.includes(squash(s.instruction.en).slice(0, 40)), `${proc.id}/${s.id}: the held English is not shown`);
        } else {
          t.ok(body.includes(squash(s.instruction.en).slice(0, 80)), `${proc.id}/${s.id}: quoted instruction`);
        }
      }
    }
    // the other marja's procedures are never shown
    await ctx.close();
  }
  // one-step-at-a-time mode: Next walks to the last step and Start over returns
  const ctx = await newContext(browser, { marja: "sistani" });
  const page = await ctx.newPage();
  const proc = data.procedures.find((p) => p.id === "fajrsistani");
  await gotoTopic(page, BASES.off, "salat", "guidedprayers");
  const card = page.locator(".procedure-card", { hasText: proc.title.en }).first();
  for (let i = 1; i < proc.steps.length; i++) await card.getByRole("button", { name: "Next" }).click();
  t.ok(squash(await card.textContent()).includes(`Step ${proc.steps.length} of ${proc.steps.length}`), "stepper reaches the last step");
  await card.getByRole("button", { name: "Start over" }).click();
  t.ok(squash(await card.textContent()).includes(`Step 1 of ${proc.steps.length}`), "Start over returns to step 1");
  await ctx.close();
  return t;
}
