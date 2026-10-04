# Wajibat Module — Progress Log

Running log for Module 18 (Wajibat & Daily Fiqh, Ja'fari, route `/fiqh`).
Spec: `wajibat-fiqh-jafari-module.md` · Decisions: `wajibat_decisions.md` (decisions win when the two disagree).
Each topic dataset gets a §13.1 topic summary, and each phase gets a §13.2 completion report.

---

## Phase 0 — Inspection & architecture — Completion Report (2026-09-25)

### What was inspected
- `package.json`, `nuxt.config.ts`: UI kit, fonts, head links
- `app/pages/poets/[slug].vue` and `app/pages/commands/[id].vue`: the most recently built pages (Q5)
- `app/components/layout/LayoutNavigationDrawer.vue`: sidebar structure
- `app/stores/prayer.js`, `app/utils/prayerFiqh.js`: how `prayer.fiqh` is stored and read
- `app/pages/settings.vue`: the fiqh toggle, the "Additional Modules" switch, export and wipe
- `app/plugins/storage.client.js`: the `$storage` wrapper
- `app/pages/bookmarks.vue`: tab and namespace structure
- `app/components/persons/AyahReferenceCard.vue`: props
- `app/utils/quranReference.ts`: shared Qur'an-citation types
- `app/data/quranCommands.ts`: the Qur'anic-text Commands layer and its id style
- `app/composables/usePoetModules.ts`: the latest example of a stateful composable
- `MODULE_BLUEPRINT.md`: Module Index, Shared Foundation, Module 17, Cross-Module Conventions
- The official websites of all three maraji'. The full source table is in `wajibat_decisions.md`.

### What was built / changed
No feature code was written in this phase (per spec).

### Files created / changed
- `wajibat_decisions.md`: filled in the Phase 0 findings (Q5, the official source table) and added pending questions P1–P4
- `wajibat_progress_log.md`: created (this file)
- `CLAUDE.md`: added a one-line pointer to the spec, the decisions file, and this log
- `MODULE_BLUEPRINT.md`: added the Module 18 row to the index and a stub Module 18 section

### Content added
None. Content starts in Phase 1.

### Sources used (reachability checked 2026-09-25)
- **Sistani:** *Islamic Laws*, 4th ed. (English, "Ruling n") and *توضیح المسائل* (Urdu). Both the pages and the PDFs load. ✅
- **Khamenei:** *Practical Laws of Islam* (English Q&A, "Q n"), *The Rules on Prayer & Fasting 2023* (numbered), and *استفتاآت کے جوابات* (Urdu), all on leader.ir. They load. ✅
- **Makarem Shirazi:** the official site loads, but no English or Urdu risala text could be reached. The announced PDF returns 404, the ahkam portal returns 404/403, and the TOC is rendered with JavaScript. ❌ See pending question P1.

### Architecture decisions (and why)
1. **UI kit: Vuetify 3** (Q5). Evidence is in `wajibat_decisions.md`.
2. **Shared types:** `QuranReference`, `SourceType` and `SourceReference` were **already extracted** to
   `app/utils/quranReference.ts` (Knowledge Platform Phase 2). Nothing needs extracting now.
   `WajibatTopic.quranicBasis` imports `QuranReference` from there.
3. **Separate verification vocabulary.** The `A | B | D` levels and `RulingBasis`
   (`fatwa | ihtiyat_wajib | ihtiyat_mustahab`) measure *which authority a fiqh ruling rests on*.
   The existing Knowledge Platform scales measure *how certain a Qur'anic/historical identification is*.
   This follows the precedent `quranCommands.ts` set with `CommandSourceBasis`: define a separate,
   module-local type rather than overload `SourceType` or `IdentificationBasis`, whose values already
   carry meaning in other modules. Shared Foundation #5 ("don't invent a near-duplicate scale") isn't
   violated, because this is a different axis and the spec (§5) requires these exact levels.
4. **Id style:** Shared Foundation #1 says entity ids are lowercase ASCII with **no hyphens**
   (e.g. `prayercommand`). Wajibat follows that for entity ids (`wudu`, `ghusljanabat`,
   `mubtilatsalat`), which differs from the spec's §7.1 proposal of hyphenated slugs. Ids double as
   URL segments, so routes look like `/fiqh/taharat/ghusljanabat`.
5. **Data layout:** `app/data/wajibat/` is a folder split by category (spec §10), not the single
   `app/data/quranX.ts` file that other modules use. The dataset will be much larger, and spec
   Phase 10 requires lazy loading per category.
6. **Routes:** `app/pages/persons/timeline.vue` already sits beside `persons/[id].vue` and wins
   (vue-router ranks static segments above dynamic ones). `/fiqh/glossary` and `/fiqh/choose-marja`
   next to `/fiqh/[category]/` rely on the same behaviour. This will be re-checked in the browser in Phase 1.
7. **Marja' preference persistence:** `useFiqhPrefs` stores `quran:fiqh-prefs:v1` through
   `$storage` with the same load/persist shape as `usePoetModules.ts`. Settings → export and wipe
   (`settings.vue` `exportData`/`clearAllData`) dump and clear **all** of `localStorage`, so the new
   key is included **automatically**. No change is needed there.
8. **Fiqh setting:** `usePrayerStore().fiqh` (`"sunni" | "jafari"`, legacy raw key `prayerFiqh`)
   stays the only source of truth. The Settings marja' selector goes under the existing fiqh toggle
   and appears only when `fiqh === "jafari"`.
9. **Bookmarks:** `bookmarks.vue` defines a fixed tab list and filters each tab with
   `startsWith("{type}:")`. A "Fiqh" tab filtering on `fiqh:` is a purely additive change. The key is
   `fiqh:{topicId}`, stored through `useBookmarks().toggle()`.
10. **Qur'anic basis cards:** `AyahReferenceCard` takes one ayah (`surahNo`, `ayahNo`). A range
    such as 5:6 on its own is fine, but a multi-ayah basis renders one card per ayah, the same way
    other modules do it.
11. **Separation from Commands (Knowledge Platform Phase 9):** `/commands` is the Qur'anic-text layer.
    `/fiqh` is the marja'-ruling layer. There are no shared data files. Cross-links are left to the
    Phase 10 Knowledge Graph.

### Adjustments to the spec's §7.1 data model
- Entity ids have no hyphens (decision 4).
- `quranicBasis?: QuranReference[]` imports from `app/utils/quranReference.ts`.
- Everything else in §7.1 stands as proposed until Phase 1 implementation shows otherwise. Any change will be reported.

### Shared patterns reused / created
Reused: `$storage`, the `useState` composable pattern, `useBookmarks.toggle`, `AyahReferenceCard`,
`quranReference.ts`, the `{module}Validate.ts` + `tests/{module}Dataset.test.ts` pattern, and the
Module 17 accessibility patterns. Created: none yet.

### Tests / Lint / Build
Not run. Phase 0 changed only documentation.

### Browser verification / Regression
Not run. No UI changed.

### Known issues
- The sidebar has no "Worship" group (P3).
- The Noto Nastaliq Urdu font isn't loaded anywhere in the app (P4).

### Unsourced items left out
All of Makarem Shirazi's rulings, until P1 is resolved.

### Open questions for the user
P1–P4 in `wajibat_decisions.md`.

### Recommended next phase
Phase 1 (Foundation) can start once P1–P4 are answered. P1 blocks only Makarem Shirazi content,
not the Phase 1 code. P3 and P4 are needed for the shell UI.

---

### Phase 1 · Taqlid — 2026-09-25
- Rulings added, per marja': Sistani 11 · Khamenei 6 · Makarem Shirazi 0 (A: 17, B: 0, D: 0)
- Procedures / decision trees added: none (none needed for this topic)
- Sources used: Sistani, *Islamic Laws* 4th ed., Rulings 1–4 and 6–9, plus 12* (https://www.sistani.org/english/book/48/2117/); Urdu *توضیح المسائل* masa'il 1–12, same numbers (https://www.sistani.org/urdu/book/61/3332/). Khamenei, *Practical Laws of Islam* Q 2, 6, 7, 8, 9 and 13 (leader.ir `sn=5238`, `sn=5239`); Urdu *استفتاآت کے جوابات* س 2, 6, 7, 8, 9 and 13, same numbers in this chapter (`sn=11366`, `sn=11367`).
- Differences between maraji' flagged: none. Each marja's entry is shown on its own, and nothing is compared or merged.
- Unsourced / needs research: Khamenei has no entry yet for *following the aʿlam*, *identifying a mujtahid*, *obtaining a fatwa*, *recommended precaution* or *death of the marja'*. His Q&A book covers some of these; they were left out, not guessed. Q 16 (aʿlam) is held back, see P5.
- Questions for the user: P5.

### Phase 1 · Ahkam (the five rulings) — 2026-09-25
- Rulings added: Sistani 1 · Khamenei 0 · Makarem 0 (A: 1)
- Sources used: Sistani, *Islamic Laws* Ruling 12*, closing paragraph on doing acts *rajāʾan* (English only; this paragraph is not in the Urdu مسئلہ ۱۲). The five definitions are app-written explanation, and the glossary definitions are quoted from *Islamic Laws*' Glossary.
- Unsourced / needs research: a Khamenei ruling on this topic.

### Phase 1 · Usul al-Din (overview) — 2026-09-25
- Rulings added: Sistani 1 · Khamenei 1 · Makarem 0 (A: 2)
- Sources used: Sistani, Ruling 1 (first paragraph; Urdu مسئلہ ۱). Khamenei, Q1312 (`sn=5204`); Urdu **س1321** (`sn=23170`). The Urdu Q number differs from the English one, and each is cited with its own number (R1).
- The list of the five usul is app-written explanation.

### Phase 1 · Furu' al-Din (overview) — 2026-09-25
- Explanation only (the list of the ten furu'). No rulings.

### Phase 1 · Bulugh — 2026-09-25
- Rulings added: Sistani 3 · Khamenei 3 · Makarem 0 (A: 6)
- Sources used:
  - Sistani, Ruling 2270* excerpt and 2271* (https://www.sistani.org/english/book/48/2355/), plus Ruling 434 (`/2171/`); Urdu مسئلہ ۲۲۷۰ excerpt (https://www.sistani.org/urdu/book/61/3648/).
  - Khamenei, Q1871, Q1873 and Q1878 (`sn=5232`); Urdu س 1887, س 1889 and س 1894 (`sn=23199`).
- **Edition difference found (see P6):** the English 4th edition revised Rulings 2270 and 2271 (marked *). The official Urdu مسئلہ ۲۲۷۱ still says facial hair is "بعید نہیں کہ بلوغت کی علامت ہو" (not unlikely to be a sign). The revised English says it *is* a sign. The Urdu is therefore **not** shown for 2271. For 2270, the excerpt used (the signs themselves) matches between the two; another part of 2270 does differ, and it is not shown.
- The women-specific ruling (bleeding before nine) is inside a collapsed panel (Q8).
- English only, no official Urdu shown: Sistani 2271* (edition difference) and 434 (the Urdu مسئلہ was not found in the chapter page fetched).
- Unsourced: Sistani has no separate entry for "lunar or solar years" (his Ruling 2270 does say "lunar years"; this is visible under *Signs of bulugh*). Khamenei has no entry for facial hair.

## Phase 1 — Foundation — Completion Report (2026-09-25)

### What was inspected
Everything from Phase 0, plus: the useBookmarks API and the `/bookmarks` tab structure, the Settings fiqh block, the prayer store's `loadFiqh`/`init` (runs in the default layout on the client), the poet pages' existing Urdu styling, the PWA `globPatterns`, and the vitest/eslint setup.

### What was built / changed
- **Data layer** (`app/data/wajibat/`): types, the three maraji', 9 categories, 5 Foundations topics, 17 rulings (26 per-marja' entries) and 19 glossary terms.
- **Pure logic and tests:** validator, search and coverage helpers, with three test files (24 tests).
- **Marja' preference:** `useFiqhPrefs` (key `quran:fiqh-prefs:v1`, `{marjaId, lang, updatedAt}`), a first-visit picker (inline on the hub and topic pages, and at `/fiqh/choose-marja`), and a Settings selector shown only when fiqh = Ja'fari.
- **Components** (`app/components/wajibat/`): HukmBadge, BasisBadge (ihtiyat tooltip), SourceLine, RulingCard (never falls back to another marja'), ExplanationBlock (dashed and italic, labelled "written by the app, not a ruling"), MarjaChip, MarjaPicker, FiqhNotices (Sunni banner and "Not scholar-reviewed"), FiqhDisclaimer, LangToggle (English / اردو / Both).
- **Pages:** `/fiqh` (hub, search, categories), `/fiqh/[category]` (topics, or a "scheduled for phase N" empty state), `/fiqh/[category]/[topic]`, `/fiqh/glossary`, `/fiqh/choose-marja`.
- **Integration:** a sidebar entry above Prayer Times (P3), a `/bookmarks` "Fiqh" tab (`fiqh:{topicId}`), and the Urdu font on `/fiqh/**` and `/poets/**` (P4).

### How the ruling texts were produced (anti-hallucination)
No ruling text was typed or translated by hand. The official pages were downloaded (sistani.org HTML and the 4th-edition PDF, and the leader.ir English and Urdu Q&A books), and a script cut each excerpt out verbatim from them. The script **fails if any excerpt isn't found** in its source. Only footnote markers like `[3]` were removed; the translator's own `[i.e. …]` glosses were kept. The glossary was produced the same way from *Islamic Laws*' Glossary. The generator scripts and downloaded pages stayed in the session scratchpad and are not in the repo (they're third-party pages). To re-verify, re-open the cited URL; every entry carries it.

### Files created / changed
- Created:
  - `app/data/wajibat/{types,marja,categories,topics,glossary,index}.ts` and `app/data/wajibat/rulings/foundations.ts`
  - `app/utils/{wajibatValidate,wajibatSearch,wajibatCoverage,wajibatLabels}.ts`
  - `app/composables/{useFiqhPrefs,useWajibat,useUrduFont}.ts`
  - `app/components/wajibat/*.vue` (10 files)
  - `app/pages/fiqh/{index,glossary,choose-marja}.vue` and `app/pages/fiqh/[category]/{index,[topic]}.vue`
  - `tests/wajibat{Dataset,Search,Coverage}.test.ts`
- Changed:
  - `app/pages/settings.vue` (marja' select)
  - `app/pages/bookmarks.vue` (Fiqh tab)
  - `app/components/layout/LayoutNavigationDrawer.vue` (entry)
  - `app/pages/poets/[slug].vue` and `app/pages/poets/index.vue` (Nastaliq font)
  - `app/assets/css/main.css` (`.urdu-text` / `.urdu-inline`)
  - `package.json` (+`@fontsource/noto-nastaliq-urdu`)
  - `wajibat_decisions.md`, `MODULE_BLUEPRINT.md`, this log

### Content added
| Topic | Rulings | Sistani (A) | Khamenei (A) | Makarem | Sistani with Urdu | Khamenei with Urdu |
|---|---|---|---|---|---|---|
| Taqlid | 11 | 11 | 6 | 0 | 11 | 6 |
| Ahkam | 1 | 1 | 0 | 0 | 0 | — |
| Usul al-Din | 1 | 1 | 1 | 0 | 1 | 1 |
| Furu' al-Din | 0 (explanation only) | — | — | — | — | — |
| Bulugh | 4 | 3 | 3 | 0 | 1 | 3 |
| **Total** | **17** | **16** | **10** | **0** | **13** | **10** |

Every entry is level A. There are no level-B or level-D entries.

### Architecture decisions (and why)
1. **`MarjaRuling` changes from spec §7.1:**
   - `hukm` is **optional**. It is set only where the source states it (e.g. "it is obligatory…"); most taqlid rulings are conditions, not one of the five ahkam, and inferring one would breach §4.4.
   - Added `format: "issue" | "qa"` and `question` for Khamenei's Q&A.
   - Added `urSource`, because the Urdu books number rulings differently from the English books (Khamenei's English Q1312 is Urdu س1321).
   - Added `excerpt` (true when only part of a numbered ruling is quoted) and `urduNote`.
2. `Ruling.sensitive` renders a ruling inside the collapsed women-specific panel (Q8). This is per ruling, not per topic, so the rest of the Bulugh topic stays open.
3. `Marja.status: "pending-sources"` covers Makarem Shirazi: he stays selectable (P1), the validator forbids adding rulings for him until his sources exist, and the UI shows the "being added" notice on every ruling.
4. **The validator enforces the source rules:** a level-A URL must be on the marja's own official site; Urdu text needs an Urdu citation on the official site; a marja' may not appear twice in one ruling; D requires `disputed`; ids must be hyphen-free.
5. **Urdu font:** `useUrduFont()` registers **only the woff2 file of the Arabic-script subset** through the FontFace API, on the pages that call it. Importing fontsource's CSS would have bundled both woff and woff2.
6. **Reading language** is a user preference (`en` / `ur` / `both`, default `en`). When Urdu is chosen and a ruling has no official Urdu, the English is shown with a visible notice.
7. **Sunni banner rendering:** the banner renders after mount, because `prayer.fiqh` is loaded on the client; this avoids showing it to Ja'fari users during hydration.

### Font size impact (P4)
- One file: `noto-nastaliq-urdu-arabic-400-normal.woff2`, **159,368 bytes (~156 KiB)**. It is referenced only from a 397-byte chunk imported by the 5 `/fiqh` pages and the 2 poet pages.
- In the browser, the font was **not requested** on `/surah/1`, `/prayerTime`, `/persons` or `/persons/timeline`, and **was** registered and applied on `/fiqh`.
- **Caveat:** the PWA's existing `globPatterns` include `woff2`, so the service worker *precaches* this file for every user at install time (precache went from 241 to 242 entries). It is what makes Urdu work offline, but it is ~156 KiB extra on install for everyone. See P7.

### Shared patterns reused / created
- Reused: `$storage`, `useState` composables, `useBookmarks().toggle/remove` (new `fiqh:` namespace), `AyahReferenceCard` (wired into the topic page; no Foundations topic has a Qur'anic basis yet), the `QuranReference` type, and the Module 17 accessibility patterns (whole-card links, `aria-pressed`, labelled icon-only controls).
- Created: global `.urdu-text` / `.urdu-inline` classes, and `useUrduFont()`, which any Urdu-showing page can reuse.

### Tests
`npm test`: **26 files, 397 tests passed** (24 of them new).

### Lint
- `npx eslint .`: 119 problems (56 errors, 63 warnings). **None of the errors are in new files.**
- The two changed files that have errors (the sidebar's unused `props`, and a `U+FFFF` parse error in `bookmarks.vue`) have exactly the same errors at HEAD. They were already there and were not touched.

### Build
`npm run build`: succeeded.

### Browser verification
Playwright drove the production build (`node .output/server/index.mjs`) with Chromium at 1280, 768 and 390 px. **63 of 64 checks passed.** They covered:
- The picker appears before any ruling.
- Choosing a marja' shows the chip and 11 taqlid cards with source lines and Level A labels.
- Urdu mode shows the official Urdu with its own citation, in Noto Nastaliq Urdu, and the toggle exposes `aria-pressed`.
- English fallback with a visible notice for 2271; the women-specific panel is collapsed by default and expands correctly.
- **No fallback:** Khamenei's missing rulings show a notice, and none of Sistani's text appears. For Makarem, all 11 taqlid rulings show "being added".
- `/fiqh/glossary` and `/fiqh/choose-marja` win over `[category]`; unknown and mismatched category/topic pages show not-found.
- Search: "ihtiyat" finds "iḥtiyāṭ".
- No Sunni banner for Ja'fari users; the Settings selector shows only for Ja'fari.
- A bookmark appears in the `/bookmarks` Fiqh tab; the sidebar order is correct.
- No nested interactive elements and no unlabeled icon-only controls.
- No horizontal overflow or clipped chips on six pages at each width.
- 390 px crops were checked by eye.

**Bug found and fixed:** at 390 px the marja' chip didn't wrap Sistani's full name (72 px overflow on topic pages). It now wraps.

**The one remaining failure is external:** api.aladhan.com returned **503 with no CORS headers** for every request during testing, for both calculation methods (checked with curl). The layout's prayer-time fetch therefore logs a console error on every page. This is an outage, not a Phase 1 change. The Vercel Analytics script 404s locally on every page and was filtered out as environmental.

### Regression results
`/surah/1`, `/prayerTime`, `/persons`, `/persons/timeline` and `/poets` all returned HTTP 200, with no new console errors apart from the two environmental ones above.

### Known issues
- Explanations are English only in Phase 1. Urdu explanations are allowed (marked explanation) but none were written yet.
- The Urdu Tawzih on sistani.org may lag the English 4th edition for the ~120 rulings marked *. Each one has to be compared before its Urdu is shown (P6).

### Unsourced items left out
- All of Makarem Shirazi's rulings (P1).
- Khamenei: 7 Foundations rulings (listed per topic above) and Q 16 (P5).
- Sistani: a separate "lunar years" entry.
- Qur'anic basis cards for the Foundations topics: none added, because no cited source links specific ayahs to them.

### Open questions for the user
P5–P7 in `wajibat_decisions.md`.

### Recommended next phase
Phase 2 (Taharat): water, then najasat, mutahhirat, istinja, wudu (with the procedure), ghusl, hayd/istihada/nifas and tayammum. P6 matters most there, because many taharat rulings (100–467) are on the 4th edition's revised list.


---

## Known issues outside this module (logged per decision X1, 2026-09-25 — not fixed here)
- **api.aladhan.com 503 / CORS.** During Phase 1 testing the prayer-time API returned
  503 with no `Access-Control-Allow-Origin` header for every request, for both calculation methods.
  The layout's prayer-time fetch (`app/stores/prayer.js`) logs a console error on every page while
  this lasts. This is an external outage that affects the whole app (Module 5).
- **Pre-existing lint errors.** `npx eslint .` reports 56 errors in files this module didn't create:
  composables, server routes, older pages, and the `props` / `U+FFFF` issues in
  `LayoutNavigationDrawer.vue` and `bookmarks.vue`, which are identical at HEAD. The Wajibat files
  lint clean.

---

## Phase 1 carry-over applied at the start of Phase 2 (2026-09-25)
- **P5, Khamenei Q 16 ("it is a caution"):** checked his book for a definition of unqualified caution.
  The Glossary has no entry for "caution", and Q 48 defines only *obligatory* caution ("the obligation
  of performing or refraining from an action is a matter of caution"). So there is no definition to
  apply, and Q 16 is now shown verbatim with the neutral label "Precaution (type not specified in the
  source)". This is the new `basis: "ihtiyat_unspecified"`. The Taharat generator applies the same
  rule to every answer that opens with "As per caution", "According to caution" or similar (R3).
- **P6a:** the Urdu view now shows an app-written Urdu notice, marked as explanation, wherever the
  Urdu edition lags a revised ruling (`urduEditionLag`).
- **Sistani Ruling 434 (Bulugh):** its official Urdu (مسئلہ ۴۳۴, `/urdu/book/61/3632/`) was found, and
  the ruling is no longer English only.

### Phase 2 · Water — 2026-09-25
- Rulings added, per marja': Sistani 11 · Khamenei 4 · Makarem 0 (A: 15)
- Sources used: Sistani, Rulings 13–52 (selected; `/english/book/48/2118–2124/`; Urdu `/urdu/book/61/3627/`). Khamenei, Q 72, 73, 74 and 77 (`sn=5140`); Urdu س 73, 74, 75 and 78 (`sn=11374`).
- English only: 35* (rain), because the Urdu lacks the revised "utensil three times" clause; edition-lag notice shown.
- **Urdu spot-check (R4):** all 10 unrevised rulings read side by side. No mismatches.
- Differences between maraji' flagged: none.

### Phase 2 · Istinjāʾ / toilet — 2026-09-25
- Rulings added: Sistani 13 · Khamenei 7 · Makarem 0 (A: 20)
- Sources used: Sistani, Rulings 53–74 (`/2125/`, `/2126/`). Khamenei, Q 90–93, 96, 97 and 98 (`sn=5141`, Q 96 in the same section); Urdu س 91–99.
- **Urdu spot-check (R4):** all 13 read. One minor wording difference: 69 (istibrāʾ), where the English says "one way is as follows" and the Urdu says "the best of which is". The ruling itself (recommended) is the same.
- **Differences between maraji' flagged:** purifying the urinary outlet. Sistani (62): once suffices, twice is a recommended precaution. Khamenei (Q 97): twice, by obligatory caution. This is stored with `differsBetweenMaraji`; users see only their own marja's ruling.

### Phase 2 · Najāsāt — 2026-09-25
- Rulings added: Sistani 17 · Khamenei 11 · Makarem 0 (A: 28)
- Sources used: Sistani, Rulings 80–135 (selected; `/2128–2139/`; Urdu `/3628/`). Khamenei, Q 265, 267, 271, 273, 275, 276, 278, 282, 284, 289, 300 and 304 (`sn=5252`); Urdu س +1 (`sn=11383`).
- English only: 109* (alcohol). The revised English makes alcohol distilled from grape wine impure; the old Urdu says all alcohol is pure.
- **Urdu spot-check (R4):** 80, 102 and 119 match.
- **Differences flagged:** wine and intoxicants. Sistani (108): wine is impure and other intoxicants are not. Khamenei (Q 300): intoxicating drinks are najis by obligatory caution.
- **Deliberately left out (see P8):** Rulings 103–107 on the impurity of disbelievers and certain groups. They are sourced, but their framing needs your decision.

### Phase 2 · Muṭahhirāt — 2026-09-25
- Rulings added: Sistani 14 · Khamenei 6 · Makarem 0 (A: 20)
- Sources used: Sistani, Rulings 142–227 (selected; `/2140–2153/`; Urdu `/3629/`). Khamenei, Q 267, 79, 80, 81, 85 and 291.
- English only: 178* (asphalt); the revised English adds "rubbing against a wall".
- **Urdu spot-check (R4):** 143 and 185 match. **177 has a minor mismatch:** the English allows "some wetness or moisture on the earth that does not spread", and the Urdu condition (دوم) just says "the earth is dry". This ruling is unrevised, so its Urdu is currently still shown (see P10).

### Phase 2 · Wuḍūʾ — 2026-09-25
- Rulings added: Sistani 24 · Khamenei 11 · Makarem 0 (A: 35)
- Sources used:
  - Sistani, Rulings 235–327 and conditions 7 and 11 (`/2154/`, `/8295/` "Conditions for the validity of wuḍūʾ", `/2157–2160/`); Urdu `/3630/`.
  - Khamenei, Q 101, 102, 104, 113, 119, 121, 122, 124, 126 and 134 (`sn=5142`), plus Q 153 (`sn=5246`); Urdu س +1.
- Procedure: **Sistani wuḍūʾ, 7 steps.** Each step quotes Rulings 281, 236, 244, 248, 251 or condition 7 verbatim. The "Wājib" badges cite Ruling 235 in a step note.
- Qur'anic basis: 5:6 (R2).
- **English only:** the 7th condition* (sequence). The revised English says the left foot must be wiped after the right as an *obligatory* precaution; the old Urdu says *recommended*.
- **Urdu spot-check (R4):** 247, 258 and 322 match.
- **Differences flagged:** how many times to wash. Sistani (247): once obligatory, twice recommended, three times unlawful. Khamenei (Q 101): once obligatory, twice permissible, "a third is not in the shar'". A sixth flag (wiping the feet) was removed after both texts were compared in full: both require wiping from the toe tips.

### Phase 2 · Ghusl — 2026-09-25
- Rulings added: Sistani 16 · Khamenei 12 · Makarem 0 (A: 28)
- Sources used: Sistani, Rulings 344–389 and 510 (`/2162–2168/`, `/2182/`; Urdu `/3631/`, `/3633/`). Khamenei, Q 169, 170, 176, 177, 184, 186, 187, 188, 190, 192, 196 and 198 (`sn=5247`); Urdu س +1.
- Procedures: Sistani sequential ghusl (2 steps, Ruling 360) and immersive ghusl (1 step, Ruling 366).
- Qur'anic basis: 5:6 and 4:43.
- English only: 383* (doubt about ghusl).
- **Urdu spot-check (R4):** 373 and 389 match. 354 has a minor difference: the Urdu item 1 adds "in any language" and a recommendation about the names of the Prophets and Imams. It doesn't contradict the English.
- **Differences flagged:**
  - Right side before left. Sistani (360): "it is better". Khamenei (Q 190): obligatory caution.
  - Washing the hair. Sistani (378): long hair need not be washed. Khamenei (Q 192): obligatory caution to wash all of it.

### Phase 2 · Ḥayḍ, istiḥāḍah and nifās — 2026-09-25
- Rulings added: Sistani 16 · Khamenei 9 · Makarem 0 (A: 25). Every ruling is `sensitive`, in the collapsed panel (Q8).
- Sources used: Sistani, Rulings 390–502 (selected; `/2169–2181/`; Urdu `/3632/`). Khamenei, Q 216–224, excluding Q 215 (`sn=5250`); Urdu س +1.
- English only: 394* (excessive istiḥāḍah). The Urdu has "for every prayer" in its first clause, which the revised English doesn't.
- 393* (medium istiḥāḍah) was compared and matches, so the Urdu is shown.
- **Urdu spot-check (R4):** 391, 438 and 448 match.
- Not used: Khamenei's Q 215. The extracted Q&A pairing looked wrong (a question about sayyid lineage with an answer about menopause), so it was left out rather than trusted.

### Phase 2 · Tayammum — 2026-09-25
- Rulings added: Sistani 13 · Khamenei 11 · Makarem 0 (A: 24)
- Sources used: Sistani, Rulings 653–712 (selected; `/2195–2205/`; Urdu `/3636/`). Khamenei, Q 199–214 (selected; `sn=5249`); Urdu س +1.
- Procedures:
  - **Sistani, 4 steps**, from Ruling 689.
  - **Khamenei, 4 steps**, from Q 208. Its step 4 (a second strike) is by obligatory caution, as the answer says. The step quotes are English only, because the Urdu answer (س 209) runs the steps together; the full Urdu Q&A is in the ruling card.
- Qur'anic basis: 5:6 and 4:43.
- English only: 712*. The revised English excepts medium istiḥāḍah; the old Urdu doesn't.
- **Urdu spot-check (R4):** 681 and 709 match. 673 has minor wording differences in the fallback order (sand, clod, pebbles), with the same substance.

## Phase 2 — Taharat — Completion Report (2026-09-25)

### What was inspected
- The official sources:
  - sistani.org English *Islamic Laws* chapter 2: 78 pages, plus the unlisted "Conditions for the validity of wuḍūʾ" page `/8295/`.
  - The Urdu *توضیح المسائل* Taharat pages (3627–3636).
  - leader.ir *Practical Laws of Islam* "Rules on Purity" (Q 69–336) and the Urdu *احکام طهارت* (س 70–337).
- The app's own Qur'an text (quranapi.pages.dev) for 5:6 and 4:43.

### What was built / changed
- **Content:** 8 Taharat topics, 131 rulings with 195 entries (Sistani 124, 117 with official Urdu; Khamenei 71, all with official Urdu), all level A. 5 step-by-step procedures. 18 new glossary terms (37 in total), quoted from the *Islamic Laws* Glossary.
- **Data model:**
  - `Procedure` / `ProcedureStep`. Each step's `instruction` must be a **verbatim substring of the cited ruling** for the same marja', and the validator enforces this.
  - `WajibatTopic.procedureIds` replaces the spec's single `procedureId`, since a topic can have several procedures and each belongs to one marja'.
  - `basis: "ihtiyat_unspecified"` (P5/R3).
  - `urduEditionLag` (P6).
- **Validator:** procedure checks (steps ordered 1..n, verbatim instructions, ruling entries for the procedure's marja', no procedures for a pending marja', topic ↔ procedure links), plus the lag check (no outdated Urdu kept on a lag entry).
- **UI:**
  - `ProcedureStepper` + `ProcedureStepBody`: one step at a time with a progress bar, Previous/Next/Start over, and "Show all steps". Each step shows the quoted text and the source line. Only the chosen marja's procedures are shown; otherwise an "a guide according to {marja} has not been added" notice appears.
  - The "Qur'anic basis" section now has an explanatory line.
  - `BasisBadge` wraps long labels, and `RulingCard` shows the Urdu edition-lag notice.

### How the texts were produced
Same method as Phase 1, with a reusable extractor: every English/Urdu ruling is indexed by its number from the downloaded pages, and every Khamenei Q&A by its Q number.
- **Khamenei's Urdu:** the purity chapter runs exactly one ahead of the English (EN Q n = UR س n+1). All 71 pairs were still checked one by one, by comparing the questions.
- **Every revised (*) Sistani ruling** was compared with its Urdu by reading both. The generator refuses to emit a revised ruling until it is marked `match` or `lag`.
- **Two Urdu-extractor bugs were found by the R4 spot-check and fixed:**
  - A cross-reference ("…مسئلہ (۶۳۳) میں…") inside a ruling was taken as the start of a new مسئلہ. This had truncated the Urdu of 84 and 389.
  - A section heading and intro leaked into the end of the previous مسئلہ (322).
  - After the fix, every generated text was diffed against the previous run. Only those three changed, and a scan found no remaining leaked headings in the Urdu, and no leaked headings or truncated endings in the English.

### Tests / Lint / Build
- `npm test`: **26 files, 406 tests passed** (33 Wajibat tests).
- `npx eslint` on the Wajibat files: clean. The 56 pre-existing errors elsewhere are unchanged (X1).
- `npm run build`: succeeded. The PWA precache is now 242 entries / 5,764.57 KiB, up from 5,469.06 KiB (+~296 KiB, mostly the ruling texts).
- **Bug found and fixed:** the `/bookmarks` Fiqh tab imported `~/data/wajibat` (the index), which put the whole rulings chunk (~335 KB) into the bookmarks page. It now imports only `topics.ts`/`categories.ts`, a 13 KB chunk.
- **Checked by recording network requests in the browser:** `/bookmarks` loads only the 13 KB chunk, `/settings` loads neither, and `/fiqh/taharat/wudu` loads the rulings chunk. Per-category lazy loading of the rulings is still spec Phase 10 work.

### Browser verification (Playwright + Chromium, production build)
- **Phase 2 suite: 37 of 37 checks passed.** It covered:
  - 8 Taharat topics, and 24 wuḍūʾ ruling cards.
  - The Qur'anic basis card (5:6).
  - The 7-step wuḍūʾ stepper: Next moves to step 2 with the quoted Ruling 236, and "Show all steps" lists all 7.
  - The Urdu edition-lag notice on the revised 7th condition, and the official Urdu with its own مسئلہ number.
  - Khamenei's view of wuḍūʾ has no Sistani procedure or text; his tayammum stepper comes from Q 208.
  - Q 16's unspecified-precaution label.
  - The women-specific rulings collapsed (20) and expanding correctly.
  - The istinjāʾ page showing only the chosen marja's differing ruling.
  - Search.
  - No overflow or clipped chips on 5 pages at 1280/768/390.
  - No nested or unlabeled controls.
  - Regression pages returning 200, and no console errors (aladhan and Vercel noise filtered, per X1).
  - 390 px crops were checked by eye.
- **The Phase 1 suite was re-run: 63 of 64 passed.** The one failure is expected: it asserted that Taharat shows the empty "scheduled for phase 2" state, and Taharat now has content.

### Architecture decisions
- **Procedures quote rulings and never paraphrase them**, and the step labels are marked as app-written. A step's hukm badge is set only where a ruling states it, and the note on the step cites that ruling.
- **Procedures are stored per marja'.** Khamenei has no numbered English wuḍūʾ procedure in his books, so his wuḍūʾ page shows the "not added" notice rather than Sistani's steps.

### Unsourced / left out
- Makarem Shirazi: everything (P1).
- Sistani 103–107 (P8).
- Khamenei: rulings with no Q&A on the same point. Each topic above shows which marja' has an entry.
- A "Is my wuḍūʾ still valid?" decision helper was **not built**. Its outcomes would mix rulings on invalidators (322), doubts (299–303) and the conditions, and a sourced tree needs your go-ahead on its scope (P11).

### Open questions
P8–P11 in `wajibat_decisions.md`.

### Recommended next phase
Phase 3 (Salat core), once P8–P11 are answered. For Khamenei it should prefer *The Rules on Prayer & Fasting 2023* (P2).

---

## Phase 2 follow-ups from the review (2026-09-25; you committed these as 1c052ce)
- **P8, purity of persons:**
  - Sistani 103 was split into four exact excerpts, in English and Urdu.
  - 104*, 105* and 107* are English only plus the Urdu notice: their Urdu is the older text (e.g. the Urdu of 107* is a definite fatwa, the revised English an obligatory precaution).
  - 106 is shown with its Urdu.
  - Khamenei's equivalents are Q 316 (ghulāt), Q 335 (rejecting what is indispensable), Q 312 (People of the Book), Q 320 (a non-kitābī non-Muslim) and Q 298 (unknown religion).
  - His Bahāʾī-specific answers (Q 327–330) are not equivalents of any of these rulings and were left out.
  - All eight sit in a "Purity of persons" panel (`Ruling.panel`), with no app commentary.
- **P9, the 5:6 note:** quotes Ṭabāṭabāʾī, *al-Mīzān*, vol. 5, pp. 187–199: «وفهمت من الكلام وجوب غسل الوجه واليدين، ومسح الرأس والرجلين».
  - The clause was checked verbatim in two independent online copies, almerja.com and greattafsirs.com.
  - The surrounding wording differs slightly between the copies, so only the clause they share is quoted.
  - shiaonlinelibrary.com (DNS failure) and almizan.org (pages load by JavaScript) could not be used.
  - The note is stored as `quranicBasisNotes`, `kind: "explanation"`, and the validator checks it.
- **P10:** Sistani 177 is now English only, with a note.

### Phase 3 · source notes (apply to every Salat topic below)
- **Sistani:** *Islamic Laws* 4th ed., Rulings 716–1150 and 1258–1511, plus three unnumbered section introductions (the obligatory prayers, the daily prayers' rakʿahs, the eleven components). Pages `/english/book/48/2207–2276/` and the unlisted `/5418/` (times). Urdu from `/urdu/book/61/3637–3642/`.
- **Khamenei:** *The Rules on Prayer & Fasting 2023* (leader.ir book 241), first priority per R6.
  - It was read through the site's own contents endpoint (`POST /ajax/book`): 165 sections and 1,003 numbered rulings, each tied to its section URL `book/241?sn=…`.
  - Rulings 507, 775–778 and 786 do not appear anywhere in the published text, so they are source gaps, not omissions.
  - **The book has no official Urdu edition, so all 143 of Khamenei's Salat entries are English only (R1),** each with a note saying so.
- **R6 conflict check:** I compared the two Khamenei books on seven points: tasbīḥāt, women's loud/quiet recitation, the qaḍāʾ of the mother's prayers, "āmīn", the Friday prayer's status, the shar'ī distance (41 km in both), and sajdah on tea leaves. **No conflicts.**
  - One internal wrinkle in the *Rules* book itself: ruling 651 says the mother's qaḍāʾ is an *obligatory caution*, while a footnote to 656 says just "a caution". The entry quotes 651 verbatim.
- **Two extraction bugs found and fixed:**
  - Sistani's unnumbered traveller conditions ("Second condition: …") leaked into the end of Ruling 1266. The splitter now also handles "<Ordinal> condition:". Foundations and Taharat were regenerated and are byte-identical to what's committed.
  - leader.ir writes some letters decomposed (h + U+0323 for ḥ). All texts are now normalised to Unicode NFC, which is the same text in a single encoding, so verbatim checks compare like with like.

### Phase 3 · Salat topics — 2026-10-02
Every entry is level A. Columns are entries per marja'. "Urdu" is Sistani entries with official Urdu; Khamenei's Salat entries are all English only (see above).

| Topic | Rulings | Sistani | Urdu | Khamenei | Revised (*) Sistani rulings, Urdu outcome |
|---|---|---|---|---|---|
| The obligatory prayers | 3 | 2 | 2 | 3 | — (two are unnumbered intros) |
| Prayer times | 8 | 8 | 8 | 8 | — |
| Qibla | 4 | 4 | 4 | 4 | — |
| Covering and clothing | 15 | 15 | 15 | 15 | — |
| Place of prayer | 8 | 8 | 8 | 7 | — |
| Adhān and iqāmah | 6 | 6 | 6 | 4 | — |
| Obligatory parts | 10 | 10 | 10 | 10 | — (one unnumbered intro) |
| Recitation | 12 | 12 | 11 | 11 | 974* lag (the Urdu lacks the nāfilah sentence) |
| Rukūʿ and sajdah | 14 | 13 | 13 | 14 | — |
| What sajdah may be on | 9 | 9 | 9 | 9 | — |
| Tashahhud, salām, qunūt | 9 | 9 | 9 | 9 | — |
| Things that invalidate | 9 | 8 | 8 | 9 | — |
| Traveller's prayer | 15 | 13 | 12 | 15 | 1266* lag (the end-of-journey sentence is new) |
| Qaḍāʾ prayers | 8 | 8 | 7 | 7 | 1370* lag (the "vow" and "deliberate omission" clauses are new) |
| Congregational prayer | 10 | 10 | 9 | 10 | 1387* lag (the Urdu says "precaution" for all cases) |
| Other obligatory prayers | 9 | 9 | 9 | 8 | 719* **match** (Friday prayer, compared in full) |
| Guided prayers | 0 (6 procedures) | 3 procedures | — | 3 procedures | — |
| **Total** | **149** | **144** | **140** | **143** | |

- **Differences between maraji' flagged (`differsBetweenMaraji`):**
  - The rukūʿ and sajdah dhikr: Sistani "any dhikr suffices, of this length"; Khamenei the specific dhikr once or "subḥānallāh" three times.
  - The eldest son and the mother's qaḍāʾ: Sistani "not obligatory, though better"; Khamenei "obligatory caution".
  - Glossary: Sistani's glossary gives a farsakh as about 5.5 km; Khamenei's ruling 410 puts eight farsakhs at 41 km. "farsakh" was therefore left out of the shared glossary, so neither marja's figure is shown to the other's followers.
- **R4 Urdu spot-check:** 30 unrevised Sistani rulings, 2 in each of the 15 subject topics (729, 742, 763, 771, 775, 825, 866, 877, 902, 921, 929, 944, 978, 980, 1008, 1042, 1062, 1068, 1100, 1103, 1140, 1145, 1258, 1320, 1355, 1360, 1433, 1441, 1470, 1496), read side by side. All match in substance.
  - One minor wording difference: in 978 the Urdu says "(احتیاط کی بناءپر)", just "precaution", where the English says "based on obligatory precaution".
- **Guided prayers:** ṣubḥ (19 steps), maghrib (27) and ẓuhr (34), for each of Sistani and Khamenei, so 160 steps in all.
  - Each step quotes its marja's own ruling, and the validator checks this.
  - Rukn steps (intention, takbīr, and each rukūʿ and pair of sajdahs) cite each marja's own rukn list: Sistani's Ruling 928, Khamenei's ruling 140.
  - "Wājib" badges cite each marja's list of eleven obligatory parts.
  - Qunūt is marked mustaḥabb.
- **Arabic in the guided prayers:**
  - Sistani's tashahhud, salām and tasbīḥāt Arabic are quoted from his rulings' own text.
  - **His rukūʿ and sajdah dhikr are published as images on sistani.org**, so those steps show the ruling's transliteration only. No Arabic was retyped (see P12).
  - Khamenei's dhikr Arabic is quoted from his ruling 318.
- **Unsourced / left out:**
  - Makarem Shirazi entirely.
  - Sistani entries the *Rules* book has no counterpart for, and vice versa (each topic shows which marja' is missing).
  - Ṣalāt al-mayyit (it belongs to the obligations towards the deceased, §6.9).
  - Prayers made obligatory by vow or hire.
  - The doubts chapter (Sistani 1151–1257, Khamenei 346–406), which is Phase 4.

## Phase 3 — Salat (core) — Completion Report (2026-10-02)

### What was built / changed
- **Content:** 17 Salat topics: 16 subject topics plus "Guided prayers" (6 procedures, 160 steps). 149 rulings with 287 entries, all level A. Glossary grows from 37 to 67 terms, each quoted from the *Islamic Laws* Glossary.
- **Data model:** `WajibatTopic.liveTool` (`"prayertimes" | "qibla"`) shows live data from Module 5 on a topic page.
- **UI:**
  - `LiveToolPanel` shows today's timings from `usePrayerStore().data` as they are. Nothing is recalculated. It notes when the user's method is Sunni and links to Prayer Times and to the Qibla tool.
  - The existing `ProcedureStepper` renders the guided prayers, with Rukn labels and hukm badges.
- **Generators:** `kh_rpf.py` (Rules book parser) and `gen_salat.py` are in the session scratchpad, not in the repo, like the earlier generators.

### Tests / Lint / Build
- `npm test`: **26 files, 411 tests passed** (38 Wajibat tests). New tests check the rakʿah/rukūʿ/sajdah/tashahhud structure of all six guided prayers, the rukn counts, that Khamenei's Salat entries all cite the Rules book and carry no Urdu, and the `liveTool` wiring.
- `npx eslint` on the Wajibat files: clean.
- `npm run build`: succeeded.

### Install-size (R5), running total of ruling text in the install-time download
| Point | PWA precache | Rulings data chunk |
|---|---|---|
| Before the module | 5,469.06 KiB | — |
| After Phase 2 | 5,764.57 KiB | ~335 KB |
| **After Phase 3** | **6,165.09 KiB** | **~730 KB** (uncompressed JS) |

- Phase 3 added **+400.5 KiB** to the install-time download. The module's running total since before it existed is **+696 KiB**, of which 156 KiB is the Urdu font.
- The rulings chunk loads only on `/fiqh` pages. Splitting it per category (spec Phase 10) would cut what each `/fiqh` page loads, but not the install-time total, since the PWA precaches every chunk.

### Browser verification (Playwright + Chromium, production build)
- **Phase 3 suite: 35 of 35 passed.** It covered:
  - 17 Salat topics.
  - The guided prayers: only the chosen marja's three; steps with ruling citations, Rukn labels and the tashahhud Arabic; Sistani's dhikr transliteration and Khamenei's Arabic from ruling 318.
  - Khamenei's English-only notes in Urdu mode.
  - The edition-lag notice on 974*, and official Urdu with مسئلہ numbers.
  - The live prayer-times panel (showing real times) and the Qibla link.
  - No cross-marja text.
  - No overflow or clipped controls on 5 pages at 1280/768/390, and no nested or unlabeled controls.
  - Regression pages (`/surah/1`, `/prayerTime`, `/persons`, wuḍūʾ, taqlīd) returning 200 with no console errors.
  - 390 px crops were checked by eye.
- **The Phase 2 suite was re-run: 37 of 37 passed.**
- AlAdhan was reachable this time, so the earlier 503 outage (X1) didn't recur.

### Open questions
P12–P14 in `wajibat_decisions.md`.

### Recommended next phase
Phase 4 (salat doubts and corrections: shakkiyyāt, ṣalāt al-iḥtiyāṭ, sajdat al-sahw), plus the "Is my wuḍūʾ still valid?" helper (P11). It is high-risk: every leaf of the decision trees must cite level-A rulings, and every path will be tested.

---

## Phase 3 follow-ups from the review (2026-10-04)

- **P12, the rukūʿ/sajdah dhikr Arabic:** checked Sistani's own sources first, per the decision.
  - The official Urdu *توضیح المسائل* masla 1014 (rukūʿ) and masla 1035 (sajdah) **do** have the dhikr written as real text — this was already captured in the dataset's `ur` field (`سُبْحَانَ رَبِّیَ الْعَظِیْمِ وَبِحَمْدِہٖ` / `سُبْحَانَ رَبِّیَ الْاَعْلیٰ وَبِحَمْدِہٖ`), re-verified now against `sistani.org/urdu/book/61/3637/` live.
  - **Correction (2026-10-04):** the Arabic was first spliced directly into the English `rukudhikr`/`sajdahdhikr` ruling text. That was wrong — the English *Islamic Laws* ruling must stay a verbatim quote of the English book, which only has this dhikr as an image, and mixing in Arabic sourced from a different book (the Urdu edition) corrupts that quote. Reverted the English `text.en` back to its original `...` placeholder for the image, and instead added two new `Recitation` entries (`rukudhikrarabic`, `sajdahdhikrarabic` in the new `app/data/wajibat/recitations.ts`), cited to Urdu masla 1014/1035, linked via a new `Ruling.recitationIds` / `ProcedureStep.recitationIds` field. `RulingCard` and `ProcedureStepBody` now render the recitation in its own block, next to the ruling/step, with its own source line — never merged into the ruling's own quote. No Arabic was taken from Khamenei's pages.
  - **New validator rule:** `wajibatValidate.ts` now flags any Arabic script in a `MarjaRuling.text.en`/`question.en` that isn't marked `arabicInSource: true` — that flag may only be set when the cited **English** source book itself prints the Arabic as text (true for 10 existing entries, audited and flagged: Khamenei's dhikr-wording/tashahhud/qunūt rulings and Sistani's tasbīḥāt/tashahhud/salām/qunūt/sajdah-material/ṣalāt-al-āyāt rulings — all verified as the English book's own printed Arabic, not spliced in). This is meant to catch any repeat of this mistake automatically.
  - The Arabic *Minhāj al-Ṣāliḥīn* and the short risala *مختصر احکام عبادات* were also checked; neither exposed readable inline text for this (TOC/PDF-only), so they weren't needed once the Tawzih text was confirmed.
- **P14, ruling 651 vs. the footnote to 656:** 651 continues to be quoted verbatim, unchanged in the UI. A data note was added to the Khamenei entry on `eldestsonmother` (ruling 651) recording the footnote to 656 and why it isn't shown (the footnote is a plain "caution", not a second ruling to reconcile). The note is in the dataset only, not rendered.
- **P13, Khamenei's Urdu Q&A for Salat:** built and verified the first entry — the rukūʿ/sajdah dhikr wording, the topic already flagged as `differsBetweenMaraji`.
  - New `qa`-format ruling `rukusajdahdhikrqa` (topic `rukusujud`): Khamenei's *Practical Laws of Islam* Q&A, English Q 485 and Urdu *استفتاآت کے جوابات* س 487 (`leader.ir/ur/book/106/استفتاآت-کے-جوابات?sn=11397`), both read live and quoted verbatim. **Agrees** with Ruling 318 of *The Rules on Prayer & Fasting 2023* (same dhikr, same alternative), so it is shown, labelled as its own Q&A entry, not a translation of 318.
  - **Coverage so far: 1 of 16 Salat subject topics.** The other 15 (prayer times, qibla, covering, place of prayer, adhān/iqāmah, obligatory parts, recitation, what sajdah may be on, tashahhud/salām/qunūt, invalidators, traveller's prayer, qaḏā' prayers, congregational prayer, other obligatory prayers, plus any other dhikr-adjacent entries in rukūʿ/sajdah) still need the Urdu Q&A book cross-check. This is left as explicit follow-up work, not claimed done — each topic needs its own live read of the matching Urdu Q&A section before an agree/differ call can be made (rule R7).
  - Urdu Q&A book chapter/section map found this session (for the follow-up work): اذان و اقامت sn=11395, قرأت sn=11396, ذکرنماز sn=11397, سجدہ sn=11398, جواب سلام sn=11399, مبطلات نماز sn=11400, شکیات نماز sn=11401, قضا نماز sn=11402, ماں باپ کی قضا نمازیں sn=11403.

## Install-size task (new, before Phase 4) — 2026-10-04

**Goal:** stop the ~730 KiB Wajibat ruling/procedure text from downloading at install time; cache it at runtime instead; add a "Save all for offline" button; verify in a real browser, not just the build output.

### What was built
- `nuxt.config.ts`: `vite.$client.build.rollupOptions.output.manualChunks` isolates everything under `app/data/wajibat/` into one chunk, named `wajibat-data-[hash].js` via a matching `chunkFileNames` override (Nuxt's own default is `[hash].js`, no `[name]`, so without this override the chunk was already isolated but had no stable name to target). `pwa.workbox.globIgnores` excludes that filename pattern from the install-time precache; a `runtimeCaching` entry (CacheFirst, cache name `wajibat-data-cache`) is kept as a backstop.
- `app/composables/useFiqhOfflineCache.ts` (new): `ensureWajibatDataCached()` and `isWajibatDataCached()`. Finds the chunk's URL from `performance.getEntriesByType("resource")` / `document.scripts`, and explicitly `fetch()`s + `cache.put()`s it into `wajibat-data-cache` if not already there.
- `useWajibat()` calls `ensureWajibatDataCached()` (fire-and-forget, client-only) every time it's used — i.e. on every `/fiqh` page — so visiting any Fiqh page keeps the whole module available offline from then on.
- `/fiqh` hub: a "Save all for offline" button (same function, on demand) with a live "Saved for offline" state, for a user who wants to be sure before going offline rather than relying on having visited.

### Bug found and fixed (real browser testing caught this; the build-output check alone did not)
The first version relied on the `runtimeCaching` rule alone, reasoning that the chunk would simply be fetched (and so cached) the first time any `/fiqh` page loaded it. **It didn't work.** Installed Playwright + a real Chromium and drove the actual production build (`node .output/server/index.mjs`):
- Confirmed, by checking `response.fromServiceWorker()` on every request on a `/fiqh` page, that every other asset (50+ JS/CSS chunks) was correctly served `fromServiceWorker: true` — so the service worker itself was genuinely active and controlling the page.
- The `wajibat-data` chunk alone showed `fromServiceWorker: false`, and `caches.open("wajibat-data-cache")` had zero entries after the visit.
- Root cause: Nuxt's SSR renderer injects `<link rel="modulepreload" href=".../wajibat-data-*.js">` into the page `<head>` for every `/fiqh` page (because the page's components statically import `~/data/wajibat`). **Chromium does not run `modulepreload` fetches through the service worker's `fetch` event.** The chunk loaded fine (modulepreload fetched it directly over the network), but that fetch was invisible to Workbox, so the `runtimeCaching` rule never fired.
- Tried removing the `<link>` two ways that didn't work and are worth recording so they aren't retried: (a) `vite.$client.build.modulePreload.resolveDependencies` — this only affects Vite's own SPA `index.html` injection, not Nuxt's SSR renderer; the link was still there after rebuilding. (b) a `hooks: { "render:html": ... }` entry in `nuxt.config.ts` — `render:html` fires on `nitroApp.hooks` (a separate, request-time hook registry inside the running server), not on the build-time `nuxt.hooks` that a top-level `hooks` key registers on, so the hook was silently never called; confirmed by a debug log that never printed even though the hook "registered" without error. A `server/plugins/*.ts` Nitro plugin would be the correct way to reach that hook, but at that point the explicit-cache approach below made chasing it further unnecessary.
- **Fix:** stopped trying to make the SW passively intercept the chunk's fetch at all. `useFiqhOfflineCache.ts` fetches and caches it explicitly from app code, which works regardless of *how* the browser originally fetched the chunk (modulepreload, dynamic import, anything).

### Browser verification (Playwright + Chromium, against `node .output/server/index.mjs`)
- **Fresh install, non-`/fiqh` page:** a brand-new browser profile, service worker confirmed `controller: true` (genuinely active and controlling), navigated to `/prayerTime` — zero requests matching the `wajibat-data` chunk, and `caches.open("wajibat-data-cache")` has no entries. Ruling text is not downloaded until `/fiqh` is opened. **Confirmed.**
- **Visiting `/fiqh` caches it:** opened `/fiqh` only (not a specific category), waited ~3 seconds — `wajibat-data-cache` has 1 entry (the chunk). Because every category/topic reads from this one chunk (the module isn't split per category — that's spec Phase 10 work, still not done), visiting the hub is enough to make every category available offline, not just the one visited.
- **Offline, client-side navigation to a never-visited topic:** went offline, then — using real link clicks inside the already-open page, not a fresh browser navigation — clicked into the Salat category and then into a specific topic (`dailyprayers`) that had never been loaded before. It rendered fully (2909 characters of real content, including the app's own "Offline" indicator in the nav drawer). **Confirmed**: once the hub has been visited (or the button used), every category works offline.
- **"Save all for offline" button:** clicked on a fresh profile that had only visited `/prayerTime` (never `/fiqh`); `wajibat-data-cache` gained the chunk, button showed "Saved for offline", and an unvisited topic then rendered offline the same way. **Confirmed.**
- **Content-hashed filename:** the chunk is `wajibat-data-<8-char-hash>.js`, where the hash is Rollup's content hash — changing any ruling's text changes the hash, so a corrected ruling ships as a new URL and a browser with the old one cached fetches the new file instead of serving stale text. Confirmed the hash changed across rebuilds that touched the Wajibat data (`CwNzGUgm` → `BoKr4D3N` after an unrelated data edit) and stayed the same across rebuilds that didn't.
- **One thing this did NOT manage to verify, and isn't claiming:** a full browser *reload* or a brand-new tab navigation (`page.goto`/F5) while offline failed in every attempt — but it failed identically for `/`, the exact page `navigateFallback` is bound to, with nothing to do with Wajibat. That strongly points to a Playwright/CDP-specific interaction between `setOffline()` and top-level navigation (sub-resource fetches were reliably interceptable throughout; only top-level `goto`/reload wasn't), not a real app bug — but it means "does a hard refresh work offline" for this SSR app in general is still an open question outside this task's scope, not something this change verified either way.

### Install-size result
| Point | PWA precache |
|---|---|
| After Phase 3 | 242 entries / 6,165.09 KiB |
| **After this task** | **240 entries / 5,431.94 KiB** |

The Wajibat ruling/procedure text (~730 KiB) is no longer in the install-time download. The 2-entry drop (242→240) is the `wajibat-data` chunk itself plus the duplicate-named chunk entry Rollup had been emitting for it; nothing else changed.

### Tests / Lint
`npm test`: 26 files, 412 tests passed (unchanged — this task touched no Wajibat content, only build config and a new, pure-utility composable). `npx eslint` on the changed files: clean.

### Files created / changed
- Created: `app/composables/useFiqhOfflineCache.ts`.
- Changed: `nuxt.config.ts` (manualChunks, chunkFileNames, workbox globIgnores/runtimeCaching), `app/composables/useWajibat.ts`, `app/pages/fiqh/index.vue` (button simplified to use the new composable).

## P13 completion — in progress, 2026-10-04

**Chapter map found** (Khamenei's *Practical Laws of Islam* Q&A, English chapter sn=5197 / Urdu chapter sn=11341): the English edition's Prayer chapter is Q337–Q506+, in 13 named sections; the Urdu edition has the same 13 plus 4 more (جواب سلام, شکیات نماز, قضا نماز, ماں باپ کی قضا نمازیں) that don't exist as named English sections. Checked directly (fetched sn=5269 and sn=5290, which list the chapter's own Q-range): confirmed the **English book has no Q&A coverage at all for qaḏāʾ prayers, traveller's prayer, or congregational prayer** — not a truncated fetch, the chapter's Q-range genuinely has nothing there. Per decision P13/R7 (supplementary entries need the book's own English citation, same as every other ruling), these three topics plus "Other obligatory prayers" get **no supplementary entries**: 0 available, not 0 found-but-skipped.

**Topics done this session (2 of 16, including the rukūʿ/sajdah dhikr entry from the Phase 3 follow-up above):**
- Rukūʿ and sajdah (dhikr wording only — see above).
- **Qibla**: two new entries. `qiblaeffortqa` (Q 363, agrees with Ruling 44 — compass/sun for certainty, else the most likely direction). `qiblanomeansqa` (Q 366, agrees with Ruling 45 — four directions, obligatory caution, when none is more likely). Both **English only**: the Urdu equivalents (س 365, س 368) exist but this session's fetch of that page returned an English paraphrase of them, not quotable Urdu script — rather than guess at the Urdu wording, only the English Q&A is shown, same as any ruling with no official Urdu available (decision R1). `urduNote` on each entry records this so a later session can go back and read the Urdu properly instead of re-deciding whether to.

**Honest pace note:** this cross-check is slow by nature — each topic needs its own live read of the matching English and Urdu Q&A sections, not just a lookup, to avoid guessing at either language's wording. Two topics took a full research pass each. At this rate the other 13 are a multi-session effort, not something to compress into one sitting without risking exactly the kind of shortcut (inventing Urdu wording, assuming a match without reading both sides) that decision P13 exists to prevent. Remaining, in the order their Q&A coverage is already confirmed to exist: the obligatory prayers (Q337–343), prayer times (Q344–362), place of prayer (Q368–425), covering and clothing (Q426–447), adhān/iqāmah (Q448–455), recitation (Q456–476), what sajdah may be on (within Q478–497), tashahhud/salām/qunūt (within Q478–497, plus جواب سلام in Urdu only), things that invalidate (Q498–506+). Confirmed with no Q&A coverage, nothing further to do: qaḏāʾ prayers, traveller's prayer, congregational prayer, other obligatory prayers.
