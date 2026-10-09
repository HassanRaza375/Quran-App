// Shared helpers for the Daily Fiqh browser suites (run with `npm run test:e2e:wajibat`).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

/** The two production servers: helpers hidden (the real configuration) and helpers shown (dev flag). */
export const BASES = {
  off: process.env.WAJIBAT_E2E_BASE || "http://localhost:3457",
  on: process.env.WAJIBAT_E2E_BASE_FLAG || "http://localhost:3456",
};

/** The full dataset, bundled from the app's own source (app/data/wajibat/index.ts) for expectations. */
export const loadDataset = async () => {
  const { build } = await import("esbuild");
  const out = path.join(os.tmpdir(), "wajibat-e2e-dataset.mjs");
  await build({
    entryPoints: [path.join(REPO, "app", "data", "wajibat", "index.ts")],
    bundle: true, format: "esm", platform: "node", outfile: out, logLevel: "error",
    alias: { "~": path.join(REPO, "app") },
  });
  return (await import(pathToFileURL(out).href + "?t=" + Date.now())).WAJIBAT_DATASET;
};

/** A pass/fail counter that prints each failure as it happens. */
export const checker = (suite) => {
  const r = { suite, pass: 0, fail: 0 };
  r.ok = (cond, msg) => {
    if (cond) r.pass++;
    else { r.fail++; console.log(`  FAIL [${suite}] ${msg}`); }
  };
  return r;
};

// Errors that are not the app's: third-party APIs (offline in CI) and the Vercel analytics script, which only exists on Vercel.
export const IGNORED_CONSOLE = /aladhan|alquran|quranapi|Failed to load resource|net::ERR|_vercel.insights/i;

/** A browser context that has already chosen a marja' and a reading language. */
export const newContext = async (browser, { marja, lang = "en", width = 1280, height = 900, offlineOk = false } = {}) => {
  const ctx = await browser.newContext({ viewport: { width, height }, serviceWorkers: offlineOk ? "allow" : "block" });
  if (marja) {
    await ctx.addInitScript(([m, l]) => {
      try { localStorage.setItem("quran:fiqh-prefs:v1", JSON.stringify({ marjaId: m, lang: l, updatedAt: Date.now() })); } catch { /* storage unavailable */ }
    }, [marja, lang]);
  }
  return ctx;
};

export const watchErrors = (page) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !IGNORED_CONSOLE.test(m.text())) errors.push(m.text()); });
  return errors;
};

export const gotoTopic = async (page, base, cat, topic) => {
  await page.goto(`${base}/fiqh/${cat}/${topic}`, { waitUntil: "networkidle" });
  await page.waitForSelector("h1", { timeout: 20000 });
  await page.waitForTimeout(150);
};

export const squash = (s) => (s ?? "").replace(/\s+/g, " ").trim();

/** What a marja's follower should see of a topic: the cards and the women's panel count, and whether he has anything at all. */
export const expectedTopic = (data, topic, marja) => {
  const byId = new Map(data.rulings.map((r) => [r.id, r]));
  const rs = topic.rulingIds.map((id) => byId.get(id)).filter((r) => r && (!r.supplementary || r.supplementary.marjaId === marja) && (!r.audience || r.audience === marja));
  const hasAny = rs.some((r) => r.rulings.some((e) => e.marjaId === marja) || (r.seeAlso || []).some((s) => s.marjaId === marja));
  const main = rs.filter((r) => !r.sensitive && !r.panel).length;
  const empty = (rs.length > 0 || topic.rulingIds.length > 0) && !hasAny;
  return { rulings: rs, hasAny, empty, main: empty ? 0 : main, sensitive: rs.filter((r) => r.sensitive).length };
};

export const CATEGORIES = ["foundations", "taharat", "salat", "sawm", "khums", "zakat"];

/** The text of one ruling card by id; a women-specific ruling sits in a collapsed panel, which is opened first. */
export const cardText = async (page, id) => {
  if (!(await page.$(`#${id}`))) {
    const title = page.locator(".v-expansion-panel-title", { hasText: "specific to women" });
    if (await title.count()) await title.first().click();
    await page.waitForSelector(`#${id}`, { timeout: 5000 });
  }
  return squash(await page.$eval(`#${id}`, (el) => el.textContent));
};
