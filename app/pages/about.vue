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
              A modern Quran application built with Nuxt 4 & Vuetify.
            </p>
          </div>

          <v-divider class="mb-6" />

          <!-- Quran API Section -->
          <div class="mb-6">
            <h2 class="text-h6 font-weight-bold mb-2">📖 Quran Data</h2>
            <p class="text-body-1">Quran content is powered by:</p>

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

          <v-divider class="my-6" />

          <!-- Footer -->
          <div class="text-center">
            <p class="text-caption text-medium-emphasis">
              Built with ❤️ using Nuxt 4, Vuetify, and modern web technologies.
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>