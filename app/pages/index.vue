<template>
  <v-container>
    <v-row dense>
      <!-- Loading skeleton -->
      <template v-if="pending">
        <v-col v-for="n in 12" :key="n" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-skeleton-loader type="card" />
        </v-col>
      </template>

      <!-- Surah list -->
      <v-col
        v-for="(surah, i) in data"
        :key="surah.surahNo"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <NuxtLink
          :to="`/surah/${i + 1}`"
          @mouseenter="prefetch(surah.surahNo)"
        >
          <v-card outlined hover>
            <v-card-item>
              <v-card-title>
                <div class="d-flex justify-end">
                  <span class="font-weight-black">
                    {{ surah.surahNameArabicLong }}
                  </span>
                </div>
              </v-card-title>

              <v-card-subtitle> Quran Aya {{ i + 1 }} </v-card-subtitle>
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
const { data, pending, error } = useFetch("/api/surahs", {
  key: "surah-list",
  lazy: true,
  cache: true,
});
const prefetch = (id) => {
  useFetch("/api/chapters", {
    query: { chapterNo: id },
    key: `chapter-${id}`,
  });
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: #000;
}
</style>
