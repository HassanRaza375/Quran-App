// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Quran App",
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-16",
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
    registerType: "autoUpdate",

    manifest: {
      name: "My Quran App",
      short_name: "Quran",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",

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
      ],
    },

    workbox: {
      navigateFallback: "/",
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.alquran\.cloud/,
          handler: "NetworkFirst",
          options: {
            cacheName: "quran-api",
          },
        },
      ],
    },
  },
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
