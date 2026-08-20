# Quran App --- Hifz Module Specification

*Living document. Prepared from the project's existing
roadmap/project-plan document and the Hifz product decisions collected
in the design interview.*

**Status:** Hifz Mode redesign/specification --- proposed next
iteration\
**Architecture:** Local-first; no backend required\
**Scope:** New memorization + revision, active recall, ayah-level
weakness tracking, transition testing, adaptive review, and daily Hifz
sessions.

------------------------------------------------------------------------

## 1. Source Context

The existing project plan records Hifz Mode as §4.8 of the feature
roadmap and as a newly shipped local-first module in Pass 17. The
current implementation has no prior Hifz code before that pass.

The current implementation includes:

-   `useHifz.ts` using `quran:hifz:v1`
-   Surah + ayah-range memorization plans
-   lightweight SM-2-style spaced repetition
-   `interval`, `ease`, `nextReviewAt`, `lastReviewedAt`, and
    `reviewCount`
-   `learning` / `memorized` states plus manual memorized / needs-review
    overrides
-   Review Queue with overdue items first
-   Arabic and translation hide/show controls
-   per-ayah repeat audio
-   optional range looping
-   mistake notes
-   Again / Good / Easy grading
-   plan creation, pause/resume, and deletion
-   a Home card for the next due Hifz review

The existing Hifz flow was verified end-to-end with a real plan and
localStorage/SRS state changes.

This document keeps that foundation but proposes a substantially richer
**practice engine** on top of it.

------------------------------------------------------------------------

# 2. Product Vision

Hifz Mode should become a complete personal memorization practice system
rather than only a review queue.

The core loop is:

**Learn → Practice → Recall → Test → Identify weakness → Recover →
Review → Assess**

The primary product question should be:

> **What should I practice today?**

The answer should be provided by **Today's Hifz**, while the underlying
system automatically manages scheduling, weakness, transitions, and
progression.

------------------------------------------------------------------------

# 3. Product Principles

## 3.1 New memorization and revision are equally important

Hifz must support both:

-   learning new ayahs
-   maintaining existing memorization

Neither should be treated as a secondary feature.

------------------------------------------------------------------------

## 3.2 Practice and Test are separate

### Practice

The app helps the user learn.

It may show:

-   Arabic
-   surrounding Mushaf context
-   audio
-   repetition controls
-   hints
-   guided progression

### Test

The app measures independent recall.

By default:

-   Arabic hidden
-   translation hidden
-   no contextual answer visible
-   hints optional
-   answer revealed only on explicit action

------------------------------------------------------------------------

## 3.3 Automatic intelligence, simple UI

The system may internally calculate:

-   SRS state
-   ayah weakness
-   transition weakness
-   review priority
-   assessment frequency
-   Hifz Health
-   recovery rate

The user should not have to understand those algorithms.

The main dashboard should remain simple.

------------------------------------------------------------------------

## 3.4 No unnecessary gamification

Do not add:

-   XP
-   points
-   badges
-   leaderboards
-   artificial rewards

Allowed:

-   subtle consistency tracking
-   activity history
-   practice heatmap
-   factual progress statistics

------------------------------------------------------------------------

## 3.5 Local-first

No backend is required for this version.

Hifz data remains local and should use the application's existing
local-storage/data-export conventions.

------------------------------------------------------------------------

# 4. Memorization Targets

A target represents:

> **Surah + ayah range**

Example:

> Al-Mulk 1--30

The first version intentionally does **not** add Juz, Hizb, or
page-based target creation.

Those can be added later without changing the underlying ayah-level
model.

------------------------------------------------------------------------

## 4.1 Multiple active targets

Users can maintain multiple active targets.

Recommended practical limit:

> 3--5 active targets

The daily scheduler rotates between targets according to priority.

------------------------------------------------------------------------

# 5. Target Creation

Target creation should be intentionally simple.

### Step 1 --- Surah

Choose a Surah.

### Step 2 --- Range

Choose:

-   start ayah
-   end ayah

### Step 3 --- Daily new-ayah target

Examples:

-   1
-   3
-   5
-   10
-   Custom

### Step 4 --- Daily time goal

Examples:

-   10 minutes
-   20 minutes
-   30 minutes
-   Custom

### Step 5

**Start Hifz**

Do not expose SRS configuration during setup.

------------------------------------------------------------------------

# 6. Automatic Memorization Progression

The user defines the target; Hifz manages the daily progression.

Example:

**Target:** Al-Baqarah 1--20\
**New target:** 5 ayahs/day

### Day 1

Learn 1--5.

### Day 2

Review 1--5.\
Learn 6--10.

### Day 3

Review 1--10.\
Learn 11--15.

The system continues this pattern while respecting review performance.

------------------------------------------------------------------------

# 7. Guided Practice Mode

Practice Mode is the learning environment.

It should use a progressive learning cycle.

## 7.1 Progressive memorization

For a new range:

### Ayah 1

Practice Ayah 1.

### Ayah 2

Practice:

> 1 → 2

### Ayah 3

Practice:

> 1 → 2 → 3

Continue progressively.

This explicitly trains **ayah-to-ayah connections**, not just isolated
ayah recall.

------------------------------------------------------------------------

# 8. Practice Controls

Practice supports:

-   Listen
-   Recite
-   Repeat ayah
-   Repeat range
-   Show/hide Arabic
-   Show/hide translation
-   Mushaf/context view
-   Jump to ayah
-   Practice from here
-   Mark "I'm Ready"

`I'm Ready` means:

> "I am ready to test this."

It does **not** affect SRS or mark the ayah as memorized.

------------------------------------------------------------------------

# 9. Repetition

Users can choose:

-   1×
-   3×
-   5×
-   10×
-   Custom

Also provide:

> **Repeat until confident**

This lets users continue until they personally feel ready.

------------------------------------------------------------------------

# 10. Audio Practice

Reuse the existing global audio player rather than creating a second
Hifz audio system.

The existing implementation already supports per-ayah audio and range
looping.

Practice should support:

> **Listen → Recite → Listen**

Controls:

-   playback speed
-   repetition count
-   repeat ayah
-   repeat range
-   loop count

Loop options:

-   1×
-   2×
-   3×
-   5×
-   10×
-   Until stopped

------------------------------------------------------------------------

# 11. Mushaf Practice View

Practice may use a Mushaf/context presentation.

The current ayah is highlighted subtly.

The user can:

-   see surrounding ayahs
-   tap another ayah
-   jump directly to it
-   choose **Practice from here**

This contextual assistance belongs to Practice, not strict Test mode.

------------------------------------------------------------------------

# 12. Strict Test Mode

Test mode should intentionally remove assistance.

Default:

> Arabic hidden\
> Translation hidden

The user recalls the ayah before revealing the answer.

After reveal:

> **How did you do?**

Grades:

-   **Again**
-   **Good**
-   **Easy**

------------------------------------------------------------------------

# 13. Test Modes

Hifz should support all of the following.

## 13.1 Full Ayah

Hide the full ayah and ask the user to recite it.

## 13.2 Continue

Show the beginning and ask the user to continue.

## 13.3 Previous Ayah

Use the ending/context to test what came before.

## 13.4 Next Ayah

Test continuation into the next ayah.

## 13.5 Random Ayah

Start from a random ayah in the memorized range.

## 13.6 Full Range

Test the entire selected passage.

------------------------------------------------------------------------

# 14. Progressive Hints

Hints are progressive.

### Level 1

Reveal the first word.

### Level 2

Reveal the first 2--3 words.

### Level 3

Reveal the beginning portion.

### Level 4

Reveal the complete ayah.

Hint usage is recorded.

A correct recall requiring hints is weaker evidence than a clean recall.

------------------------------------------------------------------------

# 15. Ayah-Level Performance

Every ayah should have its own performance state.

Example:

  Ayah   Current State     Historical Mistakes   Current Priority
  ------ --------------- --------------------- ------------------
  1      Strong                              0                Low
  2      Memorized                           2             Medium
  3      Weak                                6               High
  4      Strong                              0                Low

Historical mistakes should not be deleted.

Current weakness should be calculated independently.

------------------------------------------------------------------------

# 16. Strength States

Use five conceptual states:

-   **Not Started**
-   **Learning**
-   **Memorized**
-   **Strong**
-   **Weak / Struggling**

Strength is dynamic.

An ayah can move:

> Weak → Memorized → Strong

and later:

> Strong → Memorized → Weak

if retention deteriorates.

------------------------------------------------------------------------

# 17. Historical Mistakes vs Current Weakness

These must be separate.

Example:

> Total mistakes: 8\
> Recent mistakes: 0\
> Current strength: Strong\
> Current priority: Low

An ayah that struggled historically can recover.

Likewise, a previously Strong ayah can become weak.

------------------------------------------------------------------------

# 18. Weak Ayahs

Provide a dedicated:

> **Practice Weak Ayahs**

mode.

Example:

> Weak Ayahs --- 6
>
> Al-Baqarah 7\
> Al-Baqarah 12\
> Al-Mulk 17

One tap should automatically construct a focused session.

------------------------------------------------------------------------

# 19. Mistake Recovery

When the user misses an ayah:

1.  Record the mistake.
2.  Replay the ayah.
3.  User tries again.
4.  If successful, continue.
5.  Preserve the historical mistake.
6.  Increase future priority when appropriate.

Repeated mistakes increase review priority automatically.

------------------------------------------------------------------------

# 20. Weak Transitions

Transitions are separate from ayah states.

Example:

> Ayah 10: Strong\
> Ayah 11: Strong\
> Transition 10 → 11: Weak

This represents a real memorization problem:

> The user knows both ayahs individually but struggles to connect them.

------------------------------------------------------------------------

# 21. Weak Transition Practice

Provide:

> **Practice Weak Transitions**

Example:

> Al-Baqarah 10 → 11\
> Al-Mulk 7 → 8

One tap starts focused transition practice.

------------------------------------------------------------------------

# 22. Transition Recovery

When a transition is missed:

1.  Show/replay the preceding ayah.
2.  User retries the transition.
3.  Record the result separately.
4.  Continue if successful.
5.  Increase transition priority if repeatedly missed.

------------------------------------------------------------------------

# 23. Free Practice

Users can manually practice a specific ayah or range.

Example:

> Practice Al-Mulk 17

or:

> Practice from Al-Mulk 17

Free practice does **not** change SRS unless the user enters a graded
test.

------------------------------------------------------------------------

# 24. SRS

Retain the existing SM-2-style foundation.

The current implementation already stores:

-   interval
-   ease
-   next review
-   last review
-   review count

and supports Again / Good / Easy grading.

The redesign should extend the meaningful scheduling state to the
**individual ayah** and **transition** level.

------------------------------------------------------------------------

# 25. Daily Hifz Dashboard

The Today screen is the primary Hifz dashboard.

Example:

> ## Today's Hifz
>
> **23 items to practice**
>
> \~24 minutes
>
> **\[Start Today's Hifz\]**

The dashboard should show one primary workload number rather than
exposing a complicated priority breakdown.

If there is nothing due:

> **You're caught up**
>
> **\[Quick Test\]**

------------------------------------------------------------------------

# 26. Daily Session

One tap starts the intelligent session.

Order:

1.  Warm-up
2.  Weak Ayahs
3.  Due/overdue revision
4.  New memorization
5.  Mixed final test
6.  Session summary

------------------------------------------------------------------------

# 27. Session Priority

Internally prioritize:

1.  Weak
2.  Overdue
3.  Due
4.  New
5.  Other active targets

When multiple targets have equal priority, rotate between targets.

Users can manually override today's selection without destroying SRS
state.

------------------------------------------------------------------------

# 28. Revision First

Existing memorization takes priority over adding new material.

If current Hifz is weak, the system should reduce the pressure to add
new ayahs.

The goal is retention, not simply accumulating memorized ranges.

------------------------------------------------------------------------

# 29. Daily Time Goal

Users can have:

-   daily new-ayah target
-   daily time goal

Example:

> 5 new ayahs\
> 25 minutes

Before starting, show an estimated duration.

------------------------------------------------------------------------

# 30. Flexible Session Size

Users can manually choose how much to practice.

Possible choices:

-   5 ayahs
-   10 ayahs
-   selected range
-   entire target
-   Custom

The automatic session still recommends an appropriate workload.

------------------------------------------------------------------------

# 31. Session Resume

Interrupted sessions must persist locally.

Example:

> 17 / 30 completed
>
> **Resume Session**

Resume exactly where the user stopped.

------------------------------------------------------------------------

# 32. Skip

Users can temporarily skip an item.

Skipping:

-   does not mark it successful
-   does not erase weakness
-   does not reset SRS
-   keeps it eligible for future review

------------------------------------------------------------------------

# 33. Quick Test

Quick Test is separate from Daily Hifz.

Durations:

-   2 minutes
-   5 minutes
-   10 minutes
-   Custom

Users can select which active targets are included.

Default:

> All active targets

Quick Test is adaptive.

It prioritizes:

-   weak ayahs
-   overdue material
-   useful random testing
-   weak transitions

and mixes test types.

------------------------------------------------------------------------

# 34. Full-Range Assessment

Every target should periodically receive a full-range assessment.

The assessment mixes:

-   full ayah
-   continue
-   previous/next
-   random start
-   transitions

Frequency should be adaptive.

Strong targets are assessed less frequently.

Weak targets are assessed more frequently.

------------------------------------------------------------------------

# 35. Mastery View

Every target has a detailed Mastery view.

Example:

> ## Al-Mulk 1--30
>
> Coverage: 30/30
>
> Strong: 22\
> Memorized: 5\
> Needs revision: 2\
> Weak: 1
>
> Weakest: Ayah 17
>
> **\[Practice Weakest\]**
>
> **\[Full Range Test\]**

------------------------------------------------------------------------

# 36. Hifz Health

Each target may have a supporting Hifz Health score.

It can use:

-   recent recall
-   recent mistakes
-   hint usage
-   Again / Good / Easy
-   review consistency
-   full-range performance
-   SRS stability

The score must remain transparent through supporting details.

Do not reduce the user's Hifz to one unexplained number.

------------------------------------------------------------------------

# 37. Why Is This Weak?

For weak material, explain the signals.

Example:

> **Al-Baqarah 12 --- Weak**
>
> Historical mistakes: 5\
> Recent mistakes: 2\
> Recent hints: 1\
> Last successful review: 3 days ago
>
> **Reason: Recent recall difficulty**

------------------------------------------------------------------------

# 38. Automatic Strength Recovery

Successful reviews gradually improve current strength.

Example:

> Weak → Memorized → Strong

A single successful review should not immediately make an ayah Strong.

Repeated successful performance should progressively restore it.

------------------------------------------------------------------------

# 39. Final Test

The final test in Daily Hifz should automatically mix test types.

The user should not know whether the next item will be:

-   Full Ayah
-   Continue
-   Previous
-   Next
-   Random
-   Transition

This reduces dependence on sequence/context cues.

------------------------------------------------------------------------

# 40. Session Summary

The summary should remain factual.

Example:

> ## Session Complete
>
> 18 ayahs reviewed\
> 5 new ayahs\
> 3 mistakes\
> 2 hints used
>
> ### Needs attention
>
> Al-Baqarah 17 --- 3 recent mistakes\
> Al-Mulk 8 → 9 --- weak transition
>
> **\[Practice Weak Areas\]**

Do not add motivational copy.

Do not add a separate "What improved?" section.

------------------------------------------------------------------------

# 41. Next Review Display

Do not show a detailed "next review" card immediately after every
individual grade.

Review scheduling should be surfaced through the dashboard/session
system rather than interrupting the recall flow.

------------------------------------------------------------------------

# 42. Statistics

Separate statistics into:

-   New memorization
-   Revision
-   Weak-ayah recovery
-   Weak-transition recovery
-   Full assessments

Example:

> This month
>
> New: 42 ayahs\
> Revision: 186 ayahs\
> Weak recovered: 14\
> Transitions recovered: 8\
> Assessments: 6

------------------------------------------------------------------------

# 43. Activity History

Provide a simple local activity history.

Example:

> **August 20** - 5 new - 18 revision - 3 weak recovered
>
> **August 19** - 4 new - 21 revision

Avoid turning this into a heavy analytics dashboard.

------------------------------------------------------------------------

# 44. Consistency Heatmap

Provide a simple practice heatmap.

Example:

> August
>
> 🟩 Strong practice\
> 🟨 Light practice\
> ⬜ No practice

Keep streak/consistency secondary to actual Hifz strength.

------------------------------------------------------------------------

# 45. Progress Map

The progress map should show two dimensions:

### Coverage

How much has been memorized?

### Strength

How strong is the memorized material?

Example:

> Juz 30
>
> Memorized: 78%\
> Strong: 61%

This avoids presenting memorized coverage as healthy retention when a
large portion is weak.

------------------------------------------------------------------------

# 46. Preferences

Remember locally:

-   repetition count
-   playback speed
-   loop preference
-   Practice settings
-   Quick Test preferences
-   existing Quran display preferences

Reuse the app's existing reading/audio preference system instead of
creating duplicate preference stores.

------------------------------------------------------------------------

# 47. Audio Architecture

Do not create a second audio player for Hifz.

Use the existing global audio system.

The current project already has a shared audio player, persisted
playback preferences, Media Session integration, resume state, and
global mini-player behavior.

Hifz should integrate with that infrastructure.

------------------------------------------------------------------------

# 48. Offline Behavior

Hifz state itself is local and should work without a backend.

Quran content should use the existing chapter cache/IndexedDB
architecture where available.

The project already uses IndexedDB for structured Quran chapter and
tafsir caching and falls back to network when necessary.

Hifz should never fabricate missing Quran content.

If required content is unavailable offline:

> **This passage isn't available offline yet. Connect once to load it.**

------------------------------------------------------------------------

# 49. Data Model --- Proposed

The current plan-level SRS model is sufficient for the shipped
foundation, but the redesign needs finer-grained state.

Conceptually:

``` text
HifzStore
├── targets[]
│   ├── id
│   ├── surahNo
│   ├── startAyah
│   ├── endAyah
│   ├── dailyNewTarget
│   ├── dailyTimeGoal
│   ├── status
│   ├── lastPosition
│   └── target-level summary
│
├── ayahs[]
│   ├── targetId
│   ├── surahNo
│   ├── ayahNo
│   ├── strength
│   ├── interval
│   ├── ease
│   ├── nextReviewAt
│   ├── reviewCount
│   ├── historicalMistakes
│   ├── recentMistakes
│   ├── hintsUsed
│   └── lastReviewedAt
│
├── transitions[]
│   ├── targetId
│   ├── fromAyah
│   ├── toAyah
│   ├── strength
│   ├── mistakes
│   ├── recentMistakes
│   └── lastReviewedAt
│
├── sessions[]
│   ├── id
│   ├── targetIds
│   ├── status
│   ├── currentStep
│   ├── currentItem
│   ├── startedAt
│   └── completedAt
│
└── activity[]
    ├── date
    ├── newAyahs
    ├── revisions
    ├── recoveredAyahs
    ├── recoveredTransitions
    └── assessments
```

The exact schema can be simplified during implementation if necessary,
but the **ayah-level and transition-level concepts should remain**.

------------------------------------------------------------------------

# 50. Component Direction

Avoid growing one giant `hifz/index.vue`.

Suggested logical components:

``` text
app/pages/hifz/index.vue
app/components/hifz/
├── HifzToday.vue
├── HifzTargetCard.vue
├── HifzPractice.vue
├── HifzTest.vue
├── HifzTestPrompt.vue
├── HifzHint.vue
├── HifzSession.vue
├── HifzSessionSummary.vue
├── HifzWeakAyahs.vue
├── HifzWeakTransitions.vue
├── HifzMastery.vue
├── HifzProgressMap.vue
├── HifzQuickTest.vue
└── HifzTargetWizard.vue
```

Keep state and scheduling logic in `useHifz.ts` or smaller composables
where appropriate.

------------------------------------------------------------------------

# 51. What This Version Does Not Build

Explicitly out of scope:

-   Voice-recognition grading
-   Speech-to-text recitation analysis
-   Teacher/parent collaboration
-   Backend synchronization
-   Account dependency
-   Juz/Hizb/Page target creation
-   Teacher notes
-   XP
-   Points
-   Badges
-   Leaderboards
-   Artificial motivational messages

The absence of a backend is a reason to keep the module local-first, not
a reason to reduce the quality of the Hifz practice experience.

------------------------------------------------------------------------

# 52. Implementation Strategy

Build incrementally on the shipped Hifz foundation.

## Pass A --- Data model

Extend Hifz from plan-level state toward:

-   ayah-level state
-   transition state
-   session state
-   activity history

## Pass B --- Practice engine

Build:

-   guided progressive memorization
-   repetition controls
-   Listen → Recite → Listen
-   Mushaf/context practice
-   free practice
-   range looping

## Pass C --- Test engine

Build:

-   strict hidden mode
-   six test types
-   progressive hints
-   manual grading
-   transition testing

## Pass D --- Adaptive intelligence

Build:

-   weak ayah priority
-   weak transition priority
-   dynamic strength
-   recovery behavior
-   adaptive SRS
-   adaptive full-range assessment

## Pass E --- Daily experience

Build:

-   Today dashboard
-   one-tap Daily Hifz
-   session resume
-   flexible session size
-   time goals
-   Quick Test

## Pass F --- Progress

Build:

-   Mastery view
-   Hifz Health
-   progress map
-   statistics
-   activity history
-   heatmap

------------------------------------------------------------------------

# 53. Verification Plan

Every implementation pass should be verified with:

-   `npm run build`
-   SSR checks for `/hifz`
-   real browser interaction
-   localStorage/IndexedDB inspection where relevant
-   session interruption/resume
-   offline behavior where applicable

Do not rely only on synthetic DOM `.click()` tests for interactive
controls.

The existing project plan has already documented a real-browser testing
lesson around synthetic clicks versus actual pointer interaction; future
Hifz interaction verification should follow the same standard.

------------------------------------------------------------------------

# 54. Acceptance Criteria

The redesigned Hifz module is complete when a user can:

1.  Create a Surah + ayah memorization target.
2.  Set a daily new-ayah target.
3.  Set a daily time goal.
4.  Practice progressively.
5.  Listen and repeat ayahs.
6.  Practice until confident.
7.  Test without seeing the answer.
8.  Use progressive hints.
9.  Grade Again / Good / Easy.
10. Recover immediately from mistakes.
11. Track individual ayah weakness.
12. Track transition weakness.
13. Practice weak ayahs with one tap.
14. Practice weak transitions with one tap.
15. Start a Daily Hifz session with one tap.
16. Resume interrupted sessions.
17. Skip items temporarily.
18. Run a 2/5/10-minute Quick Test.
19. Select targets for Quick Test.
20. Run mixed test types.
21. Receive periodic full-range assessments.
22. See target-level mastery.
23. See coverage and strength.
24. See Hifz Health with understandable signals.
25. See factual session results.
26. See simple activity history.
27. See a practice heatmap.
28. Continue using Hifz without a backend.

------------------------------------------------------------------------

# 55. Final Product Definition

The redesigned Hifz module is not primarily a "memorized/not memorized"
tracker.

It is a **local-first adaptive Hifz practice engine**.

The user experience should feel like:

``` text
                     TODAY
                       │
             "23 items to practice"
                       │
              START TODAY'S HIFZ
                       │
              ┌────────┴────────┐
              │                 │
           PRACTICE             TEST
              │                 │
       Learn progressively      Recall
       Listen / Repeat          Hint
       Connect ayahs            Reveal
              │                 │
              └────────┬────────┘
                       │
                  PERFORMANCE
                       │
              ┌────────┴────────┐
              │                 │
             AYAH           TRANSITION
              │                 │
         Strong / Weak      Strong / Weak
              │                 │
              └────────┬────────┘
                       │
                   SCHEDULING
                       │
                  NEXT REVIEW
                       │
                     TODAY
```

The existing Hifz implementation provides the foundation: local plans,
SRS, review queue, Arabic/translation hiding, audio, looping, mistake
notes, grading, and persistence. This specification turns that
foundation into a complete memorization workflow while preserving the
project's existing local-first architecture and design philosophy.
