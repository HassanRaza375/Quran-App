<template>
  <v-container class="reader-container">
    <!-- Loading Skeleton -->
    <v-row v-if="pending">
      <v-col cols="12">
        <v-card class="pa-6" rounded="xl">
          <v-skeleton-loader type="heading" class="mb-4" />
          <v-skeleton-loader type="text@12" />
          <div class="mt-6 d-flex align-end justify-end">
            <v-skeleton-loader type="paragraph@10" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col cols="12" class="text-center text-red">
        Failed to load Juz.
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <div class="mushaf-wrap">
          <div class="mushaf-page">
            <!-- Juz Marker -->
            <div class="juz-marker">
              <span>Juz {{ data.juz }}</span>
            </div>

            <!-- Surah Marker (First Surah on Juz) -->
            <div class="surah-marker">
              <span class="surah-marker-text">
                {{ Object.keys(data.surahs) }}
              </span>
            </div>

            <!-- Quran Text (Continuous) -->
            <div class="mushaf-text">
              <template v-for="([name, surahBlock], i) in surahs" :key="i">
                <span class="surah-inline">
                  {{ name }}
                </span>

                <span
                  v-for="ayah in surahBlock.ayahs"
                  :key="ayah.number"
                  class="ayah-span"
                >
                  {{ ayah.text }}
                  <span v-if="ayah.sajda" class="sajda-marker"> ۩ </span>
                  <span class="ayah-number">﴿{{ ayah.numberInSurah }}﴾</span>
                </span>
              </template>
            </div>

            <!-- Page Number Footer (Optional, remove if not needed) -->
            <div class="page-number">Juz {{ data.juz }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();
const { getJuz } = useJuz();
const { data, pending, error } = useAsyncData(
  () => `juz-${route.params.id}`,
  () => getJuz(route.params.id),
  { watch: [() => route.params.id] },
);
const surahs = computed(() => Object.entries(data.value?.surahs || {}));

console.log("juz", data);
</script>
<style scoped>
/* ===============================
   Reader Container
================================= */

.reader-container {
  max-width: 950px;
  margin: auto;
  padding-bottom: 80px;
}

/* ===============================
   Mushaf Page Styling
================================= */

.mushaf-page {
  background: rgba(var(--v-theme-surface), 1);
  border-radius: 22px;
  padding: 56px 70px;
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

/* Inner frame border */
.mushaf-page::before {
  content: "";
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  border-radius: 18px;
  pointer-events: none;
}

/* ===============================
   Juz Marker
================================= */

.juz-marker {
  position: absolute;
  top: 30px;
  right: 26px;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.85);
  font-weight: 500;
}

/* ===============================
   Surah Marker (Top center)
================================= */

.surah-marker {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(var(--v-theme-primary), 0.08);
  border: 1px solid rgba(var(--v-theme-primary), 0.22);
  padding: 8px 18px;
  border-radius: 50px;
}

.surah-marker-text {
  font-family: "Amiri Quran", serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

/* ===============================
   Continuous Quran Text
================================= */

.mushaf-text {
  direction: rtl;
  text-align: justify;
  font-family: "Amiri Quran", serif;
  font-size: 2.25rem;
  line-height: 2.6;
  color: rgb(var(--v-theme-on-surface));
  padding-top: 86px;
  padding-bottom: 86px;
}

.ayah-span {
  display: inline;
}

/* Surah name inside text (marker style) */
.surah-inline {
  display: block;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 28px 0 18px;
  color: rgba(var(--v-theme-primary), 0.85);
}

/* ===============================
   Sajdah Marker
================================= */

.sajda-marker {
  color: rgba(var(--v-theme-secondary), 0.95);
  margin: 0 6px;
  font-size: 1.55rem;
}

/* ===============================
   Ayah Number Styling
================================= */

.ayah-number {
  font-size: 1rem;
  margin-inline: 8px;
  color: rgba(var(--v-theme-primary), 0.82);
}

/* ===============================
   Page Number Footer
================================= */

.page-number {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  font-weight: 600;
}

/* ===============================
   Dark Mode Tuning
================================= */

.v-theme--dark .mushaf-page {
  background: rgba(var(--v-theme-surface), 0.95);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
}

.v-theme--dark .mushaf-text {
  color: #e6f3f5;
}

/* ===============================
   Responsive
================================= */

@media (max-width: 900px) {
  .mushaf-page {
    padding: 44px 42px;
  }

  .juz-marker {
    top: 26px;
    right: 22px;
    font-size: 0.9rem;
  }

  .surah-marker {
    top: 26px;
    padding: 7px 16px;
  }

  .mushaf-text {
    font-size: 2.05rem;
    line-height: 2.5;
    padding-top: 78px;
    padding-bottom: 78px;
  }

  .mushaf-page::before {
    content: unset;
  }
}

@media (max-width: 600px) {
  .mushaf-page {
    padding: 30px 18px;
    border-radius: 18px;
  }

  .mushaf-text {
    font-size: 1.85rem;
    line-height: 2.35;
    padding-top: 70px;
    padding-bottom: 70px;
  }

  .juz-marker {
    top: 22px;
    right: 18px;
    font-size: 0.85rem;
  }

  .surah-marker {
    top: 22px;
    padding: 6px 14px;
    font-size: 1.05rem;
  }

  .page-number {
    bottom: 18px;
  }
}
</style>
