# Mir Anis Module — Research Notes (Phase 1 + Phase 2 + Phase 2B + Phase 2C)

Companion to [`mir_anis_module_research_extraction_plan.md`](./mir_anis_module_research_extraction_plan.md),
which defines the full 31-section research/extraction process and the anti-hallucination rules this
document (and the underlying dataset) must follow.

**Status: Phase 1 (Identity) + Phase 2 (Bibliographic Foundation) + Phase 2B (Primary Edition
Resolution) + Phase 2C (Rekhta Reader & Primary-Text Accessibility) done.** Phase 1 verifies
biography/identity. Phase 2 mapped 6 real editions and grew the verse corpus from 1 → 10 couplets
(all B-level). Phase 2B directly OCR-tested 2 scans and found both unreliable. Phase 2C opened
Rekhta's actual digitized reader (the strongest remaining lead) directly — real book, real 438-page
reader, genuine metadata — but found it paywalled with zero readable page content, and its table of
contents too coarse (genre-level, not poem-level) to help even with access. **Across all three
phases, no edition has yielded verifiable primary text**: 0 verses upgraded to A, 0 marsiyas with a
confirmed edition/volume/page. Two independent AI-tool misattributions were caught and rejected
along the way (a false "Hazrat Abbas" claim in Phase 2, a false "Mir Taqi Mir" attribution in
Phase 2C) — both are documented as worked examples of why this module never accepts a single
AI-generated summary as evidence. Phases 3–4, 6–10 (large-scale page-level verse extraction, full
Karbala/character/theme mapping, contextualized verses, non-Karbala poetry, literary-style analysis,
full critical reception, and the final verification audit) are **not done**. This document and the
underlying `app/assets/data/poets/mir-anis.json` are meant to be extended in later passes, not
treated as the finished module.

The machine-readable counterpart to this document is
[`app/assets/data/poets/mir-anis.json`](./app/assets/data/poets/mir-anis.json), following the
plan's Section 28 schema. The app surfaces it at `/poets/mir-anis` (Settings → Additional Modules →
"Show Literary Modules in sidebar" to reveal the sidebar entry).

---

## 1. Biography (Phase 1)

- **Full name:** Mir Babar Ali Anis; takhallus "Anis".
- **Father:** Mir Khaliq (Mir Mustahsan Khaliq), also a marsiya poet. (B)
- **Place of birth:** Faizabad, Awadh. (B)
- **Place of death:** Lucknow. (B)
- **Contemporary/rival:** Mirza Dabeer — secondary sources describe two literary "schools",
  Anisia and Dabiria, forming around the two poets. (B)
- **Education:** Early education in Faizabad, Arabic/Persian study, reported acquaintance with
  Hindi literature (Tulsidas, Malik Muhammad Jayasi). (C — a single secondary source; the
  "composing couplets at age 4–5" claim is the kind of hagiographic detail the plan explicitly
  warns against treating as fact without a primary source.)
- **Teacher:** Reportedly Shaikh Imam Bakhsh Nasikh. (C)

### Conflicting dates (per plan §6, "do not arbitrarily select one")

| Fact | Version A | Version B | Status |
|---|---|---|---|
| Birth year | 1803 (Rekhta, most secondary sources) | 1800 (Wikipedia, citing a source for "1803 CE") | Unresolved — recorded, not picked |
| Death date | 1 December 1874 | 10 December 1874 | Unresolved |
| Grandfather / lineage | Commonly repeated claim: direct grandson of Mir Hasan (author of *Sehr-ul-Bayan*) | One source: grandfather named "Zahak", Mir Hasan as great-grandfather | Unresolved — needs a genealogical/academic source |

None of these have been silently resolved in the dataset; both versions are recorded with a note.

---

## 2. Historical & Literary Context (partial)

Mir Anis worked in Lucknow during the late Awadh Nawabi period (through the 1856 British
annexation), a period generally described in secondary sources as a high point of Urdu literary
patronage and Shia religious/cultural life, and closely tied to Muharram majlis recitation
culture. **This is a general-consensus summary, not a researched historical account** — Section 7
of the plan (Awadh literary culture, pre-Anis marsiya development, oral/performance tradition,
patronage specifics) has not been separately researched.

---

## 3. Genres (Section 8)

| Genre | Attestation | Status |
|---|---|---|
| Marsiya (مرثیہ) | well-attested | Primary genre, widely and consistently documented |
| Salam (سلام) | attributed | C |
| Rubai (رباعی) | attributed | C — an unverified "~600" count from one source |
| Ghazal (غزل) | attributed | C — sources note he wrote comparatively little |
| Qasida / Masnavi / Qit'a | disputed | E — not confirmed for Anis specifically in sources checked |

---

## 4. Works & Collections (Section 9–10, partial)

Seven marsiya entries are seeded in the JSON, sourced from Rekhta.org's own marsiya index — **all
but one are opening-line/title only**, not full verified text:

- *Ba-khuda faaris-e-maidan-e-tahavvur tha Hur* (بخدا فارسِ میدانِ تہور تھا حُرؔ) — about Hurr ibn
  Yazid al-Riyahi. This one has its opening couplet (matla) recorded, corroborated by two
  independent sources agreeing on the exact wording — see the Poetry section below.
- Six further marsiyas recorded as title/opening-line only (Karbala-related, subject/character
  attribution left blank or explicitly marked as an unconfirmed inference where guessed).

**Collections:** "Kulliyat-e-Anis" is referenced generically in popular sources as the poet's
complete works, but this pass did **not** confirm which specific published edition(s) use that
title, an editor, or whether a genuinely complete Kulliyat exists. Rekhta separately hosts digitized
volumes under two title patterns ("Marasi-e-Meer Anees" and "Marsiya Haye Meer Anis Sahab
Marhoom") — whether these are the same compilation or different ones is an open bibliographic
question per plan §10, not assumed either way.

---

## 5. Poetry (Section 13, one seed verse)

Only **one** verse currently meets even Strong-Secondary (B) status:

> بخدا فارسِ میدانِ تہور تھا حُرؔ
> ایک دو لاکھ سواروں میں بہادر تھا حُرؔ

- **Verification:** B (Strong secondary) — the exact wording was corroborated by two independent
  web sources (Rekhta's own listing and an independent search-result quotation of the same line),
  but not checked against a primary critical edition or scan.
- **No translation** has been produced, per the plan's rule against translating before the Urdu is
  fully verified.
- No page/edition/volume/publisher/year is recorded — left blank rather than guessed.

This is far short of the plan's 200-verse target (§1) — deliberately: extracting further full
couplets from Rekhta's marsiya pages was not reliable in this pass (the page's verse text renders
via client-side JS that a simple fetch doesn't capture), and the plan is explicit that quantity
must never be padded with unverified material.

---

## 6. Final Quality-Control Report (Section 29)

```text
Total verses found:              1
Verified A:                      0
Strong secondary B:              1
Attributed C:                    0
Disputed D:                      0
Unverified E:                    0

Total works (title/opening-line only): 7
Total marsiyas fully mapped:     0
Total collections identified:    2 (unreconciled — see above)
Total editions identified:       0

Primary sources consulted:            0
Academic sources consulted:           0
Literary reference sources consulted: 3 (Rekhta profile, Rekhta marsiya index, Rekhta e-books
                                       listing) + 1 tertiary cross-check (Wikipedia)

Top verses / works / marsiyas: too few seeded to rank meaningfully — see §4–5 above for the full
list of what exists.
```

**Unresolved attribution questions:** work_id `anis-marsiya-003`'s character link to Hazrat Abbas
is an unconfirmed inference from its opening line only.

**Conflicting dates:** birth year, death day, grandfather/lineage — see §1 table.

**Uncertain collection titles:** "Kulliyat-e-Anis" vs. the two Rekhta-hosted digitized volume sets
— not reconciled.

**Textual variants:** none recorded yet (nothing has multiple editions checked).

**Gaps:** everything in Sections 11–27 of the plan (Karbala character studies, theme corpus,
marsiya structure mapping, language/style analysis, Anis-vs-Dabeer comparison, critical reception
with named critics, textual variants) — structural placeholders exist in the JSON (themes,
character stubs) but are not populated with researched, verse-grounded content.

---

---

# Phase 2 — Bibliographic Foundation

Research method: real web research (WebSearch + WebFetch) against Rekhta.org, Archive.org (item
catalog metadata, read directly), Wikisource (community-transcribed public-domain text), Wikipedia
(tertiary cross-check only), and a Dawn.com literary-history column, in both Urdu and English
queries per plan §13. No quote-aggregator or unattributed poetry sites were used as evidence.

### Collections identified

| Collection | Type | Editor | Publisher | Year | Volumes | Source | Verification |
|---|---|---|---|---|---|---|---|
| Kulliyat-e-Anis (کلیاتِ انیس) | kulliyat (generic name) | — | — | — | — | popular usage, unconfirmed | E |
| Marasi-e-Meer Anees / Marsiya-haye Meer Anees | marsiya collection, digitized | — | — | — | ≥6 (vols 1,2,3,5,6 on Rekhta) | Rekhta e-books listing | B |
| Naval Kishore Press original edition | kulliyat | — | Munshi Naval Kishore Press, Lucknow | 1876 (v.1) – 1877 (v.4) | 4 (108 elegies / 268 rubais / 31 salams total) | Dawn, Rauf Parekh (5 Jun 2023) | B |
| Muntakhab Marasi Anees (منتخب مراثی انیس) | marsiya selection, annotated | Syed Murtaza Hussain Fazil Lakhnawi | Majlis-e-Taraqqi-e-Adab, Lahore | Oct 1974 | 1 (12 elegies, manuscript-sourced) | Dawn + Archive.org catalog (2 independent sources) | B |
| Anis: 111 Marsiye | marsiya collection | Nayyar Masud & Timsal Masud, on research by Masood Hasan Rizvi Adeeb | Aaj Ki Kitaben, Karachi | 2023 (unconfirmed) | 3 (111 elegies = 108 original + 3 from Tej Kumar Press) | Dawn, Rauf Parekh | C (year unconfirmed) |
| Marasi Mir Anees (2004 printing) | marsiya collection, digitized scan | — | Munshi Nawal Kishore Press, Lucknow | 2004 | ≥4 (vols 1, 4 located) | Archive.org catalog, read directly | B |

**Kulliyat-e-Anis vs. these real editions:** none of the five newly-identified concrete editions is
actually titled "Kulliyat-e-Anis" — that name remains a separate, unresolved, generic popular
reference (plan §10's warning not to assume Kulliyat/Diwan naming is settled applies directly
here).

### Marsiyas identified

| Marsiya (opening line) | Collection/volume/page | Source | Verification |
|---|---|---|---|
| بخدا فارسِ میدانِ تہور تھا حُرؔ (Hurr) | unknown | Rekhta + Wikisource + independent search quote | B |
| آج شبیرؔ پہ کیا عالمِ تنہائی ہے (Imam Hussain) | unknown | Rekhta + Wikisource + independent search quote | B |
| دشت وغا میں نور خدا کا ظہور ہے | unknown | Rekhta (title only; Wikisource page exists, text not extracted) | C |
| جب رن میں سر بلند علی کا علم ہوا (character popularly assumed Abbas, NOT textually confirmed) | unknown | Rekhta + Wikisource | C — capped, see note below |
| فرزند پیمبر کا مدینے سے سفر ہے (Imam Hussain) | unknown | Rekhta + Wikisource + independent summary quote | B |
| آمد آمد حرمِ شاہ کی دربار میں ہے | unknown | Rekhta (title only) | C |
| کیا غازیانِ فوجِ خدا نام کر گئے | unknown | Rekhta (title only; Wikisource page exists, text not extracted) | B |

No marsiya in this dataset yet has a confirmed collection/volume/page — see "Research gaps" below.
The "جب رن میں..." marsiya is capped at C despite having sourced verse text, specifically because an
AI web-fetch tool used during this research asserted "Abbas" as the subject when the text itself
never names him — a real, caught example of the exact failure mode plan §4 warns against, kept
visible in the dataset rather than quietly corrected away.

### Primary sources

- **Muntakhab Marasi Anees** (Fazil Lakhnawi, ed., 1974) — digitized scan on Archive.org, catalog
  metadata read directly. An OCR-text extraction attempt for verse content was made and abandoned
  as unreliable (see "Research gaps").
- **Marasi Mir Anees** (2004 printing) — digitized scan on Archive.org, catalog metadata read
  directly; not yet used for text extraction.

### Secondary sources

- Rekhta.org — poet profile, marsiya index, e-books listing (reputable Urdu literary archive).
- Dawn.com, "Literary notes" column by Rauf Parekh (5 June 2023) — the single richest bibliographic
  source this phase; a national newspaper's literary-history column, treated as B not A.
- Urdu Wikisource (ur.wikisource.org) — community-transcribed public-domain marsiya texts, used for
  verse corroboration; treated as B, same tier as Rekhta.
- Wikipedia — tertiary only, used solely to surface the birth-year/death-day conflicts.

### Poetry extracted

```text
Previous verified verses (Phase 1):     1  (all B)
Newly added verses (Phase 2):           9  (all B)
Total verses now:                      10
A-level count:                          0
B-level count:                         10
C/D/E-level count (in verses array):    0
Variants found:                         1  (anis-verse-0007: "گھڑے" vs "کھڑے", both readings kept)
```

Every new verse was accepted only after being found in at least one reputable source (Rekhta index
or Wikisource); 7 of the 10 have two- or three-source corroboration, 3 are Wikisource-only. None has
been checked against a primary edition page by this module, so per this dataset's own rules none
qualifies as A regardless of how many secondary sources agree — the module does not use "more
sources" as a substitute for "checked against a scan."

### Research gaps

- **Marsiya → Edition → Volume → Page → Original Text path not established.** This was this phase's
  stated objective (plan-request §5) and is the single biggest remaining gap: real editions are now
  known, and marsiya text is now known, but which specific edition/volume/page each marsiya/verse
  actually sits in is not mapped for a single one of them.
- **Fazil Lakhnawi 1974 edition's OCR text was unusable.** Archive.org's raw OCR (`*_djvu.txt`) for
  this scholarly-annotated selection was too degraded for confident verbatim quotation, and passing
  it through an AI summarizer added a second layer of error risk. No verse was sourced from it.
  Re-attempting this via page images/PDF with human proofreading is the highest-value next step
  toward actual A-level verses.
- **Aaj Ki Kitaben 111-marsiye edition's 2023 publication year is unconfirmed** — single-sourced,
  possibly conflated with the Dawn article's own date.
- **"Kulliyat-e-Anis" remains unresolved** — no edition found this phase actually carries that title.
- **Character attribution risk demonstrated, not just theorized:** the Abbas/"جب رن میں..." case
  above is a concrete instance, not a hypothetical, of an AI tool asserting an unconfirmed character
  identification as fact. Kept visible in the dataset as a worked example.
- **Two of five Wikisource fetch attempts were declined** by the fetch tool on copyright-caution
  grounds despite the underlying 19th-century text being public domain (that's why Wikisource hosts
  it) — a tooling limitation to route around (e.g. different phrasing, or a different retrieval
  method) in a future pass, not a finding about the source itself.
- **Verses commonly attributed online but not verified:** none added this phase — every verse added
  had at least one reputable-source hit before being included; nothing was accepted purely because
  it "sounded right" or matched a memory of a famous line.

### Updated QC snapshot (supersedes the Phase 1 numbers above for these fields)

```text
Total verses:                     10 (was 1)
Verified A:                        0
Strong secondary B:               10
Attributed C / Disputed D / Unverified E (in verses array): 0 / 0 / 0

Total works (title-level):         7 (unchanged — same 7, now enriched with source_refs/
                                    verification_level; 3 of them now also have real verse text)
Total marsiyas cataloged (marsiyas[]): 7
Total collections identified:      6 (was 2) — 4 new, real, named editions added
Total editions with confirmed editor+publisher+year: 2 (Naval Kishore 1876-77; Fazil Lakhnawi 1974)
Total source_registry entries:     9
```

---

# Phase 2B — Primary Edition Resolution

Goal: not more poetry, but determining whether any located edition can actually serve as a primary
text source, and whether the 7 existing marsiyas can be traced to a specific edition/volume/page.
0 new verses were added this phase (well under the 10-verse cap); 1 new edition/collection/source
was added; the deliverable is `edition_registry[]` (6 entries) and `edition_page_map[]` (7 entries).

## Edition Resolution

| Edition | Editor/Publisher/Year | Scan available | Scan quality | OCR quality | Primary-usable? | Bibliographic confidence |
|---|---|---|---|---|---|---|
| Naval Kishore original (1876–77) | — / Munshi Naval Kishore Press, Lucknow / 1876–77 | No scan located | unavailable | unavailable | No | B |
| Muntakhab Marasi Anees | Fazil Lakhnawi / Majlis-e-Taraqqi-e-Adab, Lahore / Oct 1974 | Yes (Archive.org) | not directly assessed (images not inspected) | **unreliable** (directly tested twice) | No | B |
| Anis ke Marsiye, Vol. 1 | Saleha Aabid Husain / Taraqqi Urdu Bureau, New Delhi / 1980 | Yes (Archive.org) | not directly assessed | **unreliable** (directly tested) | No | B |
| Marasi Mir Anees (reprint) | — / Munshi Nawal Kishore Press, Lucknow / 2004 | Yes (Archive.org) | not assessed | not conclusively assessed (1 attempt failed, not retried) | No | B |
| Anis: 111 Marsiye | Nayyar Masud & Timsal Masud / Aaj Ki Kitaben, Karachi / 2023 (unconfirmed) | No (likely in-copyright) | unavailable | unavailable | No | C |
| Rekhta digitized volumes | — / — / — | Yes (Rekhta reader) | not assessed this phase | not assessed this phase | Unknown | B |

**Bottom line: zero of the six identified editions is currently usable as a primary text source.**
Two were directly OCR-tested this phase and failed; the rest were either never located as a scan,
not legally accessible, or simply not yet tested (Rekhta's own reader, the 2004 reprint). This is a
real, tool-level blocker (no vision/image capability available to this module), not a bibliographic
one — bibliographic confidence is B for 5 of the 6 editions.

## Marsiya Page Mapping

| Marsiya | Edition | Volume | Printed Pages | Scan Pages | Original Text Available | Verification |
|---|---|---|---|---|---|---|
| بخدا فارسِ میدانِ تہور تھا حُرؔ (Hurr) | unresolved | — | — | — | No | unresolved |
| آج شبیرؔ پہ کیا عالمِ تنہائی ہے (Imam Hussain) | unresolved | — | — | — | No | unresolved |
| دشت وغا میں نور خدا کا ظہور ہے | unresolved | — | — | — | No | unresolved |
| جب رن میں سر بلند علی کا علم ہوا | unresolved | — | — | — | No | unresolved |
| فرزند پیمبر کا مدینے سے سفر ہے (Imam Hussain) | unresolved | — | — | — | No | unresolved |
| آمد آمد حرمِ شاہ کی دربار میں ہے | unresolved | — | — | — | No | unresolved |
| کیا غازیانِ فوجِ خدا نام کر گئے | unresolved | — | — | — | No | unresolved |

4 of the 7 (Hurr, Aaj Shabir, Farzand-e-Payambar, and — no, only those 3) had an actual phrase-search
attempt made against the two OCR-tested scans; the other 4 were not attempted this phase (effort was
spent establishing whether the method works at all before scaling it up — it didn't, on these two
scans). None resolved. `edition_id` is `null` for every row, deliberately, rather than guessed.

## Existing Verse Reverification (all 10)

Every verse below was checked for an exact-phrase match against the OCR text of the 2 newly-tested
scans (Fazil Lakhnawi 1974, Saleha Abid Husain 1980). None was found in either scan — inconclusive
given both scans' OCR was independently assessed as unreliable, not evidence the lines are absent.

| Verse | Prior level | Primary source found? | New level | Reason |
|---|---|---|---|---|
| anis-verse-0001 (Hurr matla) | B | No | **B (unchanged)** | Not found in either tested scan; OCR unreliable, inconclusive |
| anis-verse-0002 (Aaj Shabir matla) | B | No | **B (unchanged)** | same |
| anis-verse-0003 | B | No | **B (unchanged)** | same |
| anis-verse-0004 | B | No | **B (unchanged)** | same |
| anis-verse-0005 (Farzand matla) | B | No | **B (unchanged)** | same |
| anis-verse-0006 | B | No | **B (unchanged)** | same |
| anis-verse-0007 | B | No | **B (unchanged)** | same |
| anis-verse-0010 (jab ran mein matla) | B | Not attempted | **B (unchanged)** | not phrase-searched this phase |
| anis-verse-0011 | B | Not attempted | **B (unchanged)** | not phrase-searched this phase |
| anis-verse-0012 | B | Not attempted | **B (unchanged)** | not phrase-searched this phase |

**0 verses upgraded to A. 0 verses downgraded.** It is entirely acceptable, and what actually
happened, for all 10 to remain at B — no primary match was confirmed, and no evidence of error in
the existing B-level text surfaced either.

## Attribution Audit

All 7 marsiyas were reviewed for whether their assigned character is actually supported by the text
itself (not just by a secondary source's label), per the plan's warning about the Abbas case:

- **confirmed_by_text (3):** anis-marsiya-hur (Hurr named in the title itself), anis-marsiya-001
  ("Shabir" — an unambiguous, standard epithet for Imam Hussain), anis-marsiya-004 ("Farzand-e-
  payambar" + Medina/Sadaat framing — reasonably direct, if slightly less explicit than a proper name).
- **uncertain (1):** anis-marsiya-003 — unchanged from Phase 2. The popular Abbas association is
  still NOT supported by the couplet text, which only says "Ali ka alam".
- **unassigned (3):** anis-marsiya-002, 005, 006 — no character was ever claimed for these; nothing
  to audit.

No new attribution errors were found, and no existing attribution was corrected — Phase 2 had
already caught the one real problem (the Abbas case) and it remains correctly flagged as uncertain.

## Kulliyat Investigation

Searched HathiTrust's catalog, WorldCat, and Google Books directly for "Kulliyat-e-Anis" / "Kulliyat
Anis" / "کلیات انیس" — **no matching library record found in any of the three.** Combined with the
fact that none of the 6 real, named editions now identified in this dataset carries that exact
title, this module's working conclusion is: **"Kulliyat-e-Anis" is most likely an informal, generic
descriptor for "the collected marsiyas of Anis" rather than the name of one specific real
publication.** This is a conclusion from absence of evidence in the sources checked, not a proven
negative — the `col-kulliyat-anis-generic` entry is kept in the dataset (not deleted) but its
confidence was downgraded to E to reflect this.

## Remaining Blockers (for Phase 3)

1. **No usable primary text source exists yet.** Every scan either has untested/unreliable OCR, or
   isn't legally/practically accessible, or hasn't been opened at all (Rekhta's own reader — the one
   genuinely untested lead worth trying next). This module has no image/vision capability, so a
   scanned page's picture cannot currently be read directly — only its OCR text layer, which has
   failed twice in a row.
2. **No marsiya has a confirmed edition/volume/page.** Phase 3 (large-scale extraction) needs this
   scaffolding to cite sources properly; right now every `edition_page_map` row is `unresolved`.
3. Everything else carried over from Phase 2 (birth/death-date conflicts, Aaj Ki Kitaben's
   unconfirmed year, etc.) remains open but is not itself blocking Phase 3.

---

# Phase 2C — Rekhta Reader & Primary-Text Accessibility Investigation

Goal: test the strongest remaining lead — Rekhta's digitized Mir Anis volumes/reader — directly,
not via search snippets, to see whether it can supply `Edition → Volume → Page → Exact Urdu Text`.
0 new verses were added this phase (limit was 5); 2 new `source_registry` entries were added; the
Rekhta and Saleha Abid Husain 1980 `edition_registry` entries were updated in place.

## Rekhta sources tested

| Source | What it is | Metadata found | Page access | OCR/text access | Assessment |
|---|---|---|---|---|---|
| Rekhta ebook reader, "Marasi-e-Meer Anees Vol. 1" (`ed-rekhta-digitized`) | Actual flip-book reader (opened directly, not just the index page) | 438 pages; contributors "Tej Kumar, Dr. Aditya Behl"; genre-level TOC (مرثیہ/رباعیات/سلام/قطعہ + page numbers) | **Blocked** — login/subscription wall, "exhausted 5 free content pages per year" | Unknown (never reached) | **Primary-source lead** — real edition, inaccessible |
| ghazalsara.org marsiya page | Individual poem page, no scan | Site copyright credit only; no book/edition/page cited | N/A (not scan-based) | Full verse text shown, unsourced | **Secondary-only** — 4th site to agree on anis-verse-0001's wording, but zero provenance |
| Archive.org `_page_numbers.json` for `col-saleha-abid-husain-1980` | Archive-hocr-tools metadata file | Reports scan→printed-page mapping and a 96% "OCR confidence" score | N/A | Contradicts this module's own direct OCR read (found garbled) | Recorded as an open discrepancy, not used to upgrade anything |

**The Tej Kumar / Dr. Aditya Behl credit is a genuine new cross-reference**: it independently
corroborates the Dawn article's mention of "rare Tej Kumar Press editions" (the source of 3 extra
elegies in the Aaj Ki Kitaben 111-marsiye edition) — two unrelated sources now both name "Tej Kumar"
in connection with Anis's marsiyas, which is a real, if still unresolved, bibliographic thread.

## Verse test results (existing 10 verses)

| Verse ID | Search method | Found | Work | Edition | Volume | Page | Exact match | Primary page visible | Result |
|---|---|---|---|---|---|---|---|---|---|
| anis-verse-0001 | Rekhta reader + ghazalsara.org | Reader: no (paywalled). ghazalsara: yes (matla only) | anis-marsiya-hur | unresolved | — | — | Consistent with existing text, not independently checked page-for-page | No | **B, unchanged** |
| anis-verse-0002/0003/0004 | Rekhta reader (TOC has no per-poem titles) | No | anis-marsiya-001 | unresolved | — | — | N/A | No | **B, unchanged** |
| anis-verse-0005/0006/0007 | Rekhta reader (TOC has no per-poem titles) | No | anis-marsiya-004 | unresolved | — | — | N/A | No | **B, unchanged** |
| anis-verse-0010/0011/0012 | Not attempted this phase | — | anis-marsiya-003 | unresolved | — | — | N/A | No | **B, unchanged** |

## Successful citation chains

**None.** No verse in this dataset achieved `verse → marsiya → edition → volume → page → original
text` this phase. The closest attempt (anis-verse-0001 via Rekhta) was stopped by the paywall before
reaching a page.

## Failed attempts — why

- **Rekhta reader:** real book, real reader, but content is metered/gated and the quota was already
  exhausted for this session — a hard access barrier, not a data-quality problem.
- **Rekhta's TOC:** exists but is genre-level only (section headings, not poem titles) — would not
  have resolved page-level mapping even with full access, without opening individual pages.
- **ghazalsara.org:** has the text but no provenance to cite — can corroborate wording, cannot
  establish a citation chain.
- **archive-hocr-tools' 96% confidence claim:** does not match this module's own direct read of the
  same OCR text (garbled) — treated as an unresolved discrepancy, not acted on.

## Textual variants

None confirmed. ghazalsara.org's matla text was checked against the dataset's existing wording and
found consistent (not a variant) — no word-for-word comparison beyond the matla was performed, since
no further text was extracted from that page this phase.

## Abbas attribution audit

**No new evidence found.** Rekhta's actual reader and ghazalsara.org do not reach anis-marsiya-003's
specific text (neither was accessible/relevant for that poem this phase). The attribution remains
**uncertain**, exactly as Phase 2 left it — the couplet text still only says "Ali ka alam" and does
not name Abbas.

## A second caught misattribution (new)

A WebSearch summarization tool, when asked about anis-marsiya-001's matla ("آج شبیر پہ کیا عالم
تنہائی ہے"), stated it "is a ghazal by Mir Taqqi Mir" from "Mir's Kulliyat." **This is false** — this
is Mir Anis's marsiya, already confirmed independently via Rekhta, Wikisource, and an earlier search
corroboration. Mir Taqi Mir is a different, 18th-century poet. Nothing in the dataset was changed
because of this — it's recorded as a second concrete example (after the Phase 2 Abbas case) of why
this module treats any single AI-generated summary as a lead to verify, never as evidence on its own.

## Phase 3 readiness

`NO — Rekhta's reader (the strongest remaining lead) is paywalled and returned zero page content;
no edition tested across three phases (5 scans + this gated reader) has yielded verifiable primary
text, so no marsiya has a confirmed edition/volume/page to extract from.`

---

## Next steps (Phase 3 candidates)

1. **Try Rekhta's own reader for at least one digitized volume** (col-rekhta-digitized-marasi) —
   the one genuinely untested lead from this phase. Rekhta typically renders clean typeset text
   (not a raw scan), so it may sidestep the OCR-quality problem entirely if its per-page reader can
   be fetched (untested — the index page was used in Phase 2, the reader itself never opened).
2. **Get human eyes (or a vision-capable tool) on the Fazil Lakhnawi 1974 or Saleha Abid Husain
   1980 page images** (PDF/JP2, both confirmed to exist) — OCR has now failed twice on these two
   scans specifically, so continuing to retry OCR on the same files is unlikely to help; the images
   themselves were never inspected because this module's tools are text-only.
3. **Establish the Marsiya → Edition → Volume → Page path** for at least the 3 best-attested
   marsiyas (Hurr, Aaj Shabir, Farzand-e-Payambar) once one of the above actually yields readable
   primary text — right now every `edition_page_map` row is `unresolved`, by design, not by gap.
4. Resolve the birth/death-date and lineage conflicts, and the Aaj Ki Kitaben publication-year gap,
   against an academic or publisher/library-catalog source rather than general web pages.
5. Build out the character and theme entries from actual verse content now that 10 real couplets
   exist, instead of the remaining structural placeholders — carefully, given the demonstrated risk
   of an AI tool asserting unconfirmed character attributions (see the Abbas/"جب رن میں..." case).
6. Only then attempt Sections 14–27 (famous-verse ranking, marsiya structure mapping, Anis vs.
   Dabeer, full critical reception) — all of which depend on having a real verified corpus first,
   per the plan's own Section 1 ("Accuracy > Quantity") and Section 30 phase ordering. Phase 3
   (large-scale primary-text extraction) should not start until step 1–3 above give this module an
   actual page-level verification capability, not just a list of editions that exist.
