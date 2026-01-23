<template>
  <v-container class="reader-container">
    <v-row dense>
      <!-- Translation Selector -->
      <v-col cols="12">
        <v-sheet
          elevation="1"
          rounded="lg"
          class="pa-3 mb-6 d-flex justify-end ga-2 translation-bar"
        >
          <v-chip
            v-for="item in translations"
            :key="item"
            :color="selectedType === item ? 'teal-darken-2' : 'grey-3'"
            :variant="selectedType === item ? 'flat' : 'outlined'"
            class="text-uppercase font-weight-medium"
            @click="setTranslation(item)"
          >
            {{ item }}
          </v-chip>
          <v-btn
            append-icon="mdi-plus"
            rounded="xl"
            color="primary"
            outlined
            variant="tonal"
            @click="dialog = true"
          >
            Audio
          </v-btn>
        </v-sheet>
      </v-col>

      <!-- Surah Header -->
      <v-col cols="12">
        <v-sheet elevation="1" rounded="lg" class="pa-6 mb-6 surah-header">
          <h1 class="arabic-title text-end mb-2">
            {{ data?.surahNameArabicLong }}
          </h1>

          <div class="text-end text-medium-emphasis">
            <span><strong>Surah:</strong> {{ data?.surahNo }}</span>
            ·
            <span><strong>Ayahs:</strong> {{ data?.totalAyah }}</span>
            ·
            <span
              ><strong>Revelation:</strong> {{ data?.revelationPlace }}</span
            >
          </div>
        </v-sheet>
      </v-col>

      <!-- Verses -->
      <v-col cols="12">
        <v-sheet v-if="pending" class="pa-6">
          <v-skeleton-loader type="heading, paragraph, paragraph, paragraph" />
        </v-sheet>

        <v-sheet v-else elevation="1" rounded="lg" class="pa-6 verses-sheet">
          <p
            v-for="(item, index) in verses"
            :key="index"
            align="end"
            class="verse-text"
          >
            {{ item }}
          </p>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- dialog -->
    <v-dialog v-model="dialog" width="auto">
      <v-card min-width="500">
        <v-card-title>
          <div class="d-flex items-center justify-space-between">
            Audio Player
            <v-btn
              size="small"
              icon="mdi-close"
              @click="dialog = false"
            ></v-btn>
          </div>
          <h2 class="text-h5 font-weight-black">
            Reciter:{{ data?.audio[1]?.reciter }}
          </h2>
        </v-card-title>
        <v-card-text>
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
const { data, pending, error } = useFetch("/api/chapters", {
  query: {
    chapterNo,
  },
  key: `chapter-${chapterNo}`, // cache per surah
  lazy: true, // don't block navigation
  cache: true,
});
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
/* Arabic Surah Title */
.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 2.5rem;
  line-height: 1.4;
}
/* Verse styling */
.verse-text {
  font-family: "Amiri Quran", serif;
  font-size: 2rem;
  color: #1b1b1b;
  line-height: 2.1;
}
</style>
