Quran Web App New Feature Roadmap & Detailed Module Specification

Product / UX / Engineering planning document Prepared from the current
project audit plus current API/platform documentation.

1.  Executive Summary

The current app already has a strong Quran-reading foundation: prayer
times, countdowns, Ramadan information, Ayah of the Day, Continue
Reading, Surah/Juz reading, translations, audio, bookmarks, search,
Asma-ul-Husna, Sajda, calendar, Qibla, settings, PWA support, Tasbeeh,
per-ayah Tafsir, and persistent Quran caching.

The next stage should turn the app from a collection of useful tools
into a personalized daily Quran companion. The highest-value additions
are account sync, a richer reading/goal system, smarter prayer and
notification workflows, offline/download management, notes and
collections, a stronger Ramadan/Khatmah experience, better
discovery/search, and a dashboard that answers one question immediately:
"What should I do next?"

The recommendation in this document is to keep the homepage
intentionally focused. It should not become a page containing every
feature. The homepage should surface the user's next prayer, reading
continuation, daily goal, Ayah of the Day, and one or two contextual
actions such as Tasbeeh or a Ramadan/Khatmah card.

2.  Current Product Baseline

The uploaded project plan reports the following current state as of Pass
10.

Source baseline: the uploaded project plan documents the current stack,
shipped features, gaps and Pass 1--10 work. See the source file lines
describing the audit and shipped modules: project plan excerpt

3.  Recommended Feature Priorities

4.  Detailed Module Specifications

4.1 Account, Profile & Cloud Sync

Priority: P0

Purpose. Give users an optional account so reading progress, bookmarks,
notes, settings and goals can move between devices. Keep the app usable
without an account; local-first behavior should remain the default.

What should be in the module.

Email/password plus passwordless/magic-link; optionally Google/Apple
later.

Profile: display name, avatar, preferred language, preferred
translation, prayer Fiqh, calculation method, location mode, timezone.

Sync settings: what is synced (bookmarks, notes, progress, goals,
Tasbeeh history, preferences).

Conflict resolution screen for rare cases where local and cloud data
diverge.

Export/delete account controls.

User behavior / flows.

Anonymous user continues to use localStorage/IndexedDB without login.

When a user signs in, local data is merged into the cloud without
silently deleting either side.

Changes made on one device eventually appear on another.

Sign-out stops cloud writes and leaves a clear local-data policy.

Data and technical model.

Supabase Auth for identity and sessions.

Postgres tables with Row Level Security for user-owned records.

Sync timestamps/version numbers on mutable records.

Do not store precise location unless the user explicitly enables a
feature that needs it.

Dashboard homepage treatment. Dashboard card changes from "Sign in to
sync" to "Synced" with last sync time. If sync fails, show a
non-blocking warning and retry option.

Acceptance criteria.

A new user can use the app without authentication.

A signed-in user sees the same bookmarks/progress on a second device.

RLS prevents one user from reading another user's records.

No destructive merge happens without explicit conflict rules.

4.2 Reading Goals & Khatmah Planner

Priority: P0

Purpose. Turn Quran reading into an intentional plan: daily pages/ayahs,
target completion date, streak, and current pace.

What should be in the module.

Goal types: finish Quran by date, pages/day, ayahs/day, Juz/week, custom
target.

Khatmah creation wizard: start date, target date, reading unit,
preferred days.

Daily target and remaining target.

Catch-up calculation when the user falls behind.

Streak counter and completion history.

Pause/resume goal without losing history.

Multiple goals, but only one promoted as the primary homepage goal.

User behavior / flows.

Opening a Surah updates reading progress.

Marking a session complete should use actual reading progress where
possible, not only a manual checkbox.

The system recalculates remaining daily target after missed days.

A goal can be shared as a simple progress image/link later.

Data and technical model.

Goal record: id, user_id, type, start_date, target_date, unit,
target_amount, status.

Reading session record: date, surah, start_ayah, end_ayah, duration,
source.

Computed metrics: completion %, current pace, required pace, projected
finish date.

Dashboard homepage treatment. Progress ring + "12 / 20 ayahs today".
Secondary text: "On pace to finish Aug 30" or "2 days behind --- +6
pages/day to recover." Do not put a giant calendar on the homepage; link
to the detailed planner.

Acceptance criteria.

Creating a goal takes under 60 seconds.

Progress updates from normal reading.

Missed days produce an understandable catch-up target.

Goal completion is persisted and can be reviewed later.

4.3 True Background Prayer Push

Priority: P0

Purpose. Upgrade the current in-app scheduling into real web push
notifications that can arrive when the browser/app is closed, subject to
browser/platform support.

What should be in the module.

Push permission state: unsupported, not asked, denied, subscribed.

Per-prayer toggles for Fajr, Dhuhr, Asr, Maghrib, Isha.

Reminder offset: at prayer time, 5/10/15/30 minutes before.

Optional sunrise/Imsak/Suhoor/Iftar reminders.

Test notification.

Quiet hours / notification schedule.

Deep link from notification to prayer page.

User behavior / flows.

Client requests notification permission only after a clear user action.

Client registers Push subscription and sends subscription details to the
backend.

Server scheduler determines which subscriptions should receive a
notification.

Service worker displays the notification and handles notification
clicks.

Expired/invalid subscriptions are removed automatically.

Data and technical model.

Push subscription table keyed by user/device.

VAPID public/private keys stored as server secrets.

Scheduled job/cron to send notifications at the correct local time.

Prayer schedule cache keyed by date, location, Fiqh and calculation
method.

Dashboard homepage treatment. Do not expose technical push details on
the homepage. Show only a compact "Prayer reminders on/off" state in the
quick settings area if useful.

Acceptance criteria.

Notifications can arrive with the app fully closed on supported
platforms.

Each notification contains the correct prayer name and timing.

Changing Fiqh/location immediately affects future scheduled
notifications.

Denied permission is handled gracefully without repeated prompts.

4.4 Personal Notes, Collections & Study Library

Priority: P1

Purpose. Upgrade bookmarks from simple saved locations into a personal
Quran study library.

What should be in the module.

Collections/folders: e.g. Dua, Patience, Family, Ramadan, Study.

Bookmark with optional note.

Tags.

Private vs shareable collection flag.

Search within saved items.

Sort by recent, Surah, tag or collection.

Rich preview showing Arabic, translation, Tafsir source and note.

User behavior / flows.

Save from Surah reader, Tafsir, search results and Juz/page views.

A bookmark can belong to multiple collections.

Notes autosave with explicit save state.

Delete requires confirmation; archive can be used for soft-delete if
desired.

Data and technical model.

Tables: bookmarks, collections, collection_items, notes, tags.

Bookmark IDs should remain stable so sync can reconcile changes.

Use server-side timestamps and soft-delete tombstones for sync.

Dashboard homepage treatment. Homepage should not become a library
browser. Show only "3 saved items recently" with a View All action.

Acceptance criteria.

Users can find a saved ayah without remembering its Surah.

A bookmark can carry personal context.

Collections sync across devices.

4.5 Offline & Download Manager

Priority: P1

Purpose. Make the PWA visibly useful offline instead of hiding caching
behind implementation details.

What should be in the module.

Offline status indicator.

Storage usage meter.

Downloaded/cached Surahs list.

Download Surah for offline reading.

Optional download of selected translations and Tafsir.

Audio download management as a separate opt-in because of storage size.

Clear cache controls with separate "clear temporary cache" and "delete
downloads."

User behavior / flows.

Use IndexedDB for structured Quran/Tafsir data.

Use Cache Storage/service worker for network resources.

Queue downloads and show progress.

Gracefully recover from quota errors.

Never block reading if a download fails.

Data and technical model.

Track download manifest: item type, identifier, version, size,
created_at.

Use immutable-content assumptions for Quran text/Tafsir where the
provider guarantees stability.

Show estimated storage impact before large downloads.

Dashboard homepage treatment. Homepage can show an offline badge, not a
download dashboard. A dedicated Downloads page handles management.

Acceptance criteria.

A downloaded Surah opens with airplane mode enabled.

Storage errors are actionable.

Users can see and remove downloaded content.

No duplicate downloads for the same content/version.

4.6 Advanced Search & Discovery

Priority: P1

Purpose. Make search a primary discovery tool across Surah names, ayahs,
translations, Tafsir and saved notes.

What should be in the module.

Search by Arabic, Urdu, English and transliteration.

Search exact phrase and loose phrase.

Filters: Surah, Juz, translation, Tafsir, bookmarked only.

Result preview with highlighted match.

Jump directly to ayah.

Search history with clear-all.

Suggested searches such as "patience", "salah", "mercy".

User behavior / flows.

Debounce input and use server/API search where appropriate.

Cache recent searches.

Preserve the query in the URL for shareability.

Search result cards should expose Surah + ayah number before the
excerpt.

Data and technical model.

Use the Quran API / Quran Foundation search capabilities where
licensing/access permits.

Keep provider-specific response mapping behind a search service.

Index user notes separately if cloud search is implemented.

Dashboard homepage treatment. Homepage search is the gateway; detailed
filters live on /search.

Acceptance criteria.

Common queries return useful results quickly.

Search can jump directly to a verse.

No provider-specific API shape leaks into UI components.

4.7 Ramadan Mode

Priority: P2

Purpose. Provide a seasonal experience that combines prayer, fasting,
Quran reading, Khatmah and daily goals.

What should be in the module.

Ramadan day counter.

Suhoor/Imsak and Iftar times.

Fasting status: planned/fasted/missed (optional and private).

Ramadan Khatmah goal.

Daily Quran target.

Daily Dua / Ayah card.

Laylat al-Qadr reminder content area with carefully sourced content.

Ramadan calendar.

User behavior / flows.

Detect Ramadan using Hijri calendar data.

Allow users to override the detected start date if their local authority
differs.

Integrate with existing prayer calculation and location settings.

Do not present religious/legal rulings as authoritative app-generated
advice; link to trusted sources where needed.

Data and technical model.

Seasonal data should be date-driven, not hardcoded.

Reuse prayer store, reading progress and goal system.

Keep Ramadan-specific tables minimal unless tracking is explicitly
enabled.

Dashboard homepage treatment. Homepage gets a contextual Ramadan hero
card rather than adding another permanent card.

Acceptance criteria.

Ramadan dates and times are clearly labeled as calculated/selected.

Suhoor/Iftar times update when location or Fiqh changes.

Ramadan mode does not duplicate core prayer data.

4.8 Memorization / Hifz Mode

Priority: P2

Purpose. Extend the reader into a study and memorization workflow
without changing the core Quran content model.

What should be in the module.

Create memorization plan by Surah/ayah range.

New lesson, recent revision, overdue revision.

Hide/show translation or Arabic.

Repeat ayah audio.

Mark: learning, memorized, needs review.

Review queue.

Optional spaced-repetition scheduling.

Mistake notes.

User behavior / flows.

A user selects a range and target frequency.

The app generates a review queue.

Completion updates the next review date.

Audio can loop the selected range.

Data and technical model.

Hifz plan tables: plans, ranges, review_items, review_events.

Do not duplicate Quran text in user tables; store stable content IDs.

Dashboard homepage treatment. If enabled, show "Next review: Al-Mulk
1--5" as a compact action card.

Acceptance criteria.

A user can create and complete a review session.

The queue is deterministic and recoverable after reload.

The feature remains optional and does not clutter casual-reader UX.

4.9 Audio & Reciter Experience

Priority: P1

Purpose. Turn the current per-Surah audio into a persistent listening
system.

What should be in the module.

Persistent audio player.

Reciter preference.

Queue: Surah list or selected range.

Repeat ayah / repeat range.

Playback speed.

Background playback where supported.

Last listened position.

Optional offline audio downloads.

User behavior / flows.

Persist reciter and playback position.

Keep audio state across navigation.

Use media session APIs where supported.

Avoid automatically playing audio on homepage.

Data and technical model.

Audio state: reciter, surah, ayah, timestamp, queue.

Use the existing audio provider behind a service abstraction.

Dashboard homepage treatment. A compact player appears at the bottom
when audio is active. Homepage can resume audio with one tap.

Acceptance criteria.

Playback resumes from the last saved position.

Reciter selection persists.

Audio failures show retry/fallback behavior.

4.10 Islamic Calendar, Events & Personal Reminders

Priority: P2

Purpose. Make the calendar a useful planning tool rather than only a
date display.

What should be in the module.

Gregorian + Hijri date.

Islamic months.

Major Islamic dates/events.

Personal reminders for Quran goals, fasting days and study tasks.

Export selected reminders to calendar later.

Location/authority note for moon-sighting-sensitive dates.

User behavior / flows.

Separate calculated dates from user-entered dates.

Allow local adjustment/override for sensitive dates.

Use the same timezone/location foundation as prayer times.

Data and technical model.

Event table: id, type, date, title, source, locale, user_override.

Reminder table linked to user and event.

Dashboard homepage treatment. Homepage only shows the current Hijri date
and next relevant event.

Acceptance criteria.

Users understand whether a date is calculated or manually adjusted.

Calendar data does not conflict with prayer calculations.

4.11 Shareable Ayah / Quote Cards

Priority: P2

Purpose. Allow users to share an ayah in a polished visual card without
requiring an account.

What should be in the module.

Arabic verse.

Selected translation.

Surah + ayah reference.

Optional Tafsir excerpt only if licensing/source rules permit.

Theme/background templates.

Copy text.

Share image.

Share link that opens the exact ayah.

User behavior / flows.

Generate the visual on the client where practical.

Use stable deep links like /surah/2#ayah-255.

Keep source attribution visible on generated cards.

Data and technical model.

Do not store generated images unless the user explicitly saves them.

Respect provider/licensing requirements for translations and tafsir.

Dashboard homepage treatment. Ayah of the Day gets a small Share button.
Avoid a large social-feed style UI.

Acceptance criteria.

Shared link opens the exact verse.

Generated card contains readable Arabic and attribution.

4.12 Settings, Personalization & Accessibility

Priority: P1

Purpose. Consolidate all user preferences into one predictable settings
system.

What should be in the module.

Theme: light/dark/system.

Arabic font size and line height.

Translation selection.

Tafsir preference.

Prayer Fiqh + calculation method.

Location source and fallback.

Notifications.

Audio defaults.

Language.

Data/export/privacy.

Accessibility: reduced motion, high contrast where supported, larger
touch targets.

User behavior / flows.

Every preference should have a clear scope: local, account-synced, or
device-specific.

Changes should update relevant stores immediately.

Dangerous/destructive actions are separated visually.

Data and technical model.

Central preferences schema.

Version settings so migrations can be handled safely.

Avoid storing secrets in localStorage.

Dashboard homepage treatment. Homepage uses preferences silently; it
should not become a settings page.

Acceptance criteria.

A new preference takes effect without a full reload where possible.

User can understand which settings affect prayer calculations.

Accessible controls are keyboard/touch friendly.

5.  Dashboard Homepage Specification

The homepage should be a personalized command center. The design should
preserve the existing visual identity---teal/deep-blue gradients,
rounded cards, glassmorphism, Amiri Arabic typography and
Sansation-style UI---while reducing the number of competing cards.

5.1 Recommended homepage hierarchy

5.2 Homepage states

First-time user: Next Prayer + Start Reading Al-Fatihah + Ayah of the
Day + Quick Actions. Do not show empty analytics.

Returning anonymous user: show real Continue Reading, daily goal if
created, bookmarks/recent saves and offline status.

Signed-in user: add sync state and cloud-backed progress; never make the
profile card dominate the screen.

Ramadan: contextual Ramadan card replaces one normal secondary card.

Hifz enabled: contextual "Next Review" card replaces a secondary card.

Offline: show a subtle offline state and prioritize cached reading
content.

5.3 Homepage design rules

One primary CTA per card.

No more than 6--8 meaningful content blocks on mobile.

Prayer countdown and Quran continuation should remain above the fold.

Do not display every module just because it exists.

Use progressive disclosure: details live on dedicated module pages.

Arabic content should remain highly readable with generous line height.

Every card needs an empty state and an error state.

Avoid color-only status indicators; pair color with text/icons.

6.  Recommended Navigation Architecture

Recommendation: keep the navigation drawer for desktop, but on mobile
introduce a bottom navigation with Home, Quran, Goals, Prayer and
Library. Put less frequently used tools under a More/Tools destination.

7.  Suggested Data Model

8.  Technical Architecture Recommendations

Keep the current local-first architecture: localStorage for small
preferences, IndexedDB for structured Quran/Tafsir/offline data, Cache
Storage/service worker for network resources.

Add Supabase only for user-owned data and synchronization; keep Quran
content behind provider services so switching providers does not require
UI rewrites.

Create clear service boundaries: QuranContentService, SearchService,
PrayerService, PushService, SyncService, AudioService, GoalService.

Use server-side authorization/RLS for every cloud table.

Treat prayer calculations as a shared domain model: location + date +
Fiqh + calculation method + timezone.

Use stable IDs for bookmarks/notes/goals to make sync deterministic.

Use optimistic UI for local changes and background sync for cloud
persistence.

Add telemetry only for product behavior that is necessary to improve the
app; avoid collecting sensitive religious or location data unless
required and explicitly disclosed.

9.  Suggested Delivery Roadmap

10. Reference Resources

Use these as the primary technical references while implementing the
modules. Provider availability, authentication requirements, licensing
and API terms should be re-checked before production release.

Quran API --- Introduction --- Current project already uses this
provider for Quran content; useful for endpoint/content understanding.

Quran Foundation --- API Reference --- Current API reference covering
Quran text, translations, Tafsir, audio, search and user APIs.

Quran Foundation --- Documentation Portal --- Overview of content APIs,
search APIs and user APIs such as bookmarks, notes, reading sessions and
goals.

AlAdhan --- Prayer Calculation Methods --- Calculation methods, Fiqh
options and customization concepts used by the prayer module.

Supabase Auth --- Authentication, sessions and authorization foundation
for cloud sync.

Supabase Auth Configuration --- Provider configuration, sessions, rate
limits and authentication settings.

Nuxt --- @vite-pwa/nuxt --- Nuxt integration for PWA manifests, service
workers and offline capabilities.

MDN --- Web App Manifest --- Manifest requirements and installable PWA
behavior.

MDN --- Making PWAs Installable --- Current browser installability
requirements and HTTPS/manifest considerations.

MDN --- Notifications API --- Notification behavior and persistent
service-worker notifications.

MDN --- Service Worker API --- Offline caching, request interception and
background capabilities.

11. Source Notes From the Current Project Audit

The uploaded project plan is the primary source for the "already built"
baseline in this document. It records the Nuxt 4/Vuetify
3/Pinia/Supabase/PWA stack, the current
Home/Surah/Prayer/Tasbeeh/Bookmark/Tafsir capabilities, the completed
Pass 1--10 work, and remaining architectural gaps. In particular, it
notes that Supabase auth is installed but not wired into the UI, and
that true background push would require a server, VAPID keys,
subscription storage and a scheduled job.

Uploaded source: Pasted markdown.md --- current Quran App project plan.
It is the baseline used for the existing-feature status in this
document.

12. Product Principles

Quran reading remains the center of the product; utility modules support
it rather than compete with it.

Local-first by default: the app should remain useful without login or
network.

Personalization should be progressive: first-time users see a simple
experience; advanced users unlock goals, Hifz, collections and detailed
settings.

Prayer information must be transparent about location, Fiqh and
calculation method.

Religious content must show source/attribution clearly and should not
imply scholarly authority where the app is only presenting third-party
content.

Notifications should be opt-in, granular and easy to disable.

The homepage should answer "what is next?" rather than "what features
exist?"

End of specification

Area \| Current state \| Planning implication

| --- \| --- \| --- \|

| Core Quran reading \| Built \| Extend with goals, notes, collections
  and richer reading analytics. \|

| Continue Reading \| Built \| Make it part of a broader Khatmah / daily
  goal system. \|

| Bookmarks \| Built \| Add folders/collections, notes, tags and sync.
  \|

| Tafsir \| Built \| Add better discovery, source metadata and optional
  expansion to Juz/page views. \|

| Tasbeeh \| Built \| Add routines, history and optional dashboard
  summary. \|

| Prayer times + Fiqh \| Built \| Add masjid/custom tuning, calendar
  export and true background push. \|

| Qibla \| Built \| Add compass UX, calibration guidance and location
  transparency. \|

| PWA/offline \| Built \| Add user-visible offline/download management.
  \|

| Authentication \| Not wired into UI \| High priority for cross-device
  sync and cloud data. \|

| Prayer notifications \| Foreground/background-tab scheduling \| True
  background push needs server-side subscription storage and scheduled
  sends. \|

Priority \| Feature \| Why \| Main dependencies

| --- \| --- \| --- \| --- \|

| P0 \| Account + cloud sync \| Unlocks cross-device continuity and
  protects user-created data. \| Auth, profile, sync, RLS \|

| P0 \| Reading goals + Khatmah \| Creates a repeatable daily habit
  around the core Quran experience. \| Goals, schedules, progress \|

| P0 \| True background prayer push \| Makes prayer reminders useful
  when the app is closed. \| Push subscriptions, scheduler \|

| P1 \| Notes + collections \| Turns bookmarks into a personal study
  library. \| Folders, notes, tags \|

| P1 \| Offline/download manager \| Makes the PWA feel like a real Quran
  app. \| IndexedDB, cache/storage controls \|

| P1 \| Richer dashboard \| Makes existing features discoverable and
  actionable. \| Home redesign \|

| P1 \| Advanced search/discovery \| Improves content discovery across
  Quran, translations and Tafsir. \| Search index/filter UX \|

| P2 \| Ramadan mode \| Creates a seasonal engagement layer without
  changing the core architecture. \| Ramadan planner, fasting, Khatmah
  \|

| P2 \| Learning / memorization mode \| Expands from reading into study
  and memorization. \| Revision plans, spaced review \|

| P2 \| Community / shared collections \| Potential network effect, but
  higher moderation/privacy cost. \| Profiles, sharing, moderation \|

Order \| Homepage block \| What it should show

| --- \| --- \| --- \|

| 1 \| 1. Header \| Greeting + Hijri date + profile/sync icon +
  settings. Keep compact. \|

| 2 \| 2. Next Prayer Hero \| Prayer name, exact time, countdown,
  location, Fiqh/method indicator and a "Prayer Times" action. \|

| 3 \| 3. Today's Quran Goal \| Primary reading progress ring/bar,
  today's target, current streak and "Continue Reading" button. \|

| 4 \| 4. Continue Reading \| Exact Surah/ayah position and one-tap
  resume. If no history, default to Al-Fatihah. \|

| 5 \| 5. Ayah of the Day \| Arabic + selected translation,
  source/reference, bookmark, audio and share. \|

| 6 \| 6. Contextual card \| Ramadan/Khatmah/Hifz/Tasbeeh depending on
  user state. Do not show all of them simultaneously. \|

| 7 \| 7. Quick Actions \| Read Quran, Search, Tasbeeh, Prayer Times,
  Qibla, Bookmarks. \|

| 8 \| 8. Recent Saves \| Only if the user has bookmarks/notes; show
  1--3 items. \|

Section \| Contents

| --- \| --- \|

| Home \| Personal dashboard \|

| Quran \| Surahs, Juz, pages, search, translations, Tafsir \|

| Goals \| Khatmah, daily goals, Hifz \|

| Prayer \| Prayer times, calendar, Qibla, notifications \|

| Library \| Bookmarks, collections, notes, recent saves \|

| Audio \| Reciters, queue, listening history \|

| Tools \| Tasbeeh, Asma-ul-Husna, Sajda \|

| Settings \| Profile, personalization, notifications, data, about \|

Table \| Purpose \| Key fields

| --- \| --- \| --- \|

| profiles \| user profile + preferences \| user_id, display_name,
  language, timezone, created_at \|

| user_preferences \| device/account preferences \| user_id, theme,
  translation, tafsir, fiqh, calculation_method \|

| reading_sessions \| actual reading events \| user_id, date, surah,
  start_ayah, end_ayah, duration \|

| reading_goals \| Khatmah/daily goals \| user_id, type, target,
  start_date, target_date, status \|

| bookmarks \| saved Quran locations \| user_id, content_type,
  content_id, created_at, deleted_at \|

| collections \| bookmark folders \| user_id, name, description,
  created_at \|

| collection_items \| bookmark-to-collection join \| collection_id,
  bookmark_id \|

| notes \| private notes \| user_id, content_id, body, updated_at \|

| tags \| user-defined tags \| user_id, name \|

| tag_items \| tag-to-content join \| tag_id, content_id \|

| push_subscriptions \| web push devices \| user_id, endpoint, keys,
  device_label, last_seen \|

| prayer_settings \| notification and prayer config \| user_id, fiqh,
  method, location_mode, per_prayer toggles \|

| hifz_plans \| memorization plans \| user_id, title, target_date,
  status \|

| hifz_review_items \| ayah/range review queue \| plan_id, surah,
  start_ayah, end_ayah, next_review_at, status \|

| audio_history \| listening progress \| user_id, surah, ayah, reciter,
  position \|

| downloads \| offline content manifest \| user_id/device_id,
  content_type, content_id, size, version \|

Phase \| Scope

| --- \| --- \|

| Phase 1 --- Foundation \| Account/Auth, sync schema,
  profile/preferences, navigation cleanup, homepage redesign. \|

| Phase 2 --- Habit loop \| Reading Goals, Khatmah, streaks, dashboard
  metrics, improved Continue Reading. \|

| Phase 3 --- Prayer reliability \| True Web Push, server scheduler,
  subscription management, notification deep links. \|

| Phase 4 --- Personal study \| Notes, collections, tags, richer
  bookmarks, search within library. \|

| Phase 5 --- Offline \| Downloads manager, storage UI, offline-first
  route/content handling, optional audio downloads. \|

| Phase 6 --- Discovery \| Advanced search, improved Tafsir discovery,
  audio queue, shareable ayah cards. \|

| Phase 7 --- Seasonal/advanced \| Ramadan Mode, Hifz mode, calendar
  reminders. \|

| Phase 8 --- Optional community \| Shared collections, profiles,
  comments/community only after privacy and moderation design. \|
