Absolutely. If you're moving this work to a **new Claude Code session**, use this as the continuation prompt. It gives Claude the project context and tells it exactly where we stopped.

```text
# CONTINUATION PROMPT — Quran Web App

You are continuing development of my existing Quran web application.

IMPORTANT: Do not assume anything from memory. Inspect the existing codebase before making changes and preserve the architecture/components already implemented.

## CURRENT PROJECT STATE

The application is a Quran-focused web app with multiple existing modules including:

- Quran reader
- Surah navigation
- Search
- Translation selection
- Tafsir
- Audio
- Bookmarks
- Prayer
- Ramadan
- Goals
- Hifz
- Qur'anic Persons / Prophets
- Prophetic Timeline
- Family Tree
- Settings
- Account/Auth scaffolding
- Other existing modules

The Qur'anic Persons feature has just gone through several development and QA phases.

## QUR'ANIC PERSONS — CURRENT FINAL STATE

The feature currently contains exactly:

**38 people**

- 25 traditionally named prophets
- 13 selected named/title-based human figures

The 38 include:

Adam
Idris
Nuh
Hud
Salih
Ibrahim
Lut
Isma'il
Ishaq
Ya'qub
Yusuf
Ayyub
Shu'ayb
Musa
Harun
Dhul-Kifl
Dawud
Sulaiman
Ilyas
Al-Yasa'
Yunus
Zakariyya
Yahya
Isa
Muhammad ﷺ
Maryam
Luqman
Fir'aun
Haman
Qarun
Talut
Jalut
Abu Lahab
Bilqis
As-Samiri
Zayd
Dhul-Qarnayn
Uzair

The feature intentionally does NOT claim to contain every individual mentioned in the Qur'an.

Its documented scope is:

"Prophets and selected named/title-based human figures mentioned in the Qur'an."

Intentionally excluded:

- 'Imran — deliberate scope decision because he appears in family/lineage references without an independent person-focused narrative.
- Iblis — non-human being.
- Harut — non-human being.
- Marut — non-human being.
- Unnamed-but-identifiable people — future scope.

## DATA VERIFICATION

Direct Mentions for included people were exhaustively verified against the app's Quran content source.

Important distinctions are preserved between:

- Qur'an-supported facts
- Traditional accounts
- Disputed scholarly positions
- Uncertain chronology
- Traditional historical identification

Special cases are intentionally hedged:

- Dhul-Qarnayn's identity is not asserted as Cyrus/Alexander.
- Dhul-Qarnayn's prophetic status remains unsettled.
- Dhul-Kifl's prophetic status remains appropriately qualified.
- Idris = Enoch is treated as traditional identification.
- Talut/Jalut = Saul/Goliath is appropriately labeled.
- Abu Lahab's relationship to Muhammad ﷺ is separated between Qur'an-supported and traditional information.
- Bilqis's personal name does NOT occur in the Qur'an. Her `directMentions` is correctly empty.
- "Sheba" / Saba' is correctly distinguished from the traditional name Bilqis.
- The unnamed son in the sacrifice passage 37:99–113 is deliberately not attributed to Isma'il or Ishaq as a settled fact.
- Shu'ayb is NOT incorrectly identified as Musa's father-in-law.

## CURRENT PERSONS FEATURES

The Persons module already supports:

- Directory
- Search
- Category filters
- Prophet filter
- Women filter
- Companions filter
- Deep-linkable person detail pages
- Direct Mentions grouped by Surah
- Related Passages
- Story View
- Play All
- Arabic
- User-selected translation
- Additional translation selection
- RTL translation handling
- Tafsir picker:
  - Ibn Kathir
  - Maarif Ul Quran
  - Tazkirul Quran
- Audio
- Bookmarking
- Resume study state
- Family Tree
- Prophetic Timeline
- Responsive layouts
- Accessibility/performance considerations

The translation and Tafsir selections reuse shared preferences:

- `useTranslationPreference.ts`
- `useTafsirPreference.ts`

Do not create duplicate translation/Tafsir state.

## IMPORTANT QA HISTORY

Several real bugs were found and fixed during browser verification.

1. Timeline and Family Tree relationship links were originally rendered as invalid dynamic `<nuxtlink>` elements. They were fixed by using explicit `v-if` / `v-else` `NuxtLink` / `span` rendering.

2. Direct Mentions had stale text saying the data was curated/non-exhaustive. This was corrected to describe the actual exhaustive verification methodology.

3. A long Dhul-Qarnayn theme chip caused mobile clipping. It was shortened to conform to the established short-tag convention.

4. Musa's relationships were missing As-Samiri, causing him not to appear as a Timeline branch. The reciprocal relationship was added and verified.

5. Several citation-precision problems were corrected in earlier content audits.

Do NOT regress these fixes.

## TEST / BUILD STATE

Latest reported state:

- `npm test` → 78/78 passed
- Production build → successful
- Whole-project ESLint still has pre-existing unrelated issues:
  - 122 problems at the time of the last audit
  - 58 errors
  - 64 warnings
- These were in unrelated existing files.
- The Persons module itself was reduced to 0 errors and 1 pre-existing warning.
- The `vue/no-v-html` warning in `AyahReferenceCard.vue` follows the existing trusted-content rendering pattern used by the main Quran reader.

Do not weaken ESLint configuration or suppress errors just to make the numbers look better.

## CURRENT PRODUCT DECISION

We completed a broader product inventory of the application.

The inventory found approximately:

- 21 modules surveyed
- 18 complete/production-ready
- 1 partial
- 2 placeholder/not started

Important findings:

### Account & Cloud Sync

A `useAuth.ts` Supabase authentication composable exists but is not actually used by the UI.

This is a half-state/scaffold, not a completed account system.

Do not start implementing cloud sync unless explicitly requested.

### Surah Videos

`/surah-vedios` is currently a small "Coming Soon" stub and is not connected to the navigation.

Do not start implementing this unless explicitly requested.

### Home Dashboard

The Home dashboard already surfaces:

- Prayer
- Ramadan
- Goals
- Hifz
- Continue Reading
- other existing dashboard content

The Qur'anic Persons feature is currently NOT surfaced on Home.

This is the next task.

# NEXT TASK

Implement:

## "Continue Studying" Qur'anic Persons dashboard card

We selected **Option 1** from three design options.

The reasoning:

- Persons study is conceptually a reading/context companion.
- It belongs beside Continue Reading.
- It should be discoverable even for first-time users.
- It should not be treated like Goals/Hifz with artificial progress/streak mechanics.

## PLACEMENT

Add the card directly below the existing **Continue Reading** card on the Home dashboard.

It should use the same established Home dashboard visual language:

- dark gradient
- rounded-xl
- white text
- text-overline
- text-h6
- icon
- clickable card
- existing spacing/layout conventions

Do NOT embed the existing `PersonCard.vue` directly because its visual language differs from the Home dashboard.

Reuse its data concepts, not its presentation.

## THREE CARD STATES

### STATE 1 — Active study history

Use the existing `usePersonStudy`.

Find the most recently studied person across all 38 people.

Display:

- Arabic name
- Person name
- Honorific where appropriate
- Category
- "Continue studying [Person]"
- The last section they were viewing

Example:

"You were reading: Key Lessons"

Clicking should navigate to:

`/persons/[id]#section-{lastSection}`

Use the existing person detail section IDs.

Do not invent another anchor/navigation system.

### STATE 2 — Bookmarked person but no study history

If the user has no study history but has bookmarked one or more Persons:

Surface a bookmarked person.

Do NOT claim they were previously studying it.

Present it as a discovery/resume opportunity.

Click → normal person detail page.

Reuse the existing `useBookmarks`.

### STATE 3 — First-time user

If there is:

- no person study history
- no bookmarked person

show a featured person.

The featured person should come from the existing `usePersons()` data.

No network request should be required.

Use the person's real `shortDescription`.

Do NOT use generic promotional copy such as:

"Explore Qur'anic Persons"

The card should feel content-driven.

## HELPER

Add a small pure helper to the existing `personStudy.ts`:

`getMostRecentlyStudied(...)`

It should identify the person with the newest study state.

Add unit tests for:

- no study records
- one record
- multiple records → newest wins
- malformed/missing timestamps if supported by the existing model

Do not create a new persistence system.

## COMPONENT

Create a small dedicated Home dashboard component for the card.

Keep the implementation focused.

Do not put all the logic into `index.vue`.

Follow the existing Home dashboard component conventions.

## EDGE CASES

Handle:

- study record referring to a person that no longer exists
- bookmark referring to a person that no longer exists
- missing/invalid `lastSection`
- invalid section → navigate to `/persons/[id]` without a fragment
- SSR/hydration safety
- no unnecessary network requests

## ACCESSIBILITY

The entire card should be an obvious interactive target.

Provide an appropriate accessible label.

Follow existing Home dashboard interaction conventions.

## DO NOT DO

Do not:

- modify the 38-person dataset
- add new people
- change Direct Mentions
- change Related Passages
- change Timeline
- change Family Tree
- redesign person detail pages
- change translation/Tafsir architecture
- implement Account/Cloud Sync
- implement Surah Videos
- refactor unrelated Home dashboard code
- fix unrelated project lint debt
- introduce a new state/persistence system

Keep this task tightly scoped.

# VERIFICATION

After implementation, verify all three states in a real browser:

### Test 1
New user:

No person study state + no person bookmark.

Expected:
Featured person appears using actual `shortDescription`.

### Test 2
Bookmarked person:

No study state + bookmarked person.

Expected:
Bookmarked person appears.

### Test 3
Resume study:

Create/use study records for at least two people with different timestamps.

Expected:
Newest study record wins.

Expected card:

"Continue studying [Person]"

and the correct last section.

Click it.

Expected URL:

`/persons/[id]#section-{lastSection}`

Verify the correct section is visible.

Also verify:

- desktop
- ~768px
- ~390px
- no horizontal overflow
- Continue Reading unchanged
- Prayer unchanged
- Ramadan unchanged
- Goals unchanged
- Hifz unchanged
- Persons detail unchanged

Run:

- `npm test`
- scoped ESLint for changed files
- `npm run build`

# REPORT FORMAT

At the end, report:

1. Files changed
2. Helper added
3. Component added
4. How the three states work
5. Browser verification results
6. Tests
7. Lint
8. Build
9. Any defects discovered
10. Any unrelated issues deliberately left untouched

Do not make unrelated improvements.

Start by inspecting the existing codebase and confirming the actual current implementation of:

- Home `index.vue`
- `usePersonStudy`
- `usePersons`
- `useBookmarks`
- person detail section IDs
- existing dashboard cards

Then implement the task.
```
