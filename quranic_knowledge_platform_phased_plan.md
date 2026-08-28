# Qur'anic Knowledge Platform — Phased Implementation Plan

## Purpose

Build the Qur'anic knowledge platform in deliberate phases.

The current **People & Groups** module is the foundation. Future modules must build on the existing architecture rather than creating disconnected systems.

### Core principles

1. **Qur'anic accuracy first**
2. Clearly separate:
   - Qur'an explicitly states
   - Authentic hadith
   - Traditional identification
   - Disputed interpretation
3. Do not invent names, relationships, chronology, locations, or claims.
4. Preserve existing working functionality.
5. Prefer additive changes over unnecessary refactors.
6. Every phase must be fully completed and verified before starting the next phase.
7. Do not claim a phase is complete unless the required checks were actually performed.
8. Keep UX consistent across modules.
9. Reuse existing components/composables/patterns wherever appropriate.
10. Keep source/reference data traceable to Qur'anic passages.

---

# Roadmap

| Phase | Module | Primary question |
|---:|---|---|
| 0 | Foundation & Architecture | How should the knowledge system work? |
| 1 | People & Groups | Who? |
| 2 | Peoples & Nations | Which communities? |
| 3 | Places | Where? |
| 4 | Stories | What narrative? |
| 5 | Themes | What does it teach? |
| 6 | Duas | How did people call upon Allah? |
| 7 | Events | What happened? |
| 8 | Signs & Miracles | What signs occurred? |
| 9 | Commands & Prohibitions | What does Allah command/forbid? |
| 10 | Knowledge Graph | How are everything connected? |

---

# Phase 0 — Foundation & Architecture

## Goal

Establish shared conventions that all later modules can reuse.

## Work

Inspect the existing codebase before changing anything.

Document and, where necessary, standardize:

- entity IDs
- names and Arabic names
- Qur'an references
- source types
- verification status
- relationships
- themes
- search indexing
- bookmarks
- audio
- tafsir
- translation preferences
- related entities
- accessibility
- mobile behavior

Create shared patterns only where the current architecture genuinely needs them.

Do not build the Knowledge Graph yet.

## Verification

Run:

- existing test suite
- lint
- build
- relevant browser checks

Confirm no regression.

## Phase completion report

At the end, provide:

### Phase 0 Details

- What was inspected
- What was changed
- Files changed
- Architecture decisions
- Shared patterns created/reused
- Tests
- Lint
- Build
- Browser verification
- Known issues
- Recommended next phase

---

# Phase 1 — People & Groups

## Goal

Maintain and finalize the Qur'anic People & Groups system.

Current foundation: approximately 59 entries.

## Work

Support:

- prophets
- named people
- title-based people
- significant unnamed individuals
- significant Qur'anic groups

Examples include:

- Al-Khidr
- People of the Cave
- People of the Trench
- Companions of the Elephant
- Hawariyyun
- Pharaoh's Magicians
- Yusuf's Brothers

Do not invent individual names for unnamed groups.

Preserve source separation.

## UX

Verify:

- directory
- filters
- search
- detail pages
- bookmarks
- Family Tree
- Timeline
- Continue Studying
- mobile
- keyboard accessibility

## Phase completion report

At the end provide:

### Phase 1 Details

- Final entity count
- Individuals
- Groups
- New additions
- Exclusions
- Future-taxonomy candidates
- Source/verification decisions
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 2 — Peoples & Nations

## Goal

Create a dedicated taxonomy for significant Qur'anic peoples, communities, tribes, and nations.

Examples to investigate:

- 'Ad
- Thamud
- Madyan
- Saba'
- Bani Israel
- Ashab al-Rass
- people of Nuh
- people of Lut
- people of Pharaoh

Do not turn entire civilizations into Person records.

## Suggested entity concepts

Possible classifications:

- nation
- community
- tribe
- religious community
- historical population
- narrative group

Use only classifications justified by the source material.

## Detail page

Consider:

- Overview
- Qur'anic References
- Associated Prophet
- Places
- Major Events
- Characteristics
- Outcome
- Themes
- Related People

## Verification

Test:

- search
- references
- related people
- navigation
- bookmarks if supported
- mobile
- accessibility
- regression of People module

## Phase completion report

### Phase 2 Details

- Entities added
- Entity classifications
- Included/excluded candidates
- Reasons for exclusions
- Qur'anic references
- Relationships created
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 3 — Places

## Goal

Create a Qur'anic Places module.

Investigate places such as:

- Makkah
- Madinah
- Egypt
- Madyan
- Sinai
- Babylon
- Badr
- Mount Judi
- Al-Hijr
- other materially significant Qur'anic locations

## Source discipline

Separate:

- Qur'anic location/reference
- traditional identification
- modern proposed geographic identification

Do not present uncertain modern geography as Qur'anic fact.

## Detail page

Consider:

- Overview
- Qur'anic References
- People
- Peoples
- Stories
- Events
- Themes
- Geographic notes
- Identification confidence

## Phase completion report

### Phase 3 Details

- Places added
- Places excluded
- Identification decisions
- Source qualifications
- Relationships
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 4 — Stories

## Goal

Create a narrative-first Qur'anic Stories module.

Start with major narratives:

- Adam
- Nuh
- Ibrahim
- Yusuf
- Musa
- Dawud & Jalut
- Sulayman & the Queen of Sheba
- Maryam
- Isa
- People of the Cave
- People of the Trench
- Companions of the Elephant

## Story structure

Consider:

- Summary
- Qur'anic passages
- People
- Peoples
- Places
- Events
- Themes
- Lessons
- Chronology where justified

## Important

Do not create artificial story chronology when the Qur'an does not establish it.

Distinguish Qur'anic sequence from later historical reconstruction.

## Phase completion report

### Phase 4 Details

- Stories added
- Story boundaries
- Qur'anic passage mapping
- People linked
- Places linked
- Events linked
- Themes linked
- Chronology decisions
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 5 — Themes

## Goal

Create a carefully curated Qur'anic Themes module.

Start with a manageable set rather than hundreds of subjective labels.

Potential themes:

- Tawhid
- Shirk
- Sabr
- Shukr
- Tawakkul
- Tawbah
- Justice
- Mercy
- Forgiveness
- Arrogance
- Hypocrisy
- Fear
- Hope
- Guidance
- Trials
- Family
- Wealth
- Knowledge
- Wisdom
- Accountability
- Paradise
- Hell

## Source discipline

Every significant theme association should have:

- Qur'anic reference
- reason/context
- confidence where appropriate
- source

Avoid unsupported AI-generated thematic tagging.

## Phase completion report

### Phase 5 Details

- Themes added
- Theme definitions
- References
- People linked
- Stories linked
- Events linked
- Related themes
- Inclusion methodology
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 6 — Duas

## Goal

Create a Qur'anic Duas module.

Include:

- prophetic duas
- duas of believers
- Rabbana duas
- prayers for forgiveness
- prayers for guidance
- prayers concerning family
- prayers for protection
- other clearly Qur'anic supplications

## Dua detail

Consider:

- Arabic
- Translation
- Transliteration if appropriate
- Speaker
- Context
- Surah/Ayah
- Audio
- Read in Qur'an
- Tafsir
- Themes

## Important

Only label something a Qur'anic dua if the Qur'anic text actually presents it as a supplication/prayer.

Do not add popular non-Qur'anic duas to this module without clearly separating them.

## Phase completion report

### Phase 6 Details

- Duas added
- Speakers
- References
- Context decisions
- Themes
- Audio behavior
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 7 — Events

## Goal

Create an Events module representing significant individual occurrences.

Examples:

- Creation of Adam
- Adam's repentance
- Nuh's Flood
- Ibrahim's confrontation with his people
- Musa and Pharaoh
- Exodus
- Sea crossing
- Talut and Jalut
- Yusuf entering prison
- Yusuf's appointment
- Yusuf's reunion
- Birth of Isa
- People of the Cave awakening
- Companions of the Elephant

## Event structure

Consider:

- What happened
- Qur'anic references
- People
- Peoples
- Places
- Story
- Themes
- Signs
- Chronology confidence

## Important

Do not create a calendar date unless the source establishes it.

Use relative chronology where appropriate.

## Phase completion report

### Phase 7 Details

- Events added
- References
- People linked
- Places linked
- Stories linked
- Chronology decisions
- Confidence/status notes
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 8 — Signs & Miracles

## Goal

Create a Signs & Miracles module.

Investigate examples such as:

### Musa

- Staff
- Hand
- Plagues
- Sea

### Isa

- Healing
- Raising the dead
- Speaking in infancy
- Bird from clay by Allah's permission

### Salih

- She-Camel

### Ibrahim

- Fire becoming cool and safe

### Sulayman

- Understanding creatures
- Wind
- Jinn working under his authority

## Source discipline

Do not automatically label every extraordinary event a "miracle."

Use precise internal classifications where useful:

- sign
- miracle
- divine aid
- punishment
- extraordinary event

## Phase completion report

### Phase 8 Details

- Signs/miracles added
- Classification decisions
- Associated people
- Associated events
- References
- Source qualifications
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 9 — Commands & Prohibitions

## Goal

Create a Qur'anic Commands & Prohibitions module.

Potential commands:

- prayer
- zakah
- fasting
- Hajj
- justice
- truthfulness
- remembrance
- repentance
- honoring parents
- keeping promises

Potential prohibitions:

- shirk
- murder
- zina
- riba
- theft
- backbiting
- false testimony
- consuming wealth unjustly
- transgression

## Critical source discipline

Distinguish:

- explicit Qur'anic command/prohibition
- inferred principle
- derived legal ruling
- scholarly interpretation

Do not present a derived fiqh ruling as though it were a verbatim Qur'anic command.

## Phase completion report

### Phase 9 Details

- Commands added
- Prohibitions added
- References
- Addressed audience
- Context
- Related themes
- Related commands/prohibitions
- Source/fiqh qualifications
- Files changed
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Next phase recommendation

---

# Phase 10 — Cross-Module Knowledge Graph

## Goal

Only after the individual modules are stable, connect them into a unified Qur'anic knowledge graph.

Example:

Musa
→ Harun
→ Pharaoh
→ Egypt
→ People of Pharaoh
→ Musa & Pharaoh story
→ Sea crossing event
→ Signs
→ Tawhid
→ Dua
→ related Qur'anic passages

## Relationships

Support meaningful relationships such as:

- person → person
- person → group
- person → place
- person → story
- person → event
- person → theme
- story → event
- story → place
- story → theme
- event → sign
- dua → person
- command → theme
- prohibition → theme

## Important

Do not create relationships merely because two entities occur in the same Surah.

Every meaningful relationship should have a defensible basis.

## Final UX

Consider:

- Related People
- Related Places
- Related Stories
- Related Events
- Related Themes
- Related Duas
- Related Signs
- Related Commands
- Related Passages

## Phase completion report

### Phase 10 Details

- Relationship types
- Number of relationships
- Source/verification approach
- Graph navigation
- Search behavior
- Performance
- Accessibility
- Mobile
- Tests
- Lint
- Build
- Browser verification
- Regression results
- Known issues
- Future opportunities

---

# Mandatory End-of-Phase Protocol

At the end of EVERY phase, Claude must stop and produce a phase completion report.

Do not silently continue into the next phase.

The report must contain:

## Phase completed

State the phase number and module.

## What was done

Give a concise but complete implementation summary.

## Content added

List:

- entities
- references
- relationships
- classifications

where applicable.

## Content decisions

Document:

- inclusions
- exclusions
- ambiguous cases
- traditional identifications
- disputed information

## Code changes

List every changed file with a one-line explanation.

## Verification

Report actual results for:

- tests
- lint
- build
- browser
- mobile
- accessibility
- search
- relevant existing features

Never fabricate verification.

## Regression

Explicitly confirm whether existing modules still work.

## Known issues

List anything remaining.

## Phase status

Use exactly one:

- COMPLETE
- COMPLETE WITH KNOWN NON-BLOCKING ISSUES
- BLOCKED

## Next phase

Give a short recommendation, but **do not begin it automatically**.

---

# Working Rules for Claude

1. Start with the current phase only.
2. Inspect before editing.
3. Make the smallest appropriate architecture change.
4. Reuse existing patterns.
5. Preserve existing data.
6. Do not rewrite unrelated files.
7. Do not invent Qur'anic facts.
8. Do not silently convert traditional reports into Qur'anic facts.
9. Do not claim tests/browser checks that were not run.
10. Stop after the current phase and provide the required completion report.
11. Wait for explicit approval before starting the next phase.
12. If a major architectural decision is required, stop and explain it before implementing it.
13. If content is uncertain, flag it instead of guessing.
14. Prefer a smaller, defensible dataset over a larger speculative one.

# Definition of Done

A phase is complete only when:

- implementation is finished
- content has been audited
- source separation is preserved
- tests pass or known failures are documented
- lint passes or known failures are documented
- build succeeds or the blocker is documented
- relevant browser verification is performed
- mobile is checked where applicable
- accessibility is checked where applicable
- regression is checked
- phase details are documented

The project should progress **phase-by-phase, with an explicit checkpoint after every phase**.
