<template>
  <v-container class="py-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h2>Ayāt as-Sajdah({{ data?.data?.ayahs?.length }})</h2>
        <p class="text-medium-emphasis">Verses of prostration in the Quran</p>
      </v-col>
    </v-row>

    <!-- Loader -->
    <v-row v-if="pending">
      <v-col cols="12">
        <v-skeleton-loader type="heading, paragraph, paragraph, paragraph" />
      </v-col>
    </v-row>

    <!-- Error -->
    <v-row v-else-if="error">
      <v-col cols="12" class="text-error"> Failed to load sajda verses </v-col>
    </v-row>

    <!-- Sajda verses -->
    <v-row v-else>
      <v-col cols="12" v-for="ayah in data.data.ayahs" :key="ayah.number">
        <v-card elevation="1" rounded="lg" class="pa-4 sajda-card">
          <!-- Sajda badge -->
          <v-chip
            :color="ayah.sajda.obligatory ? 'red' : 'primary'"
            variant="flat"
            class="mb-2"
          >
            {{
              ayah.sajda.obligatory ? "Obligatory Sajda" : "Recommended Sajda"
            }}
          </v-chip>

          <!-- Ayah text -->
          <p class="ayah-text mb-4">
            {{ ayah.text }}
            <span class="ayah-number">﴿{{ ayah.numberInSurah }}﴾</span>
          </p>

          <!-- Meta info -->
          <v-divider class="mb-3" />

          <div class="meta">
            <div>
              <strong>{{ ayah.surah.name }}</strong>
              <span class="english"> ({{ ayah.surah.englishName }}) </span>
            </div>

            <div class="meta-row">
              Juz {{ ayah.juz }} · Page {{ ayah.page }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { getAll } = useSajda();
const { data, pending, error } = await useAsyncData("sajda", () => getAll(), {
  cache: true,
});
</script>

<style scoped>
.ayah-text {
  direction: rtl;
  text-align: right;
  font-size: 1.3rem;
  line-height: 2.3;
}

.ayah-number {
  font-size: 0.9rem;
  margin-inline-start: 6px;
  color: #666;
}

.meta {
  font-size: 0.9rem;
}

.meta-row {
  color: #666;
}

.english {
  color: #777;
  font-size: 0.85rem;
}

.sajda-card {
  border-inline-start: 4px solid transparent;
}

.sajda-card:has(.v-chip.red) {
  border-inline-start-color: #d32f2f;
}

.sajda-card:has(.v-chip.primary) {
  border-inline-start-color: #1976d2;
}
</style>
