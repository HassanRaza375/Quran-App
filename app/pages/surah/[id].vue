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

          <v-menu>
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                prepend-icon="mdi-account-voice"
                rounded="xl"
                variant="tonal"
                color="primary"
                :loading="loading"
              >
                {{ selected?.reciter || "Choose Reciter" }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="rec in reciters"
                :key="rec.url"
                @click="setReciter(rec)"
              >
                <v-list-item-title>{{ rec.reciter }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
        <v-slide-y-transition>
          <v-sheet v-if="activeReciter" class="reader-player" elevation="10">
            <div class="d-flex align-center px-4 py-2">
              <div class="flex-grow-1">
                <div class="text-caption">
                  Surah {{ data?.surahNameTranslation }}
                  <span>{{ durationLabel }}</span>
                </div>
                <div class="font-weight-medium">
                  {{ activeReciter?.reciter }}
                </div>
              </div>
              <div class="d-flex align-center">
                <!-- {{ remainingLabel }} -->
                <span class="d-flex align-center me-2">{{ currentTimeLabel }}</span>
                <v-btn icon @click="toggleAudio" :loading="loading">
                  <v-icon>
                    {{ isThisSurahPlaying ? "mdi-pause" : "mdi-play" }}
                  </v-icon>
                </v-btn>
              </div>
            </div>

            <v-slider
              :model-value="progress"
              :max="duration || 0"
              step="1"
              hide-details
              @update:model-value="seek"
            />
          </v-sheet>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({ layout: "reader" });

const route = useRoute();
const { getChapter } = useChapters();
const { selected, setReciter, loadSaved } = useReciter();

const chapterNo = computed(() => Number(route.params.id));

const {
  play,
  pause,
  seek,
  playing,
  progress,
  duration,
  currentUrl,
  loading,
  currentTimeLabel,
  durationLabel,
  remainingLabel,
} = useAudioPlayer();

const { data, pending, error } = useAsyncData(
  () => `chapter-${chapterNo.value}`,
  () => getChapter(chapterNo.value),
  { watch: [chapterNo] },
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
const reciters = computed(() =>
  data.value?.audio ? Object.values(data.value.audio) : [],
);

const setTranslation = (type) => {
  selectedType.value = type;
};

// audio playing
const activeReciter = computed(() => selected.value);
const isThisSurahPlaying = computed(() => {
  return currentUrl.value === activeReciter.value?.url && playing.value;
});
const toggleAudio = () => {
  if (!activeReciter.value) return;

  if (isThisSurahPlaying.value) pause();
  else play(activeReciter.value.url);
};

/* ---------- Ayah bookmarks ---------- */
const { load, isAyahBookmarked, toggleAyah } = useBookmarks();

onMounted(() => {
  load();
  loadSaved();
});

const isAyahFav = (ayahNo) => {
  return isAyahBookmarked(chapterNo.value, ayahNo);
};

const toggleAyahBookmark = (ayahNo) => {
  toggleAyah(chapterNo.value, ayahNo);
};
watch(
  reciters,
  (list) => {
    if (list?.length) {
      setReciter(list[0]);
    }
  },
  { immediate: true },
);
watch(chapterNo, () => {
  selected.value = null; // reset when navigating
});
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
  margin-bottom: 97px;
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
.reader-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(var(--v-theme-surface), 0.98);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  z-index: 999999;
}
</style>
