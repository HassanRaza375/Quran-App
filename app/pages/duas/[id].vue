<template>
  <v-container v-if="dua" class="dua-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/duas">Back to directory</v-btn>
      <v-btn
        variant="tonal"
        :color="isBookmarked ? 'amber' : undefined"
        :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
        @click="toggleBookmark"
      >
        {{ isBookmarked ? "Saved" : "Save" }}
      </v-btn>
    </div>

    <!-- 1. Header -->
    <v-sheet elevation="1" rounded="lg" class="pa-4 mb-6 header-sheet">
      <div class="d-flex justify-space-between align-start flex-wrap ga-3">
        <div>
          <div class="arabic-title mt-4">{{ dua.arabicTitle }}</div>
          <h1 class="display-title">{{ dua.title }}</h1>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ categoryLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ sourceBasisLabel }}</v-chip>
        </div>
      </div>
    </v-sheet>

    <!-- 2. Dua overview: context + what it asks for -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Context</h2>
      <p class="body-text">{{ dua.context }}</p>
      <h2 class="section-title mt-4">What It Asks For</h2>
      <p class="body-text">{{ dua.askingFor }}</p>
      <v-alert v-if="dua.isPartialAyah" type="info" variant="tonal" density="comfortable" class="mt-4">
        {{ dua.segmentNote }}
      </v-alert>
    </v-sheet>

    <!-- 3. Who Made It -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Who Made It</h2>
      <v-chip :to="speaker.href ?? undefined" variant="tonal" color="secondary" prepend-icon="mdi-account-voice">
        {{ speaker.name }}
      </v-chip>
    </v-sheet>

    <!-- 4. Qur'anic Source: Arabic + Translation + Audio + Tafsir (reused AyahReferenceCard) -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <h2 class="section-title mb-0">Qur'anic Source</h2>
        <v-btn
          v-if="primaryAyahs.length > 1"
          size="small"
          variant="tonal"
          color="primary"
          :prepend-icon="isQueuePlaying ? 'mdi-pause' : 'mdi-play'"
          @click="onPlayAll"
        >
          {{ isQueuePlaying ? "Playing all…" : "Play all ayahs" }}
        </v-btn>
      </div>
      <p class="section-hint">
        {{ surahLabel(dua.passage.surahNumber) }} : {{ dua.passage.ayahStart }}{{ dua.passage.ayahEnd !== dua.passage.ayahStart ? `-${dua.passage.ayahEnd}` : "" }}
        — Arabic text, translation, audio, and tafsir below are the app's existing Qur'an reader data, not a
        separate copy. Each ayah has its own play button; use "Play all ayahs" above for the full passage in
        sequence.
      </p>
      <div class="d-flex flex-column ga-3">
        <AyahReferenceCard
          v-for="ayahNo in primaryAyahs"
          :key="`${dua.passage.surahNumber}:${ayahNo}`"
          :surah-no="dua.passage.surahNumber"
          :ayah-no="ayahNo"
        />
      </div>

      <template v-if="dua.parallelPassages?.length">
        <h3 class="parallel-title mt-4">Also Occurs At</h3>
        <p class="section-hint">The same request, in near-identical wording, also appears here:</p>
        <div v-for="p in dua.parallelPassages" :key="p.id" class="d-flex flex-column ga-3 mb-2">
          <AyahReferenceCard
            v-for="ayahNo in ayahRange(p.ayahStart, p.ayahEnd)"
            :key="`${p.surahNumber}:${ayahNo}`"
            :surah-no="p.surahNumber"
            :ayah-no="ayahNo"
          />
        </div>
      </template>
    </v-sheet>

    <!-- 5. Transliteration -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Transliteration</h2>
      <p class="section-hint">
        Fetched live from a verse-level transliteration source (not stored in this app) — see this
        dua's own note below if it covers more than the dua's own words.
      </p>
      <div v-if="transliterationLoading" class="d-flex justify-center py-3">
        <v-progress-circular indeterminate size="20" color="primary" />
      </div>
      <div v-else class="d-flex flex-column ga-2">
        <div v-for="ayahNo in primaryAyahs" :key="`translit-${ayahNo}`" class="transliteration-line">
          <span class="transliteration-ref">{{ dua.passage.surahNumber }}:{{ ayahNo }}</span>
          {{ transliterations[ayahNo] || "Transliteration not available for this ayah." }}
        </div>
      </div>
    </v-sheet>

    <!-- 6. Themes -->
    <v-sheet v-if="dua.themeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Themes</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="tid in dua.themeIds" :key="tid" :to="resolveTheme(tid).href ?? undefined" variant="outlined">
          {{ resolveTheme(tid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Related Story -->
    <v-sheet v-if="dua.storyId" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Story</h2>
      <v-chip :to="resolveStory(dua.storyId).href ?? undefined" variant="outlined">
        {{ resolveStory(dua.storyId).name }}
      </v-chip>
    </v-sheet>

    <!-- 8. Related People (the speaker, if a Person) -->
    <v-sheet v-if="speaker.href" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related People</h2>
      <v-chip :to="speaker.href" variant="outlined">{{ speaker.name }}</v-chip>
    </v-sheet>

    <!-- 9. Related Peoples & Nations / Places -->
    <v-sheet v-if="dua.communityIds?.length || dua.placeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 v-if="dua.communityIds?.length" class="section-title">Peoples &amp; Nations</h2>
      <div v-if="dua.communityIds?.length" class="d-flex flex-wrap ga-2 mb-3">
        <v-chip v-for="cid in dua.communityIds" :key="cid" :to="resolveCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveCommunity(cid).name }}
        </v-chip>
      </div>
      <h2 v-if="dua.placeIds?.length" class="section-title">Places</h2>
      <div v-if="dua.placeIds?.length" class="d-flex flex-wrap ga-2">
        <v-chip v-for="plid in dua.placeIds" :key="plid" :to="resolvePlace(plid).href ?? undefined" variant="outlined">
          {{ resolvePlace(plid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 10. Status Notes -->
    <v-sheet v-if="dua.statusNotes?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Notes</h2>
      <ul class="status-notes-list">
        <li v-for="(note, i) in dua.statusNotes" :key="i">{{ note }}</li>
      </ul>
    </v-sheet>

    <RelatedEntitiesSection
      :entity-ref="{ module: 'duas', id: dua.id }"
      :exclude-modules="['persons', 'peoples', 'places', 'stories', 'themes']"
    />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-hands-pray</v-icon>
    <p>Dua not found.</p>
    <v-btn to="/duas" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import AyahReferenceCard from "~/components/persons/AyahReferenceCard.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { DUA_CATEGORY_FILTERS } from "~/utils/duasSearch";

const route = useRoute();
const { getDuaById, resolveTheme, resolveStory, resolveCommunity, resolvePlace, speakerDisplay } = useDuas();
const { playPassages, isQueuePlaying } = useDuaPassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();
const { getTransliteration } = useTransliteration();

const dua = computed(() => getDuaById(String(route.params.id)));

useHead(() => ({
  title: dua.value ? `${dua.value.title} — Duas of the Qur'an` : "Dua not found",
}));
useSeoMeta({
  description: () => dua.value?.context,
  ogTitle: () => (dua.value ? `${dua.value.title} — Duas of the Qur'an` : undefined),
  ogDescription: () => dua.value?.context,
  ogType: "website",
});

onMounted(() => loadBookmarks());

/* ---------------- Bookmark ---------------- */
const bookmarkKey = computed(() => (dua.value ? `dua:${dua.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const categoryLabel = computed(() => {
  if (!dua.value) return "";
  return DUA_CATEGORY_FILTERS.find((c) => c.value === dua.value.category)?.label ?? dua.value.category;
});

const sourceBasisLabels = {
  quran_explicit: "Direct Qur'anic supplication",
  quran_narrative: "Narrative prayer",
  quran_instruction: "Qur'anic instruction to supplicate",
};
const sourceBasisLabel = computed(() =>
  dua.value ? sourceBasisLabels[dua.value.sourceBasis] ?? dua.value.sourceBasis : ""
);

const speaker = computed(() => (dua.value ? speakerDisplay(dua.value) : { name: "", href: null }));

const ayahRange = (start, end) => {
  const arr = [];
  for (let n = start; n <= end; n++) arr.push(n);
  return arr;
};
const primaryAyahs = computed(() => (dua.value ? ayahRange(dua.value.passage.ayahStart, dua.value.passage.ayahEnd) : []));

const onPlayAll = () => {
  if (!dua.value) return;
  playPassages(dua.value.title, [dua.value.passage]);
};

/* ---------------- Transliteration (fetched live, Phase 6's own composable) ---------------- */
const transliterations = ref({});
const transliterationLoading = ref(false);

const loadTransliterations = async (d) => {
  if (!d) return;
  transliterationLoading.value = true;
  transliterations.value = {};
  try {
    const results = await Promise.all(
      ayahRange(d.passage.ayahStart, d.passage.ayahEnd).map((ayahNo) =>
        getTransliteration(d.passage.surahNumber, ayahNo).then((text) => [ayahNo, text])
      )
    );
    transliterations.value = Object.fromEntries(results);
  } finally {
    transliterationLoading.value = false;
  }
};

watch(dua, (d) => loadTransliterations(d), { immediate: true });
</script>

<style scoped>
.dua-detail-container {
  max-width: 900px;
  margin: auto;
  padding-bottom: 60px;
}

.header-sheet {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-secondary), 0.05));
}

.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 1.8rem;
  direction: rtl;
}

.display-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 2px 0;
}

.section-sheet {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.parallel-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.section-hint {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 10px;
}

.body-text {
  font-size: 1rem;
  line-height: 1.7;
}

.transliteration-line {
  font-size: 0.92rem;
  line-height: 1.6;
  font-style: italic;
}

.transliteration-ref {
  font-style: normal;
  font-weight: 600;
  margin-right: 8px;
  opacity: 0.7;
}

.status-notes-list {
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.6;
  padding-inline-start: 18px;
}
</style>
