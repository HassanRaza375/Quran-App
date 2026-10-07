// Reproducible install-size measurement (decision A4). Run after `npm run build`:
//   node scripts/measure-install-size.mjs [--json]
// "Install size" = every file in the service worker's precache manifest (what a first visit
// downloads to install the PWA), read from .output/public/sw.js and summed from the built files.
// The Wajibat ruling chunk is excluded from the precache on purpose (R8), so it is reported
// separately. KiB = 1024 bytes. Gzip uses zlib level 9 as a stand-in for transfer size.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const PUBLIC = path.resolve(".output/public");
const swPath = path.join(PUBLIC, "sw.js");
if (!fs.existsSync(swPath)) {
  console.error("No .output/public/sw.js: run `npm run build` first.");
  process.exit(1);
}
const sw = fs.readFileSync(swPath, "utf8");
const urls = [...new Set([...sw.matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1].split("?")[0]))].sort();
const size = (file) => {
  const buf = fs.readFileSync(file);
  return { raw: buf.length, gzip: zlib.gzipSync(buf, { level: 9 }).length };
};
let raw = 0, gzip = 0;
const missing = [];
for (const u of urls) {
  const f = path.join(PUBLIC, u.replace(/^\//, ""));
  if (!fs.existsSync(f)) { missing.push(u); continue; }
  const s = size(f);
  raw += s.raw; gzip += s.gzip;
}
const chunks = fs.readdirSync(path.join(PUBLIC, "_nuxt")).filter((f) => /^wajibat-data-.*\.js$/.test(f));
const data = chunks.map((f) => ({ file: f, ...size(path.join(PUBLIC, "_nuxt", f)), precached: urls.some((u) => u.endsWith(f)) }));
const kib = (n) => Math.round((n / 1024) * 100) / 100;
const out = {
  precacheEntries: urls.length,
  missingFiles: missing.length,
  installKiB: kib(raw),
  installGzipKiB: kib(gzip),
  wajibatDataChunks: data.map((d) => ({ file: d.file, kib: kib(d.raw), gzipKiB: kib(d.gzip), precached: d.precached })),
};
if (process.argv.includes("--json")) console.log(JSON.stringify(out, null, 2));
else {
  console.log(`Install size (precache of ${out.precacheEntries} files): ${out.installKiB} KiB raw, ${out.installGzipKiB} KiB gzip`);
  for (const d of out.wajibatDataChunks) console.log(`Wajibat ruling chunk ${d.file}: ${d.kib} KiB raw, ${d.gzipKiB} KiB gzip, precached: ${d.precached}`);
  if (missing.length) console.log(`WARNING: ${missing.length} precache entries not found on disk`);
}
