// Phase 6 (Khums and Zakat): the "Where and how to pay" card links only to the chosen marja's own site and
// appears only on the paying topics; a question only Khamenei answers is shown to his followers and to no one
// else; amounts are on the page exactly as the data has them; the zakāt al-fiṭrah notice stays for Khamenei.
import { BASES, checker, gotoTopic, newContext, squash } from "./lib.mjs";

const SITES = { sistani: "sistani.org", khamenei: "leader.ir" };
const PAY = [["khums", "khumsdistribution"], ["zakat", "zakatrecipients"], ["zakat", "zakatgiving"]];

export default async function run({ browser, data }) {
  const t = checker("khums");
  for (const marja of ["sistani", "khamenei"]) {
    const ctx = await newContext(browser, { marja, lang: "en", width: 1280 });
    const page = await ctx.newPage();
    for (const [cat, id] of PAY) {
      await gotoTopic(page, BASES.off, cat, id);
      const card = await page.$$eval("section[aria-labelledby='sec-pay']", (els) => els.map((e) => ({ text: e.textContent || "", hrefs: [...e.querySelectorAll("a")].map((a) => a.href) })));
      t.ok(card.length === 1, `${marja} ${id}: one pay card`);
      if (card.length) {
        t.ok(card[0].hrefs.length === 1 && card[0].hrefs[0].replace(/\/$/, "").endsWith(SITES[marja]), `${marja} ${id}: links only to ${SITES[marja]} (${card[0].hrefs})`);
        t.ok(!/IBAN|account number|swift/i.test(card[0].text), `${marja} ${id}: no bank details`);
      }
    }
    await gotoTopic(page, BASES.off, "khums", "khumsitems");
    t.ok((await page.$("section[aria-labelledby='sec-pay']")) === null, `${marja} khumsitems: no pay card`);

    // audience-only questions
    const only = data.rulings.filter((r) => r.audience === "khamenei");
    const sample = only.slice(0, 6);
    for (const r of sample) {
      const topic = data.topics.find((x) => x.id === r.topicId);
      await gotoTopic(page, BASES.off, topic.categoryId, topic.id);
      const present = !!(await page.$(`#${r.id}`));
      t.ok(present === (marja === "khamenei"), `${marja}: audience-only ${r.id} shown ${present}`);
    }
    // amounts as the text states them: a nisab ruling's own wording is on the page
    if (marja === "sistani") {
      await gotoTopic(page, BASES.off, "zakat", "zakatgoldsilver");
      const body = squash(await page.textContent("body"));
      const r = data.rulings.find((x) => x.id === "zk1913");
      const en = r.rulings.find((e) => e.marjaId === "sistani").text.en;
      t.ok(body.includes(squash(en).slice(0, 80)), "zakatgoldsilver: ruling 1913 is quoted on the page");
    } else {
      await gotoTopic(page, BASES.off, "sawm", "zakatfitrah");
      const body = squash(await page.textContent("body"));
      t.ok(/No rulings from .* have been added to this topic yet/.test(body), "khamenei zakatfitrah: the notice stays");
    }
    await ctx.close();
  }
  return t;
}
