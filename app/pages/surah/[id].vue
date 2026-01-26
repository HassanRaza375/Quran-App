<template>
  <v-container class="reader-container">
    <!-- Translation & Audio Bar -->
    <v-row>
      <v-col cols="12">
        <v-sheet
          elevation="0"
          rounded="lg"
          class="pa-3 mb-6 d-flex justify-space-between align-center translation-bar"
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
        <v-sheet elevation="1" rounded="lg" class="pa-6 mb-8 surah-header">
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
        <v-sheet v-if="pending" class="pa-6">
          <v-skeleton-loader type="heading, paragraph, paragraph, paragraph" />
        </v-sheet>

        <!-- Verses -->
        <v-sheet v-else elevation="0" rounded="lg" class="pa-6 verses-sheet">
          <div v-for="(item, index) in verses" :key="index" class="verse-block">
            <p class="verse-text">
              {{ item }}
              <span class="ayah-number">﴿{{ index + 1 }}﴾</span>
            </p>
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
          <audio controls class="w-100">
            <source :src="data?.audio[1]?.url" type="audio/mpeg" />
          </audio>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "reader",
});
const route = useRoute();
const dialog = ref(false);
const chapterNo = route.params.id;
const { getChapter } = useChapters();
const { data, pending, error } = useAsyncData("chapters", () =>
  getChapter(chapterNo),
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

const verses = computed(() => {
  return typeObject.value[selectedType.value];
});
const setTranslation = (type) => {
  selectedType.value = type;
};
</script>
<style scoped>
/* Surah title */
.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 3rem;
  line-height: 1.5;
}

/* Meta info */
.meta {
  font-size: 0.95rem;
}

/* Verse container */
.verses-sheet {
  background: transparent;
}

/* Verse block spacing */
.verse-block {
  margin-bottom: 2.5rem;
}

/* Arabic verse */
.verse-text {
  font-family: "Amiri Quran", serif;
  font-size: 2.1rem;
  line-height: 2.4;
  direction: rtl;
  text-align: right;
  color: #1b1b1b;
}

/* Ayah number */
.ayah-number {
  font-size: 1rem;
  margin-inline-start: 8px;
  color: #777;
}

/* Translation bar */
.translation-bar {
  background: rgba(0, 0, 0, 0.02);
}
</style>
