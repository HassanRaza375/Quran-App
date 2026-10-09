# Daily Fiqh browser suites

Playwright checks of the real production build of the app (Module 18, `/fiqh`). They are not part of
`npm test` (which is the fast, Nuxt-free unit run); they need a built app and a browser.

```bash
npx playwright install chromium        # once
npm run test:e2e:wajibat               # builds (npm run build), starts two servers, runs every suite, stops them
npm run test:e2e:wajibat -- --skip-build               # reuse the existing .output
npm run test:e2e:wajibat -- --suite helpers,offline    # some suites only
```

The runner starts the built server twice: on port **3457** with the real configuration (decision helpers
hidden until a reviewer signs them off) and on **3456** with `NUXT_PUBLIC_WAJIBAT_SHOW_UNREVIEWED_HELPERS=true`
(used only by the helper walk). Override with `WAJIBAT_E2E_BASE` / `WAJIBAT_E2E_BASE_FLAG`. Expected counts
come from the app's own data (`app/data/wajibat/index.ts`, bundled with esbuild), never from numbers typed here.
It prints a pass/fail line per suite and the size of every data chunk, and exits non-zero on any failure.

| Suite | What it checks |
|---|---|
| `categories` | Every topic of every category, both maraji', English at 1280 px and Urdu at 390 px: the right ruling cards, the women's panel count, the single "nothing yet" notice, no horizontal overflow, helpers hidden, no console or page errors; the hub and the category pages. |
| `sawm` | Phase 5: fasting texts, Khamenei's Q&A entries (and Sistani not seeing them), zakāt al-fiṭrah notice, the dawn and maghrib panel and its links, Qur'anic basis cards, search. |
| `holds` | Display holds from the mismatch triage (B1): a held ruling shows only the pointer to his book; held Sistani Urdu shows the notice and the English; held Khamenei English shows the official Urdu; nothing leaks to the other marja'. |
| `guided` | The step-by-step prayers and ablutions: every step of every procedure shows its quoted instruction (or the Urdu excerpt where his English is held); the stepper. |
| `helpers` | The four decision helpers: **every path of every tree** is walked through the UI (262 paths); each question offers "I'm not sure"; each answer is the verbatim quote or a risala pointer; marja's name, "Not scholar-reviewed", Start over; hidden when the flag is off. |
| `chunks` | Each category loads only its own data chunk (`wajibat-data-<category>-<hash>.js`) plus the small core; sizes. |
| `offline` | The service worker; opening a category caches that category; "Save all for offline" caches all five chunks; with the network cut every category still renders from the cache, and search works. |

A stale server from an earlier build on the same port makes the suites test the wrong build: stop it first.
