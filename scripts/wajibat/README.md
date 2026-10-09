# Wajibat data generators

Every ruling text in `app/data/wajibat/rulings/*.ts`, `procedures/*.ts` and `glossary.ts` is
**generated** by these scripts from the maraji's official websites. Nothing is typed by hand.

> **Never hand-edit a generated data file** (decision R9 in `wajibat_decisions.md`).
> To change a ruling, change the generator, then regenerate. A hand edit is lost on the next
> build, and it usually breaks the source-snapshot test.

## Generated vs authored files

| File | Made by |
|---|---|
| `app/data/wajibat/rulings/foundations.ts` | `gen_foundations.py` |
| `app/data/wajibat/rulings/taharat.ts`, `procedures/taharat.ts` | `gen_taharat.py` |
| `app/data/wajibat/rulings/salat.ts`, `procedures/salat.ts` | `gen_salat.py` |
| `app/data/wajibat/rulings/salatQa.ts` | `gen_kqa.py`: Khamenei's Q&A book as supplementary entries (P13/R7) |
| `app/data/wajibat/rulings/sawmQa.ts` | `gen_kqa.py` (second output): the fasting chapter of Khamenei's Q&A book as supplementary entries (Phase 5) |
| `app/data/wajibat/rulings/sawm.ts` | `gen_sawm.py` (Phase 5): fasting and zakāt al-fiṭrah, Sistani 1529–1718 and 2003–2044, Khamenei's Rules 787–981 |
| `app/data/wajibat/rulings/khums.ts`, `zakat.ts` | `gen_khums.py` (Phase 6): Sistani Khums 1768–1866 and Zakat 1871–2002 (plus the unnumbered business-goods passage), with Khamenei's *The Rulings of Khums* Q&A (paired by number, or stand-alone with `audience`) |
| `app/data/wajibat/rulings/doubts.ts` | `gen_doubts.py`: doubts, ṣalāt al-iḥtiyāṭ, sajdat al-sahw (Phase 4a) |
| `app/data/wajibat/glossary.ts` | `gen_glossary.py` |
| `app/data/wajibat/decisionTrees/<category>.ts`, `decisionTrees.ts` | `gen_helpers.py` (Phase 4b; one file per category, `decisionTrees.ts` aggregates them for tests and scripts): the four decision helpers, authored as data in `tree_sd.py` (Sistani doubts), `tree_kd.py` (Khamenei doubts) and `tree_w.py` (wuḍūʾ, both), using `helpers_dsl.py`. Every quote is cut verbatim from the dataset dump and every option's `basedOn` phrase is checked against the marja's text; the generator reports all authoring errors at once. |
| `scripts/wajibat/treatise.py` | not a generator: reads Khamenei's Urdu treatise (*Aḥkām-e Āmūzishī*, lesson 16) for the Urdu-only wuḍūʾ entries `gen_taharat.py` uses (P19) |
| `tests/fixtures/wajibatSourceSnapshot.json` | `snapshot.py`: the source unit of every quote, read from the downloaded pages |
| `app/data/wajibat/topics.ts`, `categories.ts`, `recitations.ts`, `marja.ts` | **authored** (app-written summaries). Exceptions: `gen_doubts.py` keeps its topics' `rulingIds` in sync, and `place_qa_ids.py` places the Q&A ids. |

## Regenerating

From the repo root:

```bash
pip install pymupdf                       # only needed if sis_en.txt (a PDF) must be re-fetched
python scripts/wajibat/fetch_sources.py   # download any missing source into scripts/wajibat/.cache/
python scripts/wajibat/build.py           # regenerate every data file + the snapshot fixture
npm test                                  # the dataset validator and the verbatim checks must pass
git diff app/data/wajibat tests/fixtures  # review every changed quote before committing
```

`build.py` also needs Node and the repo's `esbuild` (`npm install`), because it dumps the dataset
for the snapshot. It dumps twice: once before `gen_helpers.py` (the trees quote the dump) and once after (so the
snapshot and tests see the trees).

To check the supplementary Q&A entries word for word against the cited leader.ir pages:
`python scripts/wajibat/verify_live_qa.py`.

## Sources and the manifest

- **Where the sources live:** raw downloaded pages are **not committed**. They live in
  `scripts/wajibat/.cache/`, which is git-ignored.
- **The manifest:** `sources.manifest.json` lists every cached file with:
  - `url`: where it comes from;
  - `method`: how it is re-created (below);
  - `fetched`: the date of the copy the data was built from;
  - `sha256`: of the file, with CRLF normalised to LF.
- **How each method re-creates a file:**
  - `page`: HTML fetched, then converted to text by `h2t.py`. This is the exact converter the data
    was built with; re-fetching a page reproduces the old file byte for byte.
  - `pdf`: the official PDF, as text via PyMuPDF.
  - `leader-tree`: a leader.ir book crawled through the site's own contents endpoint by
    `crawl_book.py`. That endpoint includes the sections the page shows collapsed.
  - `raw`: HTML kept as is, for `verify_live_qa.py`.
- **Commands:**
  - `fetch_sources.py`: downloads missing files, then checks every hash.
  - `--refresh`: re-downloads everything and lists the files whose official page changed.
  - `--record`: stores the current hashes.
- **If a page changed:** rebuild, review the diff of the affected rulings, and only then
  `--record` the new hashes.
- **leader.ir rate limits:** it sometimes refuses connections after a burst of requests. Wait,
  and crawl with `CRAWL_DELAY=1.5`.

## How the verbatim guarantee works

1. Every generator looks texts up by their book number (`src.py`, `kh_rpf.py`) and cuts excerpts
   with `_cut()`. That function fails if a start or end string isn't found. Nothing is typed.
2. `snapshot.py` records, for every quote, the official unit it came from (a whole numbered
   ruling or Q&A, or the surrounding passage of an unnumbered intro). It reads these units from
   the downloaded pages, never from the dataset.
3. `validateSourceSnapshot()` (`app/utils/wajibatValidate.ts`, run by `npm test`) checks every
   quote against that unit:
   - it must equal its numbered unit;
   - or, if marked `excerpt` or taken from an unnumbered passage, it must be a verbatim part of it.

   A paraphrase, a splice or a hand edit fails the test.

## Module map

| Script | Role |
|---|---|
| `paths.py` | Locations: `.cache/` (sources), `.cache/_build/` (scratch), the app's data folder |
| `src.py` | Indexes Sistani's English and Urdu rulings by number, and Khamenei's Q&A by number |
| `kh_rpf.py` | Indexes Khamenei's *Rules on Prayer & Fasting 2023* by ruling number |
| `kh_khums.py` | Indexes Khamenei's *The Rulings of Khums* by question number in the English, official Urdu and Persian editions (crawled with `crawl_book.py`); decides which questions parse cleanly. `kh_fitr.py` reads his older zakāt al-fiṭrah Q&A; it is not used (no citable page, decision H8). |
| `kh_stm.py` | The unnumbered rule paragraphs of *The Rulings of Khums*: extracts them from the three editions and lines them up section by section (Persian ↔ Urdu by shared vocabulary, English ↔ Persian by length and numbers). Only a paragraph all three editions confirm is paired; the rest stay English only. Citations are "Para. n, section" (Urdu فقرہ, Persian بند). |
| `entries.py` | Shared builders `S()` (Sistani), `K()` (Khamenei), `R()` (one ruling, per marja'), `finalize()`, `ts()`. Rulings withheld from display (`HIDDEN_RPF`, e.g. P15) live here with their reasons. |
| `qa_sections.py`, `picks.py` | Section map of the Q&A book; the Q&As compared with the *Rules*, with the agree/differ verdicts |
| `place_qa_ids.py` | Puts each Q&A id after the *Rules* ruling it was compared with |
| `dump_dataset.mjs`, `snapshot.py` | Dataset dump, then the snapshot fixture |
| `fetch_sources.py`, `crawl_book.py`, `h2t.py` | Re-create the source cache |
| `verify_live_qa.py` | Q&A entries vs the live leader.ir pages |
| `align_rules.py` | Aligns Khamenei's *Rules* across the Persian original (book 180), the official Urdu (197) and the English (241); English-to-Persian numbering |
| `rules_verdicts.py` | The R11 verdicts: where the English or Urdu differs from the Persian, which one is withheld, and why |
| `gen_index.py` | Writes `app/data/wajibat/rulingIndex.ts`, one line per ruling (id, topic, subject), so search and links need no category chunk. `build.py` runs it last. |
| `gen_sawm.py` | Phase 5: every ruling of the two Sistani ranges and Khamenei's 787–981, paired by point (`R()`), with the `see_also` pointers and the women-specific (`sensitive`) flags. It also keeps each Sawm topic's `rulingIds` in step. |
| `gen_khums.py` | Phase 6: every Sistani ruling of the Khums and Zakat chapters, the `PAIR` table (Khamenei question ↔ Sistani ruling, read by a person), the `STAR` table (revised rulings compared with the Urdu), and Khamenei's stand-alone questions. Two outputs: `khums.ts`, `zakat.ts`. |
| `align_rules.en_to_persian` | English → Persian ruling number. The official Urdu follows the English order (+2 in the fasting chapter); the Persian original puts English 880 at 902 and runs +1 from 881 to 900 |
| `review_rules.py`, `fa_view.py` | Print the three editions side by side for review (not part of the build) |

## Review round tools (Phase 4b follow-up)

| Command | What it does |
|---|---|
| `python scripts/wajibat/mismatch.py` | Automated mismatch check (decision A1): numbers, ordinal words and negation words across every language version of every ruling (English/Urdu from the dataset, Persian from the downloaded pages). Writes `tests/fixtures/wajibatMismatches.json`, adds new mismatches to `tests/fixtures/wajibatMismatchDecisions.json` as `pending`, and rewrites `wajibat_mismatch_report.md`. `build.py` runs it. A person decides each row; `tests/wajibatMismatch.test.ts` fails on any mismatch that has no decision entry. |
| `node scripts/wajibat/review.mjs pack [--pdf]` | Review pack per helper in `review_pack/` (Markdown, HTML, PDF with `--pdf`; PDFs need Playwright, which is a devDependency: after `npm install` run `npx playwright install chromium` once). |
| `node scripts/wajibat/review.mjs status` / `approve <helper> --reviewer "Name" [--paths all\|ids\|@file]` | Show or record per-path sign-offs in `app/data/wajibat/treeReviews.json`. A helper is shown only when every path has a current approval, or the dev flag `NUXT_PUBLIC_WAJIBAT_SHOW_UNREVIEWED_HELPERS=true` is set. |
| `npm run size` | Install size from the built service worker's precache manifest (run `npm run build` first). The only source of install-size figures. |
| `python scripts/wajibat/decide_mismatch.py --ruling ID [--marja M] --status accepted\|restored\|fix\|withhold\|decided --reviewer "Name" --note "..."` | Records a person's decision on mismatch rows (B1). **Restoring a hidden version is done only this way**; then run `python scripts/wajibat/build.py`. |
| `NUXT_PUBLIC_WAJIBAT_SHOW_UNREVIEWED_HELPERS` | Local dev flag: show helpers whose paths are not all signed off. **Never set it on Vercel**: a production build (`NODE_ENV=production` or `VERCEL_ENV=production`) fails if it is on (`app/utils/wajibatBuildGuard.ts`, called from `nuxt.config.ts`). |

### Display holds and the two-pass build (decision B1)
`build.py` generates the data twice. Pass 1 (`WAJIBAT_HOLDS=0`) writes every language version so `mismatch.py` can compare them and `triage_mismatch.py` can set the safe defaults in `tests/fixtures/wajibatMismatchDecisions.json`: Sistani high rows hide the Urdu (`hidden-pending-review`); Khamenei high rows show the version that matches the Persian and hide the other (`persian-decided-pending-review`); rows the Persian cannot decide are `needs-human` (displayed as before; see `wajibat_needs_human.md`); low rows are `low-pending-review`. Pass 2 applies the holds (`holds.py`). A person's decisions in that file (`accepted`, `restored`, ...) are never overwritten.

