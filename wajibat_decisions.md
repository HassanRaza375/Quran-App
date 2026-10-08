# Wajibat Module — Decisions Log

Source of truth for all planning decisions of the Wajibat / Daily Fiqh module (`/fiqh`).
Spec: `wajibat-fiqh-jafari-module.md`. If this file and the spec disagree, **this file wins**.

## Answered decisions (2026-09-25)

| # | Question | Decision |
|---|---|---|
| Q1 | Which marja'? | All three: Ayatullah al-Sistani, Ayatullah Khamenei, Ayatullah Makarem Shirazi |
| Q2 | How are multiple maraji' shown? | User picks their marja' in Settings and sees only that marja's rulings |
| Q3 | Languages | English + Urdu |
| Q4 | Users whose fiqh setting is Sunni | Module visible with a "Fiqh Ja'fari only for now" note |
| Q5 | UI kit | Claude Code checks the repo in Phase 0 and matches the most recently built pages — finding recorded below |
| Q6 | Route | `/fiqh` |
| Q7 | Personal tracker | Later — not in the first release |
| Q8 | Women-specific rulings | Full detail, collapsed by default |
| Q9 | Audio for recitations | Text only for now |
| Q10 | Scholar review | Undecided — show "Not scholar-reviewed" until decided |
| Q11 | Hajj depth | Overview only |
| Q12 | Qur'anic basis links | Yes — "Qur'anic basis" cards via `AyahReferenceCard` |

## Answered Phase 0 questions (2026-09-25)

| # | Question | Decision |
|---|---|---|
| P1 | How to source Makarem Shirazi's rulings | The user will download his risala into `docs/sources/`. Until then he stays in the marja' picker, and his followers see a "rulings being added — please refer to his official risala" notice. **Never fall back to another marja's ruling.** His original Persian *توضیح المسائل* is also acceptable as a primary (level A) source once the user provides it. |
| P2 | Khamenei's Q&A as a level-A source | Yes. Cite *Practical Laws of Islam* / *استفتاآت کے جوابات* by Q number as level A. For salat and sawm, prefer *The Rules on Prayer & Fasting 2023* where it covers the point. If the two books differ on the same issue, flag it in the progress log and ask the user. Don't pick one. |
| P3 | Sidebar placement | A single "Daily Fiqh (Wajibat)" entry directly above "Prayer Times". It moves into the Worship group when the sidebar is redesigned. |
| P4 | Urdu font | Bundle `@fontsource/noto-nastaliq-urdu` so it works offline, but load it **only on routes that display Urdu** (`/fiqh/**` and the poet modules, e.g. `/poets/mir-anis`). Report the font's size impact in the Phase 1 summary. |
| R1 | **New rule: Urdu ruling text** | The Urdu text of a ruling must come from the marja's **official Urdu book** (Sistani: *توضیح المسائل*; Khamenei: *استفتاآت کے جوابات*), cited with its **own** ruling/Q number. Claude Code must **not** translate rulings from English into Urdu. If a ruling has no official Urdu text, show English only for that ruling and list it in the phase summary. App-written Urdu explanations are allowed but must be marked `kind: "explanation"`. |

## Answered Phase 1 questions (2026-09-25)

| # | Question | Decision |
|---|---|---|
| P5 | How to label Khamenei's Q 16 "it is a caution" | First check whether the book has an introduction or terminology section that defines an unqualified "caution". **If it does**, apply that definition and cite it. **If it doesn't**, show the ruling in his exact wording with the neutral label **"precaution (type not specified in the source)"**. Never guess wajib vs mustahab. This rule applies to **every similar case** from now on (rule R3). |
| P6 | Sistani's Urdu edition lags the English 4th edition | Keep the current policy: where the older Urdu differs from a revised (*) English 4th-edition ruling, show English only. Additions: **(a)** in the Urdu view, also show a short Urdu notice that the Urdu edition hasn't been updated for this ruling yet, marked `kind: "explanation"`; **(b)** besides the ~120 revised rulings, spot-check a sample of **unrevised** rulings in every topic for Urdu/English mismatch, and report the result in each topic summary (rule R4). |
| P7 | Font in the PWA install-time precache | Keep it in the precache. |
| R2 | **New rule: Qur'anic basis cards (from Phase 2)** | Link an ayah only if **its own text explicitly names the act** (e.g. 5:6 for wudu/ghusl/tayammum, 4:43), verified against the fetched ayah text and the existing validator. Any interpretive link needs a cited source. Cards are labelled "Qur'anic basis" and kept separate from the rulings. |
| R3 | **New rule: unspecified precaution** | See P5. It applies to every marja' and every phase. |
| R4 | **New rule: Urdu/English spot-checks** | See P6(b). Every topic summary reports how many unrevised rulings were spot-checked and whether any mismatch was found. |
| X1 | Out-of-scope issues | The api.aladhan.com 503/CORS errors and the 56 pre-existing lint errors are logged as separate known issues in `wajibat_progress_log.md`. They are **not** fixed in this module. |

## Answered Phase 2 questions (2026-09-25)

| # | Question | Decision |
|---|---|---|
| P8 | Sistani Rulings 103–107 (purity of people) | **Include them** in their own collapsed panel with a neutral heading, quoted exactly, with **no app commentary**. Apply the same treatment to Khamenei's equivalent rulings where sourced. |
| P9 | 5:6 card on the wuḍūʾ page ("wash your feet" in the app's translation) | **Keep the card** and add a one-line note, `kind: "explanation"`, stating that Ja'fari fiqh reads this ayah as wiping the feet, **citing a Shia tafsir on 5:6** (e.g. Ṭabāṭabāʾī's *al-Mīzān*). Claude Code finds and quotes the source under the normal source rules. **If it can't be sourced, report back instead of writing the note.** |
| P10 | Unrevised Urdu wording differences | **177: English only.** Keep the Urdu for 69 and 354. |
| P11 | "Is my wuḍūʾ still valid?" helper | Build it in **Phase 4**, together with the salat-doubts helper. |
| R5 | **New rule: install-size reporting** | Every phase summary reports the **running total** of ruling text added to the PWA install-time download. |
| R6 | **Khamenei source priority for Salat (Phase 3)** | *The Rules on Prayer & Fasting 2023* first, then the *Practical Laws of Islam* Q&A. **If the two conflict, flag it and ask; don't pick one.** (Restates P2 for Phase 3.) |

## Answered Phase 3 questions (2026-10-04)

| # | Question | Decision |
|---|---|---|
| P12 | Sistani's rukūʿ and sajdah dhikr (Rulings 1014, 1035) is an image on sistani.org; the guided prayers show the transliteration only | **Check Sistani's own sources for a text version first:** the Arabic *Minhāj al-Ṣāliḥīn*, the Urdu *توضیح المسائل*, or a Persian risala on sistani.org. If one has the dhikr as text, use that Arabic with its citation. **If none does, keep the ruling's own transliteration** as it is now. Never take the Arabic from Khamenei's pages, even though the words are the same — recitation text for one marja' must come only from his own sources. |
| P13 | Khamenei's Salat entries are English only; his Urdu Q&A book (*استفتاآت کے جوابات*) covers some of the same points under its own numbering | **Yes — add his Urdu Q&A answers as separate entries**, with their own Q numbers, labelled as coming from the Q&A book (never presented as a translation of the *Rules* ruling). Use the same policy as Sistani's older Urdu (P6): show a Urdu Q&A entry only where it **agrees** with the 2023 *Rules* ruling; where it differs, show English only for the *Rules* ruling plus the existing Urdu-missing notice. Report agree/differ counts per topic. |
| P14 | Ruling 651 (the mother's qaḍāʾ, obligatory caution) vs. its own footnote to 656, which just says "a caution" | Keep quoting 651 verbatim — a plain "caution" in a footnote doesn't contradict "obligatory caution"; it's just less specific, not a second source to reconcile. Record the footnote in the ruling's data note and in the progress log. **Do not show it to users.** |
| R7 | **New rule: Khamenei Urdu Q&A supplementary entries** | See P13. Applies to every topic, every phase, wherever Khamenei's *Rules* book has no official Urdu and his Q&A book covers the same point. |

## Answered questions (2026-10-07)

| # | Question | Decision |
|---|---|---|
| P15 | Khamenei *Rules* 465 ("Traveling for fun/recreation is not ḥarām, and prayer during such a travel is not shortened") vs *Rules* 452 | **Hide 465 for now.** Before calling it a mistranslation, check (a) the surrounding rulings: it may refer to a specific kind of trip (e.g. hunting for amusement) and not contradict 452; (b) the Persian original. The Persian may be used to decide show/hide, but **never display our own translation**. Log the result. |
| P16 | "Is my wuḍūʾ still valid?" helper for Khamenei | First check leader.ir for an **official English or Urdu translation** of his Persian practical treatise (*Risāla-yi Āmūzishī*). If one exists, use it as a primary source for the helper. If not, build Khamenei's helper **only from cases his Q&A answers**, with "refer to his risala" for everything else. Build Sistani's helper fully. |
| P17 | App-written questions in the helpers | Confirmed, with conditions: (a) questions **only ask about the user's situation** and never state a ruling; (b) **each question node lists the ruling(s)** its options are based on; (c) **tests check every branch follows those rulings**, not just that leaves quote rulings verbatim. |
| P15 result | — | **Done (2026-10-07):** mistranslation confirmed. The context doesn't support a narrower reading, and the Persian مسأله 466 and the official Urdu مسئلہ 466 both say the prayer is shortened (قصر). 465 is withheld in the generator (`HIDDEN_RPF`); no translation of ours is shown. |
| P16 result | — | **Done (2026-10-07):** leader.ir has an official **Urdu** translation, «احکام آموزشی» (book 201). Lesson 16 lists the seven things that invalidate wuḍūʾ and the rules on doubting wuḍūʾ, so Khamenei's helper can be fully sourced in Urdu. No official English translation was found. See P19. |
| R9 | **New rule: generators in the repo** | Commit the generators (`gen_salat.py`, `gen_kqa.py`, `snapshot.py` and the rest) under `scripts/wajibat/`, plus the extracted source-excerpt records the verbatim check depends on, so tests run from the repo. Add a manifest (source URL, fetch date, file hash) and a README on how to regenerate the data. **Don't commit raw downloaded pages.** **Never hand-edit generated data files again.** |
| R10 | **Phase 4 split** | **4a:** download Sistani's doubts chapter; build the content topics (doubts, ṣalāt al-iḥtiyāṭ, sajdat al-sahw / forgotten parts) for both maraji'. Stop for review. **4b:** the helpers (prayer doubts + wuḍūʾ, per marja'). Stop for review. Commit and push to `wajibat-module` only; never merge to `main`. |

## Answered questions (2026-10-07, second round)

| # | Question | Decision |
|---|---|---|
| P18 | Khamenei's official Urdu *Rules* edition | **Yes, pair it with his entries before 4b** (pair by content; the Urdu uses the Persian numbering). **New rule R11 for Khamenei:** his English and Urdu are both translations of the same Persian edition, so when they disagree **the Persian original decides**: show the version that matches the Persian, hide the other, log it. This differs from Sistani (whose English 4th edition is newer than his Urdu, so the English wins). The app never displays its own translation. Show Urdu مسئلہ 466 in the travel topic; English 465 stays hidden. |
| P19 | Urdu-only wuḍūʾ source | **Agreed:** show the official Urdu with the label "no official English translation"; never translate it. Question screens may be in English (app-written); only the final answers are Urdu. **Result screens that are Urdu-only also say where English readers can verify the ruling** (his risala / office). *Ahkam-e Amozeshi* is a **third Khamenei source**: check it against the 2023 *Rules* and the Q&A with the same agree/differ rule; the 2023 Rules take priority; **flag any conflict and ask.** |
| P18 result | — | **Done (2026-10-07):** all 200 Khamenei *Rules* entries read against the Persian original and his official Urdu edition. 188 agree; 7 English withheld (Urdu shown); 3 Urdu withheld; 2 footnote trims (updated in Phase 4b: 364 and 588 were found later by a numeric comparison). Borderline cases (rulings 138, 141) treated as agreeing; details and the question to confirm are in the progress log. |
| R12 | **Phase 4b conditions** | Every question offers an **"I'm not sure"** option that leads to the risala pointer, never to a guessed outcome. One question per screen, a visible "Start over", and the marja's name and the "Not scholar-reviewed" label on every result. P17's conditions stay (questions describe the situation only; each node lists the rulings its options rely on; tests check the branch logic, not just verbatim leaves). Tests walk every path for every marja'. Commit and push to `wajibat-module` only; stop for review after 4b; never merge to `main`. |

## Answered questions (2026-10-07, third round: Phase 4b approved)

| # | Topic | Decision |
|---|---|---|
| A1 | Automated mismatch check | New test over the **whole dataset, all phases**: for every ruling with more than one language version (English / Urdu / Persian where available), compare numbers, ordinal words and negation words (not / نہیں / نه). **Report every mismatch; a person decides each.** Run now and report before Phase 5. |
| A2 | Treatise against the Persian | Check the four *Aḥkām-e Āmūzishī* entries against the Persian *Risāla-yi Āmūzishī*. |
| A3 | Issue 1154 "00" | Show the same "as printed in the official text" note on the helper answer as on the ruling card. |
| A4 | Install size | A script that measures install size reproducibly; **use it for all future figures.** |
| A5 | Transient test failure | Log it (27 files failed to load once, then passed on rerun); investigate if it recurs. |
| A6 | Review pack | Generate a printable review document (Markdown + PDF, Urdu and English) per marja' and helper, listing every path (questions, chosen answers, outcome quote, citation) with a tick box and notes column. Store reviewed status **per path in data** so a reviewer's sign-off can be recorded. |
| A7 | Feature flag | Helpers are hidden unless **all** their paths are marked reviewed (or a dev flag is on). Topic pages stay visible. |
| A8 | Git | Commit and push to `wajibat-module`; **do not merge to `main`** until the user has seen the mismatch report. |

## Answered questions (2026-10-08, fourth round: mismatch triage and merge preparation)

| # | Topic | Decision |
|---|---|---|
| B1 | Safe-default triage of the mismatch report | **No row is "accepted" by this.** It only decides what is *displayed* until a person reviews it. (a) **Sistani, High rows (English/Urdu):** hide the Urdu, show the English with the Urdu notice. Status `hidden-pending-review`. (b) **Khamenei, High rows:** compare each version's numbers and negations with the Persian; show the version that matches the Persian, hide the other (`persian-decided-pending-review`). Rows where both or neither match the Persian: `needs-human`. (c) **Low rows:** keep the current display, `low-pending-review`. **Report:** rows per status; Urdu texts now hidden per marja' and per topic; the `needs-human` rows as a short list with both texts side by side (English/Urdu rows first; the user reads Urdu). **Restoring a hidden version must be a recorded decision in `wajibatMismatchDecisions.json`, never a hand edit.** |
| B2 | Playwright | Add as a devDependency (or document in `scripts/wajibat/README.md`) so the review-pack PDFs can be regenerated. |
| B3 | Production guard | A check (test or build-time failure) that **fails a production build if `NUXT_PUBLIC_WAJIBAT_SHOW_UNREVIEWED_HELPERS` is true.** The setting must never be on in Vercel's production settings. |
| B4 | Merge to `main` | After B1–B3, **prepare** a merge of `wajibat-module` into `main` (helpers hidden, all checks green, a short release note of what is live). **Show the plan and wait for the user's go-ahead before merging.** Phase 5 (Sawm) starts after the merge. |

## Answered questions (2026-10-08, fifth round: blocker before merge)

| # | Topic | Decision |
|---|---|---|
| C1 | Held English quoted by guided-prayer steps and helper answers | For each such step or answer: if the **Urdu matches the Persian**, show the Urdu there with a label (the P19 pattern); if neither matches, show the "refer to his risala" pointer instead of a quote. Report how many were steps and how many helper answers, and re-run the guided-prayer browser checks. |
| C2 | The "match neither" rows | Check whether they come from Persian number extraction (Persian/Arabic-Indic digits, numbers as words, ordinals) rather than real errors; fix the extractor if so, re-run, report the new counts. **Do not change any display decision without telling the user.** |
| C3 | Chunk-load errors | Enable Nuxt's automatic reload on chunk-load errors (`emitRouteChunkError: "automatic"`); note it in the progress log. |
| C4 | Vercel | The user confirms the env var is not set for Production. After C1–C3 pass: show the final merge summary, then fast-forward `main`. |

## Answered questions (2026-10-08, sixth round)

| # | Topic | Decision |
|---|---|---|
| D1 | The 20 "match neither" rows | Apply the safe default and record them as `held-pending-review` through `decide_mismatch.py`: **Sistani:** hold the Urdu, show the English with the Urdu notice; **Khamenei:** show the "refer to his risala" pointer for that ruling until a person decides. (All 20 rows turned out to be Khamenei's, 8 rulings; none is Sistani's.) Rebuild, re-run the browser suites, update the release note, commit and push to `wajibat-module`. |
| D2 | Chunk reload | Keep `emitRouteChunkError: "automatic"`: no immediate reloads mid-reading (`"automatic-immediate"` stays off). |

## Phase 5 working decisions (2026-10-08): made while building, please confirm

Phase 5 started on the user's word ("start Phase 5 (Sawm)") after the Phase 4 merge preparation. These were my calls; each is a default that can be reversed.

| # | Topic | What was done |
|---|---|---|
| E1 | Scope | **Sistani:** *Islamic Laws* Chapter Four, Fasting, Rulings 1529–1718 (190 rulings), and zakāt al-fiṭrah, Rulings 2003–2044 (42). **Khamenei:** *The Rules on Prayer & Fasting 2023*, rulings 787–981 (195). **Left out for now:** iʿtikāf (Sistani Chapter Five; Khamenei 982–1009), which the spec does not list under Sawm; I suggest Phase 8. Every ruling of both ranges is quoted once (except Sistani 1662, quoted as two verbatim excerpts, one per point). |
| E2 | Topics | 13 topics in the Fasting category: who must fast; illness, harm, old age, pregnancy and breastfeeding; the intention; what invalidates the fast; janābah, ḥayḍ and nifās; dawn, maghrib and breaking the fast; kaffārah; only qaḍāʾ; qaḍāʾ and the fidyah; travel; the first of the month; kinds of fast; zakāt al-fiṭrah. Women-specific rulings are collapsed (Q8). |
| E3 | Zakāt al-fiṭrah for Khamenei | **No source found.** Not in the *Rules*, not in the Q&A book (English or Urdu), not in the Urdu treatise (*Aḥkām-e Āmūzishī* has chapters on taqlīd, ṭahārah, prayer, fasting, khums, anfāl, jihād and amr bil maʿrūf only). The topic holds Sistani's 42 rulings and, for Khamenei's followers, **one notice** ("no rulings from him in this topic yet … please refer to his office") instead of 42 empty cards. **Question for the user:** do you have a Khamenei source for zakāt al-fiṭrah (his Persian *Tawḍīḥ al-masāʾil* or an official page)? |
| E4 | Q&A supplementary entries (R7) | 41 of the 106 Q&As in the Fasting chapter (English Q 741–846, Urdu س 745–850, the Urdu number being the English + 4 throughout) were added as supplementary entries, each compared with the Rules ruling it agrees with (cited in `agreesWith`). The other 65 are not added: no matching Rules ruling to cite (for example 762, vaginal medicines; 797, giving money instead of food), or they cover several points. The list is in the progress log. |
| E5 | Live panel and Module 11 | The "Dawn, maghrib and breaking the fast" topic shows today's dawn and maghrib from the Prayer Times feature (nothing recomputed), with links to Prayer Times and to the Ramadan fasting log (no second log is built). The panel says the rulings below decide when the fast begins and ends. |
| E6 | Aḥkām-e Āmūzishī | Its fasting lessons 58–65 (Urdu, official) were **not** used: the 2023 *Rules* cover every point, and P19 gives the *Rules* priority. They remain available to fill gaps. |
| E7 | Persian numbering | The Persian original orders the fasting chapter slightly differently from the English and the official Urdu: English 880 is Persian 902, and the Persian numbers run +1 from 881 to 900 and +2 elsewhere (the Urdu is +2 throughout). Fixed in `align_rules.en_to_persian`; the mismatch check compares each Urdu text with its own Urdu number. |
| E8 | Fixes found on the way | (a) A footnote block holding two notes ("[1] … [2] …") was attached whole to the first ruling: Khamenei 879's Urdu carried 883's footnote. Fixed; no earlier ruling was affected. (b) The extractor now strips weights written in grams (the English glosses *mudd* as "750 gm."), reads Persian نُه as nine, and knows the numbers 60–90 and the Persian ordinals 11–20. **One earlier display decision changed as a result:** Sistani Ruling 866's Urdu (which the check had held because "ninety degrees" was not recognised against Urdu ۹۰) is shown again. No other earlier ruling changed. |
| E9 | Triage of the new rulings | The standing safe default (B1) was applied automatically to the new rows. See the Phase 5 report for the counts. **Open question for the user:** 13 Khamenei fasting rulings are in the "neither version matches the Persian" class; D1 held the earlier 8 with a pointer to his book, but that was your decision for those rows, so the 13 are **shown as before** (`needs-human`) until you say whether to hold them the same way. |

## Phase 0 findings (2026-09-25)

- **Q5 UI kit: Vuetify 3.** `package.json` has `vuetify` + `vite-plugin-vuetify` and no shadcn-vue,
  radix-vue, or Tailwind dependency; `nuxt.config.ts` loads no Tailwind module. The two most recently
  built pages — `app/pages/poets/[slug].vue` (commit 959a7f6) and `app/pages/commands/[id].vue`
  (Knowledge Platform Phase 9) — are written entirely in Vuetify (`v-card`, `v-chip`, `v-tabs`,
  `v-window`, `v-alert`, `v-sheet`, `v-row/v-col`). There has been no shadcn-vue migration, so the
  module uses Vuetify and follows the Module 17 accessibility patterns (Shared Foundation #14/#15).

- **Official sources located.** Each was checked from this environment on 2026-09-25. "Reachable"
  means the page or PDF actually loaded; it does not mean every ruling has been read.

  **Ayatullah al-Sistani** (office: https://www.sistani.org). Reachable: **yes**.
  | Language | Book | Edition | URL | Numbering |
  |---|---|---|---|---|
  | English | *Islamic Laws* | 4th edition | https://www.sistani.org/english/book/48/ · PDF: https://www.sistani.org/files-new/book-pdf/english-islamic-laws-4th-edition.pdf (200 OK, 11.4 MB) | "Ruling 1", "Ruling 2", … (checked on the Taqlid chapter, `/english/book/48/2117/`) |
  | Urdu | *توضیح المسائل* (Tawzih al-Masa'il) | not stated on the index page | https://www.sistani.org/urdu/book/61/ · PDF: https://www.sistani.org/files-new/book-pdf/urdu-tozih.pdf (200 OK, 3.9 MB) | numbered masa'il (to be matched against the English ruling numbers in Phase 1) |
  | Urdu | *مختصر احکام عبادات* | — | https://www.sistani.org/urdu/book/26806/ | supporting source only |
  | Urdu | *خواتین کے احکام آسان زبان میں* | — | https://www.sistani.org/files-new/book-pdf/urdu-book-26187.pdf | supporting source for Q8 topics |
  | Urdu | *مناسک حج* | — | https://www.sistani.org/urdu/book/62/ | for the Hajj overview (Phase 7) |
  | Arabic | *Minhaj al-Salihin* | — | listed on https://www.sistani.org/english/book/fatwa/ | for detail only when *Islamic Laws* is silent |

  **Ayatullah Khamenei** (office: https://www.leader.ir; https://www.khamenei.ir also reachable). Reachable: **yes**.
  | Language | Book | Edition | URL | Numbering |
  |---|---|---|---|---|
  | English | *Practical Laws of Islam* (the English *Ajwibat al-Istifta'at*, a Q&A book) | not stated on the page | https://www.leader.ir/en/book/32/Practical-Laws-of-Islam | "Q 1", "Q 2", … (checked on *Rules of Taqlid*, `?sn=5136`). Chapters include Taqlid, Purity, Prayer, Fasting, Khums, Jihad, Enjoining Good. |
  | English | *The Rules on Prayer & Fasting 2023* | 2023 | https://www.leader.ir/en/book/241?sn=32516 (an older edition is at `/en/book/206/`) | numbered rulings "1.", "141.", … |
  | Urdu | *استفتاآت کے جوابات* | — | https://www.leader.ir/ur/book/106/ | Q&A numbering. WebFetch loaded it; plain curl got a 403, which looks like bot filtering and not a dead link. |
  | Urdu | Online istifta | — | https://www.leader.ir/ur/istifta | not citable as a dataset source |

  **Ayatullah Makarem Shirazi** (office: https://makarem.ir; English mirror: https://www.makaremshirazi.net). Official site reachable: **yes**. Primary ruling text: **NOT reachable from this environment.**
  | Language | Book | Edition | URL | Status |
  |---|---|---|---|---|
  | English | *Practical Laws of Islam (Tauḍiḥ al-Masāil)* | "new updated edition", announced 2016-12-10 | Announcement: https://www.makarem.ir/news/en/News/Details/400955/ | The PDF linked from the announcement (`/upload/Admin/Publications/pdf/Practical Laws of Islam - Final Version.pdf`) returns **404** on both `makarem.ir` and `old.makarem.ir`. The online table of contents (`makarem.ir/main.aspx?catid=9001&lid=1&typeinfo=30`) loads its content with JavaScript and the chapters could not be read. |
  | English / Urdu | Ahkam portal | — | https://ahkam.makarem.ir/en and `/ur` | **404**. `makarem.ir/ahkam/{en,ur}/treatise/index` returns **403**. |
  | Persian | Ahkam portal / library | — | https://ahkam.makarem.ir/fa, https://lib.makarem.ir | Linked from the homepage; not yet checked for readable risala text |
  | English | *A Summary of Rulings* (al-islam.org) | — | https://al-islam.org/summary-rulings-naser-makarem-shirazi | **Secondary** (level B at best). Returned 403 from this environment. |

- **Other Phase 0 findings:** see the Phase 0 Completion Report in `wajibat_progress_log.md`.

## Pending questions

_(Claude Code adds new questions here and asks the user. Move them to "Answered" with the date once decided.)_

_None open._
