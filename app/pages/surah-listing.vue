<template>
  <v-container>
    <!-- Search -->
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
      <v-col cols="12">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              prepend-icon="mdi-account-voice"
              rounded="xl"
              variant="tonal"
              color="primary"
            >
              {{ selected?.reciter || "Choose Reciter" }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="rec in globalReciters"
              :key="rec.id"
              @click="setReciter(rec)"
            >
              <v-list-item-title>
                {{ rec.reciter }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
      <v-col
        v-for="surah in filteredSurahs"
        :key="surah.surahNo"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <!-- @mouseenter="prefetch(surah.surahNo)" -->
        <v-lazy
          :min-height="137"
          :options="{ threshold: 0.5 }"
          transition="fade-transition"
        >
          <v-card class="surah-card" elevation="1" rounded="lg" hover>
            <!-- PLAY BUTTON -->
            <v-btn
              icon
              size="small"
              variant="text"
              class="play-btn"
              @click.stop="toggleSurahAudio(surah)"
              :loading="isThisLoading(surah)"
            >
              <v-icon>
                {{ isPlaying(surah) ? "mdi-pause" : "mdi-play" }}
              </v-icon>
            </v-btn>

            <!-- Favorite button -->
            <v-btn
              icon
              size="small"
              variant="text"
              class="fav-btn"
              @click.stop="toggleFav(surah.surahNo)"
            >
              <v-icon :color="isFav(surah.surahNo) ? 'amber' : 'grey'">
                {{ isFav(surah.surahNo) ? "mdi-star" : "mdi-star-outline" }}
              </v-icon>
            </v-btn>

            <NuxtLink :to="`/surah/${surah.surahNo}`" class="card-link">
              <v-card-text class="pt-8">
                <div class="arabic-name">
                  {{ surah.surahNameArabicLong }}
                </div>

                <div class="english-name">
                  {{ surah.surahNameTranslation }}
                </div>

                <div class="meta mt-3">
                  <v-chip size="x-small" variant="tonal">
                    #{{ surah.surahNo }}
                  </v-chip>

                  <v-chip
                    size="x-small"
                    variant="outlined"
                    :color="
                      surah.revelationPlace === 'Meccan' ? 'indigo' : 'teal'
                    "
                  >
                    {{ surah.revelationPlace }}
                  </v-chip>

                  <v-chip size="x-small" variant="outlined">
                    {{ surah.totalAyah }} Ayahs
                  </v-chip>
                </div>
              </v-card-text>
            </NuxtLink>

            <!-- PLAYER SECTION (Only when active) -->
            <v-expand-transition>
              <div
                v-if="currentUrl === surah.audio?.[1]?.url"
                class="card-player"
              >
                <div class="time-label">
                  {{ currentTimeLabel }} / {{ durationLabel }}
                </div>

                <v-slider
                  :model-value="progress"
                  :max="duration || 0"
                  step="1"
                  hide-details
                  @update:model-value="seek"
                />
              </div>
            </v-expand-transition>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const searchText = ref("");

const { surahs, search } = useSurahs();
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
} = useAudioPlayer();

const { selected, setReciter, loadSaved } = useReciter();
const isPlaying = (surah) => {
  const url = getSurahUrl(surah);

  return url && currentUrl.value === url && playing.value;
};
const isThisLoading = (surah) => {
  const url = getSurahUrl(surah);

  return url && currentUrl.value === url && loading.value;
};
const toggleSurahAudio = (surah) => {
  const url = getSurahUrl(surah);
  if (!url) return;

  if (isPlaying(surah)) pause();
  else play(url);
};
const getSurahUrl = (surah) => {
  if (!selected.value || !surah.audio) return null;

  const reciterMatch = Object.values(surah.audio).find(
    (r) => r.reciter === selected.value.reciter
  );

  return reciterMatch?.url || null;
};
const filteredSurahs = computed(() =>
  !searchText.value ? surahs : search(searchText.value)
);
const globalReciters = computed(() => {
  if (!surahs?.length) return [];
  return Object.values(surahs[0].audio || {});
});

watch(selected, (newReciter) => {
  if (!newReciter || !currentUrl.value) return;

  const currentSurah = surahs.find((s) =>
    Object.values(s.audio || {}).some((r) => r.url === currentUrl.value)
  );

  if (!currentSurah) return;

  const newUrl = getSurahUrl(currentSurah);

  if (newUrl) {
    play(newUrl);
  }
});
//
/* Favorites */
const { has, toggle } = useBookmarks();

const favKey = (surahNo) => `surah:${surahNo}`;
const isFav = (surahNo) => has(favKey(surahNo));
const toggleFav = (surahNo) => toggle(favKey(surahNo));
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
.play-btn {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 2;
}

.card-player {
  padding: 8px 12px 12px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.time-label {
  font-size: 0.75rem;
  margin-bottom: 4px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
