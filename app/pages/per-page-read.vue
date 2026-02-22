<template>
  <v-container>
    <!-- Controls -->
    <v-row align="center">
      <v-col cols="12" md="4">
        <v-autocomplete
          v-model="page"
          :items="pages"
          item-title="title"
          item-value="value"
          label="Pages"
          variant="outlined"
          :loading="pending"
          :disabled="pending"
        />
      </v-col>

      <v-col cols="12" md="8" class="d-flex justify-end" style="gap: 12px">
        <v-btn
          variant="outlined"
          :disabled="page === 1 || pending"
          :loading="pending && navDir === 'prev'"
          @click="prevPage"
        >
          Prev
        </v-btn>

        <v-btn
          color="primary"
          :disabled="page === 604 || pending"
          :loading="pending && navDir === 'next'"
          @click="nextPage"
        >
          Next
        </v-btn>
      </v-col>
    </v-row>

    <!-- Skeleton Loader -->
    <v-row v-if="pending">
      <v-col cols="12" v-for="i in 6" :key="i">
        <v-skeleton-loader type="paragraph" />
      </v-col>
    </v-row>

    <!-- Verses -->
    <v-row v-else>
      <v-col cols="12">
        <div class="mushaf-page">
          <!-- Surah Marker -->
          <div class="surah-marker">
            <span class="surah-marker-text">
              {{ ayahs[0]?.surah?.name }}
            </span>
          </div>

          <!-- Juz / Hizb Markers -->
          <div class="juz-marker">
            <span>Juz {{ ayahs[0]?.juz }}</span>
          </div>

          <div class="hizb-marker">
            <span>Hizb {{ ayahs[0]?.hizbQuarter }}</span>
          </div>

          <!-- Quran Text (Continuous) -->
          <div class="mushaf-text">
            <span v-for="item in ayahs" :key="item.number" class="ayah-span">
              {{ item.text }}
              <span v-if="item.sajda" class="sajda-marker"> ۩ </span>
              <span class="ayah-number">﴿{{ item.numberInSurah }}﴾</span>
            </span>
          </div>

          <!-- Page Number Footer -->
          <div class="page-number">
            {{ page }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const page = ref(1);
const navDir = ref(null);

const TOTAL_PAGES = 604;

const { data, pending, refresh } = await useFetch(
  () => `https://api.alquran.cloud/v1/page/${page.value}/quran-uthmani`,
  { watch: [page] }
);

const ayahs = computed(() => data.value?.data?.ayahs || []);

const nextPage = () => {
  if (page.value < TOTAL_PAGES) {
    navDir.value = "next";
    page.value++;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    navDir.value = "prev";
    page.value--;
  }
};

const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
  title: `Page - ${i + 1}`,
  value: i + 1,
}));
</script>

<style scoped>
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
  margin-bottom: 20px;
}

/* Inner frame border */
.mushaf-page::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  border-radius: 18px;
  pointer-events: none;
}

/* ===============================
   Surah Marker
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
   Juz / Hizb Markers (Spaced)
================================= */

.juz-marker {
  position: absolute;
  top: 30px;
  right: 26px;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.85);
  font-weight: 500;
}

.hizb-marker {
  position: absolute;
  top: 30px;
  left: 26px;
  font-size: 0.95rem;
  color: rgba(var(--v-theme-on-surface), 0.85);
  font-weight: 500;
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
  /* spacing for markers */
  padding-bottom: 86px;
  /* spacing for footer */
}

.ayah-span {
  display: inline;
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

  .juz-marker,
  .hizb-marker {
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

  .juz-marker,
  .hizb-marker {
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
