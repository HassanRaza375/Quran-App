// The four decision helpers (prayer doubts and wuḍūʾ, for each marja'). Run against the server with the dev
// flag on. Every path of every tree is walked through the UI: each question offers "I'm not sure", each
// answer is a verbatim quote of the marja's ruling (or a risala pointer), and every result carries his name,
// the "Not scholar-reviewed" label, and Start over. With the flag off the helpers are hidden (BASES.off).
import { BASES, checker, gotoTopic, newContext, squash, watchErrors } from "./lib.mjs";

export default async function run({ browser, data }) {
  const t = checker("helpers");
  const marjaName = { sistani: "Sistani", khamenei: "Khamenei" };
  for (const tree of data.decisionTrees) {
    const topic = data.topics.find((x) => x.id === tree.topicId);
    const ctx = await newContext(browser, { marja: tree.marjaId });
    const page = await ctx.newPage();
    const errors = watchErrors(page);
    // hidden without the flag, shown with it
    await gotoTopic(page, BASES.off, topic.categoryId, topic.id);
    t.ok((await page.$$eval("h3", (e, title) => e.some((x) => x.textContent.includes(title)), tree.title.en)) === false, `${tree.id}: hidden when the flag is off`);
    await gotoTopic(page, BASES.on, topic.categoryId, topic.id);
    t.ok((await page.$$eval("h3", (e, title) => e.some((x) => x.textContent.includes(title)), tree.title.en)) === true, `${tree.id}: shown when the flag is on`);
    const card = page.locator(".decision-helper", { hasText: tree.title.en });
    await card.getByRole("button", { name: "Start" }).click();
    const nodes = new Map(tree.nodes.map((n) => [n.id, n]));
    let paths = 0;

    const checkResult = async (node, trail) => {
      paths++;
      const text = squash(await card.locator(".result").textContent());
      t.ok(text.includes("Not scholar-reviewed"), `${tree.id} ${trail}: "Not scholar-reviewed" on the result`);
      t.ok(text.includes(marjaName[tree.marjaId]), `${tree.id} ${trail}: the marja's name on the result`);
      t.ok((await card.getByRole("button", { name: "Start over" }).count()) > 0, `${tree.id} ${trail}: Start over`);
      if (node.outcome.kind === "ruling") {
        const shown = (await card.locator(".quote-text").allTextContents()).map(squash);
        t.ok(shown.length === node.outcome.quotes.length, `${tree.id} ${trail}: ${shown.length} quotes, expected ${node.outcome.quotes.length}`);
        node.outcome.quotes.forEach((q, i) => t.ok(shown[i] === squash(q.text), `${tree.id} ${trail}: quote ${i} is verbatim`));
      } else {
        t.ok(text.includes(squash(node.outcome.reason.text.en).slice(0, 60)), `${tree.id} ${trail}: the pointer's reason is shown`);
        t.ok(text.includes(tree.risala.book), `${tree.id} ${trail}: the risala pointer names ${tree.risala.book}`);
      }
    };

    const walk = async (nodeId, trail) => {
      const node = nodes.get(nodeId);
      if (!node.question) return checkResult(node, trail);
      t.ok((await card.getByRole("radio", { name: "I'm not sure" }).count()) === 1, `${tree.id} ${trail}: "I'm not sure" offered`);
      t.ok((await card.getByRole("button", { name: "Start over" }).count()) > 0, `${tree.id} ${trail}: Start over on a question`);
      const choices = [...node.options.map((o) => ({ label: o.label.en, next: o.nextId })), { label: "I'm not sure", next: node.notSureId }];
      for (const c of choices) {
        await card.getByRole("radio", { name: c.label, exact: true }).check();
        await card.getByRole("button", { name: "Next" }).click();
        await walk(c.next, `${trail}>${c.label.slice(0, 18)}`);
        await card.getByRole("button", { name: "Back" }).click();
      }
    };
    await walk(tree.rootId, "");
    // the number of paths walked equals the number of leaves reachable (counted from the data)
    const count = (id) => { const n = nodes.get(id); return n.question ? n.options.reduce((s, o) => s + count(o.nextId), 0) + count(n.notSureId) : 1; };
    t.ok(paths === count(tree.rootId), `${tree.id}: walked ${paths} paths, data has ${count(tree.rootId)}`);
    console.log(`  ${tree.id}: ${paths} paths`);
    t.ok(errors.length === 0, `${tree.id}: console errors ${errors.slice(0, 2).join(" ; ")}`);
    await ctx.close();
  }
  return t;
}
