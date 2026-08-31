Production SEO & Web Standards Audit
Current Nuxt SEO architecture
No dedicated SEO module or centralized metadata strategy exists. Findings from direct inspection:

nuxt.config.ts's app.head sets only: title ("Quran App"), lang="en", charset, viewport, two <link> icons, and three <meta> tags (theme-color, apple-mobile-web-app-capable ×2). No site-wide description, no Open Graph, no Twitter Card, no canonical mechanism.
useHead is called in exactly 11 of 43 page files — all 9 knowledge-module detail ([id].vue) pages, surah/[id].vue... actually not surah/[id].vue (verified directly: it has definePageMeta({layout:"reader"}) only, zero useHead), plus persons/timeline.vue. Every one of these useHead calls sets title only — no description, no og:*, no twitter:*, no canonical.
The 9 knowledge-module directory pages (persons/index.vue, peoples/index.vue, etc.) have no useHead at all — they silently inherit the generic global "Quran App" title.
The homepage (app/pages/index.vue) has no useHead/useSeoMeta at all.
No useSeoMeta, no useServerSeoMeta, no schema.org/JSON-LD utility anywhere in the codebase (confirmed by grep across app/).
No routeRules in nuxt.config.ts (no prerender/ISR/noindex-by-route configuration).
No middleware directory content (app/middleware/ is empty).
Installed SEO modules
None of the requested modules are installed. Confirmed via package.json:

No @nuxtjs/seo, no @nuxtjs/sitemap, no @nuxtjs/robots, no schema-org module.
@vite-pwa/nuxt IS installed and configured (relevant to Step 12 — the web manifest already substantially exists, see below).
@nuxt/hints is present but is a devtools/perf-hints module, unrelated to SEO.
No duplicate-install risk currently — a fresh choice is needed, not a replacement.
Complete route inventory
Route	Indexable	Canonical	Sitemap	Reason
/	Yes	/	Yes	Homepage
/about	Yes	/about	Yes	Informational
/surah/[id] (1–114)	Yes	self	Yes	Core Qur'an text content — currently has zero per-page metadata, the single biggest gap found
/surah-listing	Yes	self	Yes	Directory of all surahs
/surah-audios/[id] (1–114)	Yes, lower priority	self	Yes	Reciter audio per surah — legitimate but secondary content
/surah-vedios	Maybe	self	Maybe	Video-embed page (like Asma-ul-Husna's YouTube embed) — thin content, needs your call
/juz/[id] (1–30)	Yes	self	Yes	Standard Qur'an navigation unit
/juz	Yes	self	Yes	Directory
/per-page-read	Low value	self	Optional	Mushaf-page reading utility, not unique content per se
/asma-ul-husna	Yes	self	Yes	Real content (99 Names)
/persons, /persons/[id] (59)	Yes	self	Yes	Phase 1 module
/persons/timeline	Yes	self	Yes	Already has its own title
/peoples, /peoples/[id] (14)	Yes	self	Yes	Phase 2
/places, /places/[id] (16)	Yes	self	Yes	Phase 3
/stories, /stories/[id] (21)	Yes	self	Yes	Phase 4
/themes, /themes/[id] (42)	Yes	self	Yes	Phase 5
/duas, /duas/[id] (38)	Yes	self	Yes	Phase 6
/events, /events/[id] (40)	Yes	self	Yes	Phase 7
/signs, /signs/[id] (14)	Yes	self	Yes	Phase 8
/commands, /commands/[id] (18)	Yes	self	Yes	Phase 9
/search	noindex	/search	No	Query-driven, no unique crawlable content per state (state is local refs only — good, see Step 3)
/bookmarks	noindex	—	No	Purely personal, device-local data (per CLAUDE.md, no accounts)
/settings	noindex	—	No	Personal preferences
/downloads	noindex	—	No	Personal offline-download management
/goals	noindex	—	No	Personal reading goals
/ramadan	Maybe indexable	self	Optional	Seasonal feature page — has real explanatory content, arguable case, flagging for your call
/hifz, /hifz/session	noindex	—	No	Personal memorization progress/session state, device-local
/tasbeeh, /tasbeeh/[id]	noindex	—	No	Personal counter tool
/prayerTime	Yes, geolocation-based	self	Yes	Real utility content, though personalized — index the general page, not per-location state (none exists in URL)
/qibla-direction	Yes	self	Yes	Static utility explanation + tool
/calender	Yes	self	Yes	Islamic calendar utility
/sajda	Yes	self	Yes	Real content (list of prostration verses)
/error (Nuxt error.vue)	noindex always	—	No	Must never be indexed regardless of status code — currently NOT enforced (see Step 14)
Route-count summary for sitemap sizing: 114 (surah) + 114 (surah-audios) + 30 (juz) + 262 (9 knowledge-module entities) + 9 (module directories) + ~12 static/utility indexable pages ≈ ~540 URLs — well within a single sitemap.xml's practical limits (no sitemap index needed, see Step 4).

Indexability decisions
Summarized from the table above — three tiers:

Fully indexable, sitemap-included: all Qur'an content (surah/juz/audio), all 9 knowledge-module directories + 262 entity detail pages, About, Sajda, Qibla, Calendar, Prayer Times, Asma-ul-Husna, Surah Listing, Timeline.
noindex, excluded from sitemap: Search, Bookmarks, Settings, Downloads, Goals, Hifz (both pages), Tasbeeh (both), the error page.
Needs your decision: Ramadan Mode page (real explanatory content vs. seasonal/seldom-relevant), Surah Videos page (thin YouTube-embed content, same pattern already flagged once this session for Asma-ul-Husna), Per-Page-Read (utility vs. content).
Search/filter URL strategy
Directly verified: no page in this app writes filter/search/sort state into the URL (router.push/navigateTo with a query object returns zero matches app-wide). search.vue's query text and filters are local refs only — one stable URL, no crawlable duplicate variants to worry about there.

The one real pattern found: events/index.vue, signs/index.vue, commands/index.vue (and by the same Phase 10 pattern, implicitly extensible to others) read route.query.person on mount only, as a one-way entry point from the Persons Timeline's "N related events" links (e.g. /events?person=ibrahim). This creates a small, finite set of pre-filtered URL variants that:

Show a strict subset of the same content already at the bare directory URL.
Have no unique indexable value of their own.
Should be canonicalized to the bare directory URL (/events) via <link rel="canonical" href=".../events"> on those pages regardless of query state, and excluded from the sitemap. This avoids duplicate-content dilution without needing to block the URL outright (Timeline links still work for real visitors).
Sitemap strategy
No sitemap exists today. Recommended approach for Nuxt 4, consistent with "prefer existing datasets → generated index, not hundreds of manual URLs":

A server route (server/routes/sitemap.xml.ts, Nuxt's native server/ directory — already used by this project for server/api/*.get.js) that generates the sitemap at request time (or is prerendered at build time via routeRules), importing the 9 QURAN_* dataset arrays directly (same pattern as every module's own get{X}ById) plus surah.json for the 114/30/114 Qur'an routes, and a small static list for the ~12 indexable utility pages.
This avoids installing @nuxtjs/sitemap for what is, at ~540 URLs, a genuinely small, static-shaped problem — but @nuxtjs/sitemap remains a reasonable alternative if you'd prefer a maintained module over hand-rolled XML; flagging this as a decision point, not deciding unilaterally.
No sitemap index needed — 540 URLs is far under any practical single-sitemap ceiling (Google's soft guidance is 50,000 URLs/50MB per file).
Generation cost is trivial (reading already-in-memory arrays), no external calls, safe to run per-request or prerendered.
robots.txt strategy
Current public/robots.txt is minimal (User-Agent: * / Disallow: — allows everything) and references no sitemap. Recommended:

Keep the permissive default (do not blindly disallow directories, per your instruction).
Add Disallow: lines only for the confirmed personal/utility routes from the indexability table (/search, /bookmarks, /settings, /downloads, /goals, /hifz, /tasbeeh).
Add Sitemap: https://<domain>/sitemap.xml — blocked on the missing site-URL input (Step 6).
Do not disallow /_nuxt/, images, or any asset path — nothing in this app's rendering depends on a blocked path, and blocking would harm rendering-dependent indexing (e.g. Googlebot's JS rendering).
Canonical strategy
No site base URL is configured anywhere in the project — confirmed absent from nuxt.config.ts, .env, README.md, and package.json. This is a hard blocker for canonical URLs, OG url, JSON-LD @id/url, and the sitemap's <loc> values, all of which require an absolute production domain. This is the single most important required input before any of this work can be implemented.

Once known, the correct Nuxt 4 location is runtimeConfig.public.siteUrl (mirroring the existing quranApiBase/quranApiBase2 pattern already used in this exact file) — read from one env var, referenced everywhere metadata needs an absolute URL, never hardcoded per-file.

Trailing slash: Nuxt's router defaults to no-trailing-slash; the app's existing routes are all trailing-slash-free — canonical generation should match this consistently.
Query parameters: per Step 3, entity directory pages with a ?person= entry-point param should canonicalize to the bare path.
Dynamic routes: canonical = {siteUrl}{route.fullPath} with query stripped for the pages identified above.
Metadata strategy
Proposed centralized approach — not implemented yet, described for approval:

One small composable, e.g. useSeoHead(options), wrapping useSeoMeta + a canonical useHead link entry, called from every indexable page with { title, description, image?, type? }. This mirrors the codebase's own established "one shared helper, each page calls it with its own data" convention (same shape as use{Module}PassageQueue, useKnowledgeGraph, etc. built across Phases 6–10).
Dynamic pages derive metadata from real entity fields already in the datasets — e.g. an Event's title + first ~150 chars of its own description (never inventing new copy); a Surah page's title from surah.json's own surahNameTranslation/surahNameArabic. No keyword stuffing — descriptions are truncated real content, not synthesized SEO copy.
Directory pages get a short, static, honest description per module (e.g. "Browse all 40 significant occurrences described in the Qur'an, cross-linked to People, Places, and Stories" for /events) — these 9 short descriptions are new copy I would need to write; flagging that this is authored summary text, not extracted from data, so you can review the exact wording before it ships.
Open Graph strategy
og:title, og:description populated from the same per-page data as <title>/description above.
og:url = the canonical absolute URL (blocked on site URL).
og:type = website site-wide (not article — see JSON-LD rationale below, same reasoning applies: this is a reference/database app, not a blog).
og:image — no dedicated social preview image exists in public/ (only favicons and PWA icons, which are square app icons, not 1200×630 social cards). This is a required input: either supply an image asset, or the OG tags ship without og:image (acceptable, just less rich when shared) — flagging, not deciding.
Twitter/X strategy
twitter:card = summary_large_image if an OG image becomes available, else summary.
twitter:title/twitter:description mirror the OG values — no separate copy needed.
JSON-LD strategy
Minimal, semantically honest additions only:

WebSite on the homepage, with a SearchAction pointing at /search (Search's query isn't URL-driven today — see Step 3 caveat above; a SearchAction typically expects a ?q={search_term_string} URL pattern, which /search doesn't have. This would require adding a URL query param to /search, which is a small, real code change beyond pure metadata — flagging as a decision point, not assumed in scope.)
BreadcrumbList on every detail page (Home → Module → Entity) — cheap, accurate, directly reflects real navigation, no invented data.
Person schema on /persons/[id] pages — genuinely valid given the dataset's own name/arabicName/alternateNames/honorific fields; would NOT include invented birthDate/deathDate/sameAs since the dataset deliberately doesn't assert Gregorian dates (per this whole project's own source-discipline rules established across Phases 1–9).
Place schema on /places/[id] pages — valid given name/identificationBasis, would omit geo coordinates since none exist in the dataset (not inventing them).
Explicitly NOT using Article anywhere — no page in this app is authored, dated, bylined content; forcing Article schema onto reference/database entries would be exactly the kind of misleading structured data your instructions warn against.
No AggregateRating, Review, or author schema anywhere — none of that data exists or should be fabricated.
About page assessment
Current /about (read in full) is thin and outdated relative to the finished 10-module product: it only describes the two Qur'an APIs, prayer times, and Qibla — it does not mention Persons, Peoples & Nations, Places, Stories, Themes, Duas, Events, Signs & Miracles, or Commands & Prohibitions at all, nor the source-basis/classification discipline (quran_explicit vs. traditional vs. disputed, etc.) that is this project's own core methodological achievement across Phases 1–9. A rewrite is clearly warranted and in scope. I have NOT invented replacement content — see Required user/project inputs below for what's missing before I can write it accurately (tafsir source name, translation edition names — the About page currently doesn't even name which translation/tafsir editions are shown, only the API providers).

Sources/Methodology assessment
A dedicated /methodology (or /sources) page is well-justified — this project has substantial, real, already-documented methodology (the IdentificationBasis/EventSourceBasis/CommandSourceBasis source-tier system, the Story-vs-Event and Theme-vs-Command boundary decisions, the reverse-index Knowledge Graph) that currently exists only in code comments and past completion reports, invisible to a real visitor. Proposed structure (content only, not written yet):

What the Qur'anic text/translation/tafsir sources are (blocked — see required inputs, the app fetches from quranapi.pages.dev/alquran.cloud but the actual translation/tafsir edition names displayed to users aren't identified anywhere I can find in the codebase).
How the 10 knowledge modules relate (mirrors this project's own MODULE_BLUEPRINT.md, safe to summarize since that's the project's own real internal documentation).
The 4-tier-ish source-basis vocabulary explained in plain language (this is fully documented in-repo already, safe to write accurately).
Known limitations (e.g., "Which son was sacrificed" deliberately left unresolved, Uhud excluded from Events for insufficient direct Qur'anic grounding — real, already-documented editorial decisions, good concrete examples for a transparency page).
Privacy/Terms/Disclaimer assessment
None of these exist today (confirmed — no privacy, terms, disclaimer, or contact page in the route inventory). Given the app is explicitly local-first with no accounts (per CLAUDE.md: "keeps all user data... on-device"), a genuinely accurate Privacy Policy is actually simple and honest to write ("we don't collect your data, it stays in your browser's local storage/IndexedDB") — but Supabase is installed and configured (@supabase/supabase-js, app/plugins/supabase.client.ts, NUXT_PUBLIC_SUPABASE_URL in .env) even though CLAUDE.md states it's "not wired into the UI." A Privacy Policy needs to accurately reflect whether any data ever leaves the device via Supabase or the third-party Qur'an/prayer APIs (which do receive geolocation for prayer times/Qibla) — this needs your confirmation of exactly what network calls occur before I write claims about data handling. Terms of Use and Disclaimer (religious-content-accuracy disclaimer, not a house style requirement) are similarly straightforward to draft once you confirm there's no real organization/entity behind the app to name.

Contact/Feedback assessment
No contact mechanism exists anywhere in the app or its metadata (no email, no form, no issue tracker link found in README/CLAUDE.md/package.json). Required input: an actual contact channel (email address, GitHub issues URL, or similar) before any Contact page, error-reporting link, or security.txt can be created — I will not invent one.

Web manifest assessment
Largely already implemented, better than a from-scratch gap: @vite-pwa/nuxt provides name, short_name, description, theme_color, background_color, display, orientation, start_url, and three icon entries (192, 512, 512-maskable). Gaps:

Manifest description is generic/pre-Phase-1 ("Read, listen to and reflect on the Quran — surahs, translations, audio recitations, prayer times, qibla direction and tasbeeh counter.") — doesn't mention the 10 knowledge modules; a copy update, not a structural gap.
No dedicated 180×180 apple-touch-icon — nuxt.config.ts currently points apple-touch-icon at /pwa-192x192.png (works, but not the ideal exact size).
<VitePwaManifest /> is correctly mounted in app.vue.
Favicon/icon assessment
public/ has four favicon-ish files (favicon.ico, favicon.png, favicon2.png, favicon3.png) but nuxt.config.ts only references favicon2.png — the other three are unused dead weight or leftover iteration artifacts. favicon.ico at the root is still valuable to keep (browsers/crawlers probe /favicon.ico by convention even without a <link> tag). Recommend consolidating to favicon.ico + one clearly-current PNG, removing the unused favicon.png/favicon3.png — but I have not confirmed which of these is the "current" intended icon vs. an abandoned draft; flagging for your input rather than guessing which to delete.

security.txt assessment
Not present (public/.well-known/ doesn't exist). Per your instruction, I will not invent a security contact. Blocked on the same missing input as Contact/Feedback — a real email or reporting channel. Until provided, this should be skipped rather than populated with a placeholder.

404/error handling assessment
app/error.vue exists and handles both 404 and other errors generically (shows statusCode/message, a "Go Home" button). Gaps:

No noindex meta is ever set on the error page — a crawler hitting a broken link would currently index a genuine 404 as normal content (since it inherits the site-wide title/no-robots-meta default). This is a real, fixable gap.
The experience is minimal (plain HTML, no app chrome/navigation, no Vuetify styling, no links into the actual site content) — functional but not "useful" in the sense your instructions ask for; a Vuetify-styled version with links to the homepage and a couple of key sections (Surah listing, the 9 knowledge modules) would genuinely improve it, and is in-scope as an SEO/UX-adjacent fix, not a "new feature."
Internationalization assessment
Confirmed single-language only: htmlAttrs: { lang: "en" } is the only locale signal anywhere; no @nuxtjs/i18n, no locale-prefixed routes, no translated content structure. Correctly, no hreflang tags should be added — there is nothing to point them at, and fabricating them would be actively wrong per your instruction.

Performance/crawl assessment
No duplicate metadata risk currently (there's barely any metadata to duplicate — see above).
All 9 knowledge-module detail/directory pages and surah/[id].vue render via standard Nuxt SSR (no unusual client-only rendering pattern found for primary content) — SEO-relevant content should already be server-rendered, good baseline.
Sitemap generation cost is trivial at ~540 URLs from in-memory arrays (Step 4).
No unnecessary crawlable URL explosion found (Step 3's finding that no page persists filter state to the URL is the main reason).
No unrelated performance refactoring is proposed, per your instruction.
Proposed files to create
(Not created yet — proposed only, several blocked on required inputs below)
server/routes/sitemap.xml.ts, app/composables/useSeoHead.ts (or similar name), a rewritten app/pages/about.vue, app/pages/methodology.vue (or /sources), app/pages/privacy.vue, app/pages/terms.vue, app/pages/disclaimer.vue, app/pages/contact.vue (blocked on contact input), public/.well-known/security.txt (blocked on contact input), possibly one small og-image.png if you supply source art.

Proposed files to modify
nuxt.config.ts (site-wide description meta, runtimeConfig.public.siteUrl, possibly routeRules for noindex routes), public/robots.txt (add sitemap reference + the confirmed personal/utility disallows), app/error.vue (add noindex, improve UX), the 9 knowledge-module directory pages + index.vue + surah/[id].vue + surah-listing.vue + other indexable pages (add useSeoHead calls), app/app.config.ts/nuxt.config.ts PWA manifest description (copy update only).

Existing files that should remain untouched
All 9 quran*.ts datasets, graphIndex.ts, useKnowledgeGraph.ts, RelatedEntitiesSection.vue, all module search/validate/composable files, personsTimeline.ts, PropheticTimeline.vue, useBookmarks.js, AyahReferenceCard.vue, all existing card/detail-page relationship sections and their content/data — confirmed nothing in this audit requires touching any of the Phase 1–10 knowledge architecture beyond adding metadata calls to existing pages.

Required user/project inputs
These block correct (non-invented) implementation of specific pieces:

Production domain / site URL — blocks canonical URLs, sitemap <loc>, OG url, JSON-LD url/@id, robots.txt Sitemap: line. The single highest-priority input.
Actual translation edition name(s) and tafsir work name(s) shown to users (the About page currently names only the two API providers, not the underlying translation/tafsir content itself) — needed for an accurate About/Methodology page and for not misrepresenting attribution.
A real contact channel (email or issue tracker URL) — blocks Contact page, security.txt, and any "report an error" link.
Confirmation of what data, if any, actually leaves the device (Supabase is installed but per CLAUDE.md unused; prayer/Qibla features do send geolocation to a third-party API) — needed to write an accurate Privacy Policy rather than a template one.
Whether there's a real organization/maintainer name to put in Terms/Privacy boilerplate, or whether these should be written in first-person/project-only terms with no claimed entity.
An OG/social preview image (1200×630), if you want rich social-share cards — optional, ships fine without one.
Which of the four existing favicon files is authoritative — to safely remove the unused ones rather than guessing.
Risks
Implementing canonical/sitemap/OG with a guessed or placeholder domain would ship broken metadata to production — must not proceed on any of that without the real domain.
Writing About/Methodology copy that names translations/tafsir works not actually confirmed in-repo would misattribute content — explicitly avoided per your instructions, hence flagged rather than guessed.
Adding a SearchAction JSON-LD without first adding real query-param support to /search would describe a URL pattern that does't actually work — flagged as a linked, small scope decision rather than assumed.
Directory-page ?person= canonicalization must not accidentally break the Persons Timeline's existing pre-filter links (Phase 7/10 feature) — implementation should add a canonical tag only, never redirect or strip the query param from actual navigation.
Major decisions requiring approval
Sitemap implementation approach: hand-rolled server/routes/sitemap.xml.ts reading the existing datasets directly (my recommendation, no new dependency) vs. installing @nuxtjs/sitemap.
Ramadan Mode / Surah Videos / Per-Page-Read indexability — my lean is index Ramadan (real content), leave Surah Videos and Per-Page-Read as your call given their thin/utility nature.
/search gaining a real ?q= URL parameter to support a proper SearchAction — a small functional change beyond pure metadata; skip the SearchAction entirely if you'd rather not touch search.vue's behavior.
Scope and tone of the new legal pages (first-person project disclosure vs. naming a real entity) — depends on required input #5.
Favicon consolidation — which file(s) to keep/remove, per required input #7.
Waiting for your review and the required inputs above before any implementation begins.