<template>
  <v-container class="reader-container">
    <!-- Translation & Audio Bar -->
    <v-row>
      <v-col cols="12">
        <v-sheet
          elevation="0"
          rounded="lg"
          class="pa-3 mb-6 d-flex justify-space-between align-center translation-bar"
          color="surface"
        >
          <div class="d-flex ga-2">
            <v-chip
              v-for="item in translations"
              :key="item"
              :color="selectedType === item ? 'primary' : undefined"
              :variant="selectedType === item ? 'flat' : 'outlined'"
              size="small"
              class="text-uppercase"
              @click="setTranslation(item)"
            >
              {{ item }}
            </v-chip>
          </div>

          <v-btn
            prepend-icon="mdi-volume-high"
            rounded="xl"
            variant="tonal"
            color="primary"
            @click="dialog = true"
          >
            Audio
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Surah Header -->
    <v-row>
      <v-col cols="12">
        <v-sheet
          elevation="1"
          rounded="lg"
          class="pa-6 mb-8 surah-header"
          color="surface"
        >
          <h1 class="arabic-title text-center mb-3">
            {{ data?.surahNameArabicLong }}
          </h1>

          <div class="text-center text-medium-emphasis meta">
            <span>Surah {{ data?.surahNo }}</span>
            ·
            <span>{{ data?.totalAyah }} Ayahs</span>
            ·
            <span>{{ data?.revelationPlace }}</span>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Verses -->
    <v-row>
      <v-col cols="12">
        <!-- Loader -->
        <v-sheet v-if="pending" class="pa-6" color="surface">
          <v-skeleton-loader type="heading, paragraph, paragraph, paragraph" />
        </v-sheet>

        <!-- Verses -->
        <v-sheet
          v-else
          elevation="0"
          rounded="lg"
          class="pa-6 verses-sheet"
          color="surface"
        >
          <div v-for="(item, index) in verses" :key="index" class="verse-block">
            <div class="d-flex align-start justify-end align-center ga-3">
              <!-- Verse text -->
              <section :id="`ayah-${index + 1}`" class="verse-text flex-1">
                {{ item }}
                <span class="ayah-number">﴿{{ index + 1 }}﴾</span>
              </section>

              <!-- Bookmark (Ayah favorite) -->
              <v-btn
                icon
                size="small"
                variant="text"
                class="ayah-fav-btn"
                @click.stop="toggleAyahBookmark(index + 1)"
              >
                <v-icon :color="isAyahFav(index + 1) ? 'amber' : 'grey'">
                  {{ isAyahFav(index + 1) ? "mdi-star" : "mdi-star-outline" }}
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Audio Dialog -->
    <v-dialog v-model="dialog" width="420">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-2 text-medium-emphasis">Recitation</div>
            <div class="text-h6 font-weight-bold">
              {{ data?.audio[1]?.reciter }}
            </div>
          </div>

          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="dialog = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <audio ref="audioRef" controls preload="metadata" class="w-100">
            <source :src="data?.audio[1]?.url" type="audio/mpeg" />
          </audio>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
definePageMeta({ layout: "reader" });

const route = useRoute();
const dialog = ref(false);

const chapterNo = computed(() => Number(route.params.id));

const { getChapter } = useChapters();
const { data, pending, error } = useAsyncData("chapters", () =>
  getChapter(chapterNo.value),
);

const translations = ref(["arabic1", "arabic2", "english", "bengali", "urdu"]);
const selectedType = ref("arabic1");

const typeObject = computed(() => ({
  arabic1: data.value?.arabic1 ?? [],
  arabic2: data.value?.arabic2 ?? [],
  english: data.value?.english ?? [],
  bengali: data.value?.bengali ?? [],
  urdu: data.value?.urdu ?? [],
}));

const verses = computed(() => typeObject.value[selectedType.value]);

const setTranslation = (type) => {
  selectedType.value = type;
};

/* ---------- Ayah bookmarks ---------- */
const { load, isAyahBookmarked, toggleAyah } = useBookmarks();

onMounted(() => {
  load(); // safe even if you already load in layout
});

const isAyahFav = (ayahNo) => {
  return isAyahBookmarked(chapterNo.value, ayahNo);
};

const toggleAyahBookmark = (ayahNo) => {
  toggleAyah(chapterNo.value, ayahNo);
};
watch(dialog, (v) => {
  if (v) {
    const audio = new Audio(data.value.audio[1].url);
    audio.preload = "auto";
  }
});
/* ----------------------------------- */
</script>

<style scoped>
/* ===============================
   Reader Container
================================= */

.reader-container {
  max-width: 900px;
  margin: auto;
  padding-bottom: 80px;
}

/* ===============================
   Translation Bar
================================= */

.translation-bar {
  backdrop-filter: blur(6px);
  background: rgba(var(--v-theme-surface), 0.85);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 8px;
}

/* ===============================
   Surah Header
================================= */

.surah-header {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-secondary), 0.05)
  );
}

.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 3rem;
  line-height: 1.6;
  color: rgb(var(--v-theme-primary));
}

.meta {
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

/* ===============================
   Verses Sheet
================================= */

.verses-sheet {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  background: rgba(var(--v-theme-surface), 1);
}

/* ===============================
   Verse Block
================================= */

.verse-block {
  padding: 20px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.verse-block:last-child {
  border-bottom: none;
}

/* ===============================
   Arabic Verse Text
================================= */

.verse-text {
  font-family: "Amiri Quran", serif;
  font-size: 2.2rem;
  line-height: 2.6;
  direction: rtl;
  text-align: justify;
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.2s ease;
}

/* Light mode tuning */
.v-theme--light .verse-text {
  color: #1c2b33;
}

/* Dark mode tuning */
.v-theme--dark .verse-text {
  color: #e6f3f5;
}

/* ===============================
   Ayah Number
================================= */

.ayah-number {
  font-size: 1rem;
  margin-inline-start: 8px;
  color: rgba(var(--v-theme-primary), 0.7);
}

/* ===============================
   Bookmark Button
================================= */

.ayah-fav-btn {
  margin-top: 6px;
  flex: 0 0 auto;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.ayah-fav-btn:hover {
  opacity: 1;
}

/* ===============================
   Chips Styling
================================= */

.v-chip.v-chip--density-default {
  min-width: 70px;
  justify-content: center;
  font-weight: 500;
}

/* ===============================
   Responsive Improvements
================================= */

@media (max-width: 600px) {
  .arabic-title {
    font-size: 2.2rem;
  }

  .verse-text {
    font-size: 1.8rem;
    line-height: 2.4;
  }

  .reader-container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
