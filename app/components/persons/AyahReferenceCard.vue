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

      <!-- Translation: same language set/preference as the main Surah reader
           (useTranslationPreference.ts) — Arabic above is always shown; this
           picks which single translation language sits below it. -->
      <div class="translation-section mt-2">
        <div v-if="langPickerOpen" class="lang-picker">
          <div class="text-caption text-medium-emphasis mb-1">Choose a language:</div>
          <div class="d-flex flex-wrap ga-1">
            <v-chip
              v-for="lang in TRANSLATION_LANGS"
              :key="lang.value"
              size="x-small"
              :color="selectedLang === lang.value ? 'secondary' : undefined"
              :variant="selectedLang === lang.value ? 'flat' : 'outlined'"
              @click="selectLang(lang.value)"
            >
              {{ lang.title }}
            </v-chip>
          </div>
        </div>

        <template v-else>
          <v-chip
            size="x-small"
            variant="tonal"
            color="secondary"
            append-icon="mdi-menu-down"
            class="lang-chip mb-1"
            @click="langPickerOpen = true"
          >
            {{ translationLangTitle(selectedLang) }}
          </v-chip>

          <div class="translation-text" :class="{ 'translation-text--rtl': isRtlTranslationLang(selectedLang) }">
            {{ translationText || `Translation not available in ${translationLangTitle(selectedLang)} for this ayah.` }}
          </div>
        </template>
      </div>

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

      <!-- Tafsir: same source list/preference as the main Surah reader
           (useTafsirPreference.ts), fetched once per ayah and cached
           locally so switching sources doesn't re-fetch. -->
      <v-expand-transition>
        <div v-if="showTafsir" class="tafsir-box mt-2">
          <div v-if="!tafsirAuthor || tafsirPickerOpen" class="tafsir-picker">
            <div class="text-caption text-medium-emphasis mb-1">
              Choose a tafsir (Sunni sources — no Shia/Ja'fari tafsir is available from this app's data provider):
            </div>
            <div class="d-flex flex-wrap ga-1">
              <v-chip
                v-for="author in TAFSIR_AUTHORS"
                :key="author"
                size="x-small"
                :color="tafsirAuthor === author ? 'primary' : undefined"
                :variant="tafsirAuthor === author ? 'flat' : 'outlined'"
                @click="selectTafsirAuthor(author)"
              >
                {{ author }}
              </v-chip>
            </div>
          </div>

          <template v-else>
            <div class="d-flex align-center justify-space-between mb-1 ga-2 flex-wrap">
              <v-chip
                size="x-small"
                variant="tonal"
                color="primary"
                append-icon="mdi-menu-down"
                @click="tafsirPickerOpen = true"
              >
                {{ tafsirAuthor }}
              </v-chip>
            </div>

            <div v-if="tafsirGroupVerse" class="tafsir-group-note">{{ tafsirGroupVerse }}</div>

            <div v-if="tafsirLoading" class="d-flex justify-center py-2">
              <v-progress-circular indeterminate size="18" color="primary" />
            </div>
            <div v-else-if="tafsirError" class="text-caption text-error">Failed to load tafsir. Please try again.</div>
            <div v-else class="tafsir-content" v-html="renderTafsirMarkdown(tafsirContent)" />
          </template>
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
const { preferredLang, load: loadTranslationPreference, setPreferredLang } = useTranslationPreference();
const { preferredAuthor, load: loadTafsirPreference, setPreferredAuthor } = useTafsirPreference();

onMounted(() => {
  loadBookmarks();
  // Synchronous reads (see the composables) — seed this card's local
  // selection from whatever's already stored, same as a freshly-opened
  // panel in the main reader would. Applied post-mount, not during SSR
  // render, for the same reason theme/accessibility prefs are (see
  // CLAUDE.md's SSR/hydration notes) — the server can't know a client's
  // saved preference.
  loadTranslationPreference();
  if (preferredLang.value) selectedLang.value = preferredLang.value;
  loadTafsirPreference();
});

const pending = ref(true);
// Keep the whole chapter (not just one language's array) so switching
// translation language never needs a second fetch.
const chapter = ref(null);
// Per-ayah audio (distinct from a surah's own full-recitation `chapter.audio`)
// is only resolved on first play, not on render — avoids an extra network
// call per reference card just to draw a play button (§26 performance note).
const audioUrl = ref(null);

const verse = computed(() => {
  if (!chapter.value) return null;
  const i = props.ayahNo - 1;
  return {
    arabic1: chapter.value.arabic1?.[i],
    arabic2: chapter.value.arabic2?.[i],
    english: chapter.value.english?.[i],
    urdu: chapter.value.urdu?.[i],
    bengali: chapter.value.bengali?.[i],
  };
});

/* ---------------- Translation language ---------------- */
const selectedLang = ref("english");
const langPickerOpen = ref(false);

/* ---------------- Tafsir ---------------- */
const showTafsir = ref(false);
const tafsirPickerOpen = ref(false);
const tafsirAuthor = ref(null);
const tafsirEntries = ref(null); // all sources for this ayah, fetched once — see fetchTafsirEntries
const tafsirLoading = ref(false);
const tafsirError = ref(false);

// Every ref this watcher assigns must be declared above it — assigning to a
// ref that's declared further down the file throws "Cannot access ... before
// initialization" the moment this immediate watcher runs during setup (a
// real bug caught here once already during Phase 2; see MODULE_BLUEPRINT.md).
watch(
  () => [props.surahNo, props.ayahNo],
  async () => {
    pending.value = true;
    chapter.value = null;
    audioUrl.value = null;
    showTafsir.value = false;
    tafsirAuthor.value = null;
    tafsirEntries.value = null;
    tafsirPickerOpen.value = false;
    langPickerOpen.value = false;
    try {
      chapter.value = await getChapter(props.surahNo);
    } catch {
      chapter.value = null;
    } finally {
      pending.value = false;
    }
  },
  { immediate: true }
);

const translationText = computed(() => verse.value?.[selectedLang.value] || "");

const selectLang = (lang) => {
  selectedLang.value = lang;
  langPickerOpen.value = false;
  setPreferredLang(lang); // same key the main reader reads/writes — see useTranslationPreference.ts
};

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

const tafsirContent = computed(() => tafsirEntries.value?.find((t) => t.author === tafsirAuthor.value)?.content ?? "");
const tafsirGroupVerse = computed(
  () => tafsirEntries.value?.find((t) => t.author === tafsirAuthor.value)?.groupVerse ?? null
);

const fetchTafsirEntries = async () => {
  if (tafsirEntries.value) return; // already fetched for this ayah — switching author just re-reads the array
  tafsirLoading.value = true;
  tafsirError.value = false;
  try {
    tafsirEntries.value = await getTafsir(props.surahNo, props.ayahNo);
  } catch {
    tafsirError.value = true;
  } finally {
    tafsirLoading.value = false;
  }
};

const selectTafsirAuthor = async (author) => {
  tafsirAuthor.value = author;
  tafsirPickerOpen.value = false;
  setPreferredAuthor(author); // same key the main reader reads/writes — see useTafsirPreference.ts
  await fetchTafsirEntries();
  if (tafsirEntries.value && !tafsirEntries.value.some((t) => t.author === author)) tafsirError.value = true;
};

const onTafsirClick = () => {
  showTafsir.value = !showTafsir.value;
  if (!showTafsir.value) return;
  if (tafsirAuthor.value) {
    fetchTafsirEntries();
  } else if (preferredAuthor.value) {
    selectTafsirAuthor(preferredAuthor.value);
  }
  // else: leave the picker showing (tafsirAuthor is null -> template renders it).
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

.translation-section {
  font-family: var(--font-ui);
}

.lang-chip {
  cursor: pointer;
}

.translation-text {
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.8);
  line-height: 1.6;
}

.translation-text--rtl {
  font-family: "Amiri Quran", serif;
  direction: rtl;
  text-align: right;
  font-size: 1.05rem;
  line-height: 1.9;
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

.tafsir-group-note {
  font-size: 0.78rem;
  font-style: italic;
  opacity: 0.75;
  margin-bottom: 8px;
}

.tafsir-content :deep(p) {
  margin: 0 0 10px;
}

.tafsir-content :deep(p:last-child) {
  margin-bottom: 0;
}

.tafsir-content :deep(.tafsir-heading) {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin: 12px 0 6px;
}

.tafsir-content :deep(.tafsir-heading:first-child) {
  margin-top: 0;
}
</style>
