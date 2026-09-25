<template>
  <v-btn-toggle
    :model-value="lang"
    mandatory
    divided
    density="comfortable"
    color="primary"
    variant="outlined"
    aria-label="Language of the rulings"
    @update:model-value="setLang"
  >
    <v-btn value="en" :aria-pressed="lang === 'en'">English</v-btn>
    <v-btn value="ur" :aria-pressed="lang === 'ur'"><span class="urdu-inline" lang="ur">اردو</span></v-btn>
    <v-btn value="both" :aria-pressed="lang === 'both'">Both</v-btn>
  </v-btn-toggle>
</template>

<script setup>
const { lang, setLang } = useFiqhPrefs();
</script>
