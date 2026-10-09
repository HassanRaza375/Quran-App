// Offline use (decision R8): the service worker installs; opening a category caches that category's chunk
// (and the core) in Cache Storage; "Save all for offline" caches every category; with the network cut every
// category still renders; and the hub shows "Saved for offline" again after a reload.
import { BASES, CATEGORIES, checker, expectedTopic, newContext, squash } from "./lib.mjs";

const cachedChunks = (page) =>
  page.evaluate(async () => {
    const c = await caches.open("wajibat-data-cache");
    return (await c.keys()).map((r) => r.url).filter((u) => /wajibat-data-/.test(u)).map((u) => /wajibat-data-([a-z]+)-/.exec(u)[1]).sort();
  });

export default async function run({ browser, data }) {
  const t = checker("offline");
  const base = BASES.off;

  // 1. visiting a category caches that category only
  {
    const ctx = await newContext(browser, { marja: "sistani", offlineOk: true });
    const page = await ctx.newPage();
    await page.goto(`${base}/fiqh/sawm/sawmniyyah`, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");
    await page.waitForTimeout(1500);
    t.ok(await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())), "service worker registered");
    const got = (await cachedChunks(page)).join();
    t.ok(got === "core,sawm", `visiting Sawm caches core + sawm (got ${got})`);
    await ctx.close();
  }

  // 2. Save all, go offline, every category renders
  const ctx = await newContext(browser, { marja: "khamenei", offlineOk: true });
  const page = await ctx.newPage();
  await page.goto(`${base}/fiqh`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate(() => navigator.serviceWorker.ready);
  const button = page.getByRole("button", { name: /Save all for offline/ });
  t.ok((await button.count()) === 1, "the hub offers 'Save all for offline'");
  await button.click();
  await page.getByRole("button", { name: /Saved for offline/ }).waitFor({ timeout: 30000 });
  const all = (await cachedChunks(page)).join();
  t.ok(all === "core,foundations,salat,sawm,taharat", `Save all caches all five chunks (got ${all})`);

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  t.ok(await page.getByRole("button", { name: /Saved for offline/ }).isVisible(), "the hub shows 'Saved for offline' after a reload");

  // A second tab: it has loaded only the core chunk. The app shell is not precached for hard navigations,
  // so offline reading means moving around inside the open app; every category chunk must then come from
  // the cache (the service worker's CacheFirst rule), not from this tab's memory.
  const reader = await ctx.newPage();
  const errors = [];
  reader.on("pageerror", (e) => errors.push(String(e)));
  await reader.goto(`${base}/fiqh`, { waitUntil: "networkidle" });
  await reader.waitForSelector(".v-text-field input");
  await ctx.setOffline(true);
  for (const cat of CATEGORIES) {
    const topic = data.topics.find((x) => x.categoryId === cat && expectedTopic(data, x, "khamenei").hasAny);
    try {
      await reader.click(`a[href='/fiqh/${cat}']`);
      await reader.click(`a[href='/fiqh/${cat}/${topic.id}']`);
      await reader.waitForSelector(".ruling-card", { timeout: 15000 });
      const cards = await reader.$$eval(".ruling-card", (e) => e.length);
      t.ok(cards === expectedTopic(data, topic, "khamenei").main, `offline: ${cat}/${topic.id} renders ${cards} cards`);
    } catch (e) {
      t.ok(false, `offline: ${cat}/${topic.id} did not render (${squash(String(e)).slice(0, 90)})`);
    }
    await reader.goBack();
    await reader.goBack();
    await reader.waitForSelector(".v-text-field input");
  }
  t.ok(errors.length === 0, `offline: no page errors ${errors.slice(0, 1)}`);
  // search works offline (it needs no category chunk)
  await reader.fill(".v-text-field input", "kaffārah");
  await reader.waitForTimeout(600);
  t.ok((await reader.$$eval("a[href*='/fiqh/sawm/']", (a) => a.length)) > 0, "offline: search finds fasting rulings");
  await ctx.setOffline(false);
  await ctx.close();
  return t;
}
