// Dumps the app's Wajibat dataset (as bundled by build.py with esbuild) to JSON, so the
// Python snapshot builder can read every quoted text. Usage: node dump_dataset.mjs <bundle.mjs> <out.json>
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const [bundle, out] = process.argv.slice(2);
const W = await import(pathToFileURL(bundle).href);
fs.writeFileSync(
  out,
  JSON.stringify({ rulings: W.WAJIBAT_RULINGS, recitations: W.WAJIBAT_RECITATIONS, procedures: W.WAJIBAT_PROCEDURES, topics: W.WAJIBAT_TOPICS, decisionTrees: W.WAJIBAT_DATASET.decisionTrees })
);
console.log(`dataset: ${W.WAJIBAT_RULINGS.length} rulings, ${W.WAJIBAT_RULINGS.reduce((n, r) => n + r.rulings.length, 0)} entries`);
