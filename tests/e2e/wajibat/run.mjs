// One command for every Daily Fiqh browser suite against a production build:
//     npm run test:e2e:wajibat                              builds the app (npm run build), starts two servers, runs all suites
//     npm run test:e2e:wajibat -- --skip-build              reuse an existing .output
//     npm run test:e2e:wajibat -- --suite helpers,offline   run some suites only
// Needs Playwright's Chromium once: npx playwright install chromium
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { BASES, REPO, loadDataset } from "./lib.mjs";
import { chunkSizes } from "./chunks.mjs";

const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const only = (args.includes("--suite") ? args[args.indexOf("--suite") + 1] ?? "" : "").split(",").filter(Boolean);
const SUITES = ["categories", "sawm", "holds", "guided", "helpers", "chunks", "offline"];

if (!skipBuild || !fs.existsSync(path.join(REPO, ".output", "server", "index.mjs"))) {
  console.log("Building the app (npm run build)...");
  const b = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], { cwd: REPO, stdio: "inherit", shell: process.platform === "win32" });
  if (b.status !== 0) {
    console.error("Build failed.");
    process.exit(1);
  }
}

const servers = [];
const stop = () => servers.forEach((s) => s.kill());
process.on("exit", stop);
const start = async (port, extraEnv) => {
  const child = spawn(process.execPath, [path.join(REPO, ".output", "server", "index.mjs")], {
    cwd: REPO, env: { ...process.env, PORT: String(port), NITRO_PORT: String(port), ...extraEnv }, stdio: "ignore",
  });
  servers.push(child);
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://localhost:${port}/fiqh`)).ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server on ${port} did not start`);
};

let failed = 0;
try {
  // helpers hidden (the real configuration) on one port; the dev flag on another, for the helper walk only
  await start(Number(new URL(BASES.off).port), {});
  await start(Number(new URL(BASES.on).port), { NUXT_PUBLIC_WAJIBAT_SHOW_UNREVIEWED_HELPERS: "true" });
  const data = await loadDataset();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const results = [];
  for (const name of SUITES.filter((s) => !only.length || only.includes(s))) {
    console.log(`\n== ${name}`);
    const started = Date.now();
    const r = await (await import(`./${name}.mjs`)).default({ browser, data });
    r.seconds = Math.round((Date.now() - started) / 1000);
    results.push(r);
    console.log(`   ${r.pass} passed, ${r.fail} failed (${r.seconds}s)`);
  }
  await browser.close();
  console.log("\nSuite results");
  for (const r of results) console.log(`  ${r.suite.padEnd(11)} ${String(r.pass).padStart(5)} passed  ${String(r.fail).padStart(3)} failed`);
  failed = results.reduce((n, r) => n + r.fail, 0);
  console.log(`  ${"total".padEnd(11)} ${String(results.reduce((n, r) => n + r.pass, 0)).padStart(5)} passed  ${String(failed).padStart(3)} failed`);
  console.log("\nData chunks (from the build)");
  for (const s of chunkSizes()) console.log(`  ${s.name.padEnd(11)} ${(s.raw / 1024).toFixed(2).padStart(9)} KiB raw  ${(s.gzip / 1024).toFixed(2).padStart(8)} KiB gzip`);
} finally {
  stop();
}
process.exit(failed ? 1 : 0);
