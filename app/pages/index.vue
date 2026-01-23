<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchText"
          append-inner-icon="mdi-magnify"
          label="Search Surah"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-row dense>
      <!-- Loading skeleton -->
      <template v-if="pending">
        <v-col v-for="n in 12" :key="n" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-skeleton-loader type="card" />
        </v-col>
      </template>

      <!-- Surah list -->
      <v-col
        v-for="surah in filteredSurahs"
        :key="surah.surahNo"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <NuxtLink :to="`/surah/${surah.surahNo}`">
          <v-card outlined hover @mouseenter="prefetch(surah.surahNo)">
            <v-card-item>
              <v-card-title>
                <div class="d-flex justify-end">
                  <span class="font-weight-black">
                    {{ surah.surahNameArabicLong }}
                  </span>
                </div>
              </v-card-title>

              <v-card-subtitle> Quran Aya {{ surah.surahNo }} </v-card-subtitle>
            </v-card-item>

            <v-card-text class="bg-surface-light pt-4">
              <div>English Name: ({{ surah.surahNameTranslation }})</div>
              <div>Revelation Place: {{ surah.revelationPlace }}</div>
            </v-card-text>
          </v-card>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, computed } from "vue";

const searchText = ref("");

const { data, pending, error } = useFetch("/api/surahs", {
  key: "surah-list",
  lazy: true,
  cache: true,
});

const surahsWithNumber = computed(() => {
  if (!data.value) return [];

  return data.value.map((surah, index) => ({
    ...surah,
    surahNo: index + 1,
  }));
});

const filteredSurahs = computed(() => {
  if (!searchText.value) return surahsWithNumber.value;

  const q = searchText.value.toLowerCase();

  return surahsWithNumber.value.filter(
    (surah) =>
      surah.surahName.includes(q) ||
      surah.surahNameTranslation.toLowerCase().includes(q) ||
      surah.surahNameArabicLong.includes(searchText.value) ||
      surah.revelationPlace.toLowerCase().includes(q),
  );
});
const prefetch = (surahNo) => {
  useFetch("/api/chapters", {
    query: { chapterNo: surahNo },
    key: `chapter-${surahNo}`,
    cache: true,
  });
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: #000;
}
</style>
