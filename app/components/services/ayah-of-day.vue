<script setup lang="ts">
const { ayah, loading, fetchAyahOfTheDay } = useAyahOfTheDay();

onMounted(fetchAyahOfTheDay);
</script>

<template>
  <!-- Ayah of the Day -->
  <v-row>
    <v-col cols="12">
      <v-card rounded="xl" elevation="10" class="ayah-card-modern pa-5">
        <div class="d-flex align-center justify-space-between mb-3">
          <div>
            <div class="text-overline text-grey-lighten-1">
              Daily Reflection
            </div>
            <div class="text-h6 font-weight-bold">Ayah of the Day</div>
          </div>

          <v-chip class="text-white" size="small" variant="tonal">
            Quran
          </v-chip>
        </div>
        <v-progress-linear v-if="loading" indeterminate />

        <template v-if="ayah && !loading">
          <div class="ayah-arabic-modern mb-3"> ﴾{{ ayah.arabic }}﴿ </div>

          <div class="ayah-translation-modern">“{{ ayah.urdu }}”</div>

          <v-divider class="my-4" opacity="0.2" />

          <div class="d-flex justify-space-between align-center">
            <div class="ayah-meta">
              Surah {{ ayah.surah_name }} • {{ ayah.surah_number }}:{{
                ayah.ayah_number
              }}
            </div>

            <div>
              <v-btn
                icon="mdi-refresh"
                variant="text"
                @click="fetchAyahOfTheDay"
              />
              <v-btn icon="mdi-share-variant-outline" variant="text" />
              <v-btn icon="mdi-bookmark-outline" variant="text" />
            </div>
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>
<style scoped>
.ayah-arabic-modern {
  font-size: 28px;
  text-align: center;
  font-family: "Amiri", serif;
  line-height: 1.8;
}

.ayah-translation-modern {
  font-size: 16px;
  text-align: center;
  opacity: 0.85;
}

.ayah-meta {
  font-size: 13px;
  opacity: 0.7;
}
</style>
