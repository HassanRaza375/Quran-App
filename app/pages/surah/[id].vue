<template>
  <v-container class="reader-container">
    <!-- Translation & Audio Bar -->
    <v-row>
      <v-col cols="12">
        <v-sheet
          elevation="0"
          rounded="lg"
          class="pa-3 mb-6 d-flex justify-space-between align-center translation-bar"
          color="surface"
        >
          <div class="d-flex ga-2">
            <v-chip
              v-for="item in translations"
              :key="item"
              :color="selectedType === item ? 'primary' : undefined"
              :variant="selectedType === item ? 'flat' : 'outlined'"
              size="small"
              class="text-uppercase"
              @click="setTranslation(item)"
            >
              {{ item }}
            </v-chip>
          </div>

          <div class="d-flex align-center ga-2">
            <v-btn
              v-if="activeReciter"
              icon
              size="small"
              variant="tonal"
              color="primary"
              :loading="loading"
              @click="toggleAudio"
            >
              <v-icon>{{ isThisSurahPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
            </v-btn>

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
                  v-for="rec in reciters"
                  :key="rec.url"
                  @click="setReciter(rec)"
                >
                  <v-list-item-title>{{ rec.reciter }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Surah Header -->
    <v-row>
      <v-col cols="12">
        <v-sheet
          elevation="1"
          rounded="lg"
          class="pa-4 mb-8 surah-header"
          color="surface"
        >
          <h1 class="arabic-title text-center mb-3">
            {{ data?.surahNameArabicLong }}
          </h1>

          <div class="text-center text-medium-emphasis meta">
            <span>Surah {{ data?.surahNo }}</span>
            ·
            <span>{{ data?.totalAyah }} Ayahs</span>
            ·
            <span>{{ data?.revelationPlace }}</span>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- Verses -->
    <v-row>
      <v-col cols="12">
        <!-- Loader -->
        <v-sheet v-if="pending" class="pa-2" color="surface">
          <v-skeleton-loader type="heading, paragraph, paragraph, paragraph" />
        </v-sheet>

        <!-- Verses -->
        <v-sheet
          v-else
          elevation="0"
          rounded="lg"
          class="pa-2 verses-sheet"
          color="surface"
        >
          <div v-for="(item, index) in verses" :key="index" class="verse-block">
            <div class="d-flex align-start justify-end align-center ga-3">
              <!-- Verse text -->
              <section :id="`ayah-${index + 1}`" class="verse-text flex-1">
                {{ item }}
                <span class="ayah-number">﴿{{ index + 1 }}﴾</span>
              </section>

              <!-- Bookmark (Ayah favorite) -->
              <v-btn
                icon
                size="small"
                variant="text"
                class="ayah-fav-btn"
                @click.stop="toggleAyahBookmark(index + 1)"
              >
                <v-icon :color="isAyahFav(index + 1) ? 'amber' : 'grey'">
                  {{ isAyahFav(index + 1) ? "mdi-star" : "mdi-star-outline" }}
                </v-icon>
              </v-btn>
              <v-btn
                icon="mdi-share-variant-outline"
                variant="text"
                class="share--btn"
                @click="shareAyahNo = index + 1"
              />
              <v-btn
                class="verse--play"
                :icon="
                  playing && playingAyah === index + 1
                    ? 'mdi-pause'
                    : 'mdi-play'
                "
                @click="playAyah(index + 1)"
              />
            </div>

            <!-- Tafsir & Translation -->
            <div class="verse-actions-row">
              <v-btn
                size="small"
                variant="text"
                class="translation-toggle-btn"
                :color="getTranslationPanel(index + 1).open ? 'secondary' : undefined"
                prepend-icon="mdi-translate"
                @click="onTranslationButtonClick(index + 1)"
              >
                Translation
              </v-btn>

              <v-btn
                size="small"
                variant="text"
                class="tafsir-toggle-btn"
                :color="getTafsirPanel(index + 1).open ? 'primary' : undefined"
                prepend-icon="mdi-book-open-page-variant-outline"
                @click="onTafsirButtonClick(index + 1)"
              >
                Tafsir
              </v-btn>
            </div>

            <v-expand-transition>
              <div v-if="getTranslationPanel(index + 1).open" class="translation-panel">
                <!-- Language picker: shown until a language is chosen for this ayah,
                     or when the user taps the language chip to switch it -->
                <div
                  v-if="!getTranslationPanel(index + 1).lang || translationPickerFor === index + 1"
                  class="translation-picker"
                >
                  <div class="text-caption text-medium-emphasis mb-2">
                    Choose a language:
                  </div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip
                      v-for="lang in TRANSLATION_LANGS"
                      :key="lang.value"
                      :color="getTranslationPanel(index + 1).lang === lang.value ? 'secondary' : undefined"
                      :variant="getTranslationPanel(index + 1).lang === lang.value ? 'flat' : 'outlined'"
                      @click="selectTranslationLang(index + 1, lang.value)"
                    >
                      {{ lang.title }}
                    </v-chip>
                  </div>
                </div>

                <template v-else>
                  <div class="d-flex align-center justify-space-between mb-2 ga-2 flex-wrap">
                    <v-chip
                      size="small"
                      variant="tonal"
                      color="secondary"
                      append-icon="mdi-menu-down"
                      class="translation-lang-chip"
                      @click="translationPickerFor = index + 1"
                    >
                      {{ translationLangTitle(getTranslationPanel(index + 1).lang) }}
                    </v-chip>

                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      variant="text"
                      @click="closeTranslationPanel(index + 1)"
                    />
                  </div>

                  <div
                    class="translation-content"
                    :class="{ 'translation-content--rtl': isRtlTranslationLang(getTranslationPanel(index + 1).lang) }"
                  >
                    {{ typeObject[getTranslationPanel(index + 1).lang]?.[index] }}
                  </div>
                </template>
              </div>
            </v-expand-transition>

            <v-expand-transition>
              <div v-if="getTafsirPanel(index + 1).open" class="tafsir-panel">
                <!-- Author picker: shown until an author is chosen for this ayah,
                     or when the user taps the author chip to switch it -->
                <div
                  v-if="!getTafsirPanel(index + 1).author || tafsirPickerFor === index + 1"
                  class="tafsir-picker"
                >
                  <div class="text-caption text-medium-emphasis mb-2">
                    Choose a tafsir (Sunni sources — no Shia/Ja'fari tafsir is available from
                    this app's data provider):
                  </div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-chip
                      v-for="author in TAFSIR_AUTHORS"
                      :key="author"
                      :color="getTafsirPanel(index + 1).author === author ? 'primary' : undefined"
                      :variant="getTafsirPanel(index + 1).author === author ? 'flat' : 'outlined'"
                      @click="selectTafsirAuthor(index + 1, author)"
                    >
                      {{ author }}
                    </v-chip>
                  </div>
                </div>

                <template v-else>
                  <div class="d-flex align-center justify-space-between mb-2 ga-2 flex-wrap">
                    <v-chip
                      size="small"
                      variant="tonal"
                      color="primary"
                      append-icon="mdi-menu-down"
                      class="tafsir-author-chip"
                      @click="tafsirPickerFor = index + 1"
                    >
                      {{ getTafsirPanel(index + 1).author }}
                    </v-chip>

                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      variant="text"
                      @click="closeTafsirPanel(index + 1)"
                    />
                  </div>

                  <div v-if="getTafsirPanel(index + 1).groupVerse" class="tafsir-group-note">
                    {{ getTafsirPanel(index + 1).groupVerse }}
                  </div>

                  <div v-if="getTafsirPanel(index + 1).loading" class="d-flex justify-center py-4">
                    <v-progress-circular indeterminate size="24" color="primary" />
                  </div>

                  <v-alert
                    v-else-if="getTafsirPanel(index + 1).error"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mt-2"
                  >
                    Failed to load tafsir. Please try again.
                  </v-alert>

                  <div
                    v-else
                    class="tafsir-content"
                    v-html="renderTafsirMarkdown(getTafsirPanel(index + 1).content)"
                  />
                </template>
              </div>
            </v-expand-transition>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <AyahShareCard
      v-if="shareAyahNo && data"
      :model-value="!!shareAyahNo"
      @update:model-value="(v) => { if (!v) shareAyahNo = null }"
      :arabic="data.arabic1?.[shareAyahNo - 1]"
      :translation="data.english?.[shareAyahNo - 1]"
      translation-label="English"
      :surah-name="data.surahNameTranslation"
      :surah-no="chapterNo"
      :ayah-no="shareAyahNo"
    />
  </v-container>
</template>

<script setup>
definePageMeta({ layout: "reader" });
const { getChapter } = useChapters();
const { selected, setReciter } = useReciter();
const route = useRoute();

const chapterNo = computed(() => Number(route.params.id));

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
  reset,
} = useAudioPlayer();

const { data, pending, error } = await useAsyncData(
  () => `chapter-${chapterNo.value}`,
  () => getChapter(chapterNo.value),
  { watch: [chapterNo] }
);

/* ---------- SEO — dynamic per surah, recomputed on client-side navigation
 * between surahs since `data` is reactive on `chapterNo` ---------- */
useHead(() => ({
  title: data.value
    ? `Surah ${data.value.surahNo} — ${data.value.surahNameTranslation} (${data.value.surahNameArabicLong})`
    : `Surah ${chapterNo.value}`,
}));
useSeoMeta({
  description: () =>
    data.value
      ? `Read Surah ${data.value.surahNo}, ${data.value.surahNameTranslation} (${data.value.surahNameArabicLong}) — ${data.value.totalAyah} ayahs, revealed in ${data.value.revelationPlace}. Arabic text, translation, tafsir, and audio recitation.`
      : `Read Surah ${chapterNo.value} of the Qur'an with Arabic text, translation, tafsir, and audio recitation.`,
  ogTitle: () => (data.value ? `${data.value.surahNameTranslation} — Surah ${data.value.surahNo}` : `Surah ${chapterNo.value}`),
  ogDescription: () =>
    data.value
      ? `${data.value.totalAyah} ayahs, revealed in ${data.value.revelationPlace}.`
      : undefined,
  ogType: "website",
});

/* ---------- Reading progress ---------- */
const { setProgress, load: loadProgress } = useReadingProgress();
const { recordAyahRead, load: loadGoals } = useReadingGoals();
// Must run before the immediate `watch(data, ...)` below can fire
// `trackProgress` — otherwise the goals store would persist with whatever
// is currently in memory (empty on a fresh page load) and silently wipe
// any goals/daily-log data already saved from a previous session.
loadGoals();
let lastTrackedAyah = 1;
let scrollTimeout;

const trackProgress = (ayahNo) => {
  if (!data.value || ayahNo === lastTrackedAyah) return;
  lastTrackedAyah = ayahNo;
  setProgress(chapterNo.value, ayahNo, {
    surahName: data.value.surahNameTranslation,
    surahNameArabic: data.value.surahNameArabicLong,
    totalAyah: data.value.totalAyah,
  });
  recordAyahRead(chapterNo.value, ayahNo);
};

const handleScroll = () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const sections = document.querySelectorAll('[id^="ayah-"]');
    const threshold = window.innerHeight * 0.35;
    let current = 1;

    for (const el of sections) {
      if (el.getBoundingClientRect().top <= threshold) {
        current = Number(el.id.replace("ayah-", ""));
      } else {
        break;
      }
    }

    trackProgress(current);
  }, 400);
};

watch(
  data,
  (val) => {
    if (!val) return;
    lastTrackedAyah = 1;
    trackProgress(1);
  },
  { immediate: true }
);

onMounted(() => {
  loadProgress();
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  clearTimeout(scrollTimeout);
});

const translations = ref(["arabic1", "arabic2", "english", "bengali", "urdu"]);
const selectedType = ref("arabic1");

onMounted(() => {
  const preferred = localStorage.getItem("preferredVerseDisplay");
  if (preferred && translations.value.includes(preferred)) selectedType.value = preferred;
});

const typeObject = computed(() => ({
  arabic1: data.value?.arabic1 ?? [],
  arabic2: data.value?.arabic2 ?? [],
  english: data.value?.english ?? [],
  bengali: data.value?.bengali ?? [],
  urdu: data.value?.urdu ?? [],
}));

const verses = computed(() => typeObject.value[selectedType.value]);
const reciters = computed(() =>
  data.value?.audio ? Object.values(data.value.audio) : []
);

const setTranslation = (type) => {
  selectedType.value = type;
  localStorage.setItem("preferredVerseDisplay", type);
};

// audio playing
const activeReciter = computed(() => selected.value);
const isThisSurahPlaying = computed(() => {
  return currentUrl.value === activeReciter.value?.url && playing.value;
});
const toggleAudio = () => {
  if (!activeReciter.value) return;

  if (isThisSurahPlaying.value) pause();
  else
    play(activeReciter.value.url, {
      type: "surah",
      surahNo: chapterNo.value,
      title: data.value?.surahNameTranslation ?? `Surah ${chapterNo.value}`,
      subtitle: activeReciter.value.reciter,
    });
};

/* ---------- Ayah bookmarks ---------- */
const { load, isAyahBookmarked, toggleAyah } = useBookmarks();

onMounted(() => {
  load();
});

const isAyahFav = (ayahNo) => {
  return isAyahBookmarked(chapterNo.value, ayahNo);
};

const toggleAyahBookmark = (ayahNo) => {
  toggleAyah(chapterNo.value, ayahNo);
};
// Re-resolve the picked reciter to *this* surah's audio URL by name every
// time the reciter list changes (new surah, or data just finished loading).
// `selected` only carries a URL that's meaningful for whichever surah it
// was last picked on — reusing it as-is on a different surah would silently
// play the wrong track. Falls back to the first reciter if there's no
// remembered pick yet, or the remembered name isn't available here.
watch(
  reciters,
  (list) => {
    if (!list?.length) return;
    const match = selected.value ? list.find((r) => r.reciter === selected.value.reciter) : null;
    setReciter(match ?? list[0]);
  },
  { immediate: true }
);
watch(chapterNo, () => {
  reset();
});
// Deliberately no onBeforeRouteLeave reset — audio now persists across
// navigation via the global AudioMiniPlayer (§4.9), instead of always
// stopping the moment you leave this page.

// share card
const shareAyahNo = ref(null);

// verse play
const { getVerse } = useVerse();

const playingAyah = ref(null);

const playAyah = async (ayahNo) => {
  try {
    const verse = await getVerse(chapterNo.value, ayahNo);

    const audioUrl = verse.audio?.["1"]?.url; // always first reciter
    if (!audioUrl) return;

    if (playing.value && playingAyah.value === ayahNo) {
      pause();
      playingAyah.value = null;
      return;
    }

    await play(audioUrl, {
      type: "ayah",
      surahNo: chapterNo.value,
      title: `${data.value?.surahNameTranslation ?? "Surah " + chapterNo.value} — Ayah ${ayahNo}`,
      subtitle: "Recitation",
    });
    playingAyah.value = ayahNo;
  } catch (e) {
    console.error(e);
  }
};
watch(playing, (v) => {
  if (!v) playingAyah.value = null;
});

/* ---------- Tafsir ---------- */
const { getTafsir } = useTafsir();

// Shared across the app (see useTafsirPreference.ts) so the source picked
// here is the same one Module 17's AyahReferenceCard defaults to, and vice versa.
const { preferredAuthor: defaultTafsirAuthor, load: loadTafsirPreference, setPreferredAuthor } = useTafsirPreference();
const tafsirPanels = reactive({}); // ayahNo -> { open, author, content, groupVerse, loading, error }
const tafsirPickerFor = ref(null); // which ayah's inline author-picker is currently showing

onMounted(() => {
  loadTafsirPreference();
});

const getTafsirPanel = (ayahNo) => {
  if (!tafsirPanels[ayahNo]) {
    tafsirPanels[ayahNo] = {
      open: false,
      author: null,
      content: "",
      groupVerse: null,
      loading: false,
      error: false,
    };
  }
  return tafsirPanels[ayahNo];
};

const selectTafsirAuthor = async (ayahNo, author) => {
  const panel = getTafsirPanel(ayahNo);
  const alreadyLoaded = panel.author === author && panel.content && !panel.error;

  panel.author = author;
  panel.open = true;
  if (tafsirPickerFor.value === ayahNo) tafsirPickerFor.value = null;

  setPreferredAuthor(author);

  if (alreadyLoaded) return; // switching back to an author already fetched for this ayah

  panel.loading = true;
  panel.error = false;
  try {
    const tafsirs = await getTafsir(chapterNo.value, ayahNo);
    const match = tafsirs.find((t) => t.author === author);
    if (!match) throw new Error("Tafsir not found");
    panel.content = match.content;
    panel.groupVerse = match.groupVerse;
  } catch (e) {
    console.error(e);
    panel.error = true;
  } finally {
    panel.loading = false;
  }
};

const onTafsirButtonClick = (ayahNo) => {
  const panel = getTafsirPanel(ayahNo);
  if (panel.open) {
    panel.open = false;
    return;
  }

  panel.open = true;
  const author = panel.author || defaultTafsirAuthor.value;
  if (author) selectTafsirAuthor(ayahNo, author);
  // else: panel is open with no author yet, so the template shows the inline picker.
};

const closeTafsirPanel = (ayahNo) => {
  getTafsirPanel(ayahNo).open = false;
};

/* ---------- Inline Translation ---------- */
// Same UX pattern as Tafsir above, but no fetch needed: every translation is
// already part of the chapter data (`typeObject`), so this is purely local
// panel state — pick a language once, remembered as the default for the
// next ayah, multiple ayahs can have it open at once.
//
// The language list/RTL-set/title-lookup and the "last picked" preference
// itself are shared with Module 17's AyahReferenceCard (see
// useTranslationPreference.ts) — TRANSLATION_LANGS/isRtlTranslationLang/
// translationLangTitle are auto-imported from that composable file, same as
// any other app/composables export.
const { preferredLang: defaultTranslationLang, load: loadTranslationPreference, setPreferredLang } =
  useTranslationPreference();

onMounted(() => {
  loadTranslationPreference();
});

const translationPanels = reactive({}); // ayahNo -> { open, lang }
const translationPickerFor = ref(null);

const getTranslationPanel = (ayahNo) => {
  if (!translationPanels[ayahNo]) {
    translationPanels[ayahNo] = { open: false, lang: null };
  }
  return translationPanels[ayahNo];
};

const selectTranslationLang = (ayahNo, lang) => {
  const panel = getTranslationPanel(ayahNo);
  panel.lang = lang;
  panel.open = true;
  if (translationPickerFor.value === ayahNo) translationPickerFor.value = null;

  setPreferredLang(lang);
};

const onTranslationButtonClick = (ayahNo) => {
  const panel = getTranslationPanel(ayahNo);
  if (panel.open) {
    panel.open = false;
    return;
  }

  panel.open = true;
  const lang = panel.lang || defaultTranslationLang.value;
  if (lang) selectTranslationLang(ayahNo, lang);
  // else: panel is open with no language yet, so the template shows the inline picker.
};

const closeTranslationPanel = (ayahNo) => {
  getTranslationPanel(ayahNo).open = false;
};

watch(chapterNo, () => {
  Object.keys(tafsirPanels).forEach((k) => delete tafsirPanels[k]);
  tafsirPickerFor.value = null;
  Object.keys(translationPanels).forEach((k) => delete translationPanels[k]);
  translationPickerFor.value = null;
});
</script>

<style scoped>
/* ===============================
   Reader Container
================================= */
.share--btn {
  position: absolute;
  top: -4px;
  right: -4px;
}
.verse--play {
  position: absolute;
  top: -4px;
  left: -4px;
}
.reader-container {
  max-width: 900px;
  margin: auto;
  padding-bottom: 120px;
}

/* ===============================
   Translation Bar
================================= */

.translation-bar {
  backdrop-filter: blur(6px);
  background: rgba(var(--v-theme-surface), 0.85);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 8px;
}

/* ===============================
   Surah Header
================================= */

.surah-header {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.05),
    rgba(var(--v-theme-secondary), 0.05)
  );
}

.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 3rem;
  line-height: 1.6;
  color: rgb(var(--v-theme-primary));
}

.meta {
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

/* ===============================
   Verses Sheet
================================= */

.verses-sheet {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  background: rgba(var(--v-theme-surface), 1);
  margin-bottom: 97px;
}

/* ===============================
   Verse Block
================================= */

.verse-block {
  padding: 20px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  position: relative;
}

.verse-block:last-child {
  border-bottom: none;
}

/* ===============================
   Arabic Verse Text
================================= */

.verse-text {
  font-family: "Amiri Quran", serif;
  font-size: calc(2.2rem * var(--arabic-font-scale, 1));
  line-height: 2.6;
  direction: rtl;
  text-align: justify;
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.2s ease;
}

/* Light mode tuning */
.v-theme--light .verse-text {
  color: #1c2b33;
}

/* Dark mode tuning */
.v-theme--dark .verse-text {
  color: #e6f3f5;
}

/* ===============================
   Ayah Number
================================= */

.ayah-number {
  font-size: 1rem;
  margin-inline-start: 8px;
  color: rgba(var(--v-theme-primary), 0.7);
}

/* ===============================
   Bookmark Button
================================= */

.ayah-fav-btn {
  margin-top: 6px;
  flex: 0 0 auto;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.ayah-fav-btn:hover {
  opacity: 1;
}

/* ===============================
   Tafsir
================================= */

.verse-actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.tafsir-toggle-btn {
  opacity: 0.75;
  font-family: var(--font-ui);
}

.tafsir-toggle-btn:hover {
  opacity: 1;
}

.tafsir-author-chip {
  cursor: pointer;
}

.tafsir-panel {
  margin-top: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.05);
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  border-inline-start: 3px solid rgb(var(--v-theme-primary));
}

.tafsir-picker {
  font-family: var(--font-ui);
}

.tafsir-group-note {
  font-size: 0.8rem;
  font-style: italic;
  opacity: 0.7;
  margin-bottom: 10px;
}

.tafsir-content {
  font-family: var(--font-ui);
  font-size: 0.95rem;
  line-height: 1.75;
  direction: ltr;
  text-align: start;
  color: rgb(var(--v-theme-on-surface));
}

.tafsir-content :deep(p) {
  margin: 0 0 12px;
}

.tafsir-content :deep(p:last-child) {
  margin-bottom: 0;
}

.tafsir-content :deep(.tafsir-heading) {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin: 16px 0 8px;
}

.translation-toggle-btn {
  opacity: 0.75;
  font-family: var(--font-ui);
}

.translation-toggle-btn:hover {
  opacity: 1;
}

.translation-lang-chip {
  cursor: pointer;
}

.translation-panel {
  margin-top: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-secondary), 0.08);
  border: 1px solid rgba(var(--v-theme-secondary), 0.2);
  border-inline-start: 3px solid rgb(var(--v-theme-secondary));
}

.translation-picker {
  font-family: var(--font-ui);
}

.translation-content {
  font-family: var(--font-ui);
  font-size: 0.95rem;
  line-height: 1.75;
  direction: ltr;
  text-align: start;
  color: rgb(var(--v-theme-on-surface));
}

.translation-content--rtl {
  font-family: "Amiri Quran", serif;
  direction: rtl;
  text-align: right;
  font-size: 1.15rem;
  line-height: 2;
}

.tafsir-content :deep(.tafsir-heading:first-child) {
  margin-top: 0;
}

/* ===============================
   Chips Styling
================================= */

.v-chip.v-chip--density-default {
  min-width: 70px;
  justify-content: center;
  font-weight: 500;
}

/* ===============================
   Responsive Improvements
================================= */

@media (max-width: 600px) {
  .arabic-title {
    font-size: 2.2rem;
  }

  .verse-text {
    font-size: calc(1.8rem * var(--arabic-font-scale, 1));
    line-height: 2.4;
  }

  .reader-container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
