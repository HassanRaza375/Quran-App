// Phase 5 specifics: texts of the fasting chapter, Khamenei's Q&A entries, the zakāt al-fiṭrah notice,
// the dawn/maghrib panel and its links, Qur'anic basis cards, search.
import { BASES, checker, gotoTopic, newContext, squash } from "./lib.mjs";

export default async function run({ browser }) {
  const t = checker("sawm");
  {
    const ctx = await newContext(browser, { marja: "sistani" });
    const page = await ctx.newPage();
    await gotoTopic(page, BASES.off, "sawm", "sawmniyyah");
    let body = await page.textContent("body");
    t.ok(body.includes("It is not necessary for one to make an intention in his heart to fast"), "Sistani 1529 shown");
    t.ok(!body.includes("Practical Laws of Islam"), "Sistani page cites no Khamenei Q&A");
    t.ok((await page.$("#khqa754")) === null, "Sistani does not see Khamenei's Q&A entry");
    await gotoTopic(page, BASES.off, "sawm", "zakatfitrah");
    body = await page.textContent("body");
    t.ok(body.includes("one ṣāʿ"), "zakāt al-fiṭrah (Sistani) shows ruling 2003");
    await gotoTopic(page, BASES.off, "sawm", "sawmtimes");
    body = await page.textContent("body");
    t.ok(/Today's dawn and maghrib/.test(body), "dawn/maghrib panel shown");
    t.ok((await page.$("a[href='/ramadan']")) !== null, "links to the Ramadan fasting log");
    t.ok((await page.$("a[href='/prayerTime']")) !== null, "links to Prayer Times");
    await gotoTopic(page, BASES.off, "sawm", "sawmwho");
    t.ok(/Qur'anic basis/.test(await page.textContent("body")), "Qur'anic basis cards on 'Who must fast'");
    await ctx.close();
  }
  {
    const ctx = await newContext(browser, { marja: "khamenei" });
    const page = await ctx.newPage();
    await gotoTopic(page, BASES.off, "sawm", "sawmmubtilat");
    const body = squash(await page.textContent("body"));
    t.ok((await page.$("#khqa763")) !== null, "Khamenei sees his Q&A 763 (injections)");
    t.ok(body.includes("supportive, nutritional or intravenous injections"), "Q&A 763 text shown");
    t.ok(/Nine things invalidate/.test(body), "Rules 817 shown");
    await gotoTopic(page, BASES.off, "sawm", "zakatfitrah");
    t.ok(/No rulings from .* have been added to this topic yet/.test(await page.textContent("body")), "zakāt al-fiṭrah: single notice for Khamenei");
    t.ok((await page.$$eval(".ruling-card", (e) => e.length)) === 0, "zakāt al-fiṭrah: no cards for Khamenei");
    await ctx.close();
  }
  {
    const ctx = await newContext(browser, { marja: "khamenei", lang: "ur" });
    const page = await ctx.newPage();
    await gotoTopic(page, BASES.off, "sawm", "sawmmubtilat");
    t.ok(/روزہ/.test(await page.textContent("body")), "Urdu mode shows Urdu text");
    await ctx.close();
  }
  {
    const ctx = await newContext(browser, { marja: "sistani" });
    const page = await ctx.newPage();
    await page.goto(`${BASES.off}/fiqh`, { waitUntil: "networkidle" });
    const input = await page.$(".v-text-field input");
    t.ok(!!input, "hub has a search box");
    if (input) {
      await input.fill("fiṭrah");
      await page.waitForTimeout(600);
      t.ok((await page.$$eval("a[href*='/fiqh/sawm/zakatfitrah']", (a) => a.length)) > 0, "search 'fiṭrah' finds the topic");
      await input.fill("kaffārah");
      await page.waitForTimeout(600);
      t.ok((await page.$$eval("a[href*='/fiqh/sawm/']", (a) => a.length)) > 0, "search 'kaffārah' finds fasting rulings (no category chunk needed)");
    }
    await ctx.close();
  }
  return t;
}
