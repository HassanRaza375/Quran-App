<template>
  <v-container class="pb-16">
    <!-- Header Skeleton -->
    <v-row v-if="loading">
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" class="pa-6">
          <v-skeleton-loader type="heading" class="mb-4" />
          <v-skeleton-loader type="text" width="40%" class="mb-3" />
          <v-skeleton-loader type="chip" width="120" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Real Header -->
    <v-row v-else>
      <v-col cols="12">
        <v-card rounded="xl" elevation="0" class="pa-6 surah-header">
          <div class="d-flex flex-wrap align-center justify-space-between">
            <div>
              <div class="d-flex align-center ga-2">
                <div class="arabic-name">
                  {{ surah?.surahNameArabicLong }}
                </div>
                <v-btn icon size="small" variant="text" @click="toggleAudio(surahNo)">
                  <v-icon :color="isAudioBookmarked(surahNo) ? 'amber' : 'grey'">
                    {{ isAudioBookmarked(surahNo) ? "mdi-bookmark" : "mdi-bookmark-outline" }}
                  </v-icon>
                </v-btn>
              </div>

              <div class="text-subtitle-1 text-medium-emphasis">
                {{ surah?.surahNameTranslation }}
              </div>

              <div class="mt-2">
                <v-chip size="small" variant="tonal">
                  #{{ surah?.surahNo }}
                </v-chip>
                <v-chip size="small" class="ml-2" variant="outlined">
                  {{ surah?.totalAyah }} Ayahs
                </v-chip>
              </div>
            </div>

            <div v-if="currentReciter" class="d-flex align-center ga-2">
              <div class="text-right">
                <div class="text-caption text-medium-emphasis">
                  Now Playing {{ currentTimeLabel }} / {{ durationLabel }}
                </div>
                <div class="font-weight-medium">
                  {{ currentReciter.reciter }}
                </div>
              </div>

              <v-btn icon variant="tonal" color="primary" @click="toggle">
                <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reciters Grid -->
    <v-row class="mt-4">
      <!-- Skeleton cards -->
      <template v-if="loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card" />
        </v-col>
      </template>

      <!-- No audio -->
      <v-col cols="12" v-else-if="reciters.length < 1">
        <v-alert type="info" variant="tonal"> No audio available </v-alert>
      </v-col>

      <!-- Real cards -->
      <v-col
        v-else
        cols="12"
        sm="6"
        md="4"
        lg="3"
        v-for="rec in reciters"
        :key="rec.url"
      >
        <LazyServicesReciterAudioCard :reciter="rec" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { playing, pause, play, currentUrl, durationLabel, currentTimeLabel } =
  useAudioPlayer();
const { getChapter } = useChapters();
const route = useRoute();
const surahNo = computed(() => Number(route.params.id) || 1);

const { load, isAudioBookmarked, toggleAudio } = useBookmarks();
onMounted(() => {
  load(); // safe even if you already load in layout
});

const chapterData = ref(null);
const loading = ref(true);

watchEffect(async () => {
  loading.value = true;
  chapterData.value = await getChapter(surahNo.value);
  loading.value = false;
});

const surah = computed(() => chapterData.value);
const reciters = computed(() =>
  chapterData.value?.audio ? Object.values(chapterData.value.audio) : []
);
const currentReciter = computed(() =>
  reciters.value.find((r) => r.url === currentUrl.value)
);

const toggle = () => {
  if (playing.value) pause();
  else if (currentReciter.value) play(currentReciter.value.url);
};
</script>
