import vuetify from "vite-plugin-vuetify";
import { assertNoUnreviewedHelpersInProduction } from "./app/utils/wajibatBuildGuard";

// Decision B3: fails a production build if the Wajibat "show unreviewed helpers" dev flag is on.
assertNoUnreviewedHelpersInProduction(process.env);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    // A tab opened before a deploy still points at the old hashed chunks. With "automatic", a failed
    // route-chunk load while navigating reloads the page once (Nuxt's chunk-reload plugin, with its
    // own loop guard) instead of leaving an error. Nuxt 4's default is already "automatic"; it is set
    // explicitly so the behaviour is deliberate and tested (tests/wajibatBuildGuard.test.ts).
    emitRouteChunkError: "automatic",
  },
  app: {
    head: {
      title: "Quran App",
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon2.png" },
        { rel: "apple-touch-icon", href: "/pwa-192x192.png" },
      ],
      meta: [
        { name: "theme-color", content: "#13547A" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "mobile-web-app-capable", content: "yes" },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // modules
  modules: [
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxt/image",
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
  ],
  // css
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/css/main.css",
  ],
  // build
  build: {
    transpile: ["vuetify"],
  },
  // vite
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    plugins: [vuetify({ autoImport: true })],
    // Force the Wajibat ruling/procedure text into its own deterministically
    // named client chunk, so the PWA config can exclude it from the
    // install-time precache and cache it at runtime instead (see the
    // `pwa.workbox` globIgnores/runtimeCaching entries below) — it's ~700+
    // KiB that only Fiqh-module visitors need, not something every install
    // should fetch. `$client` (not the top-level `build` key) because Nuxt
    // merges it in last, specifically so module-set rollupOptions.output
    // (which a plain `build` key here loses to) don't silently win.
    $client: {
      build: {
        rollupOptions: {
          output: {
            // One chunk per Daily Fiqh category (loaded on demand by app/data/wajibat/runtime.ts) plus a
            // small "core" (categories, topics, glossary, the ruling index). All are named wajibat-data-*.
            manualChunks(id) {
              const p = id.replace(/\\/g, "/");
              if (!p.includes("/data/wajibat/")) return;
              if (/\/(chunks\/foundations|rulings\/foundations)\./.test(p)) return "wajibat-data-foundations";
              if (/\/(chunks\/taharat|rulings\/taharat|procedures\/taharat|decisionTrees\/taharat)\./.test(p)) return "wajibat-data-taharat";
              if (/\/(chunks\/salat|rulings\/(salat|salatQa|doubts)|procedures\/salat|recitations|decisionTrees\/salat)\./.test(p)) return "wajibat-data-salat";
              if (/\/(chunks\/sawm|rulings\/(sawm|sawmQa))\./.test(p)) return "wajibat-data-sawm";
              if (/\/(chunks\/khums|rulings\/khums)\./.test(p)) return "wajibat-data-khums";
              if (/\/(chunks\/zakat|rulings\/zakat)\./.test(p)) return "wajibat-data-zakat";
              return "wajibat-data-core";
            },
            // Nuxt's own default chunkFileNames is "_nuxt/[hash].js" (no
            // [name]), so without this the manualChunks grouping above still
            // lands in its own file, just under an indistinguishable hash —
            // this is what lets the PWA config (below) target it by name.
            chunkFileNames: (chunkInfo) =>
              chunkInfo.name.startsWith("wajibat-data-") ? "_nuxt/[name]-[hash].js" : "_nuxt/[hash].js",
          },
        },
      },
    },
  },
  // pwa
  pwa: {
    // "prompt" (not "autoUpdate") so a new service worker waits for the user
    // to confirm via the bottom reload banner (PwaUpdatePrompt.vue) instead
    // of silently swapping the app under them / force-reloading mid-read.
    registerType: "prompt",
    injectRegister: "auto",
    manifest: {
      name: "Quran App",
      short_name: "Quran App",
      description:
        "Read, listen to and reflect on the Quran — surahs, translations, audio recitations, prayer times, qibla direction and tasbeeh counter.",
      theme_color: "#13547A",
      background_color: "#F3F8F9",
      display: "standalone",
      orientation: "portrait",
      start_url: "/",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}"],
      // The Wajibat (Daily Fiqh) ruling/procedure text is its own chunk
      // (see vite.$client.build.rollupOptions.output.manualChunks) and is
      // deliberately kept OUT of the install-time precache — only users who
      // open /fiqh should download it.
      //
      // This CacheFirst rule is a backstop, not the real mechanism: verified
      // in a real browser (Playwright) that Nuxt's SSR-injected
      // <link rel="modulepreload"> for this chunk is NOT run through the
      // service worker's fetch event in Chromium, so a passive runtimeCaching
      // rule alone never actually catches it. The real caching happens from
      // app code instead — app/composables/useFiqhOfflineCache.ts explicitly
      // fetches-and-caches the chunk on every /fiqh page visit (and the
      // "Save all for offline" button on the /fiqh hub does the same thing
      // on demand) — using the SAME cache name, so this rule still applies
      // if some future code path ever does fetch it through a route the SW
      // can see.
      globIgnores: ["**/wajibat-data-*.js"],
      navigateFallback: "/",
      runtimeCaching: [
        {
          urlPattern: ({ url }) => /\/wajibat-data-.*\.js$/.test(url.pathname),
          handler: "CacheFirst",
          options: {
            cacheName: "wajibat-data-cache",
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year; content is versioned by its build hash
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Quran text/translation/tafsir/reciter-list API — this content is
          // immutable (surah text and tafsir never change), so CacheFirst
          // (fetch once, ever) instead of StaleWhileRevalidate, which would
          // otherwise re-fetch on every visit purely to refresh a cache that
          // never needed refreshing. The app also mirrors this into
          // IndexedDB via useQuranDB for instant, no-network reads on repeat
          // visits — this SW-level cache is the fallback/backstop layer.
          urlPattern: ({ url }) =>
            url.hostname.includes("quranapi.pages.dev"),
          handler: "CacheFirst",
          options: {
            cacheName: "quran-api-cache",
            expiration: {
              maxEntries: 1000,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // reciter audio files — also immutable, and only ever cached
          // lazily (whatever's actually played), so a generous cap here
          // just avoids evicting recently-played recitations too eagerly.
          urlPattern: ({ request, url }) =>
            request.destination === "audio" || /\.(mp3|ogg|wav)$/i.test(url.pathname),
          handler: "CacheFirst",
          options: {
            cacheName: "quran-audio-cache",
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      type: "module",
    },
  },
  // runtime config
  runtimeConfig: {
    // quranApiBase: process.env.QURAN_API_BASE,
    public: {
      quranApiBase: process.env.QURAN_API_BASE,
      quranApiBase2: process.env.QURAN_API_BASE2,
      // Wajibat decision helpers are shown only when every path is marked reviewed (decision A7).
      // Dev flag: set NUXT_PUBLIC_WAJIBAT_SHOW_UNREVIEWED_HELPERS=true to show them anyway.
      wajibatShowUnreviewedHelpers: false,
    },
  },
});
