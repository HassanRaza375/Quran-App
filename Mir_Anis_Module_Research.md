# Mir Anis Module — Research Notes (Phase 1 + Phase 2 + Phase 2B + Phase 2C + Phase 3 + Phase 4 + Phase 5 + Phase 6 + Phase 7 + Phase 8 + Phase 9 + Phase 10 + Phase 11)

Companion to [`mir_anis_module_research_extraction_plan.md`](./mir_anis_module_research_extraction_plan.md),
which defines the full 31-section research/extraction process and the anti-hallucination rules this
document (and the underlying dataset) must follow.

**Status: Phase 1 (Identity) through Phase 9 (Band 18-20 Extraction & Discrepancy Investigation)
done.** Phases 1-3 built a bibliographic foundation and established OCR-based recovery was a dead
end. Phase 4 broke through via a Columbia University scholar's teaching site hosting cleanly typeset
transcriptions. Phases 5-7 reached the dataset's first A1 verses and resolved the grandfather/
lineage conflict. **Phase 8 found and confirmed a complete 577-page scan of the exact edition
already in this dataset**, matching already-transcribed text word-for-word and upgrading/correcting
16 verses. **Phase 9 extended that confirmed edition by 3 more bands (page 312, all A1), closed a
Phase-8 fetch gap (page 311 now directly re-confirmed), and re-investigated — rather than further
deferred — an open discrepancy**: the confirmed edition's own page 16 doesn't match a different,
earlier-used excerpt's "page 16" for the same nominal book. Direct comparison of both sources' title
pages found them near-identical, which *deepens* rather than resolves this puzzle; it is recorded as
explicitly unresolved, with the affected A1 verses cross-referencing the open question without being
downgraded (their own page-309 attribution is independently solid). **Current state: 19 A-level
verses (up from 16), 10 B-level verses (unchanged), 29 total, 0 downgraded, 5 characters, 1 major
biographical conflict resolved, 1 bibliographic discrepancy honestly left open.** Four independent
AI-tool misattribution/fabrication attempts have been caught and rejected across the research — each
documented as a worked example of why this module never accepts a single AI-generated claim as
evidence on its own. **Phase 10 (Karbala Core Topics, Data Refinement & UI Simplification) is a
deliberate scope change and is done for its own narrowed goals**: it did not extract new primary
text, but instead synced `themes[]`/`characters[]` to the 29 verses actually in the dataset (was
stale, still pointing at Phase-1 placeholders), consolidated the page-16 discrepancy into one
current-status note, and added real character/theme/verification-level filtering to the Poetry
Library UI. Primary-text extraction past band 20, the page-16 discrepancy's resolution, non-Karbala
poetry, Anis-vs-Dabeer comparison, and marsiya-structure mapping remain **paused, not abandoned** —
see Phase 10's section below for the full breakdown. **Phase 11 was a small polish pass**: it fixed
a display gap where Phase 10's character/theme data existed in the dataset but wasn't rendered on
the page, and proofread (reworded, not re-argued) the two Phase 10 research notes for clarity. No
data, scope, or extraction changed. This document and the underlying
`app/assets/data/poets/mir-anis.json` are meant to be extended in later passes, not treated as the
finished module.

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

# Phase 3 — Primary-Text Recovery & Verified Poetry Extraction

Goal: recover actual primary-source Urdu text using a multi-route strategy (OCR-tolerant fragment
search, alternate derivatives, alternate/independent scans, Wikisource raw-wikitext provenance
check) rather than repeating the single "search OCR, fail, conclude inaccessible" pattern from
earlier phases. 0 new verses were added (limit was 5 this phase) — none reached the A-level bar.

## A. Executive result

```text
Primary editions successfully recovered:      0 (page-level)
Usable page-level primary witnesses:            0
A-level verses:                                 0
B-level verses:                                10 (unchanged)
New works resolved:                             0
Marsiyas mapped to edition/page:                0 confirmed; 3 have an unreproduced OCR lead
Textual variants:                               0 new
```

## B. Edition table (all editions tested to date, Phase 3 additions marked *)

| Edition | Editor/Publisher/Year | Digital source | Page access | OCR quality | Primary usable? | Pages mapped |
|---|---|---|---|---|---|---|
| Naval Kishore original (1876–77) | — / Naval Kishore Press / 1876–77 | none located | — | — | No | 0 |
| Muntakhab Marasi Anees | Fazil Lakhnawi / Majlis-e-Taraqqi-e-Adab / 1974 | Archive.org | images untested | unreliable, but produced a fragile TOC-header lead* | No | 0 |
| Anis ke Marsiye Vol. 1 | Saleha Abid Husain / Taraqqi Urdu Bureau / 1980 | Archive.org | images untested | unreliable; a page-number claim from this scan was tested and rejected as unevidenced* | No | 0 |
| *Anees Ke Marsiye (DLI)* | credited "Abid Hussain" (ambiguous) / — / — | Archive.org (DLI/U. Kashmir) | images untested | **unreliable — worse than the other two*** | No | 0 |
| Marasi Mir Anees (2004 reprint) | — / Naval Kishore Press / 2004 | Archive.org | untested | not conclusively tested | No | 0 |
| Anis: 111 Marsiye | Nayyar/Timsal Masud / Aaj Ki Kitaben / 2023(?) | none (in-copyright) | — | — | No | 0 |
| Rekhta digitized reader | — / — / — | Rekhta | **paywalled, 0 pages viewed** | unknown (never reached) | No | 0 |

**\*New this phase:** the DLI/University of Kashmir scan is a genuinely different institution/pipeline
than the other two Archive.org scans — testing it was specifically to rule out "one bad batch" as
the explanation. It failed at least as badly, which strengthens the overall conclusion with
independent evidence rather than repeating the same test.

## C. The one real finding: a fragile OCR lead (not a confirmed fact)

A broad calibration pass over the Fazil Lakhnawi 1974 scan's OCR text found the poet's own name
(~60–80 times) and produced 10 candidate section-header lines. **3 of them are recognizable, despite
heavy garbling, as this dataset's own marsiyas:**

| OCR line (as returned, garbled) | Matches | Confidence |
|---|---|---|
| "جب رن میق سربلند علی کا م لم ہوا" | anis-marsiya-003 ("جب رن میں سر بلند علی کا علم ہوا") | low — see below |
| "آغاز می ثیںت ۔ جب غازیانِ نوج خدا لام کروکۓے" | anis-marsiya-006 ("کیا غازیانِ فوجِ خدا نام کر گئے") | low — see below |
| "صلیہ :۰ : ات ات حم شاہ یق دربار میں کے" | anis-marsiya-005 ("آمد آمد حرمِ شاہ کی دربار میں ہے") | low — see below |

This is the first positive edition-inclusion signal found across four research phases, and it is
recorded (`marsiyas[].candidate_edition`) — **but a targeted follow-up fetch, asking specifically to
re-locate the anis-marsiya-003 line and quote its next two lines, failed to reproduce the match.**
No page number was obtained for any of the three, and none of the fetch attempts could reliably
quote 15 lines of surrounding context without acknowledged degradation. Per this module's own rules,
an unreproduced signal is not evidence — it is a lead. `collection_id`, `verification_level`, and
`page_verification` were deliberately left unchanged for all three marsiyas.

## D. A caught fabrication (3rd example)

A separate fetch against the Saleha Abid Husain 1980 scan returned specific, clean page numbers
("شبیر references: pages 47–49") for generic word-fragment hits, with no stated method for how they
were derived. **Rejected.** Contrast with the Fazil Lakhnawi finding above, which came with an
actual quotable (if garbled) line — this one came with nothing checkable, which is exactly the
profile of a plausible-sounding fabrication rather than an observation. No page numbers from this
claim entered the dataset. This is the third caught-and-rejected AI misattribution/fabrication in
this research (after the Phase 2 Hazrat Abbas claim and the Phase 2C Mir Taqi Mir claim).

## E. Wikisource provenance — closed out

Checked the raw wikitext (`action=raw`) of a Wikisource marsiya page directly this phase, not just
the rendered page. Confirmed: no template, category, or citation field names a source edition or
scan anywhere in the underlying markup. This isn't a viewing limitation — Wikisource genuinely
provides no traceable provenance for these pages as authored. Verification level for
Wikisource-sourced text remains B, now on a fully closed-out basis.

## F. New leads surfaced, not yet investigated

Found but not tested this phase (listed for Phase 4, per the efficiency rule against chasing every
lead in one pass): `muntakhibmarasiyeanees` and `dli.ernet.450049` ("Majmua Marsiya Meer Anees") on
Archive.org; Rekhta's "Bazm-e-Anees" (Intikhab-e-Marasi-e-Anees) and "Waqiat-e-Karbala" titles. The
"Tej Kumar, Dr. Aditya Behl" contributor credit on Rekhta's Vol. 1 reader independently
cross-references the Dawn article's "Tej Kumar Press" mention — a real thread, still unresolved.

## G. Provenance map (current state — every verse)

```text
Verse → Marsiya → Collection → Edition → Volume → Printed page → Digital witness
  B   →   B     →  mostly B  → 6 tested, →  n/a   →   none      →  OCR unreliable (3 scans),
                                0 usable                            reader paywalled (1),
                                                                      no citation (Wikisource)
```

Every arrow in this chain still terminates before "printed page" for all 10 verses.

## Remaining blockers (demonstrated, not assumed)

1. **OCR is unreliable across every scan tested (3, from 2 independent pipelines)** — not a single
   failed attempt; independently re-confirmed this phase with a 3rd, differently-sourced scan.
2. **Rekhta's reader remains paywalled.** No new access route was found or attempted redundantly
   this phase, per the efficiency rule.
3. **The one positive signal (Fazil Lakhnawi TOC match) is unreproduced**, and this module's rules
   require reproducibility, not a single hit, before treating something as evidence.
4. Everything carried over from earlier phases (Kulliyat-e-Anis, date conflicts, Aaj Ki Kitaben's
   year) remains open but non-blocking for text recovery specifically.

## Definition-of-success check

Target was ≥20 A-level verses, ≥2 page-mapped marsiyas, ≥1 usable primary edition, or an honestly
documented reason why not. **Result: 0 / 0 / 0, with a fully auditable trail of what was tried.**
Per the phase's own instruction ("a smaller result is acceptable if the evidence is genuine; a
larger result is NOT acceptable if provenance is weak"), this is the correct outcome given the
actual evidence obtained, not a shortfall from insufficient effort — see the edition table above for
what was actually tested.

---

# Phase 4 — Primary Witness Discovery & Edition Recovery

Goal: stop repeating the OCR investigation and find a genuinely usable primary witness through a
different route — library/institutional catalogs, Google Books/HathiTrust, academic citation
mining, and a deeper look at the Tej Kumar Press lead. **This phase succeeded**, via a route not
tried before: a scholarly teaching site hosting cleanly typeset (not scanned) transcriptions with
printed source citations.

## A. Primary Witness Discovery

```text
New primary witnesses identified:        2 (franpritchett.com transcription pages; Ali Jawad
                                             Zaidi's Sahitya Akademi monograph)
New primary witnesses accessible:        2 (both fully read via page-image rendering)
New primary witnesses page-verifiable:   0 (neither gives a specific page/folio number)
```

**The breakthrough:** Frances Pritchett (Professor Emerita of Urdu, Columbia University) hosts
extensive SOAS/Columbia teaching materials on Mir Anis's marsiya "جب قطع کی مسافتِ شب آفتاب نے" at
franpritchett.com (the site relocated from columbia.edu, which is why earlier direct columbia.edu
fetches in this research returned 403 errors — now resolved). One linked PDF, captioned "THE NEW
MAS'UD EDITION OF THE URDU TEXT," is cleanly typeset text — not a scan — with an explicit citation
printed at the foot of the page: **"source: Anis: 111 Marsiye, Edited by Naiyer Masud and Timsal
Masud. AAJ, Karachi. 2021."**

This PDF's text layer could not be extracted programmatically — diagnosed precisely: the font maps
glyphs to Private-Use-Area Unicode codepoints (a legacy Urdu desktop-publishing encoding scheme),
which is a *different* failure mode from OCR degradation, not the same problem recurring. Text
extraction being blocked is not the same as the text being unreadable, so this module rendered the
PDF page to a high-resolution image (via PyMuPDF, installed locally for this purpose) and read the
Urdu text directly, visually — the human/vision-equivalent method the earlier phases' OCR work was
always a proxy for. Five bands were transcribed this way, each independently re-verified against a
second, higher-resolution crop before entry (one correction made: شانے not شانہ in band 4).

## B. Edition table (Phase 4 addition marked *)

| Edition | Editor/Publisher/Year | Repository | Digital availability | Page availability | Verification status |
|---|---|---|---|---|---|
| *Anis: 111 Marsiye* | *Naiyer Masud & Timsal Masud / Aaj Ki Kitaben, Karachi / **2021** (year now confirmed, was "2023 (unconfirmed)")* | *franpritchett.com (transcription, not the book itself)* | *5 bands of 1 marsiya, cleanly legible* | *No page/folio number given* | ***B1 — best-evidenced text in this dataset*** |
| *Marsia Meer Anees (1887)* | *— / Munshi Newul Kishore, Lucknow / 1887* | *Archive.org (State Central Library, Hyderabad scan)* | *OCR tested* | *— * | ***Unreliable — 4th independent OCR failure*** |
| Muntakhab Marasi Anees, Fazil Lakhnawi 1974 | (unchanged from Phase 3) |
| Anis ke Marsiye, Saleha Abid Husain 1980 | (unchanged from Phase 3) |
| Anees Ke Marsiye, DLI | (unchanged from Phase 3) |
| Naval Kishore 1876-77 original | (unchanged — still no scan located) |
| Marasi Mir Anees 2004 reprint | (unchanged) |
| Rekhta digitized reader | (unchanged — still paywalled) |

## C. Verse results

```text
Previous A:      0
Previous B:      10
New A:            0
New B:            5   (anis-verse-0014 to 0018, a new marsiya: anis-marsiya-007)
Downgraded:       0
Variants:         0 new
```

## D. Marsiya mapping

```text
anis-marsiya-007 ("جب قطع کی مسافتِ شب آفتاب نے"):
  Edition:       Anis: 111 Marsiye (Aaj Ki Kitaben, Karachi, 2021) — CONFIRMED via printed citation
  Volume:        not specified in the citation
  Printed page:  NOT given — this is the one missing link keeping this at B1, not A
  Digital page:  n/a (typeset transcription, not a scan)
  Text verified: YES, against the source page image, band-by-band, with independent re-verification
```

This is the first marsiya in the entire dataset with a confirmed *edition* — genuine, if partial,
progress on the `edition_page_map`, even though the page-level link is still missing.

## E. Source independence

| Claim | Status |
|---|---|
| Anis: 111 Marsiye exists, ed. Naiyer Masud & Timsal Masud | Independent: named in both src-dawn-parekh-2023 (Dawn, journalism) and src-pritchett-masud-pdf (an unrelated academic site) — genuinely two different people/institutions agreeing |
| Publication year 2021 | Primary-adjacent: printed directly on the Pritchett transcription page itself, not a copy of the Dawn article's claim |
| Hurr's role/story | Independent: now confirmed by both Rekhta/Wikisource (Phase 1-2) AND Zaidi's Sahitya Akademi monograph (Phase 4) — two genuinely separate source types (web literary archive vs. published academic monograph) |
| Abbas as standard-bearer (general fact, not the specific-poem question) | Independent academic confirmation (Zaidi) — but see caveat in F below |

## F. New bibliographic leads

- **Tej Kumar Press partially resolved:** Tej Kumar Bhargav (1919–1987) and the Tej Kumar Book
  Depot were successors to the historic Naval Kishore Press in Lucknow (found via one web search,
  not yet independently corroborated against a second source). Plausibly explains Rekhta's "Tej
  Kumar" contributor credit (Phase 2C) as a successor-press connection to the original 1876-77
  print — but this specific causal link is NOT confirmed, only the general historical fact.
- **Ali Jawad Zaidi's *Mir Anis*** (Sahitya Akademi, "Makers of Indian Literature" series) — a full
  54-page academic monograph, image-scanned, page-image-read this phase for ~4 pages only. Strong
  lead for a future pass (biography detail, genre analysis, and a footnote on p.23 specifically
  about a manuscript/lineage question relevant to this dataset's open grandfather-lineage conflict).
- Academic critic excerpts still unread on the same Pritchett page: Shamsur Rahman Faruqi,
  Muhammad Sadiq (a different work than the one already used), Ram Babu Saksena — flagged, not
  investigated this phase.

## G. Rejected evidence

**4th caught fabrication:** a WebSearch summary claimed "Kulliyat-e-Anees consists of 579 Rubais...
with a 150-page preface" — checked directly against the Wikipedia page it appeared alongside in the
same result set; not present there. Rejected; not added to the dataset. (Prior three: the Hazrat
Abbas claim, the Mir Taqi Mir attribution, the unevidenced Saleha-Abid-Husain page numbers.)

**Google Books and HathiTrust are technically blocked** for this module's tools (403/error
responses on direct search) — recorded as a tool-access limitation, not a finding about whether
those repositories hold relevant content. web.archive.org is entirely blocked at the tool level
(explicit refusal, not a fetch failure) — ruled out for future phases.

## Phase 5 readiness

`NO — one genuine primary-adjacent witness (B1, not A1/A2) was found and used for 5 verses, but no
page/folio-level evidence exists for it or any other marsiya in this dataset; a repeatable
page-level verification workflow has not been demonstrated. The single most actionable next
acquisition target: read more of Ali Jawad Zaidi's monograph and the rest of the Pritchett site
(more segmented-text PDFs, unread critic excerpts) via the same page-image method that worked this
phase — it is now a demonstrated, repeatable technique, just not yet applied at scale.`

---

# Phase 5 — Visual Primary-Text Extraction & Page-Level Verification

Goal: apply the Phase 4 page-image-reading method more, specifically to close the one remaining gap
(a printed page number) for anis-marsiya-007. **This phase succeeded — the dataset's first A1-level
(Primary Verified) text now exists.**

## A. Extraction Results

```text
Pages visually inspected:      ~10 (across 2 PDFs — the Phase 4 Masud-edition PDF re-examined for
                                 band 6/7 comparison, and this phase's new 8-page PDF)
Pages containing Anis text:     7 of 8 in the new PDF (1 title page)
Verses extracted/upgraded:      7 (5 upgraded B1→A1, 2 new at B)
A1:                              5  (anis-verse-0014 to 0018)
A2:                              0
B1:                              0  (the 2 remaining Phase-4 verses without a page number are
                                     tracked as plain B — see note below)
B2:                              2  (anis-verse-0019, 0020 — real page number, edition unidentified)
Unresolved:                      0
```

## B. The breakthrough

The new PDF (`urdu_001_026.pdf`, linked from the same franpritchett.com page as Phase 4's source)
turned out to be a scan of an actual printed book: its first page is the title page of **"انیس کے
مرثیے، جلد دوم" (Anis ke Marsiye, Jild Dom / Volume 2)**, compiled by **Saleha Aabid Husain**,
published by **Taraqqi Urdu Bureau, New Delhi, 1980** — the *same edition* already in this dataset
(`col-saleha-abid-husain-1980`), whose Volume 1 (via Archive.org) had unreadable OCR. This is
Volume 2, scanned far more clearly, and hosted by a different site entirely. Page 2 of the PDF
carries a **visible printed page number: ۱۶ (16)** — and shows the exact same marsiya already
partly in this dataset (anis-marsiya-007), bands 1-5.

This is the first time in five research phases that this module could directly, visually confirm
**edition + page + exact wording** for the same text — satisfying this module's own A1 definition
in full. anis-verse-0014 through 0018 were upgraded accordingly.

## C. Edition Table (Phase 5 additions marked *)

| Edition | Editor/Publisher/Year | Page access | Verification status |
|---|---|---|---|
| ***Anis ke Marsiye, Jild Dom* (Volume 2)** | Saleha Aabid Husain / Taraqqi Urdu Bureau, New Delhi / 1980 | **Page 16 visually confirmed** | ***A — first primary-usable edition in this dataset*** |
| *Unidentified large-format volume* | — / — / — | *Pages 310-311 visible, edition not identified* | *B — real page, no edition* |
| Anis: 111 Marsiye (Aaj Ki Kitaben, 2021) | (unchanged from Phase 4) — B1, no page number | | |
| (5 other previously-tested editions) | | | unchanged |

## D. Marsiya Results

```text
anis-marsiya-007 ("جب قطع کی مسافتِ شب آفتاب نے")
  Bands 1-5:  Edition CONFIRMED (Anis ke Marsiye Jild Dom, 1980) — Page CONFIRMED (16) — A1
  Bands 6-7:  Page CONFIRMED (310-311) — Edition NOT identified — B2
  Bands 8-41: Visually confirmed to exist in the page-310+ source, NOT transcribed this phase
  Characters: none named in bands 1-7 (addressed generally to "ghazis") — left empty, correctly
  Themes:     Faith, Courage, Patience, Tragedy
```

## E. Verse Results (new/changed this phase)

| Verse | Before | After | Change |
|---|---|---|---|
| anis-verse-0014 (matla) | B1 | **A1** | Page 16 confirmed; exact match, no variant |
| anis-verse-0015 | B1 | **A1** | Page 16 confirmed; **1 variant found** ("اے دن" vs "یہ دن") — preserved, not resolved |
| anis-verse-0016 | B1 | **A1** | Page 16 confirmed; exact match |
| anis-verse-0017 | B1 | **A1** | Page 16 confirmed; **1 correction**: "یٰسن" (flagged uncertain in Phase 4) → "یہ سن" |
| anis-verse-0018 | B1 | **A1** | Page 16 confirmed; exact match |
| anis-verse-0019 (band 6, new) | — | B2 | Page 310 confirmed, edition unidentified; **1 variant** vs the 2021 edition |
| anis-verse-0020 (band 7, new) | — | B2 | Page 310 confirmed, edition unidentified; corroborated by the 2021 edition (no variant) |

**0 verses downgraded.** The correction to anis-verse-0017 was made only because the original
reading had already been explicitly flagged as uncertain in Phase 4 — this is resolving a
documented uncertainty with better evidence, not silently overwriting a confident prior reading.

## F. Source Chain (for anis-verse-0014, the strongest case)

```text
Frances Pritchett (Columbia University) teaching page
  ↓ links to
urdu_001_026.pdf
  ↓ page 1 =
title page: Anis ke Marsiye, Jild Dom, ed. Saleha Aabid Husain,
            Taraqqi Urdu Bureau, New Delhi, 1980
  ↓ page 2 =
printed page ۱۶ (16) — matla of "جب قطع کی مسافتِ شب آفتاب نے" clearly visible
  ↓
anis-verse-0014 — text_urdu matches exactly, no variant
```

## G. Rejected/Caveated Evidence

- **Did NOT assume pages 16 and 310 belong to the same book.** The jump from page 16 directly to
  page 310 within the same PDF is a real discontinuity, treated as evidence of two separate
  sources rather than silently merged into one continuous citation.
- **Did NOT treat the page-310 witness's real page number as sufficient for A-level** on its own —
  a page number without a confirmed edition does not meet this module's A-level bar, so
  anis-verse-0019/0020 stay at B despite having genuine page numbers.
- **Did NOT re-verify the Masud-edition (2021) reading of band 6 to the same standard** before
  using it in a variant comparison — flagged explicitly as needing a future high-resolution
  re-check, rather than presented as equally solid.

## Phase 6 readiness (extraction at scale)

`PARTIAL YES, narrowly — the page-image method is now proven with a real page-level result (5 A1
verses), and it is repeatable (the same PDF alone visually confirms content through at least band
41). But this phase deliberately stopped at 7 bands (per the "quality over quantity" instruction and
its own effort budget), so "large-scale" extraction has not actually been demonstrated yet — only
"small-scale, page-verified" has. The most actionable next step is direct continuation: transcribe
bands 8 onward from the same already-open page-310+ source (edition still needs identifying), and
apply the same method to the rest of Ali Jawad Zaidi's monograph and franpritchett.com's other
Anis-related PDFs, which remain almost entirely unexamined.`

---

# Phase 6 — Systematic Primary-Text Extraction & Witness Resolution

Goal: (1) identify the page-310+ witness's edition, (2) continue extracting anis-marsiya-007
sequentially from where Phase 5 left off. Priority 1 was attempted thoroughly and **not resolved**;
Priority 2 **succeeded** — 4 more bands added, including the dataset's first explicitly-textual
character naming since the Hurr marsiya.

## Extraction

```text
Pages visually inspected:     5 more (310-314, dedicated header-region crops for each)
New verses extracted:         4  (anis-verse-0021 to 0024 — bands 8-11)
Existing verses upgraded:     0  (none eligible — no new A-worthy witness found this phase)
A1: 5 (unchanged)   A2: 0   B1: 0   B2: 6 (was 2, +4)   C/D/E: 0
```

## Page-310+ Witness — dedicated result

```text
Edition identified:     NO
How identified:         N/A — not identified
Page 310 source:        unidentified large-format volume (src-pritchett-unidentified-p310)
Page 311 source:        same, sequentially confirmed (310→311→312→313→314, no gaps/restarts)
B2 verses:               6 (anis-verse-0019 to 0024)
Can they be upgraded?    Not this phase. See evidence exhausted below.
```

**Evidence exhausted this phase:**
- Directly inspected 5 pages (310-314) — dedicated crops isolating just the header region confirmed
  plain sequential page numbers, no title, no running header, no footer, no colophon.
- Checked the PDF's own file metadata — reveals only a 2008-10-23 scan by a Canon iR5570/iR6570
  office photocopier, not a source citation.
- Ran 2 targeted web searches on distinctive phrases from bands 6 and 26 — no edition citation
  surfaced. (One search did reveal Rekhta now separately indexes this marsiya at its own URL — a
  wording-corroboration lead, not an edition-identification one; not yet followed up.)

This is a genuinely exhausted attempt for readily-available routes, not a skipped one — the next
real lead (per Phase 5's own suggestion) is cross-referencing the page-number range (~300-320+)
against known editions' actual volume sizes, which requires locating a table of contents or page
count for a candidate edition rather than re-inspecting this witness further.

## A self-caught internal-consistency check

While re-examining the page sequence for this batch, a casual (never-recorded) earlier description
had conflated a band number with a page number for one page. Before adding anything to the dataset,
this was checked directly with dedicated high-resolution crops of just the header region for pages
310-314, confirming the true sequence (310→311→312→313→314, no gaps). Nothing incorrect had entered
the dataset — this was caught during this phase's own verification step, not a correction to
previously-published data — but it's recorded here as a reminder that page/band numbers must be
read from isolated, unambiguous crops, not inferred from a single mixed-content view.

## New character attributions (explicit, not inferred)

Band 10 (anis-verse-0023) names قاسمؓ (Qasim) and علی اکبرؓ (Ali Akbar) directly in the verse text —
"قاسم سا گلبدن، علی اکبرؓ سا نوخوش جمال" ("one with a form like Qasim's, one with a countenance
fresh and joyous like Ali Akbar's"). Two new character entries were added on this basis. This is
deliberately the clean contrast case against anis-marsiya-003's Abbas situation: here the names are
*in the couplet itself*, not assumed from a title or an external label — exactly the standard the
Abbas case was meant to enforce.

## Rejected/Caveated Evidence

- No new fabrications were caught this phase (the search results were unhelpful rather than
  actively wrong, unlike Phases 2-4's caught cases).
- Did not extrapolate the page-310+ witness's edition from any circumstantial similarity to the
  known editions (e.g. did not assume it's the Aaj Ki Kitaben edition just because bands 6-7's
  wording partially overlaps with it) — the band-6 variant found in Phase 5 is itself evidence
  against that assumption, not for it.

## Phase 7 readiness

`NO — still only 5 A-level verses (target was 20+). The page-16 witness (the only A-worthy one
found so far) has been fully mined for its visible content (bands 1-5); reaching 20+ A-level verses
requires either identifying the page-310+ witness's edition (which would upgrade 6 existing B2
verses immediately) or locating another A-worthy witness (more volumes of the confirmed 1980
edition, or further pages of Ali Jawad Zaidi's still-mostly-unread monograph). Single highest-value
remaining blocker: the page-310+ witness's edition identity.`

---

# Phase 7 — Edition Cross-Referencing & Continued Extraction

Goal: identify the page-310+ witness's edition without re-inspecting pages already exhausted in
Phase 6; continue extracting anis-marsiya-007; use remaining effort on Zaidi's monograph. Priority 1
did **not** identify the edition but ruled out two real candidates with direct evidence. Priority 2
added 5 more bands. Priority 3 produced an unplanned but significant win: **the Phase 1
grandfather/lineage conflict is now resolved.**

## Executive result

```text
New verses:                5  (anis-verse-0025 to 0029 — bands 12-16, B2)
Verses upgraded:           0
A1: 5 (unchanged)   B2: 11 (was 6, +5)   Total verses: 26
Candidate editions ruled out for the page-310+ witness: 2 (with direct visual evidence)
Candidate editions newly catalogued: 1 (the 1887 Naval Kishore/Hyderabad scan — tested for OCR in
                                          Phase 4 but never formally added to edition_registry)
Biography conflicts resolved: 1  (grandfather/lineage — was open since Phase 1)
```

## Edition table update

| Edition | This phase's finding |
|---|---|
| 1887 Naval Kishore (Hyderabad scan, in.ernet.dli.2015.396320) | Formally catalogued (`ed-naval-kishore-1887-hyderabad`, 399 leaves). Page image fetched via Archive.org's IIIF API and visually compared against the mystery witness — **different layout (dense diagonal manuscript-style grid)** — ruled out. |
| 2004 Naval Kishore reprint (`ed-naval-kishore-2004-reprint`) | Page image fetched the same way — **different layout (small rubai-style grid boxes, labelled Vol. 1 at that point)** — ruled out. |
| Anis ke Marsiye, Jild Dom, 1980 (`ed-saleha-abid-husain-1980-vol2`) | Not re-tested, but noted: its confirmed page-16 layout is *stylistically consistent* with the mystery witness (same column format, same page-number convention). **Explicitly not treated as identification** — recorded as a Phase 8 lead requiring an actual table of contents or page count, per this phase's own instruction against inferring from circumstantial similarity. |

**New technique found and used:** Archive.org's IIIF image API
(`https://iiif.archive.org/iiif/{id}${leaf}/full/pct:N/0/default.jpg`) fetches a single page image
without downloading the full PDF — useful because a direct PDF fetch failed outright for one 205MB
candidate (`maxContentLength exceeded`, confirmed directly). This is now a reusable method for future
phases when a candidate edition's PDF is too large to fetch whole.

## Marsiya mapping update

```text
anis-marsiya-007 ("جب قطع کی مسافتِ شب آفتاب نے")
  Bands 1-5:   A1 — page 16, Anis ke Marsiye Jild Dom (1980) — unchanged
  Bands 6-16:  B2 — pages 310-311, edition still unidentified (was bands 6-11 after Phase 6;
               +5 bands, +1 page, this phase)
  Bands 17-41: visually confirmed to exist, not yet transcribed
```

## Source chain — unchanged for A1 verses; for the new B2 verses (bands 12-16)

```text
Pritchett teaching page → urdu_001_026.pdf → page 311 → bands 12-16 text
  ↓
edition: UNKNOWN (2 candidates ruled out this phase; 1 lead not yet confirmed)
```

## The lineage resolution (Priority 3)

Reading pages 11-13 of Ali Jawad Zaidi's monograph (properly footnoted, Sahitya Akademi) resolved
the Phase 1 conflict directly:

- **Mir Ghulam Husain "Zahik"** (the source of Phase 1's "Zahak" — a transliteration variant, not
  a different person) was **Mir Hasan's father** — i.e. **Anis's great-grandfather**.
- Zaidi's text states explicitly: "Anis is deeply indebted to his **grandfather** for the rich
  literary traditions he inherited from him" — confirming **Mir Hasan as Anis's grandfather**.
- Chain: Zahik → Mir Hasan (b. c.1727-29, d. 24 Oct 1786, author of *Sehr-ul-Bayan*) → Mir
  Mustahsan "Khaliq" (Anis's father, already established) → Mir Anis.

The earlier single-source claim that seemed to reverse this (grandfather=Zahak, great-grandfather=
Mir Hasan) is now understood as most likely a garbled compression of the correct chain, not a
genuine competing scholarly position — no source was ever found independently asserting the
reversed order with its own citation. `biography.grandfather_lineage` is now marked `resolved: true`,
with the original uncertainty preserved in the note rather than erased. New sourced detail was also
captured: Mir Hasan's precise death date, and a properly-attributed scholarly disagreement over his
birth year (Ashhari vs. Waheed Qureshi, with Zaidi's own reasoning for preferring one) — exactly the
plan's own model for handling conflicting dates, rather than this module picking one itself.

## Rejected/Caveated Evidence

- Did not infer the mystery witness's edition from the stylistic-consistency observation, despite
  it being suggestive — explicitly logged as a lead, not a conclusion, per this phase's instruction.
- Did not treat the two ruled-out candidates' page-count plausibility (both are large enough to
  contain a page 310) as outweighing their directly-observed different layouts — visual evidence
  took precedence over circumstantial page-count reasoning.
- No new AI-generated-claim fabrications were rejected this phase — no free-text summary made a
  specific, uncheckable claim this pass (the IIIF image fetches returned real images, not summaries).

## Phase 8 readiness

`NO — still 5 A-level verses (target 20+). The page-310+ witness's edition remains unidentified,`
`though the candidate search space has narrowed (2 more ruled out with direct evidence) and a`
`specific, checkable lead now exists (confirm/rule out the 1980 edition via its actual table of`
`contents or page count, rather than more visual comparisons). The lineage resolution is a genuine`
`win but doesn't move the verse-verification counts. Single highest-value next step: obtain a table`
`of contents or total page count for Anis ke Marsiye, Jild Dom (1980) — the one candidate not yet`
`ruled out or confirmed.`

---

# Phase 8 — Edition Confirmation via Table of Contents & Continued Extraction

Goal: confirm or rule out *Anis ke Marsiye, Jild Dom* (1980) as the page-310+ witness's edition.
**Priority 1 succeeded decisively** — not with a table of contents, but with something stronger: a
second, complete scan of the same edition, matched page-for-page against already-transcribed text.

## Executive result

```text
Pages independently visually confirmed:  3 (309, 310, 312 — via Archive.org IIIF page images)
Verses corrected (page 16 -> 309):        5  (anis-verse-0014 to 0018)
Verses upgraded (B2 -> A1):               11  (anis-verse-0019 to 0029)
Verses downgraded:                        0
New verses:                               0 (Priority 2 deliberately deferred — see below)
A-level verses:  16 (was 5)     B-level verses: 10 (was 21)     Total: 26 (unchanged)
```

## How Priority 1 was resolved

Rather than another round of circumstantial testing, this phase searched Archive.org directly for
the *exact* edition already in this dataset — "Anis ke Marsiye, Jild Dom, Saleha Aabid Husain,
Taraqqi Urdu Bureau, New Delhi, 1980" — and found a **second, complete 577-page scan**
(`anees-k-marsye`, uploaded by "Maab Library"), distinct from the partial Volume 1 scan already
catalogued. Using the IIIF single-page technique from Phase 7, three pages were fetched and
directly, visually compared against already-transcribed text:

| This dataset's text | This item's page | Result |
|---|---|---|
| anis-verse-0014–0018 (bands 1-5, matla) | 309 | **Exact match** |
| anis-verse-0019–0024 (bands 6-11) | 310 | **Exact match** |
| anis-verse-0025–0029 (bands 12-16, inferred page) | 311 | Not independently re-fetched this session (transient 500 error); inferred from bracketing matches |
| bands 18-23 (not yet transcribed) | 312 | **Exact match** (confirms the sequence continues correctly; not used to add new verses this phase) |

This is a genuine, word-for-word page-for-page confirmation — the strongest evidentiary basis found
in this entire research project.

## A real complication, documented not hidden

This confirmed edition's **own page 16 does not match** the content this dataset had attributed to
"page 16" since Phase 5 (via a different, Pritchett-hosted excerpt PDF of the same nominal edition).
The Phase 5 "16" almost certainly refers to a separately-paginated offprint/excerpt of just this one
marsiya, not the complete 577-page volume's own pagination. **Correction made:** anis-verse-0014
through 0018's `page` field changed from 16 to 309 — the number a researcher could actually look up
in the complete, publicly accessible edition. The original claim and its source
(`src-pritchett-saleha-vol2-p16`) remain in the record, not erased, per this module's
correction-discipline.

## Verse upgrades (B2 → A1)

anis-verse-0019 through anis-verse-0029 (bands 6-16) — the edition they were missing is now
confirmed. Two new character entries from Phase 6 (Qasim, Ali Akbar) were upgraded from B to A
`source_status` accordingly, since anis-verse-0023 (where they're explicitly named) is now A1.

## Priority 2 — deliberately deferred

Bands 18-23 (page 312) were viewed and visually confirmed to belong to the same, now-identified
edition — but **not transcribed into new verses this phase**. The text on this specific page is
denser/more visually compressed than earlier bands, and rather than risk a lower-confidence
transcription under this session's remaining time budget, extraction was deliberately deferred to a
future phase with a fresh, careful pass. This is a discipline choice: the 16 verses corrected/
upgraded this phase already represent a large, unusually strong result, and diluting that with a
rushed addition would work against the plan's own "accuracy > quantity" principle.

## Priority 3 — not reached

Priority 1's larger-than-expected scope (finding and fully confirming an entire edition, then
correcting 5 verses and upgrading 11 more) consumed the effort that would otherwise have gone to
further Ali Jawad Zaidi monograph reading. Remains open for Phase 9.

## Source chain (representative example, anis-verse-0019)

```text
Archive.org search for "Anis ke Marsiye Jild Dom Saleha Aabid Husain 1980"
  ↓
anees-k-marsye (577-page complete scan, Archive.org, uploaded by Maab Library)
  ↓ IIIF page-image fetch, leaf 310
printed page 310 — band 6 visually confirmed, exact text match
  ↓
anis-verse-0019 — A1
```

## Rejected/Caveated Evidence

- Did not treat page 311's upgrade as identically strong to pages 309/310/312 — explicitly flagged
  in the affected verses' notes as resting on bracketing evidence plus a prior independent
  page-311 confirmation (Phase 6), not a fresh direct re-check this session.
- Did not transcribe bands 18-23 despite having a matching page image in hand — a deliberate
  quality-over-speed choice, not a capability limit.
- Did not assume this item's page 16 content was simply "wrong" or ignorable — recorded the
  mismatch as a real bibliographic fact about how these two scans relate (or don't).

## Phase 9 readiness

`PARTIAL — the primary blocker from Phases 5-7 (edition identification) is now resolved for bands`
`1-16, and the dataset has 16 A-level verses (target from Phase 5 was 20+, now within close reach).`
`A repeatable, proven page-verification pipeline exists (IIIF fetch -> visual read -> cross-check`
`against a confirmed edition). What's NOT yet demonstrated: extracting NEW bands (17+) at the same`
`confidence level — Priority 2 was deliberately deferred, not completed. Single highest-value next`
`step: transcribe bands 18-23 (page 312, already fetched and edition-confirmed, just not yet`
`transcribed) with the same care applied to bands 1-16, which should be a fast, low-risk way to`
`reach or exceed the 20-A-level-verse target.`

---

# Phase 9 — Band 18-23 Extraction & Page-16 Discrepancy Investigation

Goal: (1) transcribe bands 18-23 to pass the 20-A-level target, (2) resolve the page-311 gap from a
Phase 8 transient fetch failure, (3) directly re-investigate the page-16 discrepancy rather than
defer it further. **All three priorities were acted on** — 1 and 2 succeeded cleanly; 3 was
genuinely re-investigated and found to be a deeper puzzle than Phase 8 assumed, and is now
documented as explicitly unresolved rather than quietly reinterpreted as settled.

## Executive result

```text
New verses:                  3  (anis-verse-0030 to 0032 — bands 18-20, page 312, A1)
Verses strengthened:         5  (anis-verse-0025 to 0029 — page 311 gap closed, "bracketed
                                  confirmation" caveat removed, now directly re-confirmed)
Verses downgraded:           0
A-level: 19 (was 16)   B-level: 10 (unchanged)   Total: 29 (was 26)
```

## Priority 1 — bands 18-20 transcribed, bands 21-23 deliberately NOT rushed

Page 312 was freshly re-fetched (not reused from Phase 8) via Archive.org's IIIF API, cropped
locally with Pillow into per-band regions for careful reading, and bands 18, 19, 20 were transcribed
and added as A1 verses (edition already confirmed in Phase 8; page 312 directly visible and
matching). **Bands 21-23 were attempted but not added**: the text on this specific stretch of page
312 is visibly denser, with editorial footnote markers (suggesting the underlying edition carries
scholarly annotations this module has no access to), and initial readings showed lower confidence
than bands 18-20. Rather than transcribe at reduced confidence to hit a target count, extraction
stopped at band 20 — consistent with "confidence per verse, not band count."

## Priority 2 — page 311 gap closed

Re-fetched leaf 311 via IIIF; it succeeded this time (Phase 8's failure was transient, as
suspected). Direct visual comparison confirms an exact match against anis-verse-0025 through 0029
(bands 12-16), with the printed page number "311" clearly visible. These 5 verses' verification
notes are updated to remove the "bracketed confirmation" caveat — they are now as directly confirmed
as pages 309, 310, and 312.

## Priority 3 — page-16 discrepancy: investigated, not resolved, and deepened

Fetched the confirmed edition's own leaf 1 (title page) via IIIF and directly compared it — pixel
by pixel, not just by title text — against the Pritchett-hosted excerpt's title page (on file since
Phase 5). **Finding: the two title pages are visually near-identical** (same arch/dome graphic
design, same publisher seal, same text layout). This *deepens* the puzzle rather than resolving it:
Phase 8's working theory (that the Pritchett excerpt's "16" belonged to a separately-typeset
offprint) is now less well-supported, since a genuinely separate offprint would be less likely to
reuse an apparently identical title page design. No alternative explanation was confirmed either.

**Verdict: left explicitly unresolved**, per this module's rule for conflicts the evidence doesn't
clearly settle — not resolved by assumption in either direction, and Phase 8's tentative explanation
is now flagged as weakened, not restated as fact. Both `source_registry` entries and all 5 affected
A1 verses (anis-verse-0014–0018) now carry a note pointing to this open question, so it doesn't sit
silently contradicted in the record. **This does not affect those verses' A1 status** — their page-309
attribution is an independent, direct match against the confirmed edition, unrelated to whatever
explains the other source's internal numbering.

## Edition table update

No new editions this phase — Priority 1/2 extended confirmed use of `ed-anees-k-marsye-577`;
Priority 3 added a documented open question to `src-pritchett-saleha-vol2-p16` and
`src-archive-anees-k-marsye` rather than a new candidate.

## Marsiya mapping update

```text
anis-marsiya-007: bands 1-20 now A1 (pages 309-312, all 4 pages directly, independently confirmed)
Bands 21-41: visually confirmed to exist (denser text, footnote markers); not transcribed
```

## Source chain (band 18, representative)

```text
Fresh IIIF fetch, leaf 312, anees-k-marsye
  ↓ local Pillow crop for band-level reading
  ↓ independent re-verification crop
band 18 text — exact, no uncertain words
  ↓
anis-verse-0030 — A1
```

## Rejected/Caveated Evidence

- Did not transcribe bands 21-23 despite having page 312 open and edition-confirmed — a deliberate
  confidence-over-completeness choice, documented as such rather than silently skipped.
- Did not let the page-16 title-page similarity be read as resolving the discrepancy in favor of
  "same book" — visual similarity of a cover is not the same as matching interior content, and the
  interior content (page 16 itself) still doesn't match.
- Did not let a second fetch failure (had it occurred) on page 311 become treated as confirmation by
  omission — the retry genuinely succeeded and was checked, not assumed.

## Phase 10 readiness

`YES for continued extraction — 19 A-level verses (target was 20+, effectively met/one verse short),`
`a page-verification pipeline proven across 4 consecutive pages (309-312), and a clear, low-risk next`
`step (bands 21-41 with fresh, careful attention, or extending past page 312). PARTIAL for the`
`broader module: the page-16 discrepancy remains a genuine open question, not blocking further`
`extraction but worth flagging before any future pass treats "page 16" claims elsewhere in this`
`dataset as settled. Single highest-value next step: attempt bands 21-23 again with more targeted`
`high-resolution crops per band (the density issue may be a resolution problem, not necessarily an`
`unreadable-source problem), or move on to bands 24+ where legibility may improve.`

---

# Phase 10 — Karbala Core Topics, Data Refinement & UI Simplification

**Scope change, recorded explicitly:** this phase intentionally narrowed away from the original
31-section plan. Primary-text page hunting (bands 21+, the page-16 discrepancy) is **paused, not
abandoned**. Non-Karbala poetry, Anis-vs-Dabeer comparison, and marsiya-structure mapping remain out
of scope until explicitly resumed. This phase instead refined what already exists: syncing
themes/characters to the real dataset, consolidating a scattered research thread, and adding real
UI filtering now that the Poetry Library holds 29 verses.

## Executive result

```text
Themes populated:          8 of 10 now have real verse coverage (was 3 of 10, and those 3 were
                            stale — pointing at seed verses from Phase 1, not the 27 added since)
Theme tags added to verses: 4  (anis-verse-0011/0012 → Courage; 0021/0026 → Spirituality) —
                            conservative, grounded only in already-transcribed text
Characters refined:        5 of 5 (attributes/recurring_imagery/emotional_register filled in
                            where evidenced; Hazrat Abbas's left deliberately empty)
Research notes:            +2 (1 consolidated page-16 status note, 1 phase-scope note);
                            0 deleted — historical trail preserved
Verses/marsiyas/editions:  unchanged (0 new extraction this phase, by design)
UI: Poetry Library gained character/theme/verification-level filtering; no tabs removed
    (none of the out-of-scope sections — non-Karbala poetry, Anis-vs-Dabeer, marsiya-structure —
    had ever been built into the UI to begin with)
```

## Priority 1 — Karbala characters & themes

**Themes**: `themes[].representative_verses` was badly stale — it only reflected the 2 verses
seeded in Phase 1, never updated as 27 more verses were added across Phases 4-9. Rebuilt from what
verses are *actually* tagged:

| Theme | Verses | Status |
|---|---|---|
| Faith | 8 | Best-covered — dawn prayer, ablution with dust, praise amid hardship |
| Tragedy | 7 | Hussain's isolation, the journey from Medina, the garden-destroyed metaphor |
| Family | 5 | Absent family named explicitly; Qasim/Ali Akbar together; garden metaphor |
| Courage | 5 (+2 this phase) | Hurr's bravery; the "alam"/standard passage (bands 10-12) |
| Separation | 3 | "No son, no nephew, no brother"; departure from Medina |
| Spirituality | 2 (new this phase) | Houris testifying to sainthood; contemplating God's power |
| Sacrifice | 1 | Direct: "this morning is blessed, whose evening leads to Paradise" |
| Patience | 1 | "Three days of hunger, yet content with life" |
| Loyalty | 0 | **Honestly marked unsupported** — no verse in this dataset evidences it yet |
| Humanity | 0 | **Honestly marked unsupported** — same |

The 4 new tags (bands 11-12 → Courage, continuing band 10's same passage; bands 21/26 →
Spirituality) were added only because the *already-transcribed* text directly supports them — no
new research, no verses re-read for this purpose.

**Characters**: filled in `attributes`/`recurring_imagery`/`emotional_register` for all 5 existing
characters (Imam Hussain, Hurr, Hazrat Abbas, Qasim, Ali Akbar), grounded strictly in verse text and
sources already in `source_registry`. **Hazrat Abbas's fields were deliberately left empty** — this
dataset still has no verse confirmed to be about him specifically (the popular "جب رن میں..."
association remains unconfirmed per its own long-standing note), and filling these fields would mean
drawing on general Karbala knowledge not evidenced by this dataset's own text, which this phase's
refinement-only scope explicitly excludes. Qasim and Ali Akbar's entries note explicitly that only
their physical-description couplet is evidenced here — their well-known martyrdom narratives are
*not* asserted, since they aren't in this dataset's transcribed text.

No new characters were added (Zainab, Sakina, Ali Asghar, Habib ibn Mazahir — none appear by name in
any verse currently transcribed).

## Priority 2 — Refinement, not re-extraction

- **Consolidated the page-16 discrepancy** into one clearly-labeled "PHASE 10 CONSOLIDATED STATUS
  NOTE" at the end of `research_notes`, giving the current single-source-of-truth summary. The
  earlier phase-by-phase notes were **preserved, not deleted** — they're a legitimate audit trail of
  how the finding developed, and deleting them would look like erasing evidence rather than tidying
  prose.
- **Cross-reference audit**: verified every `characters[].representative_verses` and
  `themes[].representative_verses` entry actually appears in that verse's own `character`/`theme`
  array (and vice versa) — zero mismatches found after Priority 1's additions.
- **Did not** re-open primary-text page hunting, the page-16 resolution, or push past band 20 —
  explicitly out of scope this phase.

## Priority 3 — UI simplification

Reviewed `/poets/mir-anis` and its dedicated components (`usePoetModules.ts`,
`literary/VerificationBadge.vue`). Found that the UI was already minimal by design from earlier
phases: no tab or filter had ever been built for non-Karbala poetry, Anis-vs-Dabeer comparison, or
marsiya-structure — and `critical_reception` (4 entries, 2 of them real) was never rendered anywhere
at all. So there was nothing to hide or remove.

What the module *did* need: the Poetry Library had grown to 29 verses as a single flat list with no
way to navigate it. Added real, data-backed filtering — verification level, character, theme — using
the same `v-chip role="button" aria-pressed` pattern already used elsewhere in this app (e.g. the
Persons module), not a new visual style. Filter options are generated from what actually occurs on
some verse (`[...new Set(...)]`), so a filter chip only ever appears when it has real data behind
it — no "genre" filter was added, since every verse in this dataset is currently genre "Marsiya"
(zero discriminating value).

## Files Changed

`app/assets/data/poets/mir-anis.json` — themes/characters refined, 2 research_notes added (0
deleted), module status note updated. `app/pages/poets/[slug].vue` — Poetry Library tab gained
filter chips + filtered-verse computed properties; no other tabs touched. No other files.

## Validation

JSON valid; zero duplicate IDs; zero broken references; a dedicated cross-reference audit (verse ↔
character ↔ theme consistency) found zero mismatches; `eslint` clean on `[slug].vue` (zero
warnings); other pre-existing warnings elsewhere unchanged; dev server returned 200 on `/`,
`/poets`, `/poets/mir-anis`, `/settings`; default (Overview) tab content confirmed present in SSR
output; sidebar toggle still hidden by default.

## Done for now vs. explicitly paused

**Done for now:** Karbala character/theme refinement (grounded in existing 29 verses), page-16
discrepancy documentation consolidated into one current-status note, Poetry Library filtering.

**Explicitly paused, not abandoned:** primary-text extraction past band 20 (bands 21-41 visually
confirmed to exist); resolving the page-16 discrepancy; non-Karbala poetry (ghazal/rubai/salam
corpus); Anis-vs-Dabeer comparison; marsiya structure mapping (chehra/sarapa/rukhsat/etc.); reading
the rest of Ali Jawad Zaidi's monograph and franpritchett.com's other PDFs; further edition/volume
discovery. Resume any of these by picking up the relevant "Next steps" list from Phase 9's section
above — nothing about this phase's scope narrowing invalidates that work, it's just not this
phase's job.

---

# Phase 11 — Small Polish Pass

Light cleanup only — no new research, no new extraction, no scope changes. Two things prompted
this pass: verifying that Phase 10's data additions actually show up in the UI (they hadn't all
been wired in), and tightening the two Phase 10 notes future passes will read first.

**What was fixed:** Phase 10 filled in `characters[].attributes` / `recurring_imagery` /
`emotional_register` and rebuilt `themes[].explanation`, but `[slug].vue`'s Karbala & Characters
and Themes tabs never rendered any of those fields — only `poetic_role`/`note` for characters and
`theme`/`source_status` for themes. All of that Phase 10 work was invisible in the actual page.
Added `v-if`-guarded rows for the three character fields and the theme `explanation`, so a field
only renders when it has real content. Hazrat Abbas's three fields are empty strings/arrays, so his
card simply skips those rows and falls back to `poetic_role` + `note`, exactly as before — no empty
headers, no broken layout. Verified this by temporarily switching the page's default active tab
(`karbala`, then `themes`, then `poetry`) and re-fetching the SSR HTML each time — the same
technique used in earlier phases to inspect Vuetify `v-window-item` content, since only the active
tab renders server-side. Confirmed: all 5 character cards render cleanly (4 with real
attributes/imagery/register text, Abbas's card cleanly omitting those three rows); all 10 theme
cards render their `explanation` text, including Loyalty and Humanity, whose explanation is itself
the honest "not yet supported" sentence — so even the zero-verse themes read as intentional, not
broken. The Poetry Library's filter chips (level/character/theme) and all 29 verse cards render as
expected. The active tab was reverted to `overview` afterward — confirmed via a final SSR fetch.

No actual browser/screenshot tool is available in this environment; this SSR-HTML-per-tab technique
plus direct data/template inspection is the closest verification available, and is more rigorous
than a plain dev-server 200 check.

**Proofreading:** tightened the two Phase 10 research notes for clarity — the page-16 consolidated
status note and the Phase 10 scope-change note. Both were dense single-paragraph blocks (no
line-break rendering in the notes UI, so clarity has to come from sentence structure). Cleaned up
run-on clauses and mid-sentence emphasis (e.g. "not deleted, but THIS is..." → two plain sentences)
and gave the scope note's four numbered items parallel structure. **No facts, claims, or citations
were changed** — same content, easier to scan. Verified via `research_notes.length` staying at 75
before and after (only the last two entries' text changed).

**Files changed:** `app/pages/poets/[slug].vue` (character/theme field rendering added; no tabs
added/removed, no filter logic changed), `app/assets/data/poets/mir-anis.json` (two research_notes
entries reworded only — no additions, deletions, or data changes elsewhere), this document.

**Validation:** ESLint clean on `[slug].vue`; JSON valid, `research_notes` count unchanged (75);
dev server 200 on `/poets/mir-anis` under all four tested default-tab states; sidebar toggle/routing
untouched.

**Confirmation nothing else changed:** no verses, marsiyas, editions, or sources were added, edited,
or removed this phase; no other pages/composables touched; nothing committed to git
(`git status --short` shows the same three files as Phase 10: this document, the dataset, and
`[slug].vue`).

---

## Next steps (Phase 11 candidates — resume point, carried over unchanged from Phase 9)

Phase 10 deliberately did not act on this list (see its section above — scope was narrowed to
refinement only). It remains the correct resume point whenever primary-text/extraction work picks
back up:

1. **Retry bands 21-23** with more targeted, per-band high-resolution crops (the density/legibility
   issue this phase may be a resolution problem, not an unreadable-source problem) — or move on to
   bands 24+ where legibility may simply improve past this particular stretch.
2. **Continue toward band 41** once 21-23 (or a skip past them) is resolved — the marsiya's full
   extent is already visually confirmed to exist in the same confirmed edition.
3. **The page-16 discrepancy is now a standalone open question worth its own investigation**, not
   just a footnote: the two title pages being near-identical while page 16's content differs is
   genuinely strange and might reward checking a few more early pages (2-15) of both sources for
   any divergence point, rather than jumping straight to page 16. (Phase 10 added a consolidated
   status note for this but did not re-investigate it — see `research_notes`.)
4. **Read more of Ali Jawad Zaidi's monograph** (~13 of 54 pages read) — the remaining ~40 pages
   likely hold further named-critic quotations and bibliographic detail.
5. **Read more of the franpritchett.com site**: other segmented-text PDFs, the "variant readings"
   PDF (directly relevant to Section 22), and the unread critic excerpts (Faruqi, Sadiq's other
   work, Saksena) — still untouched since Phase 4.
6. Only then attempt Sections 14–27 (famous-verse ranking, marsiya structure mapping, Anis vs.
   Dabeer, full critical reception) — the plan's Section 1 ("Accuracy > Quantity") still governs
   pacing, but this dataset now has a proven, working page-verification pipeline to scale up with.
7. **Loyalty and Humanity themes still have zero supporting verses** in this dataset (see Phase 10)
   — worth watching for as future extraction continues; do not force-tag existing verses to fill
   this gap.
