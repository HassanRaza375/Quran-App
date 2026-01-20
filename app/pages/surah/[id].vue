<template>
  <v-container class="reader-container">
    <v-row dense>
      <!-- Translation Selector -->
      <v-col cols="12">
        <v-sheet elevation="1" rounded="lg" class="pa-3 mb-6 d-flex justify-end ga-2 translation-bar">
          <v-chip v-for="item in Object.keys(typeObject)" :key="item"
            :color="selectedType === item ? 'teal-darken-2' : 'grey-3'"
            :variant="selectedType === item ? 'flat' : 'outlined'" class="text-uppercase font-weight-medium"
            @click="setTranslation(item)">
            {{ item }}
          </v-chip>
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
            <span><strong>Revelation:</strong> {{ data?.revelationPlace }}</span>
          </div>
        </v-sheet>
      </v-col>

      <!-- Verses -->
      <v-col cols="12">
        <v-sheet elevation="1" rounded="lg" class="pa-6 verses-sheet">
          <transition-group name="fade" tag="div">
            <p v-for="(item, index) in verses" :key="index" class="verse-text text-end mb-6">
              {{ item }}
            </p>
          </transition-group>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
definePageMeta({
  layout: "reader",
});
const route = useRoute()
const chapterNo = route.params.id
const { data, pending, error } = await useFetch('/api/chapters', {
  query: {
    chapterNo
  }
})
const selectedType = ref('arabic1')
const typeObject = computed(() => ({
  arabic1: data.value?.arabic1 ?? [],
  arabic2: data.value?.arabic2 ?? [],
  english: data.value?.english ?? [],
  bengali: data.value?.bengali ?? [],
  urdu: data.value?.urdu ?? [],
}))

const verses = computed(() => {
  return typeObject.value[selectedType.value]
})
const setTranslation = (type) => {
  selectedType.value = type
}

</script>
<style scoped>
/* Arabic Surah Title */
.arabic-title {
  font-family: 'Amiri', 'Scheherazade New', serif;
  font-size: 2.5rem;
  line-height: 1.4;
}

/* Verse styling */
.verse-text {
  font-family: 'Amiri', 'Scheherazade New', serif;
  font-size: 2rem;
  line-height: 2.8rem;
  color: #1b1b1b;
}

/* Non-Arabic translations */
.translation {
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 1.05rem;
  line-height: 1.9rem;
  color: #424242;
}

/* Fade transition when switching translations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
