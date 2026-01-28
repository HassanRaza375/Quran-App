// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Quran App', 
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon2.png' },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // modules
  modules: ["@nuxt/eslint", "@nuxt/hints", "@nuxt/image", "@nuxt/fonts"],
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
