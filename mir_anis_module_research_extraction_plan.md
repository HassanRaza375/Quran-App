# Mir Anis Module — Research, Extraction & Content Specification

## Purpose

Create a comprehensive, source-verified digital literary module about **Mir Babar Ali Anis (میر ببر علی انیس)** for an Urdu/Islamic literary study application.

The module should cover:

- Mir Anis's biography and historical context
- His literary career and contribution to Urdu literature
- His work in marsiya, especially Karbala
- Major marsiyas and other reliably documented works
- Diwan/Kulliyat/collection and edition information
- Verified poetry (شعر), including Karbala and non-Karbala poetry
- Character-based and theme-based poetry
- Context and explanation for individual verses
- Literary style and critical reception
- Source and edition information for every important quotation

The goal is to create **reusable structured content**, not merely a prose biography.

---

# 1. Critical Research Principle

## Accuracy > Quantity

Do not build the module by collecting large numbers of Internet quotations first.

Use a **two-pass research process**:

### Pass 1 — Source Map

First establish:

1. Bibliography
2. Major collections
3. Kulliyat/Diwan information
4. Major marsiyas
5. Reliable editions
6. Primary and academic sources
7. Known textual/attribution issues

Then collect a small set of highly verified representative verses.

### Pass 2 — Poetry Corpus

Only after the source map is established, expand the poetry corpus.

It is better to have:

> 200 verified verses

than:

> 2,000 verses with uncertain attribution.

---

# 2. Source Policy

Prioritize sources in this order:

1. Original or critical editions of Mir Anis's works
2. Digitized scans of published books
3. Established Urdu literary institutions
4. Academic publications
5. University publications
6. Scholarly reference works
7. Reputable Urdu literary archives
8. Digitized historical manuscripts

Do NOT use random quote websites, social-media posts, unattributed poetry pages, or SEO websites as primary evidence for verses.

For every important verse, attempt to record:

- Work/collection
- Marsiya/poem title
- Volume
- Edition
- Editor
- Publisher
- Publication year
- Page number
- Digital source URL, where available
- Whether the wording was checked against an original scan

Never invent missing bibliographic information.

---

# 3. Source Verification Levels

Every poetic quotation must have a verification status.

Use exactly these levels:

### A — Primary verified
Confirmed against an original/critical edition or authoritative scan.

### B — Strong secondary
Confirmed by reputable academic/literary sources but the primary edition was not checked.

### C — Attribution
Commonly attributed to Mir Anis but primary attribution has not been confirmed.

### D — Disputed
Reliable sources disagree about attribution or wording.

### E — Unverified
Found online but reliable attribution/source could not be established.

The application should preferably label only **A and B** as verified poetry.

Do not silently upgrade C/D/E content.

---

# 4. Anti-Hallucination Rules

These rules are mandatory.

1. Never invent a Mir Anis sher.
2. Never complete a half-remembered sher.
3. Never attribute a viral Urdu quote to Mir Anis without evidence.
4. Never treat a quote website as proof of authorship.
5. Never merge two different verses.
6. Never alter original Urdu wording while presenting it as a quotation.
7. Never claim a poem title without evidence.
8. Never claim a collection contains a poem without checking the edition/source.
9. Never invent page numbers.
10. Never invent publication dates.
11. Never silently resolve conflicting biographical dates.
12. Clearly mark uncertain information.
13. Separate source-derived facts from interpretation.
14. Preserve Urdu text as it appears in the cited edition.
15. If a verse cannot be verified, exclude it from the verified-poetry dataset.
16. Do not reconstruct damaged or incomplete verses from memory.
17. Do not combine variants from different editions into a new "canonical" text without explicitly documenting the editorial decision.

---

# 5. Module Information Architecture

Build the content around these sections:

```text
Mir Anis
│
├── Overview
│   ├── Full name
│   ├── Takhallus
│   ├── Birth
│   ├── Death
│   ├── Family
│   ├── Literary identity
│   └── Historical significance
│
├── Life & Biography
│   ├── Early life
│   ├── Family background
│   ├── Mir Khaliq
│   ├── Education
│   ├── Literary development
│   ├── Lucknow/Awadh
│   ├── Contemporary poets
│   └── Final years
│
├── Historical & Literary Context
│
├── Literary Work
│   ├── Marsiya
│   ├── Ghazal
│   ├── Salam
│   ├── Rubai
│   ├── Qasida
│   ├── Mathnavi
│   ├── Qit'a
│   └── Other documented forms
│
├── Karbala & Marsiya
│   ├── Karbala in Anis's poetry
│   ├── Major marsiyas
│   ├── Themes
│   ├── Characters
│   └── Representative verses
│
├── Works & Collections
│   ├── Kulliyat
│   ├── Diwan
│   ├── Marsiya collections
│   ├── Individual works
│   └── Editions
│
├── Poetry Library
│   ├── All verified verses
│   ├── Karbala verses
│   ├── Non-Karbala verses
│   ├── Character filters
│   └── Theme filters
│
├── Context of the Sher
│
├── Language & Style
│
├── Anis & Dabeer
│
├── Critical Reception
│
└── Study
    ├── Search
    ├── Bookmark
    ├── Notes
    ├── Collections
    └── Related verses
```

---

# 6. Biography Research

Extract a complete biography.

Capture:

- Full name
- Common name
- Takhallus
- Father
- Family background
- Date of birth
- Place of birth
- Date of death
- Place of death
- Education
- Teachers
- Literary influences
- Family members who were poets
- Relationship with Mir Khaliq
- Connection with Lucknow
- Literary career
- Patrons
- Contemporary poets
- Mirza Dabeer
- Major life events
- Final years
- Burial place, if reliably documented

## Conflicting dates

If sources disagree:

- Do not arbitrarily select one.
- Give the commonly accepted date.
- Record alternative dates.
- Cite sources supporting each.
- State scholarly consensus if available.

---

# 7. Historical & Literary Context

Explain the environment in which Mir Anis worked.

Research:

- Urdu literary culture of Awadh/Lucknow
- Development of Urdu marsiya
- Development of marsiya before Anis
- Shia religious and cultural environment of Lucknow
- Muharram and majlis culture
- Oral/performance tradition of marsiya
- Literary patronage
- Relationship between poetry and public recitation
- Anis's position in the development of Urdu marsiya
- Anis and Dabeer

Clearly distinguish:

- historical fact
- literary criticism
- later interpretation

---

# 8. Literary Genres

Identify every genre in which Mir Anis is reliably documented as writing.

Potential categories:

- مرثیہ
- غزل
- سلام
- رباعی
- قصیدہ
- مثنوی
- قطعات
- نوحہ
- Other forms, if reliably documented

For each genre provide:

- Genre name
- Urdu name
- Description
- Approximate quantity, if known
- Major surviving works
- Representative examples
- Sources

Classify each genre as:

- well-attested
- attributed
- disputed

Do not assume every genre commonly mentioned online has a substantial surviving corpus.

---

# 9. Works Catalog

Create a structured catalog.

Schema:

```json
{
  "work_id": "",
  "title": "",
  "title_urdu": "",
  "genre": "",
  "date_or_period": "",
  "opening_line": "",
  "closing_line_if_known": "",
  "subject": "",
  "characters": [],
  "karbala_related": false,
  "collection": "",
  "volume": "",
  "edition": "",
  "editor": "",
  "publisher": "",
  "publication_year": "",
  "source": "",
  "source_url": "",
  "source_status": "",
  "notes": ""
}
```

Do not invent titles.

---

# 10. Diwan / Kulliyat / Collections

This requires special bibliographic research.

Research and distinguish:

- دیوانِ انیس
- کلیاتِ انیس
- مرثیہ collections
- individual marsiya compilations
- later editorial compilations
- manuscripts

Determine:

1. Which collections are historically documented?
2. Which are later editorial compilations?
3. Whether a complete Kulliyat exists
4. Major published editions
5. Editors
6. Publishers
7. Publication years
8. Number of volumes
9. Approximate number of marsiyas
10. Whether editions differ
11. Whether poems appear under different titles/opening lines
12. Which editions are most authoritative

Do NOT assume "Diwan-e-Anis" and "Kulliyat-e-Anis" are interchangeable.

Explain bibliographic differences.

---

# 11. Mir Anis and Karbala

Make this one of the largest sections.

Research his poetic treatment of:

- امام حسینؑ
- حضرت عباسؑ
- حضرت علی اکبرؑ
- حضرت قاسمؑ
- حضرت زینبؑ
- حضرت سکینہؑ
- حضرت علی اصغرؑ
- مسلم بن عقیلؑ
- حُر بن یزید
- حبیب بن مظاہر
- Other important figures appearing in his marsiyas

For each character document:

- role
- characterization
- virtues/attributes
- recurring imagery
- emotional treatment
- major relevant marsiyas
- representative verified verses
- sources

---

# 12. Karbala Themes

Classify verses into themes.

Suggested themes:

## Faith
- ایمان
- توکل
- یقین

## Sacrifice
- قربانی
- ایثار
- شہادت

## Loyalty
- وفا
- اطاعت
- عہد

## Courage
- شجاعت
- بہادری
- رجز

## Patience
- صبر
- استقامت

## Separation
- فراق
- رخصتی
- وداع

## Family
- اہل بیت
- بھائی
- باپ بیٹا
- خاندان

## Tragedy
- مصیبت
- شہادت
- غم

## Spirituality
- عشق
- عبادت
- بندگی

## Humanity
- اخلاق
- رحم
- عدل

For each theme provide:

- explanation
- representative verses
- relevant poem
- historical/literary context
- source

---

# 13. Verse Extraction

This is the core dataset.

Use this schema:

```json
{
  "verse_id": "anis-verse-0001",
  "poet": "Mir Anis",
  "text_urdu": "",
  "text_roman": "",
  "translation_english": "",
  "translation_urdu_simple": "",

  "genre": "",
  "theme": [],
  "subtheme": [],

  "karbala_related": false,
  "character": [],

  "poem_title": "",
  "poem_opening": "",

  "collection": "",
  "volume": "",
  "edition": "",
  "editor": "",
  "publisher": "",
  "publication_year": "",
  "page": "",

  "source_url": "",
  "source_status": "A",
  "verification_notes": "",

  "context": "",
  "textual_variants": []
}
```

## Translation rules

Do not produce Roman Urdu or translations until the Urdu original has been verified.

Clearly label translations as translations, not original poetry.

Do not back-translate or reconstruct the Urdu from a translation.

---

# 14. Famous Karbala Verses

Create a separate curated collection.

Categories:

1. General Karbala
2. Imam Hussainؑ
3. Hazrat Abbasؑ
4. Ali Akbarؑ
5. Qasimؑ
6. Zainabؑ
7. Sakinaؑ
8. Ali Asgharؑ
9. Shahadat
10. Wafa
11. Rukhsat
12. Battlefield
13. Sabr
14. Ahl al-Bayt
15. Ashura

Rank each verse:

- canonical
- widely cited
- commonly attributed
- uncertain

"Famous" must not mean "frequently reposted online."

---

# 15. Context of the Sher

Every major verse should have contextual metadata.

Use:

```text
Marsiya:
Poem opening:
Situation:
Character:
Theme:
What is happening:
Why the verse matters:
Simple Urdu explanation:
English translation:
Source:
Edition:
Page:
Verification level:
```

The app should answer:

> "یہ شعر کس موقع پر کہا گیا؟"

rather than simply displaying isolated quotations.

---

# 16. Marsiya Structure

Research and explain the structure of Mir Anis's marsiyas.

Potential sections:

- چہرہ
- سراپا
- رخصت
- آمد
- رجز
- جنگ
- شہادت
- بین

Determine whether this sequence is universal or varies from marsiya to marsiya.

For selected major marsiyas, map the actual structure:

```text
Marsiya:
Opening:
Chehra:
Sarapa:
Rukhsat:
Arrival:
Rajaz:
Battle:
Martyrdom:
Mourning:
```

Do not force the structure onto poems where the evidence does not support it.

---

# 17. Character Analysis

For every major Karbala character:

```json
{
  "character": "",
  "poetic_role": "",
  "attributes": [],
  "recurring_imagery": [],
  "emotional_register": "",
  "representative_verses": [],
  "relevant_marsiyas": [],
  "sources": []
}
```

Focus on:

- courage
- loyalty
- sacrifice
- spirituality
- family relationships
- dignity
- grief
- moral choice

---

# 18. Language & Style

Research:

- Urdu diction
- Persian influence
- Arabic vocabulary
- idioms
- metaphors
- similes
- imagery
- rhetoric
- dialogue
- dramatic narration
- battlefield description
- emotional transitions
- character speech
- rhythm
- meter where reliably identifiable

Support major claims with authentic examples.

---

# 19. Non-Karbala Poetry

Do not make the module exclusively about Karbala.

Research verified poetry concerning:

- morality
- human nature
- life
- death
- friendship
- loyalty
- love
- wisdom
- spirituality
- society
- philosophical reflection
- general observations

Clearly separate:

`Karbala/Marsiya`

from

`Non-Karbala`

If the surviving corpus is limited or poorly documented for a particular genre/theme, say so instead of filling the gap with uncertain material.

---

# 20. Anis and Dabeer

Create a balanced comparison.

Compare:

- literary style
- diction
- imagery
- character portrayal
- emotional intensity
- Persian influence
- narrative technique
- dialogue
- performance tradition
- popularity
- historical context

Do not declare one poet superior unless a specific critic/source is being discussed.

---

# 21. Critical Reception

Research major literary critics' assessments of Mir Anis.

For each critic:

- critic name
- source
- date
- assessment
- brief quotation where legally permissible
- interpretation

Prioritize academic and established literary criticism.

Do not present your own interpretation as a critic's statement.

---

# 22. Textual Variants

If different editions contain different wording:

```json
{
  "canonical_text": "",
  "variant_text": "",
  "edition_a": "",
  "edition_b": "",
  "difference": "",
  "editorial_note": ""
}
```

Do not silently normalize variants.

Preserve the wording of the cited edition.

---

# 23. Search Strategy

Search in both Urdu and English.

Suggested queries:

```text
میر انیس کلیات
میر انیس مرثیے
میر انیس دیوان
میر ببر علی انیس
انیس کے مرثیے
انیس کے اشعار
میر انیس کربلا
میر انیس مرثیہ امام حسین
میر انیس مرثیہ عباس
میر انیس مرثیہ علی اکبر
میر انیس مرثیہ قاسم
میر انیس غزل
Mir Anis complete works
Mir Anis Kulliyat
Mir Anis marsiya
Mir Anis marsiyas Karbala
Mir Anis poetry
Mir Anis Diwan
Mir Anis bibliography
Mir Anis literary criticism
Mir Anis Anis Dabeer
```

When a famous verse is discovered, search its opening line independently to locate the original poem/edition.

---

# 24. Two-Level Content Model

Separate the dataset into:

## A. Authoritative content

Content allowed to appear as verified:

- A — Primary verified
- B — Strong secondary

## B. Research notes

Content retained for research but not presented as verified:

- C — Attribution
- D — Disputed
- E — Unverified

This allows the research team to preserve useful leads without contaminating the public poetry corpus.

---

# 25. Recommended Database Relationships

Use these logical entities:

```text
Poet
  ↓
Collection
  ↓
Work / Marsiya
  ↓
Section / Context
  ↓
Verse
  ↓
Theme
  ↓
Character
  ↓
Source / Edition
```

A verse may have:

- multiple themes
- multiple characters
- multiple editions
- textual variants
- multiple translations
- multiple notes

---

# 26. Suggested Verse UI

For every verse, the application should be able to display:

### Original
Urdu text in large readable typography.

### Metadata
- شاعر
- صنف
- مرثیہ
- کردار
- موضوع

### Context
"یہ شعر کس موقع پر ہے؟"

### Meaning
- آسان اردو
- English translation

### Source
- Collection
- Volume
- Edition
- Page

### Verification
- Verified / Strong secondary / Attribution / Disputed

### Actions
- Bookmark
- Add note
- Add to collection
- Copy
- Share

This fits naturally with an application that already supports bookmarks, notes, tags, collections and sharing. 

---

# 27. Suggested Search & Filters

Allow users to search Mir Anis content by:

### Text
- Urdu text
- Roman Urdu
- English translation

### Work
- Marsiya
- Collection
- Diwan/Kulliyat

### Character
- امام حسینؑ
- حضرت عباسؑ
- حضرت زینبؑ
- علی اکبرؑ
- قاسمؑ
- سکینہؑ
- علی اصغرؑ

### Theme
- وفا
- شہادت
- صبر
- شجاعت
- ایثار
- عشق
- رخصت

### Verification
- Verified
- Strong secondary
- Research/uncertain

### Genre
- Marsiya
- Ghazal
- Salam
- Rubai
- Qasida
- etc.

---

# 28. Final Dataset Structure

Return both human-readable research and machine-readable JSON.

## Human-readable document

Use this structure:

1. Biography
2. Historical context
3. Literary career
4. Literary genres
5. Major works
6. Diwan/Kulliyat/collections
7. Mir Anis and Karbala
8. Major marsiyas
9. Karbala characters
10. Themes
11. Famous verses
12. Non-Karbala poetry
13. Language and style
14. Anis vs Dabeer
15. Critical reception
16. Bibliography
17. Research limitations

## Machine-readable JSON

```json
{
  "poet": {},
  "biography": {},
  "historical_context": {},
  "literary_context": {},
  "genres": [],
  "works": [],
  "collections": [],
  "marsiyas": [],
  "characters": [],
  "themes": [],
  "verses": [],
  "textual_variants": [],
  "critical_reception": [],
  "sources": [],
  "research_notes": []
}
```

---

# 29. Final Quality-Control Report

Before returning the research, produce:

```text
Total verses found:
Verified A:
Strong secondary B:
Attributed C:
Disputed D:
Unverified E:

Total works:
Total marsiyas:
Total collections:
Total editions identified:

Primary sources consulted:
Academic sources consulted:
Literary reference sources consulted:

Top 20 highest-confidence Karbala verses:
Top 20 highest-confidence non-Karbala verses:
Top 20 major Mir Anis works:
Top 10 major marsiyas:
```

Also list:

- unresolved attribution questions
- conflicting dates
- uncertain collection titles
- textual variants
- gaps in available sources

---

# 30. Recommended Research Workflow

Follow this order:

## Phase 1 — Identity
Verify biography and historical identity.

## Phase 2 — Bibliography
Map Kulliyat, Diwan, collections, editions and manuscripts.

## Phase 3 — Major Works
Identify major marsiyas and other works.

## Phase 4 — Karbala
Map characters, events, themes and marsiyas.

## Phase 5 — Poetry
Extract verified verses from identified primary sources.

## Phase 6 — Context
Connect verses to their specific narrative situations.

## Phase 7 — Non-Karbala
Research other genres and themes separately.

## Phase 8 — Literary Analysis
Study style, language, imagery, structure and critical reception.

## Phase 9 — Verification
Audit every quotation and bibliographic claim.

## Phase 10 — Export
Return human-readable research + JSON dataset.

---

# 31. Final Instruction to the Research Agent

You are building a **serious digital literary archive**, not a generic article.

Therefore:

- Accuracy is more important than volume.
- Primary sources are more important than search-engine frequency.
- Every quotation must be traceable.
- Every uncertain claim must be marked.
- Original Urdu must be preserved.
- Translation must never be mistaken for original text.
- Different editions must be treated as potentially different textual witnesses.
- Biography, literary criticism, historical fact and interpretation must be clearly distinguished.
- Never fill missing information with plausible-sounding content.

The final result should be strong enough that a developer can directly transform it into a searchable Mir Anis content module with verified poetry, works, themes, characters, context, sources, bookmarks and notes.
