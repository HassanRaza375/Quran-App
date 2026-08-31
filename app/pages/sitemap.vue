<template>
  <v-container class="py-10 sitemap-container">
    <div class="text-center mb-8">
      <v-icon size="48" color="primary" class="mb-3">mdi-sitemap-outline</v-icon>
      <h1 class="text-h4 font-weight-bold">Sitemap</h1>
      <p class="text-medium-emphasis mt-2">Everything in the app, in one place.</p>
    </div>

    <v-row>
      <v-col v-for="section in sections" :key="section.title" cols="12" sm="6" lg="4">
        <v-card elevation="1" rounded="lg" class="pa-4 h-100">
          <div class="d-flex align-center ga-2 mb-3">
            <v-icon color="primary" size="20">{{ section.icon }}</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold mb-0">{{ section.title }}</h2>
          </div>
          <v-list density="compact" nav class="pa-0">
            <v-list-item
              v-for="link in section.links"
              :key="link.to"
              :to="link.to"
              :title="link.label"
              :subtitle="link.count != null ? `${link.count} entries` : undefined"
              class="px-0"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
useHead({
  title: "Sitemap — Quran App",
});
useSeoMeta({
  description: "A full map of every section of the app — the Qur'an reader, the Qur'anic knowledge modules, and every worship tool.",
});

const sections = [
  {
    title: "Qur'an",
    icon: "mdi-book-open-variant",
    links: [
      { to: "/", label: "Home" },
      { to: "/surah-listing", label: "Surah Listing", count: 114 },
      { to: "/juz", label: "Juz Index", count: 30 },
      { to: "/asma-ul-husna", label: "Asma-ul-Husna (99 Names)", count: 99 },
      { to: "/sajda", label: "Sajda — Verses of Prostration" },
      { to: "/surah-vedios", label: "Surah Videos" },
    ],
  },
  {
    title: "Qur'anic Knowledge Platform",
    icon: "mdi-graph-outline",
    links: [
      { to: "/persons", label: "People & Groups", count: 59 },
      { to: "/persons/timeline", label: "Prophetic Timeline" },
      { to: "/peoples", label: "Peoples & Nations", count: 14 },
      { to: "/places", label: "Places", count: 16 },
      { to: "/stories", label: "Stories", count: 21 },
      { to: "/themes", label: "Themes", count: 42 },
      { to: "/duas", label: "Duas", count: 38 },
      { to: "/events", label: "Events", count: 40 },
      { to: "/signs", label: "Signs & Miracles", count: 14 },
      { to: "/commands", label: "Commands & Prohibitions", count: 18 },
    ],
  },
  {
    title: "Worship Tools",
    icon: "mdi-mosque",
    links: [
      { to: "/prayerTime", label: "Prayer Times" },
      { to: "/qibla-direction", label: "Qibla Direction" },
      { to: "/calender", label: "Islamic Calendar" },
      { to: "/tasbeeh", label: "Tasbeeh Counter" },
      { to: "/ramadan", label: "Ramadan Mode" },
      { to: "/hifz", label: "Hifz (Memorization) Mode" },
    ],
  },
  {
    title: "Your Study Tools",
    icon: "mdi-account-outline",
    links: [
      { to: "/search", label: "Search" },
      { to: "/bookmarks", label: "Bookmarks" },
      { to: "/goals", label: "Reading Goals" },
      { to: "/downloads", label: "Downloads" },
      { to: "/per-page-read", label: "Per-Page Reading" },
      { to: "/settings", label: "Settings" },
    ],
  },
  {
    title: "About",
    icon: "mdi-information-outline",
    links: [
      { to: "/about", label: "About This App" },
    ],
  },
];
</script>

<style scoped>
.sitemap-container {
  max-width: 1100px;
  margin: auto;
}
</style>
