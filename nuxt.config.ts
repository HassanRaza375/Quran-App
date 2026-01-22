// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // modules
  modules: ["@nuxt/eslint", "@nuxt/hints", "@nuxt/image"],
  // css
  css: ["vuetify/styles", "@mdi/font/css/materialdesignicons.css"],
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
    public: { quranApiBase: process.env.QURAN_API_BASE, quranApiBase2: process.env.QURAN_API_BASE2 },
  },
});
