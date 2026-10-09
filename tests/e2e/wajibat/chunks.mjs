// Each /fiqh category loads its own data chunk, and only that one. Network-level check of which
// wajibat-data-*.js files a visit downloads, plus the size of every chunk (raw and gzip) from the build.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { BASES, REPO, checker, gotoTopic, newContext } from "./lib.mjs";

export const chunkSizes = () => {
  const dir = path.join(REPO, ".output", "public", "_nuxt");
  return fs.readdirSync(dir).filter((f) => /^wajibat-data-.*\.js$/.test(f)).map((f) => {
    const buf = fs.readFileSync(path.join(dir, f));
    return { file: f, name: f.replace(/^wajibat-data-([a-z]+)-.*$/, "$1"), raw: buf.length, gzip: zlib.gzipSync(buf, { level: 9 }).length };
  }).sort((a, b) => a.name.localeCompare(b.name));
};

export default async function run({ browser }) {
  const t = checker("chunks");
  const sizes = chunkSizes();
  t.ok(sizes.map((s) => s.name).join() === "core,foundations,khums,salat,sawm,taharat,zakat", `seven data chunks (core + 6 categories): ${sizes.map((s) => s.name)}`);
  const visit = async (steps) => {
    const ctx = await newContext(browser, { marja: "sistani" });
    const page = await ctx.newPage();
    const seen = new Set();
    page.on("request", (r) => {
      const m = /wajibat-data-([a-z]+)-[^/]+\.js$/.exec(r.url());
      if (m) seen.add(m[1]);
    });
    for (const s of steps) {
      if (s === "hub") await page.goto(`${BASES.off}/fiqh`, { waitUntil: "networkidle" });
      else await gotoTopic(page, BASES.off, ...s.split("/"));
    }
    await ctx.close();
    return [...seen].sort().join();
  };
  t.ok((await visit(["hub"])) === "core", "the hub loads only the core chunk");
  t.ok((await visit(["sawm/sawmniyyah"])) === "core,sawm", "a Sawm topic loads core + sawm only");
  t.ok((await visit(["salat/doubts"])) === "core,salat", "a Salat topic loads core + salat only");
  t.ok((await visit(["taharat/wudu"])) === "core,taharat", "a Taharat topic loads core + taharat only");
  t.ok((await visit(["foundations/taqlid"])) === "core,foundations", "a Foundations topic loads core + foundations only");
  t.ok((await visit(["sawm/sawmniyyah", "salat/doubts"])) === "core,salat,sawm", "two categories load two category chunks");
  return t;
}
