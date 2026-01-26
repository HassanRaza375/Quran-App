<template>
  <v-container class="reader-container">
    <v-row dense>
      <v-col cols="12" v-if="error"> Error: {{ error.message }} </v-col>

      <v-col cols="12"> Juz of Quran {{ juzNo }} </v-col>
      <!-- Verses -->
      <v-col cols="12">
        <v-sheet v-if="pending" class="pa-6 verses-sheet rtl">
          <v-skeleton-loader type="heading" class="mb-4 skeleton-rtl" />

          <v-skeleton-loader
            v-for="n in 6"
            :key="n"
            type="paragraph"
            class="mb-2 skeleton-rtl"
          />
        </v-sheet>

        <v-sheet
          v-if="!pending && data"
          elevation="1"
          rounded="lg"
          class="pa-6 verses-sheet"
        >
          <div
            v-for="(surahBlock, surahName) in data.surahs"
            :key="surahName"
            class="mb-6"
          >
            <h2 class="mb-3 text-center arabic-title">
              {{ surahBlock.surah.name }}
            </h2>

            <div
              v-for="ayah in surahBlock.ayahs"
              :key="ayah.number"
              align="end"
              class="verse-text"
            >
              <p>
                {{ ayah.text }}
                <span class="ayah-number">﴿{{ ayah.numberInSurah }}﴾</span>
              </p>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { id } = useRoute().params
const { getJuz } = useJuz();
const { data, pending, error } = useAsyncData("juz", () => getJuz(id));
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

.rtl {
  direction: rtl;
}

.skeleton-rtl .v-skeleton-loader__text {
  margin-left: auto;
}
</style>
