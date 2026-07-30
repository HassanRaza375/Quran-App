import vuetify from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  },
  // pwa
  pwa: {
    registerType: "autoUpdate",
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
      navigateFallback: "/",
      runtimeCaching: [
        {
          // Quran text/translation/reciter API
          urlPattern: ({ url }) =>
            url.hostname.includes("quranapi.pages.dev"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "quran-api-cache",
            expiration: {
              maxEntries: 300,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // reciter audio files
          urlPattern: ({ request, url }) =>
            request.destination === "audio" || /\.(mp3|ogg|wav)$/i.test(url.pathname),
          handler: "CacheFirst",
          options: {
            cacheName: "quran-audio-cache",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
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
    },
  },
});
