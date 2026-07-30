# Quran App — Project Plan

_Living document, updated after each work pass. Last updated: 2026-07-30 (Pass 2)._

This document is the working plan for turning the app into an installable PWA, fixing first-load
performance, shipping a real Tasbeeh (dhikr counter) module, completing the Continue Reading /
Ayah of the Day features, and cleaning up bugs/design debt found during the audit.

**Status:** Pass 1 (PWA, perf, Tasbeeh) ✅ shipped. Pass 2 (Continue Reading, Ayah of the Day
refresh, wider bug sweep, Bookmarks completion) ✅ shipped — see §4. Pass 3 (prayer notification
scheduling) ✅ shipped — see §5. Pass 4 (Arabic + Urdu text on saved ayah bookmarks) ✅ shipped —
see §6. Pass 5 (PWA installability was actually broken since Pass 1 — fixed) ✅ shipped — see §7.

---

## 1. PM Audit — What's already built

**Stack:** Nuxt 4, Vuetify 3 (manually registered, not tree-shaken), Pinia, Supabase client (auth,
not yet wired into UI), `@vite-pwa/nuxt` (installed but **not configured**), `@nuxt/image`,
`@vercel/analytics`.

**Working features:**
- Home dashboard: prayer times, countdown, Ramadan panel, Ayah of the Day, "continue reading" (now wired to real progress — see §4).
- Surah reader (`/surah/[id]`) with multi-translation tabs, per-ayah bookmarking, per-ayah audio, full-surah audio player with reciter picker.
- Surah listing, Juz index/detail, per-page read, search, Asma-ul-Husna, Sajda, bookmarks, calendar, prayer times, qibla direction, settings, about.
- Bookmarks composable with a generic key scheme (surah/ayah/name/sajda) backed by localStorage.
- Light/dark theme with system-preference sync.

**Gaps found:**
- ~~**PWA:** dependency present, zero config...~~ ✅ resolved in Pass 1.
- ~~**Tasbeeh module:** placeholder page, no logic, not linked from navigation...~~ ✅ resolved in Pass 1.
- **First load performance:**
  - Vuetify is imported in full (`import * as components/directives from "vuetify/components|directives"`) — every component in the library ships in the initial bundle regardless of usage.
  - `LayoutNavigationDrawer` (mounted on every page via the default layout) statically imports the 171 KB `surah.json` through `useSurahs()` just to build the "Audio" submenu, so that payload is parsed on first load of every page even if the drawer is never opened.
  - `LayoutAppBar` sets a random Unsplash photo as its background **on every page**, computed identically at module scope for SSR and client — this is both a perf hit (uncached hit to an external image host on every load, no `width`/quality params) and a hydration-mismatch bug (SSR and client `Math.random()` pick different images).
- **Dead / duplicate code:**
  - `app/utils/api.ts` (`useApi`) duplicates `app/plugins/api.js` (`$api`/`$api2`) — unused anywhere, only the plugin is actually consumed.
  - `app/app.config.ts` still has the `nuxi init` boilerplate ("Hello Nuxt", red primary) — nothing reads `useAppConfig()`, and it doesn't match the real Vuetify theme defined in `plugins/vuetify.js`, which is confusing for anyone touching theming later.
- **Incomplete feature, documented but not built out further:** Settings' "Enable Prayer Notifications" only requests permission and stores a flag — no actual scheduling/service-worker push exists. Left as-is (out of scope for this pass) but noted so it isn't mistaken for working.

---

## 2. Designer notes

The app already has a clear visual identity on the Home page: teal/deep-blue gradient cards,
`rounded="xl"`, glassmorphism (`backdrop-filter: blur`), gradient text accents, Amiri Quran for
Arabic, Sansation for UI. That system just isn't applied consistently yet.

Changes made in this pass:
- **App bar:** dropped the random remote photo (perf + hydration bug) for a themed gradient
  matching the rest of the app (`teal-darken-4` → deep blue), so it's consistent, deterministic,
  and free of an external network dependency on every page.
- **Tasbeeh module:** built using the same visual language as Home (gradient hero, glass stat
  cards, rounded-xl, big touch targets) so it doesn't feel like a bolted-on page — circular
  progress ring for the count, large tap area (44px+ touch target, thumb-reachable), haptic
  feedback on supported devices.
- **Theme config cleanup:** `app.config.ts` now mirrors the real teal palette instead of the
  leftover scaffold red, so future dark/light work has one source of truth to look at instead of two disagreeing ones.

Not in scope for this pass (flagged for a follow-up design pass): calendar, qibla-direction, sajda
and per-page-read screens still use default Vuetify styling and weren't touched, to keep this
change focused and reviewable.

---

## 3. Developer plan

1. **PWA** — configure `@vite-pwa/nuxt` in `nuxt.config.ts`: web app manifest (name, icons incl.
   maskable, theme/background color, standalone display), `registerType: autoUpdate`, Workbox
   runtime caching (`StaleWhileRevalidate` for the Quran API JSON, `CacheFirst` for reciter audio
   with an expiration cap), auto-injected register script.
2. **Perf:**
   - Add `vite-plugin-vuetify` for component/directive tree-shaking (drop the manual `import *`
     registration in `plugins/vuetify.js`).
   - Code-split `surah.json` in `useSurahs()`/nav drawer via dynamic `import()` instead of a
     static top-level import.
   - Fix `LayoutAppBar` (remove random remote image / hydration mismatch).
3. **Tasbeeh module** (`useTasbeeh` composable + `tasbeeh/index.vue` + `tasbeeh/[id].vue`):
   preset dhikr list (SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah, Astaghfirullah)
   + custom counter, target cycles (33/99/100/∞), persisted counts/history via the existing
   `$storage` plugin, vibration feedback, reset with confirmation, and a link added to the nav
   drawer (currently missing entirely).
4. **Bug/dead-code cleanup:** remove `app/utils/api.ts`, align `app.config.ts` theme.
5. **Verify:** `npm run dev`, exercise the Tasbeeh flow and PWA installability in-browser.

---

## 4. Pass 2 — Continue Reading, Ayah of the Day, and a wider bug sweep

A second Explore pass was run across every remaining page (`juz`, `per-page-read`, `calender`,
`sajda`, `qibla-direction`, `prayerTime`, `search`, `bookmarks`, `asma-ul-husna`, `about`,
`surah-audios`, `surah-vedios`, plus the Supabase auth plugin) to find anything else stubbed or
broken, so it could be fixed in the same pass instead of trickling in one request at a time.

### 4.1 Continue Reading — ✅ shipped
Was fully hardcoded on Home ("Surah Al-Baqarah", "Ayah 153", "45%") — not connected to anything.
- New `useReadingProgress` composable: tracks `{ surahNo, ayahNo, surahName, totalAyah }`,
  persisted via the existing `$storage` plugin, plus an overall **% of the Quran completed**
  computed from cumulative ayah counts (`surah.json`, lazily imported so it doesn't bloat the
  bundle — same technique used for the nav drawer in Pass 1).
- `surah/[id].vue` now records progress: immediately on opening a surah (ayah 1), then keeps it
  updated as the reader scrolls (debounced scroll listener finds the last ayah past the
  35%-viewport line).
- Home's Resume card now reads real data, shows a "Start Reading" empty state for first-time
  users (defaults to Al-Fatihah), and its button deep-links to `/surah/{n}#ayah-{n}`.

### 4.2 Ayah of the Day refresh — ✅ shipped, was a real bug
`fetchAyahOfTheDay()` always checked "is there a cached ayah for today?" **before** deciding
whether to fetch — so the refresh button in `ayah-of-day.vue` called the exact same function with
no way to bypass the cache, meaning **refresh never did anything** if you'd already loaded the
page once that day. Fixed by giving the composable a `force` param (`fetchAyahOfTheDay(true)` on
refresh) that skips the cache read, fetches a new random ayah, and overwrites today's cached one.
Also switched it off a hardcoded `$fetch(https://quranapi.pages.dev/...)` and raw `localStorage`
onto the app's existing `$api` plugin and `$storage` plugin, matching every other service/composable.

### 4.3 Other bugs — ✅ shipped
- `calender.vue`: the dead `loading` ref (set `false` at the *start* of the fetch, and never
  actually read anywhere in the template — the skeleton correctly gated on `calendarDays.length`
  already) has been removed; the geolocation-polling `setInterval` is now stored and cleared on
  unmount instead of leaking if you navigate away before it resolves.
- `juz/[id].vue`: the "Surah Marker" was rendering `Object.keys(data.surahs)` as a raw
  comma-joined array dump; now formatted as `"Al-Fatihah · Al-Baqarah"` (verified in-browser for
  Juz 1, which spans both). Removed a leftover `console.log`.
- `surah-audios/[id].vue`: the page fetched the surah header and its reciter list as two separate
  hardcoded `$fetch` calls; switched to the existing `useChapters()`/`getChapter()` composable
  (one request instead of two, no more hardcoded API URL). The dead `toggle()` function is now
  wired to a real pause/play button next to the "Now Playing" indicator in the header, so you can
  stop playback without hunting for whichever reciter card is currently active among a long list.
- `prayerTime.vue`: re-enabled the "(Next)" text label next to the highlighted prayer — colour
  alone wasn't an accessible way to convey it.

### 4.4 Bookmarks — ✅ shipped
`bookmarks.vue` had Surah/Ayah working, but the Audios/Sajdas/Pages/Juz tabs literally rendered
*"...bookmarks will appear here once you implement them."* to end users. Now:
- `useBookmarks` extended with `juz`, `audio` (per-surah reciter page), and `page` (mushaf page)
  key types (`sajda` already existed but had no UI calling it).
- Added a bookmark toggle button to `sajda.vue` (per verse), `juz/index.vue` (per juz chip),
  `surah-audios/[id].vue` (in the header, next to the surah name), and `per-page-read.vue` (next
  to Prev/Next).
- `per-page-read.vue` now also accepts `?page=N` in the URL to jump straight to a page — needed so
  a saved page bookmark's "Open" button actually lands on the right page instead of always page 1.
- All four tabs in `bookmarks.vue` now render real, persisted, removable lists instead of the
  placeholder string.
- **Bonus bug found while wiring this up:** `bookmarks.vue` called `useSurahs().getAll` to resolve
  surah names for display — but `useSurahs()` has never exported a `getAll` method (it only
  exposes `surahs`/`rawSurahs`/`search`/`setSort`/`selectedSort`). That call was silently failing
  inside `useAsyncData` on every visit to the page, so every bookmark card fell back to showing
  "Surah 2" instead of the real Arabic/translated name. Fixed by reading `rawSurahs` directly
  (already synchronously available, no async fetch needed for local JSON).

All new/changed routes verified via `npm run build` (clean) and `npm run dev` (every touched route
returns 200, no hydration warnings, no console errors): `/`, `/surah/1`, `/bookmarks`, `/sajda`,
`/juz`, `/juz/1`, `/surah-audios/1`, `/per-page-read`, `/per-page-read?page=5`, `/tasbeeh`,
`/tasbeeh/subhanallah`, `/calender`, `/prayerTime`.

### 4.5 Explicitly not touched (documented, not fixed)
- **Supabase auth** (`plugins/supabase.client.ts` is fully commented out, `useAuth.ts` will throw
  if called): nothing in the UI currently calls `useAuth()`, so this is a dormant subsystem, not a
  user-facing bug. Wiring it up for real needs actual Supabase credentials, a login/signup UI, and
  a security pass — out of scope here.
- **`surah-vedios.vue`** ("Coming Soon" placeholder): honestly labeled, not deceptive, and there's
  no video data source/API to back it yet — left as-is rather than fabricating content.
- ~~**Settings → prayer notifications**: still only requests permission and stores a flag...~~
  ✅ resolved in Pass 3, see §5.

---

## 5. Pass 3 — Prayer notification scheduling

Turned out `stores/prayer.js` already had *some* notification logic (not "nothing exists" as
Pass 1 assumed) — it fired `registration.showNotification()` when a 1-second countdown poll hit
zero. The real question was scope: should this go further into true background push (works with
the app fully closed), which needs a server, a subscriber database, VAPID keys, and a scheduled
job to trigger sends — real infrastructure this project doesn't have yet (Supabase is installed
but disabled/uncredentialed, no cron is configured). Asked the user; the call was to make the
existing in-app path solid rather than stand up a push backend right now.

**Shipped:**
- Replaced the 1-second `setInterval` poll that decided whether to fire a notification with
  precise per-prayer `setTimeout`s (`scheduleNotifications()` in `stores/prayer.js`). Every
  enabled prayer gets its own timer for its next occurrence (today if still upcoming, tomorrow if
  already passed), and each timer reschedules itself forward after firing — so the whole day's
  notifications are queued up front instead of only ever tracking a single "next prayer".
- Fixed the notification text: with a reminder offset set (e.g. "10 minutes before"), it used to
  say *"It's time for Fajr prayer"* at a moment that wasn't actually Fajr time — now says *"Fajr
  begins in 10 minutes."*
- **Real bug found in the process:** the cache key / API date used for the daily prayer-times
  refetch was computed **once** when the store was created (`const today = ...`) and never
  updated. Since it's a Pinia store that lives for the whole SPA session, any session left open
  past midnight would keep re-fetching (or worse, re-using a stale cache for) *yesterday's* prayer
  times forever, silently breaking both the displayed times and any notification scheduled off
  them. Changed `today` from a frozen constant to a function that reads the real date on every call.
- `settings.vue` now actually calls `prayer.refreshNotificationSchedule()` whenever the
  enable-toggle, per-prayer toggles, or reminder offset change (previously these only wrote to
  `localStorage`, the schedule wouldn't pick up the change until state happened to be
  recomputed elsewhere) — and after permission is freshly granted.
- Added a "Send Test Notification" button and an inline note in Settings clarifying the real
  constraint: *"Notifications fire while the app is open (foreground or a background tab) — they
  won't arrive if the app or browser is fully closed."* — stated plainly instead of implying it's
  a full background-push feature.
- Removed `app/utils/canNotify.js`, an unused duplicate of the (now-removed) permission-check
  logic that lived only in the store.

Verified via `npm run build` (clean) and `npm run dev` (`/`, `/settings`, `/prayerTime`,
`/calender` all 200, no hydration warnings, no console errors).

**Still not built (would need real infrastructure, flagged for later):** true background push —
notifications while the app/browser is fully closed. Needs VAPID keys, a server endpoint to store
each user's push subscription + location, and a scheduled job (Vercel Cron or similar) to send at
the right minute. Revisit once there's a data store and cron actually provisioned.

---

## 6. Pass 4 — Arabic + Urdu text on saved ayah bookmarks

Ayah bookmarks (`bookmarks.vue`, Ayahs tab) only ever stored/showed a key (`ayah:surahNo:ayahNo`)
resolved to a title like *"Al-Baqarah • Ayah 255"* — no verse content, so you couldn't tell what
you'd actually bookmarked without opening it.

**Shipped:** each ayah bookmark card now fetches and displays the verse's Arabic text and Urdu
translation (via the existing `useVerse()`/`VerseService` composable — same `/api/{surah}/{ayah}.json`
endpoint already used elsewhere, confirmed it returns `arabic1` and `urdu` fields). Fetched lazily
per-card into a local cache (`verseTexts`) keyed by `surahNo:ayahNo` when the Ayahs tab's bookmark
list changes, with a skeleton shown while loading. Text is right-to-left styled for both fields
(Urdu uses Arabic script, so it needs `direction: rtl` too, not just the Arabic verse).

Deliberately kept as a fetch-on-view rather than storing the verse text in the bookmark itself —
`useBookmarks` stores bookmarks as plain keys with no metadata for any type, and duplicating verse
text into local storage would only save a network round-trip that Pass 1's PWA runtime caching
(`StaleWhileRevalidate` on `quranapi.pages.dev`) already makes cheap after the first view.

Verified via `npm run build` (clean), `npm run dev` (`/bookmarks`, `/surah/2` both 200, no console
errors), and a direct check of the quranapi endpoint confirming the `arabic1`/`urdu` field shape.

---

## 7. Pass 5 — The PWA from Pass 1 wasn't actually installable

Asked to confirm the PWA setup was real, so it got checked properly this time instead of taking
the Pass-1 config at face value. First attempt used `curl`/headless-Chrome-dump-dom against
`http://localhost:3000` and found **no `<link rel="manifest">` anywhere** — worrying, since Pass 1
had confirmed `manifest.webmanifest` and `sw.js` were being generated and served. (First check was
also briefly confused by a leftover dev-mode server still bound to `[::1]:3000` from an earlier
session — Windows resolves `localhost` to `::1` first, so `curl localhost:3000` was silently
hitting the stale dev process, which has PWA disabled by design via `devOptions.enabled: false`.
Killed it and confirmed the same result against the real rebuilt production server.)

**Root cause:** `@vite-pwa/nuxt` does not auto-inject the manifest `<link>` tag. It ships a
`<VitePwaManifest />` component that has to be placed somewhere in the app (typically `app.vue`)
— its whole job is calling `useHead()` to add that link. Pass 1 wrote the `pwa: {...}` config in
`nuxt.config.ts` but never added the component, so the manifest was generated and servable but
literally undiscoverable by a browser. Fixed by adding `<VitePwaManifest />` to `app.vue`.

**What was and wasn't actually broken**, confirmed with a real headless-Chrome session (Puppeteer
driving the installed Chrome) rather than static HTML inspection, since service worker
registration is a JS side effect with no DOM footprint `curl`/`--dump-dom` could ever see:
- Manifest link: broken → now `/manifest.webmanifest`, present after the fix.
- Service worker: was actually fine already — confirmed active and controlling the page even
  before this fix (`navigator.serviceWorker.controller` set, registration active). Pass 1's
  Workbox/SW setup itself was correct; only the manifest discovery was missing.
- After the fix, Chrome's own `beforeinstallprompt` event fires on load (intercepted on purpose,
  since `pwa.client.installPrompt: true` defers it for a custom install button rather than the
  native mini-infobar) — that event only fires when Chrome's installability criteria are actually
  met, which is the real confirmation this is now a genuinely installable PWA, not just "files
  exist on disk."

Lighthouse was tried first but Lighthouse 12.x dropped the scored PWA category entirely, so it
produced nothing usable here — verification had to be done directly against the manifest/service
worker APIs instead.

Verified via `npm run build` (clean) + a full production `node .output/server/index.mjs` session
driven by Puppeteer/Chrome, checking `document.querySelector('link[rel="manifest"]')`,
`navigator.serviceWorker.getRegistrations()`, and `navigator.serviceWorker.controller` directly —
not just that the files 200'd. Puppeteer was installed with `--no-save` for this check only and
removed afterward; no dependency changes were left behind.
