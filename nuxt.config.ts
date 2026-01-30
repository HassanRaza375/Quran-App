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
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon2.png" }],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // modules
  modules: [
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/fonts",
    "@vite-pwa/nuxt",
  ],
  // css
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/css/main.css",
  ],
  fonts: {
    families: [
      {
        name: "Amiri Quran",
        provider: "google",
        weights: [400],
      },
      {
        name: "Sansation",
        provider: "google",
        weights: [400],
      },
    ],
  },
  // pwa
  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',   // 🔴 VERY IMPORTANT

    manifest: {
      id: '/',
      name: 'Quran App',
      short_name: 'Quran',
      description: 'A beautiful Holy Quran app with translation and audio',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#13547a',
      background_color: '#80d0c7',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }
      ]
    },

    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.alquran\.cloud/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'quran-api',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 7,
            },
          },
        },
      ],
    },
  }
  ,
  // build
  build: {
    transpile: ["vuetify"],
  },
  // vite
  vite: {
    define: {
      "process.env.DEBUG": false,
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
