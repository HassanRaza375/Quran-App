<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="xl" class="pa-6">
          <!-- Header -->
          <div class="text-center mb-8">
            <v-icon size="48" color="primary" class="mb-3">
              mdi-book-open-page-variant
            </v-icon>
            <h1 class="text-h4 font-weight-bold">About This App</h1>
            <p class="text-medium-emphasis mt-2">
              A local-first Qur'an companion — reading, translations, tafsir, audio, prayer
              times, and a structured Qur'anic knowledge platform.
            </p>
          </div>

          <v-divider class="mb-6" />

          <!-- What this is -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">📱 What This App Is</h2>
            <p class="text-body-1">
              This is a Qur'an reading and study app built with Nuxt 4 and Vuetify. It works
              without an account — reading progress, bookmarks, reading goals, Hifz (memorization)
              progress, and settings are all stored on your own device, not on a server.
            </p>
          </div>

          <!-- Knowledge Platform -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">🕸️ The Qur'anic Knowledge Platform</h2>
            <p class="text-body-1 mb-3">
              Beyond the Qur'an text itself, this app includes nine cross-linked reference modules
              that catalog what the Qur'an describes — each one scoped narrowly and cross-checked
              against the Qur'an text before being included:
            </p>
            <v-row dense>
              <v-col v-for="m in knowledgeModules" :key="m.to" cols="12" sm="6">
                <NuxtLink :to="m.to" class="module-link">
                  <v-sheet rounded="lg" class="pa-3 module-tile" elevation="0">
                    <div class="d-flex align-center ga-2 mb-1">
                      <v-icon size="18" color="primary">{{ m.icon }}</v-icon>
                      <span class="font-weight-medium">{{ m.name }}</span>
                      <v-chip size="x-small" variant="tonal" class="ml-auto">{{ m.count }}</v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis">{{ m.description }}</div>
                  </v-sheet>
                </NuxtLink>
              </v-col>
            </v-row>
            <p class="text-body-1 mt-3">
              A Knowledge Graph connects these modules to each other and to the People and Places
              already in the app — for example, an Event page can show the Signs, Duas, or
              Commands connected to it, even where that connection isn't declared directly on the
              Event's own entry, by tracing it through the other module's own reference.
            </p>
          </div>

          <!-- Source discipline -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">🔍 Distinguishing Fact from Interpretation</h2>
            <p class="text-body-1 mb-3">
              Every entry in the knowledge modules above is labeled with how directly it comes
              from the Qur'an text itself:
            </p>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-check-circle-outline">
                <v-list-item-title class="text-body-2">
                  <strong>Qur'an-explicit</strong> — directly stated in the Qur'an's own wording.
                </v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-book-search-outline">
                <v-list-item-title class="text-body-2">
                  <strong>Qur'anic context</strong> — established by the Qur'an's own surrounding
                  narrative, without one single verse stating it outright.
                </v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-history">
                <v-list-item-title class="text-body-2">
                  <strong>Traditional</strong> — a later identification (a name, a site, a detail)
                  layered onto the Qur'an text by tradition, not stated in the Qur'an itself.
                </v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-help-circle-outline">
                <v-list-item-title class="text-body-2">
                  <strong>Disputed</strong> — scholars differ, and the Qur'an does not itself
                  settle the question.
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <p class="text-body-1 mt-2">
              Where an entry depends on the weaker tiers, that's disclosed on the entry itself
              rather than presented as settled Qur'anic fact.
            </p>
          </div>

          <!-- Quran API Section -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">📖 Qur'an Data</h2>
            <p class="text-body-1">Qur'an text, translations, tafsir, and audio are fetched from:</p>

            <v-list density="comfortable">
              <v-list-item
                prepend-icon="mdi-api"
                title="Quran API"
                subtitle="https://quranapi.pages.dev/api"
              />
              <v-list-item
                prepend-icon="mdi-cloud-outline"
                title="AlQuran Cloud API"
                subtitle="https://alquran.cloud/api"
              />
            </v-list>
          </div>

          <!-- Prayer Times -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">🕌 Prayer Times</h2>
            <p class="text-body-1">
              Prayer times are calculated using your current location and
              fetched from a reliable prayer time service API.
            </p>
          </div>

          <!-- Qibla -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">🧭 Qibla Direction</h2>
            <p class="text-body-1">
              Qibla direction is calculated based on your geographic coordinates
              using precise spherical trigonometry relative to the Kaaba in
              Makkah.
            </p>
          </div>

          <!-- Privacy -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">🔒 Local-First</h2>
            <p class="text-body-1">
              Bookmarks, reading goals, Hifz progress, and settings are stored on your own device
              (in your browser's local storage and IndexedDB) — not uploaded anywhere. Prayer
              times and Qibla direction do send your device's location to the prayer-time API
              above in order to calculate them.
            </p>
          </div>

          <!-- Limitations -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">⚠️ Limitations</h2>
            <p class="text-body-1">
              The knowledge modules above were compiled by carefully reading the Qur'an text
              itself against the source tiers described earlier. This app is not affiliated with
              any religious institution, and its classifications are not a substitute for guidance
              from a qualified scholar — where the app itself is uncertain, it says so on the entry
              rather than presenting a guess as settled fact.
            </p>
          </div>

          <v-divider class="my-6" />

          <!-- Footer -->
          <div class="text-center">
            <p class="text-caption text-medium-emphasis mb-1">
              Built with ❤️ using Nuxt 4, Vuetify, and modern web technologies.
            </p>
            <NuxtLink to="/sitemap" class="text-caption">See the full Sitemap →</NuxtLink>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
useHead({
  title: "About — Quran App",
});
useSeoMeta({
  description:
    "A local-first Qur'an companion with reading, translations, tafsir, audio, prayer times, and a structured Qur'anic knowledge platform covering People, Places, Stories, Themes, Duas, Events, Signs, and Commands.",
});

const knowledgeModules = [
  { name: "People & Groups", to: "/persons", icon: "mdi-account-group-outline", count: 59, description: "Prophets, named figures, and groups mentioned in the Qur'an." },
  { name: "Peoples & Nations", to: "/peoples", icon: "mdi-map-marker-radius-outline", count: 14, description: "Communities and nations the Qur'an describes." },
  { name: "Places", to: "/places", icon: "mdi-map-outline", count: 16, description: "Real-world locations named or described in the Qur'an." },
  { name: "Stories", to: "/stories", icon: "mdi-book-open-page-variant-outline", count: 21, description: "The Qur'an's narrative accounts, prophet by prophet." },
  { name: "Themes", to: "/themes", icon: "mdi-lightbulb-on-outline", count: 42, description: "Recurring doctrinal and moral concepts across the Qur'an." },
  { name: "Duas", to: "/duas", icon: "mdi-hands-pray", count: 38, description: "Supplications made by name in the Qur'an's own text." },
  { name: "Events", to: "/events", icon: "mdi-timeline-clock-outline", count: 40, description: "Discrete occurrences within or across the Stories." },
  { name: "Signs & Miracles", to: "/signs", icon: "mdi-star-four-points-outline", count: 14, description: "Specific signs and miracles the Qur'an itself names as such." },
  { name: "Commands & Prohibitions", to: "/commands", icon: "mdi-gavel", count: 18, description: "The Qur'an's own direct commands and prohibitions." },
];
</script>

<style scoped>
.module-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.module-tile {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  height: 100%;
  transition: background 0.15s ease;
}

.module-link:hover .module-tile {
  background: rgba(var(--v-theme-primary), 0.06);
}
</style>
