<template>
  <v-container>
    <!-- Search -->
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="searchText" append-inner-icon="mdi-magnify" label="Search Surah" variant="outlined"
          clearable hide-details />
      </v-col>
    </v-row>

    <v-row dense>
      <!-- Loading skeleton -->
      <!-- <template v-if="pending">
        <v-col v-for="n in 12" :key="n" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-skeleton-loader type="card" />
        </v-col>
      </template> -->

      <!-- Surah cards -->
      <v-col v-for="surah in filteredSurahs" :key="surah.surahNo" cols="12" sm="6" md="4" lg="3" xl="2">
        <!-- @mouseenter="prefetch(surah.surahNo)" -->
        <v-lazy :min-height="137" :options="{ threshold: 0.5 }" transition="fade-transition">
          <v-card class="surah-card" elevation="1" rounded="lg" hover>
            <!-- Favorite button -->
            <v-btn icon size="small" variant="text" class="fav-btn" @click.stop="toggleFav(surah.surahNo)">
              <v-icon :color="isFav(surah.surahNo) ? 'amber' : 'grey'">
                {{ isFav(surah.surahNo) ? "mdi-star" : "mdi-star-outline" }}
              </v-icon>
            </v-btn>

            <NuxtLink :to="`/surah/${surah.surahNo}`" class="card-link">
              <v-card-text class="pt-8">
                <!-- Arabic name -->
                <div class="arabic-name">
                  {{ surah.surahNameArabicLong }}
                </div>

                <!-- English name -->
                <div class="english-name">
                  {{ surah.surahNameTranslation }}
                </div>

                <!-- Meta -->
                <div class="meta mt-3">
                  <v-chip size="x-small" variant="tonal">
                    #{{ surah.surahNo }}
                  </v-chip>

                  <v-chip size="x-small" variant="outlined" :color="surah.revelationPlace === 'Meccan' ? 'indigo' : 'teal'
                    ">
                    {{ surah.revelationPlace }}
                  </v-chip>

                  <v-chip size="x-small" variant="outlined">
                    {{ surah.totalAyah }} Ayahs
                  </v-chip>
                </div>
              </v-card-text>
            </NuxtLink>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const searchText = ref("")

const { surahs, search } = useSurahs()

const filteredSurahs = computed(() =>
  !searchText.value ? surahs : search(searchText.value)
)

/* Favorites */
const { has, toggle } = useBookmarks()

const favKey = (surahNo) => `surah:${surahNo}`
const isFav = (surahNo) => has(favKey(surahNo))
const toggleFav = (surahNo) => toggle(favKey(surahNo))
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}

.surah-card {
  position: relative;
}

.fav-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
}

.arabic-name {
  font-family: "Amiri Quran", serif;
  font-size: 1.6rem;
  text-align: right;
  direction: rtl;
}

.english-name {
  font-size: 0.9rem;
  color: #666;
}

.meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
