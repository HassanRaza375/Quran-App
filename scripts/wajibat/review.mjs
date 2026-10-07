// Review tools for the decision helpers (decisions A6, A7).
//
//   node scripts/wajibat/review.mjs pack [--pdf]            printable review pack per marja' and helper
//   node scripts/wajibat/review.mjs status                  how many paths of each helper are signed off
//   node scripts/wajibat/review.mjs approve <treeId> --reviewer "Name" [--paths all|id,id|@file.txt]
//                                    [--date YYYY-MM-DD] [--status approved|changes-needed] [--note "..."]
//
// The pack lists every path (questions, chosen answers, the outcome quote with its citation, the
// official Urdu of the quoted ruling where there is one) with a tick box and a notes column, in
// Markdown and HTML (and PDF with --pdf, which needs Playwright + Chromium: it is not a repo dependency).
// "approve" records a sign-off per path in app/data/wajibat/treeReviews.json together with the path's
// current content hash; any later edit to the path makes that sign-off stale. A helper is shown to
// users only when every one of its paths has a current approval (or the dev flag is on).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..", "..");
const REVIEWS = path.join(ROOT, "app", "data", "wajibat", "treeReviews.json");
const OUTDIR = path.join(ROOT, "review_pack");

const load = async () => {
  const out = path.join(ROOT, "scripts", "wajibat", ".cache", "_build", "review_bundle.mjs");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await build({
    stdin: {
      contents: 'export * from "./app/data/wajibat/index.ts"; export * from "./app/utils/wajibatReview.ts";',
      resolveDir: ROOT,
    },
    bundle: true, format: "esm", platform: "node", outfile: out, logLevel: "error",
    alias: { "~": path.join(ROOT, "app") },
  });
  return import(pathToFileURL(out).href + "?" + Date.now());
};

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name) => { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : undefined; };
const W = await load();
const reviews = JSON.parse(fs.readFileSync(REVIEWS, "utf8"));

if (cmd === "status") {
  for (const t of W.WAJIBAT_DATASET.decisionTrees) {
    const s = W.summariseReview(t, reviews);
    console.log(`${t.id}: ${s.approved}/${s.total} approved, ${s.changesNeeded} need changes, ${s.stale} changed since review, ${s.unreviewed} unreviewed${s.fullyReviewed ? "  -> VISIBLE" : "  -> hidden"}`);
  }
} else if (cmd === "approve") {
  const tree = W.WAJIBAT_DATASET.decisionTrees.find((t) => t.id === args[1]);
  if (!tree) { console.error("unknown tree id; one of: " + W.WAJIBAT_DATASET.decisionTrees.map((t) => t.id).join(", ")); process.exit(1); }
  const reviewer = flag("reviewer");
  if (!reviewer) { console.error('--reviewer "Name" is required'); process.exit(1); }
  const status = flag("status") ?? "approved";
  if (!["approved", "changes-needed"].includes(status)) { console.error("--status must be approved or changes-needed"); process.exit(1); }
  const date = flag("date") ?? new Date().toISOString().slice(0, 10);
  const spec = flag("paths") ?? "all";
  const all = W.enumeratePaths(tree);
  let wanted = all;
  if (spec !== "all") {
    const ids = new Set((spec.startsWith("@") ? fs.readFileSync(spec.slice(1), "utf8").split(/[\s,]+/) : spec.split(",")).filter(Boolean));
    wanted = all.filter((p) => ids.has(p.id));
    const missing = [...ids].filter((i) => !all.some((p) => p.id === i));
    if (missing.length) { console.error("unknown path ids: " + missing.join(", ")); process.exit(1); }
  }
  reviews[tree.id] ??= {};
  for (const p of wanted) reviews[tree.id][p.id] = { hash: W.pathHash(tree, p), status, reviewer, date, ...(flag("note") ? { note: flag("note") } : {}) };
  fs.writeFileSync(REVIEWS, JSON.stringify(reviews, null, 1) + "\n");
  console.log(`${wanted.length} path(s) of ${tree.id} recorded as ${status} by ${reviewer} on ${date}`);
} else if (cmd === "pack") {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const entryOf = (rid, marja) => W.getMarjaRuling(W.getRulingById(rid), marja);
  const today = new Date().toISOString().slice(0, 10);
  const written = [];
  for (const tree of W.WAJIBAT_DATASET.decisionTrees) {
    const marja = W.getMarjaById(tree.marjaId);
    const paths = W.enumeratePaths(tree);
    const md = [`# Review pack: ${tree.title.en}`, "",
      `- Marja': **${marja.name.en}**`, `- Helper: \`${tree.id}\` on topic \`${tree.topicId}\``, `- His own book for "I'm not sure": ${tree.risala.book}, ${tree.risala.location} (${tree.risala.url})`,
      `- Paths: **${paths.length}**. Generated ${today}. Status: **Not scholar-reviewed** until every path below is signed off.`, "",
      "How to review: for each path, read the questions and the answers chosen, then read the quoted outcome and its citation, and decide whether **that answer is right for that situation**. Tick **OK** or **Changes**, write notes. Sign-offs are recorded by path id (`node scripts/wajibat/review.mjs approve " + tree.id + ' --reviewer "Name" --paths id,id`), and a path edited after sign-off must be reviewed again.', "",
      "## Index", "", "| # | Path id | Situation (answers chosen) | Answer | OK | Changes | Notes |", "|---|---|---|---|---|---|---|"];
    const html = [`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Review pack: ${esc(tree.title.en)}</title><style>
      body{font-family:Arial,sans-serif;font-size:10.5pt;line-height:1.4;margin:18mm}h1{font-size:18pt}h2{font-size:12pt;margin:0 0 4px}
      table{border-collapse:collapse;width:100%}td,th{border:1px solid #888;padding:3px 5px;vertical-align:top;font-size:9pt}
      .path{page-break-inside:avoid;border:1px solid #666;padding:8px;margin:10px 0}.q{color:#333}.a{font-weight:bold}
      blockquote{margin:6px 0;padding:4px 8px;border-left:3px solid #999;white-space:pre-wrap}.ur{direction:rtl;text-align:right;font-family:"Noto Nastaliq Urdu","Jameel Noori Nastaleeq","Noto Naskh Arabic",serif;font-size:13pt;line-height:2}
      mark{background:#ffe08a}.cite{font-size:9pt;color:#444}.tick{margin-top:6px}.idx td:nth-child(n+5){width:9%}
      </style></head><body><h1>Review pack: ${esc(tree.title.en)}</h1><p><b>Marja':</b> ${esc(marja.name.en)} &nbsp; <b>Helper:</b> ${tree.id} &nbsp; <b>Paths:</b> ${paths.length} &nbsp; <b>Generated:</b> ${today}<br><b>Status:</b> Not scholar-reviewed until every path is signed off.<br><b>"I'm not sure" pointer:</b> ${esc(tree.risala.book)}, ${esc(tree.risala.location)}</p>
      <h2>Index</h2><table class="idx"><tr><th>#</th><th>Path id</th><th>Situation</th><th>Answer</th><th>OK</th><th>Changes</th><th>Notes</th></tr>`];
    const idxRows = [], details = [], htmlRows = [], htmlDetails = [];
    paths.forEach((p, i) => {
      const n = i + 1;
      const qa = p.steps.filter((s) => s.node.question);
      const oc = p.leaf.outcome;
      const situ = qa.map((s) => `${s.node.question.text.en} → ${s.answer}`);
      const answer = oc.kind === "ruling" ? "Ruling: " + oc.quotes.map((q) => `${entryOf(q.rulingId, tree.marjaId).source.reference}`).filter((v, k, a) => a.indexOf(v) === k).join(", ") : "Pointer to his book";
      idxRows.push(`| ${n} | \`${p.id}\` | ${situ.map((x) => x.replace(/\|/g, "/")).join("<br>")} | ${answer} | ☐ | ☐ | |`);
      htmlRows.push(`<tr><td>${n}</td><td>${esc(p.id)}</td><td>${situ.map(esc).join("<br>")}</td><td>${esc(answer)}</td><td>☐</td><td>☐</td><td></td></tr>`);
      const d = [`### Path ${n}: \`${p.id}\``, ""];
      const h = [`<div class="path"><h2>Path ${n}: <code>${esc(p.id)}</code></h2>`];
      qa.forEach((s, k) => {
        d.push(`${k + 1}. **Q:** ${s.node.question.text.en}  `, `   **A chosen:** ${s.answer}  `);
        const bo = s.optionId ? s.node.options.find((o) => o.id === s.optionId).basedOn : [];
        if (bo.length) d.push(`   *Option rests on:* ${bo.map((b) => `${b.rulingId}: "${b.phrase}"`).join("; ")}  `);
        h.push(`<p class="q">${k + 1}. <b>Q:</b> ${esc(s.node.question.text.en)}<br><span class="a">A chosen: ${esc(s.answer)}</span>${bo.length ? `<br><i>Option rests on:</i> ${esc(bo.map((b) => `${b.rulingId}: "${b.phrase}"`).join("; "))}` : ""}</p>`);
      });
      d.push("", "**Outcome:**", "");
      h.push("<p><b>Outcome:</b></p>");
      if (oc.kind === "refer") {
        d.push(`> ${oc.reason.text.en}`, ">", `> Pointer: ${tree.risala.book}, ${tree.risala.location}: ${tree.risala.url}`);
        h.push(`<blockquote>${esc(oc.reason.text.en)}<br>Pointer: ${esc(tree.risala.book)}, ${esc(tree.risala.location)}: ${esc(tree.risala.url)}</blockquote>`);
      } else {
        const seen = new Set();
        for (const q of oc.quotes) {
          const e = entryOf(q.rulingId, tree.marjaId);
          const mark = (t) => oc.verdictPhrases.reduce((acc, v) => acc.split(v).join(`\u0001${v}\u0002`), t);
          d.push(...mark(q.text).split("\n").map((l) => "> " + l.replace(/\u0001/g, "**").replace(/\u0002/g, "**")), ">");
          h.push(`<blockquote${q.lang === "ur" ? ' class="ur"' : ""}>${esc(mark(q.text)).replace(/\u0001/g, "<mark>").replace(/\u0002/g, "</mark>")}</blockquote>`);
          const cite = `${e.source.title}, ${e.source.reference}${q.lang === "ur" && e.urSource ? ` (Urdu: ${e.urSource.title}, ${e.urSource.reference})` : ""} · ${e.source.url}`;
          d.push(`> *Citation (${q.rulingId}):* ${cite}`, ">");
          h.push(`<div class="cite">Citation (${q.rulingId}): ${esc(cite)}</div>`);
          if (e.note) { d.push(`> *Note shown with it:* ${e.note}`, ">"); h.push(`<div class="cite">Note shown with it: ${esc(e.note)}</div>`); }
          if (q.lang === "en" && e.text.ur && !seen.has(q.rulingId)) {
            seen.add(q.rulingId);
            d.push("> *Official Urdu of the same ruling (for the Urdu reader; the helper shows the English quote):*", ">", ...e.text.ur.split("\n").map((l) => "> " + l), ">");
            h.push(`<div class="cite">Official Urdu of the same ruling:</div><blockquote class="ur">${esc(e.text.ur)}</blockquote>`);
          }
          if (e.urduOnly) { d.push("> *Urdu-only source: no official English translation exists; the helper says so on the result.*", ">"); h.push('<div class="cite">Urdu-only source: no official English translation exists; the helper says so on the result.</div>'); }
        }
        if (oc.seeRulingIds?.length) { d.push(`Related rulings linked: ${oc.seeRulingIds.join(", ")}`); h.push(`<p class="cite">Related rulings linked: ${esc(oc.seeRulingIds.join(", "))}</p>`); }
      }
      d.push("", "☐ OK   ☐ Changes needed   Notes: ______________________________________________", "", "---", "");
      h.push('<p class="tick">☐ OK &nbsp;&nbsp; ☐ Changes needed &nbsp;&nbsp; Notes: ______________________________________________</p></div>');
      details.push(...d); htmlDetails.push(h.join(""));
    });
    md.push(...idxRows, "", "## Paths", "", ...details);
    html.push(...htmlRows, "</table><h2 style=\"page-break-before:always\">Paths</h2>", ...htmlDetails, "</body></html>");
    const base = path.join(OUTDIR, `${tree.id}`);
    fs.writeFileSync(base + ".md", md.join("\n"), "utf8");
    fs.writeFileSync(base + ".html", html.join("\n"), "utf8");
    written.push(tree.id);
  }
  console.log("Markdown and HTML written to review_pack/ for: " + written.join(", "));
  if (args.includes("--pdf")) {
    let chromium;
    try { const m = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright"); chromium = (m.default ?? m).chromium; } catch { console.error("--pdf needs Playwright (set PLAYWRIGHT_MODULE to its path, or npm i -D playwright)"); process.exit(1); }
    const browser = await chromium.launch();
    for (const id of written) {
      const page = await browser.newPage();
      await page.goto(pathToFileURL(path.join(OUTDIR, id + ".html")).href);
      await page.pdf({ path: path.join(OUTDIR, id + ".pdf"), format: "A4", margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" }, printBackground: true });
      await page.close();
      console.log(`PDF: review_pack/${id}.pdf`);
    }
    await browser.close();
  }
} else {
  console.error("usage: review.mjs pack [--pdf] | status | approve <treeId> --reviewer NAME [--paths all|ids|@file] [--date D] [--status S] [--note N]");
  process.exit(1);
}
