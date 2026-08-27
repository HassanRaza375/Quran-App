# Quran App — Module Blueprint (Rebuild Specification)

This document describes the app as a set of **independent, tech-agnostic modules**. Each module
lists its purpose, screens, data model, business rules/algorithms, and external dependencies —
enough to re-implement the same product on a different stack (native mobile, a different web
framework, a backend-backed version, etc.) without copying the current Nuxt/Vue code.

It complements, not replaces, the existing docs:
- `README.md` — current tech stack and quick reference
- `Quran_WebApp_Feature_Roadmap_and_Module_Specification.md` — original feature roadmap
- `Hifz_Module_Specification.md` — full design spec for Module 10 (Hifz), referenced not repeated here
- `prophets-quran-feature.md` — full design spec for Module 17 (Prophets & Qur'anic Persons), referenced not repeated here
- `PROJECT_PLAN.md` — build history

**Global architectural decisions** (apply to every module unless noted):
1. **Local-first, no backend.** All user data lives on-device. Every module owns one storage
   record, loaded on client mount and re-persisted after every mutation.
2. **Local-calendar-day date keys** (`YYYY-MM-DD` from `getFullYear/getMonth/getDate`), never
   UTC/`toISOString()` — avoids off-by-one-day bugs for users east of UTC.
3. **Reactive in-memory state + persisted snapshot.** Each module keeps state in memory (reactive
   store/state object) and mirrors it to persistent storage synchronously after each change —
   no debouncing, no background sync.
4. **Content vs. user-data separation.** Quran text/translations/tafsir/audio are immutable,
   fetched from external content APIs, and cached indefinitely (IndexedDB-equivalent + HTTP
   cache). User-generated data (bookmarks, goals, Hifz progress, settings) is small, structured,
   and stored separately (localStorage-equivalent / key-value store).
5. **Additive migrations.** When a module's schema changes, keep the old storage key, write a
   migration that reads it once, transforms it into the new shape, writes it under a new
   versioned key, and never deletes the source of truth for user data without a fallback.

---

## Module Index

| # | Module | Depends on |
|---|---|---|
| 1 | [Content Data Layer](#module-1--content-data-layer) | — |
| 2 | [Core Reading Experience](#module-2--core-reading-experience) | 1 |
| 3 | [Search](#module-3--search) | 1 |
| 4 | [Global Audio Player](#module-4--global-audio-player) | 1 |
| 5 | [Prayer Times & Qibla](#module-5--prayer-times--qibla) | — |
| 6 | [Islamic Calendar & Events](#module-6--islamic-calendar--events) | 5 |
| 7 | [Reminders](#module-7--reminders) | — |
| 8 | [Reading Goals / Khatmah](#module-8--reading-goals--khatmah) | 2 |
| 9 | [Bookmarks & Personal Library](#module-9--bookmarks--personal-library) | 1 |
| 10 | [Hifz (Memorization Engine)](#module-10--hifz-memorization-engine) | 1, 4 |
| 11 | [Ramadan Mode](#module-11--ramadan-mode) | 5, 8 |
| 12 | [Offline Downloads & PWA](#module-12--offline-downloads--pwa) | 1, 4 |
| 13 | [Ayah Sharing](#module-13--ayah-sharing) | 1 |
| 14 | [Utility Tools](#module-14--utility-tools-tasbeeh--asma-ul-husna--sajda-list) | 1, 9 |
| 15 | [Settings & Accessibility](#module-15--settings--accessibility) | all |
| 16 | [Account & Cloud Sync (future)](#module-16--account--cloud-sync-not-built) | all |
| 17 | [Prophets & Qur'anic Persons](#module-17--prophets--quranic-persons) | 1, 4, 9 |

---

## Module 1 — Content Data Layer

**Purpose:** Single source of truth for Quran text, translations, tafsir, per-page (mushaf)
images/text, Juz boundaries, Sajda list, chapter metadata, and reciter audio. Every reading
feature is a view over this layer.

### External APIs (swap for any Quran-content provider)
| Provider | Used for | Notes |
|---|---|---|
| `quranapi.pages.dev` | Chapter text (all editions), per-ayah translations, tafsir (3 Sunni sources), reciter audio lists | Treated as immutable — cache forever |
| `alquran.cloud` (`api.alquran.cloud/v1`) | Full-text search, per-page (mushaf) reads | **Must be called over HTTPS** — an HTTP call 301-redirects and the redirect response doesn't carry CORS headers, so browsers silently reject it |
| `api.aladhan.com` | Prayer times, Hijri calendar (used by Module 5/6) | — |

### Entities
- **Chapter**: `{ surahNo, surahName, surahNameArabic, surahNameTranslation, totalAyah, revelationType, ayahs: [{ ayahNo, arabic1, arabic2, translations: {en, ur, bn, ...}, audio: {reciterKey: {url, originalUrl}} }] }`
- **Tafsir**: keyed by `${surahNo}:${ayahNo}:${sourceId}` → `{ text (markdown-lite), source }`
- **Juz**: `{ juzNo, surahRanges: [{surahNo, startAyah, endAyah}] }`
- **Page (mushaf)**: `{ pageNo, ayahs: [...] }` sourced from the search-provider's page endpoint
- **Sajda**: static list of `{ surahNo, ayahNo, type: "recommended"|"obligatory" }`
- **Surah list**: static metadata array (name, translation, ayah count, revelation place) — ship
  as a bundled JSON asset, not a network call, since it never changes

### Caching strategy (reference implementation: IndexedDB `chapters` + `tafsirs` object stores)
- One object store per content type, keyed by natural id (`surahNo`, or a composite tafsir key).
- On read: check local cache → return if hit; else fetch from network → write to cache → return.
- Cache writes must be **best-effort and silently swallow failures** (quota exceeded, storage
  disabled in private browsing) — the network is always the fallback, so a cache failure must
  never break the read.
- Pair with an HTTP-level cache (service worker `CacheFirst`, or platform-native persistent HTTP
  cache) as a second fallback layer, with a ~1 year TTL and no revalidation (content is immutable).

### Rebuild notes
- Any local structured store works: SQLite, Realm, Core Data, IndexedDB, or even flat files.
- If moving to a backend-backed model, this whole layer can become a thin proxy/cache in front of
  the same or a different Quran API — the rest of the app should be unaffected as long as the
  `Chapter`/`Tafsir`/`Juz`/`Page` shapes are preserved.
- **SSR-specific gotcha (only relevant if server-rendering):** don't `await` anything before the
  first call into a request-scoped context/composable — crossing a microtask boundary before that
  call loses per-request context on some frameworks (Nuxt specifically). Gate any
  IndexedDB-equivalent access behind a client-only check for the same reason (server has no
  IndexedDB).

---

## Module 2 — Core Reading Experience

**Purpose:** The actual reading UI: Surah reader, Juz index/detail, per-page (mushaf) reader,
Surah listing, multi-translation display, inline tafsir, per-ayah bookmark/audio/share actions.

### Screens
- **Surah listing** — all 114 surahs, name/translation/ayah-count/revelation-place, search/filter,
  bookmark toggle per surah.
- **Surah reader** (`/surah/:id`) — full surah text; tabs for available translations
  (Arabic/Urdu/English/Bengali/alternate Arabic script); per-ayah: bookmark toggle, play audio,
  open tafsir panel (source picker across 3 tafsir sources), open translation panel, share.
  Continuous-scroll reading position is tracked (feeds Module 8).
- **Juz index** (`/juz`) — 30 Juz, each showing its surah/ayah range.
- **Juz detail** (`/juz/:id`) — reads through a Juz across surah boundaries.
- **Per-page / Mushaf reader** (`/per-page-read`) — traditional page-image-like reading, page
  navigation.
- **Surah audio listing** (`/surah-audios/:id`) — reciter picker for full-surah playback.

### Data flow
- Reader pages pull from Module 1 (cache-through fetch), never call the network directly for the
  same content twice.
- Bookmark/audio/share actions delegate to Modules 9, 4, 13 respectively — the reader itself owns
  no persistent state except reading position (Module 8 dependency: `recordAyahRead(surahNo,
  ayahNo)` fires as the user scrolls past each ayah).

### Business rules
- **Reciter audio URL is resolved by reciter *name*, not stored URL.** A reciter's audio URL is
  only valid for the surah it was fetched with; every playback call re-resolves the URL by
  matching the reciter's name against the *current* surah's own audio list. Never persist/reuse a
  raw audio URL across surahs.
- Translation/tafsir panels are lazy — fetched only when opened, then cached (Module 1).

### Rebuild notes
- This module is pure UI/orchestration; the interesting logic (progression tracking, bookmarking,
  audio resolution) lives in the modules it depends on. Keep it thin.

---

## Module 3 — Search

**Purpose:** Full-text search across Quran editions (Arabic text, tafsir sources, English/Urdu
translations), with scoping and history.

### Behavior
- Input: free-text query (min length 3 chars to avoid huge result sets), an edition id, an
  optional surah scope (`"all"` or a specific surah number).
- Query external search endpoint: `GET /search/{query}/{surahScope}/{editionId}`.
- **A 404 from the search API means "no matches," not an error** — must be handled as an empty
  result set, not surfaced as a failure.
- Cap displayed results (e.g. 60) even if the API returns more; show the true total count
  separately.
- In-memory query cache keyed by `query|scope|edition` avoids re-hitting the network for repeated
  searches within a session.
- Result rows normalize provider-specific fields into `{ surahNo, surahNameEnglish,
  surahNameArabic, ayahNo, text, editionName, deepLink }`.
- Editions offered: a curated list grouped by `english | urdu | arabic | tafsir` — not every
  edition the provider supports, just the ones with acceptable translation quality.

### Search History
- Separate small persisted list of recent queries (id, query text, timestamp), capped in length,
  most-recent-first, de-duplicated.

### Rebuild notes
- If the target platform doesn't have (or you don't want to depend on) a hosted search API,
  this module can be replaced with a local full-text index (e.g. SQLite FTS5) built from Module
  1's cached chapter text — same external contract (`search(query, edition, scope) → results[]`).

---

## Module 4 — Global Audio Player

**Purpose:** One playback engine shared across the entire app — surah/ayah recitation, Hifz
practice audio, resume-on-reload — so there is never more than one audio element and one "now
playing" state.

### State
```
nowPlaying: { type: "surah" | "ayah", surahNo, title, subtitle } | null
playing: boolean
progress: number (seconds)
duration: number (seconds)
playbackRate: number            // persisted preference
repeatOne: boolean              // persisted preference
autoAdvance: boolean            // persisted preference (auto-play next surah)
resumeInfo: { url, position, nowPlaying } | null   // persisted, restored on next app launch
```

### Behavior
- `play({ type, surahNo, title, subtitle }, url)` — the caller must always pass display metadata,
  not just a URL, because the mini-player is mounted once globally and has no other way to know
  what's playing.
- Persist `resumeInfo` whenever playback pauses; on next launch, offer to resume from the saved
  position/url.
- Integrate with the platform's media-session API (lock-screen / hardware media controls) where
  available.
- Repeat-one and auto-advance are player-level toggles, not per-surah settings.
- Playback speed, repeat, and auto-advance preferences persist independently of what's playing.

### Rebuild notes
- On mobile, prefer a genuine background-audio-capable player (e.g. platform media player /
  foreground service) so playback survives app backgrounding — the web version is
  foreground/backgrounded-tab-only by nature.
- Module 10 (Hifz) explicitly reuses this player rather than building a second one — preserve that
  relationship in any reimplementation; per-ayah repeat, range looping, and loop-count controls
  needed by Hifz should be capabilities of this module, not duplicated.

---

## Module 5 — Prayer Times & Qibla

**Purpose:** Daily prayer times, Qibla direction, and in-app (foreground-only) notification
scheduling, with a Sunni/Ja'fari calculation-method toggle.

### External API
`api.aladhan.com/v1/timings/{DD-MM-YYYY}?latitude=&longitude=&method=&school=&midnightMode=`

### Calculation methods (fiqh setting — a user preference, not a build-time identity)
| Fiqh | Params |
|---|---|
| `sunni` (default) | `method=2` (ISNA) |
| `jafari` | `method=0` (Shia Ithna-Ashari / Leva Institute, Qum), `school=0`, `midnightMode=1` |

### Location
- Request device geolocation; on denial/unavailability, fall back to a fixed default coordinate
  (this build defaults to Lahore, Pakistan — 31.5204, 74.3587) and flag `locationSource: "fallback"`
  in the UI so the user knows the times may be off for their real location.

### Qibla calculation (great-circle bearing to the Kaaba, 21.4225°N 39.8262°E)
```
y = sin(kaabaLng - lng)
x = cos(lat) * tan(kaabaLat) - sin(lat) * cos(kaabaLng - lng)
qiblaBearing = (atan2(y, x) * 180/π + 360) mod 360     // degrees from true north
```
Pair with the device compass/magnetometer for a live-rotating needle where available.

### Caching
- Cache the day's response under a key that includes lat/lng/fiqh/date, so switching fiqh or
  location invalidates the cache correctly and a stale method's result is never silently reused.
- Auto-refetch scheduled for a few seconds after the next prayer's time passes (not a polling
  loop) so the day rolls over correctly even in a long-lived session.

### Notifications (foreground/background-tab only — no server push in this build)
- Per-prayer enable toggles + a single "minutes before" reminder offset, stored as user settings.
- One timer scheduled per enabled prayer for its next occurrence (today if still upcoming, else
  tomorrow); after firing, reschedule the same prayer forward by 24h.
- Real "works fully closed" push requires a push-capable backend (VAPID keys / platform push
  service + a subscription store) — explicitly out of scope for the local-first build; flag this
  as a backend dependency if the rebuild wants full background push.

### Rebuild notes
- On native mobile, prefer the platform's local-notification scheduler over JS timers for
  reliability across app suspension.

---

## Module 6 — Islamic Calendar & Events

**Purpose:** Hijri calendar with month navigation and a curated Islamic-events dataset.

### Data
- Hijri date conversion comes from the same `api.aladhan.com` response used for prayer times
  (it returns both Gregorian and Hijri dates).
- A **static, bundled dataset** of Islamic events keyed by Hijri `{month, day}`, each tagged:
  - `category` (e.g. `major`, `shia-occasion`, …)
  - `tradition`: `"shared" | "sunni" | "jafari"` — filter/display by the user's fiqh setting
    (Module 5) rather than hard-coding one tradition as default.
  - Optional `dateNote` explaining tradition-specific observance differences.
- **Known, intentional gap:** contested Twelve-Imams martyrdom dates are excluded pending proper
  sourcing — don't silently "fill in" dates without a credible source when rebuilding; keep this
  gap explicit if you carry the dataset forward as-is.

### Rebuild notes
- Ship the events dataset as static structured data (JSON/asset), not a network call — it doesn't
  change at runtime and has no need for a backend.

---

## Module 7 — Reminders

**Purpose:** Simple personal calendar reminders (independent of Islamic events), optionally
yearly-recurring.

### Entity
```
Reminder { id, title, date (YYYY-MM-DD local), note, recurringYearly, done, createdAt }
```

### Behavior
- CRUD + `toggleDone`.
- Derived views: `upcoming` (not done, date ≥ today, sorted ascending) and `overdue` (not done,
  date < today, sorted ascending).
- No native scheduling in this build (unlike Module 5's prayer notifications) — reminders are
  surfaced passively in-app. If porting to native, wiring these into the platform's local
  notification scheduler is a natural extension, not a redesign.

---

## Module 8 — Reading Goals / Khatmah

**Purpose:** Personal Quran-completion planning: multiple goal types, streaks, and catch-up pacing
that adapts as the user falls behind or gets ahead.

### Entity
```
ReadingGoal {
  id, type: "finish-by-date"|"ayahs-per-day"|"pages-per-day"|"juz-per-week"|"custom",
  label, startDate (local key), targetDate (local key | null, only for finish-by-date),
  dailyAyahTarget: number,        // every goal type normalizes to an ayahs/day figure internally
  startAbsoluteAyah: number,      // absolute position in the whole Quran at creation time
  preferredDays: number[],        // 0=Sun..6=Sat — days the user actually intends to read
  status: "active"|"paused"|"completed"|"abandoned",
  createdAt
}
```
Plus a `dailyLog: Record<dateKey, string[]>` mapping each day to the set of unique ayah-keys
(`"surah:ayah"` or a synthetic `"manual:timestamp:n"` for manually-logged progress) read that day
— this is what streaks are computed from, independent of the goal's own pacing math.

### Normalizing goal types to a daily ayah target
```
finish-by-date : ceil(remainingAyahsFromStart / daysUntilTarget)
pages-per-day  : ceil(dailyAmount * AYAHS_PER_PAGE)
juz-per-week   : ceil(dailyAmount * AYAHS_PER_JUZ / 7)
ayahs-per-day / custom : max(1, round(dailyAmount))
```

### Streak
Count consecutive local-calendar days (walking backward from today) with at least one logged
ayah. Today doesn't need to already have an entry for the streak to still be "alive" — only
yesterday onward must be unbroken.

### Catch-up pacing (adjusted daily target)
```
daysSinceStart = count of the goal's preferredDays between startDate and today
expectedByNow  = dailyAyahTarget * daysSinceStart
deficit        = max(0, expectedByNow - readSinceStart)
if deficit == 0: adjustedDailyTarget = dailyAyahTarget
else:
  remainingDays = targetDate ? daysBetween(today, targetDate) : 7   // open-ended goals spread catch-up over a week
  adjustedDailyTarget = dailyAyahTarget + ceil(deficit / remainingDays)
isBehindPace = adjustedDailyTarget > dailyAyahTarget
```
Only count the goal's own `preferredDays` in `daysSinceStart` — don't penalize a user for not
reading on a day they never intended to. Do **not** floor `daysSinceStart` to a minimum of 1; a
goal created today has had zero elapsed days and must not immediately show as "behind."

### Projected finish date
`pace = readSinceStart / max(1, daysSinceStart-including-non-preferred-days)`; if pace > 0,
`daysToGo = ceil(remaining / pace)` from today.

### Recording progress
- `recordAyahRead(surahNo, ayahNo)` — called as the reader scrolls past each ayah; de-duplicates
  per day (an ayah re-read the same day doesn't double-count).
- `recordManualAyahs(count)` — manual fallback for offline/physical-mushaf reading; adds
  synthetic dated keys so it still counts toward the streak and pacing.
- Only one goal is "active" (primary) at a time; creating a new goal makes it the active one,
  but past/paused/completed goals remain queryable.

### Rebuild notes
- `AYAHS_PER_PAGE`, `AYAHS_PER_JUZ`, and `TOTAL_QURAN_AYAHS` are fixed constants derivable from
  the standard Mushaf layout — bundle them as static data (see Module 1's surah metadata), not a
  network call.
- Absolute ayah position (`getAbsoluteAyahPosition(surahNo, ayahNo)`) requires a running sum of
  ayah counts per surah — precompute once from Module 1's static surah list.

---

## Module 9 — Bookmarks & Personal Library

**Purpose:** A flat bookmarking primitive across every content type, plus an additive layer of
notes/tags/collections on top.

### Bookmarks (flat key set)
A single `Set<string>` of bookmark keys, namespaced by content type:
```
surah:{surahNo}         ayah:{surahNo}:{ayahNo}      name:{id} (Asma-ul-Husna)
sajda:{surahNo}:{ayahNo} juz:{juzNo}                  audio:{surahNo} (reciter-page bookmark)
page:{pageNo}
```
Plus a side-map `addedAt: Record<key, timestamp>` for "recently bookmarked" sorting — kept
separate from the key set itself so it can't regress the many call sites that only add/remove/
toggle. `has/add/remove/toggle` are the generic primitives; per-type helpers
(`isAyahBookmarked`, `toggleAyah`, …) are thin wrappers for call-site convenience.

### Library layer (notes/tags/collections — keyed by the *same* bookmark key strings)
```
LibraryCollection { id, name, description, createdAt }
LibraryItemMeta   { note: string, tags: string[], collectionIds: string[], updatedAt }
```
- Purely additive metadata on top of bookmark keys — deleting a bookmark elsewhere does **not**
  auto-delete its library metadata; callers must explicitly clean up both when a bookmark is
  removed if you want them to stay in sync.
- `createCollection`/`deleteCollection` — deleting a collection strips its id from every item's
  `collectionIds` rather than deleting the items.

### Rebuild notes
- Keep bookmarks and library metadata as two separate stores even in a rebuild — it lets
  "bookmark" stay a cheap, ubiquitous action (used from a dozen places) while notes/tags/folders
  stay an opt-in power-user layer.

---

## Module 10 — Hifz (Memorization Engine)

**Purpose:** A full local-first adaptive memorization practice system: ayah- and
transition-level spaced repetition, Practice vs. Test modes, six test types, progressive hints,
weak-item recovery, daily sessions with resume, Quick Test, full-range assessment, and
mastery/health reporting.

**This module has a complete standalone specification — see [`Hifz_Module_Specification.md`](./Hifz_Module_Specification.md)
for the full product design (principles, UX flows, acceptance criteria).** This section documents
the concrete data model and algorithms as actually implemented, for direct reuse in a rebuild.

### Core concept
A **Target** = Surah + ayah range (e.g. Al-Mulk 1–30) with a daily new-ayah pace and a daily time
goal. The system tracks memorization strength at two independent granularities:
- **per ayah** (can I recall this ayah on its own?)
- **per transition**, i.e. `ayah[n] → ayah[n+1]` (can I connect it to the one after it? — a real
  and distinct failure mode from knowing both ayahs individually)

### Data model
```
HifzTarget {
  id, surahNo, surahName, startAyah, endAyah,
  dailyNewTarget: number, dailyTimeGoalMinutes: number,
  status: "active"|"paused"|"completed",
  lastPosition: number,        // highest ayah introduced so far; startAyah-1 = nothing introduced yet
  lastAssessmentAt: dateKey|null, createdAt
}

HifzAyahState {                 // key = `${targetId}:${ayahNo}`
  targetId, ayahNo,
  strength: "not-started"|"learning"|"memorized"|"strong"|"weak",
  interval: number, ease: number,        // SM-2-lite scheduling state
  nextReviewAt: dateKey, reviewCount: number,
  historicalMistakes: number,            // NEVER decremented — permanent record
  recentResults: Grade[],                // rolling window, capped at last 5 — drives *current* weakness only
  hintsUsed: number, lastHintLevel: number, lastReviewedAt: dateKey|null
}

HifzTransitionState {           // key = `${targetId}:${fromAyah}`, toAyah = fromAyah + 1
  targetId, fromAyah, toAyah,
  strength: "not-started"|"learning"|"memorized"|"strong"|"weak",
  mistakes: number, recentResults: Grade[], lastReviewedAt: dateKey|null
}

HifzActivityDay { date, newAyahs, revisions, recoveredAyahs, recoveredTransitions, assessments }

HifzSessionState {
  id, kind: "daily"|"weak"|"quick-test"|"free-practice"|"assessment",
  targetIds: string[], items: SessionItem[], currentIndex: number,
  status: "in-progress"|"completed"|"abandoned",
  startedAt, completedAt, stats: { mistakes, hints }
}

SessionItem {
  id, type: "warmup"|"weak-ayah"|"weak-transition"|"revision"|"new"|"final-mixed"|"assessment",
  targetId, ayahNo?, fromAyah?, toAyah?,
  isNew?: boolean,              // true for progressive-practice-before-test items
  gradedTest: boolean,          // false for free-practice — grading it does NOT touch SRS
  testMode: "full"|"continue"|"previous"|"next"|"random"|"transition",
  result: Grade|"skipped"|null, hintLevel: number
}
```
`Grade = "again" | "good" | "easy"`.

### Strength classification (recomputed after every grade, never stored as a raw "flag")
```
computeAyahStrength(reviewCount, interval, recentResults):
  if reviewCount == 0: "learning"
  if count("again" in last 5 results) >= 2: "weak"
  if interval >= 21: "strong"
  if interval >= 3: "memorized"
  else: "learning"

computeTransitionStrength(recentResults):
  if recentResults empty: "not-started"
  if count("again" in last 5) >= 1: "weak"        // transitions are stricter — one recent miss is enough
  if recentResults.length >= 3: "strong"
  else: "memorized"
```

### SM-2-lite grading (ayah-level; applied on every graded test item)
```
on grade == "again":
  interval = 1
  ease = max(1.3, ease - 0.2)
  historicalMistakes += 1
on grade == "good":
  interval = max(1, round(interval * ease))
on grade == "easy":
  interval = max(1, round(interval * ease * 1.3))
  ease = min(2.8, ease + 0.1)
interval = min(interval, 180)                     // cap review spacing at ~6 months
nextReviewAt = today + interval days
recentResults = (recentResults + [grade]).slice(-5)
strength = computeAyahStrength(...)
```
Transitions record `recentResults`/`mistakes`/`strength` the same way but do **not** carry their
own interval/ease — they're binary connect-or-not signals, not independently scheduled.

### New-ayah introduction pressure ("Revision First" — retention over accumulation)
```
effectiveNewAyahBudget(dailyNewTarget, weakCount):
  if weakCount >= 3: 0                              // stop introducing new material entirely
  if weakCount >= 1: max(1, floor(dailyNewTarget / 2))  // halve the pace
  else: dailyNewTarget
newAyahBudgetToday(target) = min(effectiveNewAyahBudget(...), target.endAyah - target.lastPosition)
```
`introduceAyahs(targetId, count)` extends `lastPosition`, creates a fresh `HifzAyahState` per new
ayah, and links each to the previous one via a fresh `HifzTransitionState` — this is what
implements the spec's "progressive memorization" (practice 1, then 1→2, then 1→2→3, …).

### Session queue construction
All entry points build a `SessionItem[]` queue differently, then hand it to one shared runner
(grade/skip/advance/resume):
- **Daily session**: warm-up (one strong ayah per target, for confidence) → weak ayahs + weak
  transitions (highest priority) → due/overdue revision (round-robin across active targets so no
  single target starves another) → new ayahs (respecting the budget above) → a final mixed-mode
  re-test of a random sample (≤4) of everything already covered today, each in a random test mode.
- **Weak session**: just weak ayahs + weak transitions across selected targets.
- **Quick Test** (`minutes` budget): `budget = max(2, round(minutes*60 / 45sec-per-item))`. Pool =
  all weak items + all due/overdue + a shuffled fill of already-introduced ayahs in random-test
  mode; shuffle the whole pool and take `budget` items.
- **Free practice**: every ayah in a chosen range, `gradedTest: false` — never touches SRS.
- **Full-range assessment**: every ayah in `[startAyah, lastPosition]` in a random test mode, plus
  every transition between them — used to periodically re-validate a whole target, not just
  recently-touched items.

### Session lifecycle
`startSession` persists immediately (so a session survives a reload). `gradeCurrent(grade,
hintLevel)` grades the current item via `gradeAyah`/`gradeTransition` (skipped entirely if
`gradedTest: false`), records the result on the item, updates session-level `stats`, and advances.
`skipCurrent` marks the item `"skipped"` — **does not** touch SRS or weakness state, item remains
eligible for a future session. `advance()` past the last item auto-completes the session; on an
`assessment` session, completion also stamps `target.lastAssessmentAt`.

### Coverage / Mastery / Health (derived, not stored)
Compute per-target: coverage (`introduced / (endAyah-startAyah+1)`), counts by strength bucket,
weakest ayah, and a "Hifz Health" signal built from recent recall rate, mistake counts, hint
usage, and full-range assessment results — always shown with its contributing signals, never as
an opaque single number (explicit product principle — see spec §36–37).

### v1 → v2 migration (illustrative pattern for any future schema change)
The original shipped model tracked SRS at the *plan* level only (one interval/ease per whole
range). The v2 upgrade expands each legacy plan into a target plus one `HifzAyahState` per
already-introduced ayah (seeded from the plan's own interval/ease/reviewCount) and one
`HifzTransitionState` per adjacent pair — runs once, automatically, on first load if the new
storage key is empty but the legacy key has data.

### Rebuild notes
- Keep ayah-level and transition-level state **explicitly separate** even if you simplify
  everything else — it's the one modeling decision the whole spec is built around.
- The scheduler intentionally never exposes SRS internals (interval/ease/next-review) to the user
  — only strength buckets, weak lists, and one workload number ("23 items to practice"). Preserve
  that UX boundary in a rebuild even if the underlying algorithm differs.
- Reuses Module 4 (global audio player) rather than a dedicated Hifz player — don't duplicate
  playback/looping/speed logic here.

---

## Module 11 — Ramadan Mode

**Purpose:** A Ramadan-specific view layered on top of Modules 5 and 8: day counter with a
moon-sighting override, fasting tracker, and a Ramadan Khatmah goal.

### Entity
```
RamadanState {
  startOverride: dateKey | null,             // user's own "Ramadan actually started on..." date
  fastingLog: Record<dateKey, "fasted"|"missed"|"planned">
}
```

### Ramadan detection
- **Primary**: Hijri month == 9, from Module 5's prayer-times response (which already returns the
  Hijri date alongside timings).
- **Override**: if the user sets a local start date, treat it as authoritative for a **30-day
  window** from that date (the longer of the two possible lunar-month lengths, so it doesn't
  expire a day early on a 30-day Ramadan) — `isRamadanActive = overrideActive OR apiSaysRamadan`.
- `ramadanDay` = days since override start + 1 (if override active), else the API's own Hijri day.

### Estimated end date
Real month length (29 vs 30 days) isn't knowable in advance — assume 30 and label it
"estimated" everywhere it's surfaced. Used as the target date for the Ramadan Khatmah goal
(created via Module 8's `createGoal({ type: "finish-by-date", targetDate: estimatedEnd })`,
seeded from the user's current reading position).

### Fasting log
- `cycleFastingStatus(dateKey)`: unset → fasted → missed → unset (one-tap cycling through a day
  cell in a calendar grid).
- Derived: counts by status, and a "fasted" streak computed the same way as Module 8's reading
  streak (walk backward from today, today doesn't need to be logged yet to keep the streak alive).

### Other Ramadan content
- Suhoor/Imsak/Iftar times = Fajr/Imsak/Maghrib from Module 5's timings, just relabeled.
- Daily Dua/Ayah card and Laylat al-Qadr reminders: static/curated content, no new data model
  needed beyond "pick today's entry from a bundled list."

---

## Module 12 — Offline Downloads & PWA

**Purpose:** Explicit, user-controlled offline availability (distinct from opportunistic browsing
cache), plus installability.

### Entity
```
DownloadedSurah {
  surahNo, surahName, totalAyah, hasTafsir: boolean,
  reciterKey, reciterName, audioUrl,          // null if audio wasn't included in this download
  sizeBytesEstimate, downloadedAt
}
```
Manifest = `DownloadedSurah[]`, persisted separately from Module 1's opportunistic content cache.

### Behavior
- Downloading a surah: fetch + persist its chapter text into Module 1's cache, fetch tafsir for
  every ayah with bounded concurrency (this build uses 6 parallel requests) into the same cache,
  and — if audio was requested — fetch the audio file into a **dedicated** cache distinct from the
  service worker's own opportunistic audio cache, so "clear temporary cache" can wipe the
  opportunistic one without deleting something the user explicitly downloaded.
- Track `downloadingSurah` (current) and `{done, total}` progress for a progress UI; surface
  errors without losing already-completed items.
- Storage usage/quota: query the platform's storage-estimate API where available to show
  used/available space; treat it as best-effort display info, not a hard gate.
- `isDownloaded(surahNo)` gates UI (e.g. "Downloaded" badge, offline-availability checks elsewhere
  in the app).

### PWA / installability layer (parallel, not the same as the manifest above)
- Installable web app manifest (name, icons, theme color, standalone display, portrait
  orientation).
- Runtime HTTP cache: `CacheFirst` for the content API host and for audio file requests, 1-year
  TTL, capped entry counts (this build: 1000 API entries / 300 audio entries) — this is the
  *implicit* offline layer that benefits every visitor even without an explicit download, whereas
  the manifest above is the *explicit*, user-initiated one.
- Online/offline status: a simple reactive flag from the platform's connectivity events, surfaced
  as a persistent indicator so the user knows why something might be failing to load.

### Rebuild notes
- On native mobile, "download manager" maps naturally onto the platform's own background
  download/file-storage APIs; the manifest schema above still applies as the bookkeeping layer.

---

## Module 13 — Ayah Sharing

**Purpose:** Generate a shareable image card for a chosen ayah (Arabic + translation), with theme
customization, plus copy-text and native share.

### Theme model
```
AyahCardTheme {
  id, label,
  background: [colorStop1, colorStop2],   // gradient
  textColor, accentColor,
  pattern: "none"|"geometric"|"arch"|"stars"
}
```
8 curated presets shipped; a `"custom"` theme id lets the user override colors/pattern and,
separately, supply a custom photo background — the preset list is a starting point, not an
exhaustive enum.

### Rendering
- Client-side canvas (or platform-native image compositing) rendering: draw background
  gradient → optional low-opacity decorative pattern (must never compete visually with the text)
  → word-wrapped Arabic + translation text, respecting RTL for the Arabic block → export as an
  image.
- Text wrapping measures against the canvas's current font metrics and greedily packs words per
  line up to a max width — direction (RTL/LTR) only affects alignment, not the wrapping algorithm
  itself.
- Output actions: copy the ayah text (plain text, no image), download the generated image, or
  invoke the platform's native share sheet with the image attached.

### Rebuild notes
- Keep image generation entirely client-side — no server round-trip needed, and it keeps the
  no-backend property intact.

---

## Module 14 — Utility Tools (Tasbeeh, Asma-ul-Husna, Sajda list)

### Tasbeeh (dhikr counter)
```
TasbeehPreset { id, arabic, transliteration, meaning, color }   // static list, incl. a "custom" slot
TasbeehEntry  { count, target, cycles, lifetime }                // per preset id, persisted
```
- `increment`: `count++`, `lifetime++`; on reaching `target`, roll over (`cycles++`, `count = 0`)
  with a distinct haptic pattern from a normal tap (short buzz per count, longer pattern on cycle
  completion) — haptics are a nice-to-have enhancement, not load-bearing.
- `reset` zeroes `count` only (not `lifetime`/`cycles`); `setTarget` changes the goal and resets
  the current count.

### Asma-ul-Husna (99 Names)
- Static bundled list (Arabic, transliteration, meaning). Bookmarkable per-name via Module 9's
  `name:{id}` key namespace. No independent persisted state of its own.

### Sajda list
- Static list of the Quran's prostration verses (from Module 1), each linkable into the reader and
  bookmarkable via Module 9's `sajda:{surahNo}:{ayahNo}` namespace.

---

## Module 15 — Settings & Accessibility

**Purpose:** Cross-cutting user preferences: reading/audio defaults, accessibility toggles, data
management.

### Accessibility preferences
```
AccessibilityPrefs {
  reducedMotion: boolean, highContrast: boolean, largeTouchTargets: boolean,
  arabicFontScale: number   // 1 = default; scales the reader's Arabic text specifically
}
```
- Also respect the **OS-level** reduced-motion preference even if the user never touched the
  in-app toggle (`prefers-reduced-motion`-equivalent) — OR it with the explicit setting, don't let
  the explicit setting override an OS accessibility need to "false."
- **Apply preferences after first render, not before.** A server/initial render can't know the
  user's saved preference; applying it pre-hydration (web) or pre-first-paint causes a visible
  flash-then-correct rather than a mismatch — an intentional, accepted tradeoff, not a bug.

### Other settings
- Reading defaults (preferred translation edition(s), default reciter), audio defaults (default
  playback speed).
- **Data management**: export all local data (bundle every module's storage record into one
  downloadable file) and a full local-data clear/reset — since there's no account, this is the
  user's only backup/portability mechanism. Any rebuild should treat "export everything" and
  "wipe everything" as first-class, always-available actions, not buried settings.

---

## Module 16 — Account & Cloud Sync (not built)

**Status:** Explicitly deferred, not a bug. Documented here so a rebuild can decide deliberately
rather than by omission.

- An auth client may be installed/scaffolded but intentionally not wired into any UI.
- To build this for real: a real backend project, real credentials (not placeholders), and
  row-level-security-backed sync of every local module's storage record (bookmarks, goals, Hifz
  progress, settings, library) keyed by user id — each module's existing local schema is the
  natural shape for the corresponding sync table/collection.
- True background push notifications (Module 5) are a related, equally-deferred backend
  dependency: needs push credentials, a server-side subscription store, and a scheduler — separate
  from account sync but likely built alongside it.

---

## Module 17 — Prophets & Qur'anic Persons

**Purpose:** A "Qur'an study index" of prophets and other Qur'anic persons — browse/search/filter
a directory, then drill into a person's verified Direct Mentions (exact ayahs naming them) and
manually-curated Related Passages (their story context, even where the name isn't repeated), with
deep links back into Module 2's reader and reuse of Modules 4 (audio) and 9 (bookmarks).

**Full product spec:** [`prophets-quran-feature.md`](./prophets-quran-feature.md) (34 sections,
5 implementation phases). **Only Phase 1 (directory/search/filter) and Phase 2 (Qur'an
integration: Direct Mentions, Related Passages, reader/audio/tafsir/bookmark reuse) are built.**
Phase 3 (bookmark-a-person + resume study state, Family Tree, Related People, Scholarly/
Traditional Notes as a distinct UI) and Phase 4 (Prophetic Timeline) are **not implemented** —
the data schema already carries `relationships` so Phase 3 doesn't require a schema change, only
new UI.

### Seed dataset — explicitly not exhaustive
This ships with **9 curated persons** (Adam, Nuh, Ibrahim, Yusuf, Musa, Isa, Muhammad, Maryam,
Luqman), not the full 25-prophet-plus-others scope the spec envisions. Every `directMentions`
entry was cross-checked against a live Qur'an search API at authoring time (Arabic
`quran-simple` edition — the same content approach as Module 3), but each person's list is a
**representative subset**, not a claim of every occurrence of their name. A card's "N direct
mentions" count is accurate to its own curated array, not to the true total occurrence count in
the Qur'an — extending the dataset is expected before treating it as authoritative (per the
spec's own §27 "must be verified against the actual Qur'an content" rule, §64 note in the app's UI
links back to this caveat).

### Data model (`app/data/quranPersons.ts` in the reference implementation)
```
QuranPerson {
  id, name, arabicName, alternateNames?,
  primaryCategory: "prophet"|"woman"|"man"|"ruler_leader"|"companion"|"family_relative"|"other",
  secondaryCategories?: PrimaryCategory[],       // filtering matches primary OR secondary
  personType: "prophet"|"messenger"|"prophet_and_messenger"|"quranic_person"|"title_based_person",
  honorific?: { short?, arabic? },               // e.g. "AS"/"عليه السلام" — omitted for non-prophets
  shortDescription, detailedDescription?,
  themes?: string[],
  chronology?: { label?, order?, status: "strong"|"traditional"|"uncertain"|"unknown" },
  directMentions: QuranReference[],              // { surahNumber, ayahNumber } — exact name mentions only
  relatedPassages: RelatedPassage[],              // { id, surahNumber, ayahStart, ayahEnd, title?, description?, storyOrder?, source:"quran", verificationStatus:"verified" }
  relationships?: PersonRelationship[],           // { personId, relationshipType, sourceType, verificationStatus } — personId MAY point outside the seed dataset, see below
  keyLessons?: KeyLesson[],                       // { text, quranReferences, status:"quran_derived" }
  sources?: SourceReference[],                    // { type, citation, note? }
  statusNotes?: string[],
}
```
**Source-separation is the core discipline of this module**: `sourceType`/`verificationStatus`
fields exist on relationships, and `status`/`chronology.status` exist elsewhere, specifically so
the UI never presents a traditional/uncertain claim with the same visual weight as a direct
Qur'anic reference. Preserve this distinction in any rebuild — it's the spec's explicit product
principle (§34): **Person → Qur'anic references → Context → Lessons → Relationships →
Supplementary traditional information**, not biography-first.

**Relationships may reference a person id outside the current dataset** (e.g. this seed's Ibrahim
entry names "ismail"/"ishaq" as sons, and Musa names "harun" as a brother, none of which have
full profiles yet) — this is intentional (spec §14's own example does the same with "Lut"), not a
data bug. The dataset validator (below) deliberately does **not** flag this; the UI layer is
responsible for only linking a relationship chip when the target id actually resolves, and
rendering the rest as plain text.

### Pure logic (`app/utils/personsSearch.ts`, `app/utils/personsValidate.ts`)
Kept dependency-free (no Nuxt/Vue imports) specifically so they're unit-testable in isolation and
reusable if the UI layer is rebuilt on another stack:
- `searchPersons(persons, query)` — matches name/arabicName/alternateNames/description/themes/
  categories, case-insensitive and tashkeel-insensitive; an exact `"11:25"`-shaped query resolves
  to whichever person(s) have that reference in `directMentions` **or** inside a `relatedPassages`
  range, falling back to text search if nothing matches.
- `filterByCategory(persons, category)` — `"all"` passthrough, else primary-OR-secondary match.
- `groupDirectMentionsBySurah(person)` — Direct Mentions are always grouped/collapsed by Surah in
  the UI (spec §9), never rendered as one flat list.
- `groupRelatedPassagesBySurah(person)` / `sortRelatedPassagesForStoryView(person)` — the two
  Related Passages view modes (spec §11); Story View sorts by `storyOrder`, falling back to
  surah/ayah order for any passage missing one, so an incompletely-curated person still renders
  sensibly.
- `validatePerson`/`validateDataset` (personsValidate.ts) — checks every reference's
  surah/ayah against the **real** per-surah ayah counts (Module 1's surah list), catches
  duplicate direct mentions and inverted/out-of-bounds passage ranges, and duplicate person ids
  across the dataset. Run this against any dataset addition before shipping it — see
  `tests/personsDataset.test.ts` for the automated form of the same check.

### Audio integration (reuses Module 4, does not duplicate it)
"Play all passages" queues every ayah across a person's (or one passage's) ranges and drives them
through the *same* shared global audio player. This required one small, additive change to Module
4: an `endedAt` tick (`Date.now()` on every natural end-of-playback, distinct from a user pause)
that a caller can `watch()` to advance its own queue — a generalization of the pattern Module 4
already used internally for surah-to-surah auto-advance, not a parallel playback system.

### Reuse boundaries (per spec §10/§12/§17 "do not build a second X")
- Arabic/translation text and per-ayah audio come from Module 1/2's existing chapter-fetch and
  per-ayah audio resolution (by reciter *name*, same caveat as Module 2) — never hardcoded.
- Tafsir panel reuses Module 1's `useTafsir` cache-through fetch.
- Ayah-level bookmarking on every reference card reuses Module 9's `ayah:{surahNo}:{ayahNo}` key
  directly — no person-feature-specific bookmark storage.
- "Read in Quran" / "Read Passage" deep-link to Module 2's reader as `/surah/{surahNo}#ayah-{n}`,
  the same anchor convention Module 3 (Search) already uses.

### Not yet built (tracked here so a rebuild doesn't have to rediscover the gap)
- **Person-level bookmarking + resume study state** (spec §17) — the natural extension is Module
  9's bookmark key namespace (`person:{id}`) plus a small additive per-person "last viewed
  section" record, following the same `useState`+`$storage` shape as every other module; not
  wired up yet.
- **Family Tree visualization / Related People UI** (spec §14) — `relationships` data exists;
  no rendering yet.
- **Scholarly/Traditional Notes as a distinct UI section** — `sources`/`statusNotes` are rendered
  today as a single flat "Sources & Notes" block on the detail page, not the richer structure the
  spec envisions.
- **Prophetic Timeline** (spec §15) — not built; the "Browse People / Timeline" view toggle on the
  landing page is intentionally omitted rather than shipping a dead button.

### Rebuild notes
- Treat the dataset (`quranPersons.ts`-equivalent) as content, not code — in a rebuild, prefer
  storing it as versioned structured data (JSON/CMS-backed) so it can grow past the seed 9 without
  a code change, and so the verification workflow (spec §28) can run against it independently of
  app releases.
- The exact-reference search behavior (`"11:25"` typed into the search box) is a small but
  high-value detail from spec §16 — don't drop it when reimplementing search.

---

## Cross-Module Conventions Checklist (apply when rebuilding any module)

- [ ] One storage record per module, versioned key (`namespace:module:v{n}`).
- [ ] `load()` on client/app start, `persist()` synchronously after every mutation — no debounced
      or batched writes for user data (it's small; correctness beats micro-optimization here).
- [ ] Date keys are **local calendar days**, computed from local `year/month/day`, never a UTC
      timestamp slice.
- [ ] Additive migrations: read the old key once, write the new shape, keep old data readable as a
      fallback until the migration has clearly succeeded.
- [ ] Historical/audit counters (e.g. Hifz's `historicalMistakes`) are never decremented; "current"
      state is always a *separate*, independently computed field.
- [ ] Any module that reads external content should hit Module 1's cache first, network second,
      and never assume network availability.
