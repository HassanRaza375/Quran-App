// Every topic of every category that has content, for both maraji', in English at desktop width and in
// Urdu at phone width: the right ruling cards, no overflow, the women's panel, the single "nothing yet"
// notice, helpers hidden, no console or page errors.
import { BASES, CATEGORIES, checker, expectedTopic, gotoTopic, newContext, watchErrors } from "./lib.mjs";

export default async function run({ browser, data }) {
  const t = checker("categories");
  for (const marja of ["sistani", "khamenei"]) {
    for (const [lang, width] of [["en", 1280], ["ur", 390]]) {
      const ctx = await newContext(browser, { marja, lang, width });
      const page = await ctx.newPage();
      const errors = watchErrors(page);
      for (const cat of CATEGORIES) {
        for (const topic of data.topics.filter((x) => x.categoryId === cat)) {
          const where = `${marja}/${lang}/${width} ${cat}/${topic.id}`;
          await gotoTopic(page, BASES.off, cat, topic.id);
          const exp = expectedTopic(data, topic, marja);
          const cards = await page.$$eval(".ruling-card", (els) => els.length);
          t.ok(cards === exp.main, `${where}: ${cards} cards, expected ${exp.main}`);
          const notice = await page.$$eval(".v-alert", (els) => els.some((e) => /No rulings from .* have been added to this topic yet/.test(e.textContent || "")));
          t.ok(notice === exp.empty, `${where}: "nothing yet" notice ${notice}, expected ${exp.empty}`);
          if (exp.sensitive && !exp.empty) {
            const titles = await page.$$eval(".v-expansion-panel-title", (els) => els.map((e) => e.textContent || "").join("|"));
            t.ok(titles.includes(`specific to women (${exp.sensitive})`), `${where}: women's panel (${exp.sensitive})`);
          }
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          t.ok(overflow <= 1, `${where}: horizontal overflow ${overflow}px`);
          const helper = await page.$$eval("h2", (els) => els.some((e) => /Find your answer/.test(e.textContent || "")));
          t.ok(!helper, `${where}: helper must be hidden (no sign-offs)`);
        }
      }
      t.ok(errors.length === 0, `${marja}/${lang}/${width}: console/page errors: ${errors.slice(0, 3).join(" ; ")}`);
      await ctx.close();
    }
  }
  // category pages and the hub
  const ctx = await newContext(browser, { marja: "sistani" });
  const page = await ctx.newPage();
  await page.goto(`${BASES.off}/fiqh`, { waitUntil: "networkidle" });
  const hub = await page.textContent("body");
  t.ok(/Fasting/.test(hub) && /13 topics/.test(hub), "hub lists Fasting with 13 topics");
  for (const cat of CATEGORIES) {
    await page.goto(`${BASES.off}/fiqh/${cat}`, { waitUntil: "networkidle" });
    const links = await page.$$eval(`a[href^='/fiqh/${cat}/']`, (as) => new Set(as.map((a) => a.getAttribute("href"))).size);
    t.ok(links === data.topics.filter((x) => x.categoryId === cat).length, `category ${cat} lists all its topics (${links})`);
  }
  await ctx.close();
  return t;
}
