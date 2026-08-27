<template>
  <div class="ayah-ref-card">
    <div v-if="pending" class="d-flex justify-center py-3">
      <v-progress-circular indeterminate size="20" color="primary" />
    </div>

    <template v-else-if="verse">
      <div class="d-flex align-start justify-space-between ga-2">
        <div class="arabic-text flex-1">{{ verse.arabic1 }}</div>
        <v-chip size="x-small" variant="tonal" color="primary" class="ref-chip">
          {{ surahLabel(surahNo) }} : {{ ayahNo }}
        </v-chip>
      </div>

      <div class="translation-text mt-2">{{ verse.english }}</div>

      <div class="actions-row mt-2">
        <v-btn
          size="small"
          variant="text"
          :icon="isThisPlaying ? 'mdi-pause' : 'mdi-play'"
          :aria-label="isThisPlaying ? `Pause recitation of ${surahLabel(surahNo)} ayah ${ayahNo}` : `Play recitation of ${surahLabel(surahNo)} ayah ${ayahNo}`"
          @click="togglePlay"
        />
        <v-btn
          size="small"
          variant="text"
          :icon="isBookmarked ? 'mdi-star' : 'mdi-star-outline'"
          :color="isBookmarked ? 'amber' : undefined"
          :aria-label="isBookmarked ? `Remove ${surahLabel(surahNo)} ayah ${ayahNo} bookmark` : `Bookmark ${surahLabel(surahNo)} ayah ${ayahNo}`"
          @click="toggleBookmark"
        />
        <v-btn
          size="small"
          variant="text"
          prepend-icon="mdi-book-open-page-variant-outline"
          :color="showTafsir ? 'primary' : undefined"
          @click="onTafsirClick"
        >
          Tafsir
        </v-btn>
        <v-spacer />
        <v-btn
          size="small"
          variant="tonal"
          color="primary"
          append-icon="mdi-arrow-right"
          :to="`/surah/${surahNo}#ayah-${ayahNo}`"
          @click="$emit('open', { surahNo, ayahNo })"
        >
          Read in Quran
        </v-btn>
      </div>

      <v-expand-transition>
        <div v-if="showTafsir" class="tafsir-box mt-2">
          <div v-if="tafsirLoading" class="d-flex justify-center py-2">
            <v-progress-circular indeterminate size="18" color="primary" />
          </div>
          <div v-else-if="tafsirError" class="text-caption text-error">Failed to load tafsir.</div>
          <div v-else class="tafsir-content" v-html="renderTafsirMarkdown(tafsirContent)" />
        </div>
      </v-expand-transition>
    </template>

    <v-alert v-else type="warning" variant="tonal" density="compact" class="mt-1">
      Qur'anic reference could not be loaded. Please try again.
    </v-alert>
  </div>
</template>

<script setup>
const props = defineProps({
  surahNo: { type: Number, required: true },
  ayahNo: { type: Number, required: true },
});
defineEmits(["open"]);

const { getChapter } = useChapters();
const { getVerse } = useVerse();
const { getTafsir } = useTafsir();
const { play, pause, playing, currentUrl } = useAudioPlayer();
const { load: loadBookmarks, isAyahBookmarked, toggleAyah } = useBookmarks();

onMounted(() => loadBookmarks());

const pending = ref(true);
const verse = ref(null);
// Per-ayah audio (distinct from a surah's own full-recitation `chapter.audio`)
// is only resolved on first play, not on render — avoids an extra network
// call per reference card just to draw a play button (§26 performance note).
const audioUrl = ref(null);
const showTafsir = ref(false);
const tafsirLoading = ref(false);
const tafsirError = ref(false);
const tafsirContent = ref("");

watch(
  () => [props.surahNo, props.ayahNo],
  async () => {
    pending.value = true;
    verse.value = null;
    audioUrl.value = null;
    showTafsir.value = false;
    try {
      const chapter = await getChapter(props.surahNo);
      const i = props.ayahNo - 1;
      verse.value = {
        arabic1: chapter?.arabic1?.[i],
        english: chapter?.english?.[i],
      };
    } catch {
      verse.value = null;
    } finally {
      pending.value = false;
    }
  },
  { immediate: true }
);

const isThisPlaying = computed(() => audioUrl.value && currentUrl.value === audioUrl.value && playing.value);
const togglePlay = async () => {
  if (isThisPlaying.value) {
    pause();
    return;
  }
  if (!audioUrl.value) {
    const v = await getVerse(props.surahNo, props.ayahNo);
    audioUrl.value = v?.audio?.["1"]?.url ?? null;
  }
  if (!audioUrl.value) return;
  play(audioUrl.value, {
    type: "ayah",
    surahNo: props.surahNo,
    title: `${surahLabel(props.surahNo)} — Ayah ${props.ayahNo}`,
    subtitle: "Recitation",
  });
};

const isBookmarked = computed(() => isAyahBookmarked(props.surahNo, props.ayahNo));
const toggleBookmark = () => toggleAyah(props.surahNo, props.ayahNo);

const onTafsirClick = async () => {
  showTafsir.value = !showTafsir.value;
  if (!showTafsir.value || tafsirContent.value) return;
  tafsirLoading.value = true;
  tafsirError.value = false;
  try {
    const tafsirs = await getTafsir(props.surahNo, props.ayahNo);
    tafsirContent.value = tafsirs?.[0]?.content ?? "";
  } catch {
    tafsirError.value = true;
  } finally {
    tafsirLoading.value = false;
  }
};
</script>

<style scoped>
.ayah-ref-card {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgba(var(--v-theme-surface), 1);
}

.arabic-text {
  font-family: "Amiri Quran", serif;
  font-size: 1.5rem;
  line-height: 2;
  direction: rtl;
  text-align: right;
}

.ref-chip {
  flex: 0 0 auto;
  white-space: nowrap;
}

.translation-text {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
  line-height: 1.6;
}

.actions-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.tafsir-box {
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.05);
  border-inline-start: 3px solid rgb(var(--v-theme-primary));
  font-size: 0.85rem;
  line-height: 1.65;
}
</style>
