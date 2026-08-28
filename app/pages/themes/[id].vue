<template>
  <v-container v-if="theme" class="theme-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/themes">Back to directory</v-btn>
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
          <div class="arabic-name mt-4">{{ theme.arabicName }}</div>
          <h1 class="display-name">{{ theme.name }}</h1>
          <div v-if="theme.alternateNames?.length" class="alternate-names">
            Also known as: {{ theme.alternateNames.join(", ") }}
          </div>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ categoryLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ conceptualBasisLabel }}</v-chip>
        </div>
      </div>
    </v-sheet>

    <!-- 2. Overview: definition + description -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <p class="definition-text"><strong>{{ theme.definition }}</strong></p>
      <p class="description-text mt-2">{{ theme.description }}</p>
    </v-sheet>

    <!-- 3. Qur'anic Passages -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <h2 class="section-title mb-0">Qur'anic Passages</h2>
        <v-btn
          size="small"
          variant="tonal"
          color="primary"
          :prepend-icon="isQueuePlaying ? 'mdi-pause' : 'mdi-play'"
          @click="onPlayAll"
        >
          {{ isQueuePlaying ? "Playing all…" : "Play all passages" }}
        </v-btn>
      </div>
      <p class="section-hint">
        Representative passages illustrating this theme — curated proof-texts, not an exhaustive
        occurrence search (a theme is a concept, not a searchable name).
      </p>
      <div class="d-flex flex-column ga-2 mt-2">
        <RelatedPassageCard
          v-for="p in theme.representativePassages"
          :key="p.id"
          :passage="p"
          :is-this-passage-playing="isThisPassagePlaying(p)"
          @play="playSinglePassage"
          @open="onOpenPassage"
        />
      </div>
    </v-sheet>

    <!-- 4. Stories -->
    <v-sheet v-if="theme.storyIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Stories</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="sid in theme.storyIds" :key="sid" :to="resolveStory(sid).href ?? undefined" variant="outlined">
          {{ resolveStory(sid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 5. People -->
    <v-sheet v-if="theme.personIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">People</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in theme.personIds" :key="pid" :to="resolvePerson(pid).href ?? undefined" variant="outlined">
          {{ resolvePerson(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6. Peoples & Nations -->
    <v-sheet v-if="theme.communityIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Peoples &amp; Nations</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="cid in theme.communityIds" :key="cid" :to="resolveCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveCommunity(cid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Places -->
    <v-sheet v-if="theme.placeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Places</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="plid in theme.placeIds" :key="plid" :to="resolvePlace(plid).href ?? undefined" variant="outlined">
          {{ resolvePlace(plid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Related Themes -->
    <v-sheet v-if="theme.relatedThemeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Themes</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="tid in theme.relatedThemeIds" :key="tid" :to="resolveTheme(tid).href ?? undefined" variant="outlined">
          {{ resolveTheme(tid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 9. Source Basis / Notes -->
    <v-sheet v-if="theme.sources?.length || theme.statusNotes?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Definition &amp; Source Basis</h2>
      <ul v-if="theme.sources?.length" class="sources-list">
        <li v-for="(s, i) in theme.sources" :key="i">
          <v-chip size="x-small" variant="outlined" class="mr-2">{{ sourceTypeLabel(s.type) }}</v-chip>{{ s.citation }}
        </li>
      </ul>
      <ul v-if="theme.statusNotes?.length" class="status-notes-list mt-2">
        <li v-for="(note, i) in theme.statusNotes" :key="i">{{ note }}</li>
      </ul>
    </v-sheet>
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-lightbulb-off-outline</v-icon>
    <p>Theme not found.</p>
    <v-btn to="/themes" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import RelatedPassageCard from "~/components/persons/RelatedPassageCard.vue";
import { THEME_CATEGORY_FILTERS } from "~/utils/themesSearch";

const route = useRoute();
const { getThemeById, resolvePerson, resolveCommunity, resolvePlace, resolveStory, resolveTheme } = useThemes();
const { playPassages, isQueuePlaying, queue, queueIndex } = useThemePassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const theme = computed(() => getThemeById(String(route.params.id)));

useHead(() => ({
  title: theme.value ? `${theme.value.name} — Themes of the Qur'an` : "Theme not found",
}));

onMounted(() => loadBookmarks());

/* ---------------- Bookmark ---------------- */
const bookmarkKey = computed(() => (theme.value ? `theme:${theme.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const categoryLabel = computed(() => {
  if (!theme.value) return "";
  return THEME_CATEGORY_FILTERS.find((c) => c.value === theme.value.category)?.label ?? theme.value.category;
});

const conceptualBasisLabels = {
  quran_explicit_concept: "Qur'an-explicit concept",
  quran_derived_concept: "Qur'an-derived concept",
  scholarly_interpretation: "Scholarly interpretation",
};
const conceptualBasisLabel = computed(() =>
  theme.value ? conceptualBasisLabels[theme.value.conceptualBasis] ?? theme.value.conceptualBasis : ""
);

const sourceTypeLabel = (type) =>
  ({ quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" })[type] ?? type;

/* ---------------- Playback ---------------- */
const onPlayAll = () => {
  if (!theme.value) return;
  playPassages(theme.value.name, theme.value.representativePassages);
};
const playSinglePassage = (passage) => {
  if (!theme.value) return;
  playPassages(theme.value.name, [passage]);
};
const isThisPassagePlaying = (passage) => {
  if (!isQueuePlaying.value) return false;
  const current = queue.value[queueIndex.value];
  return !!current && current.surahNo === passage.surahNumber && current.ayahNo >= passage.ayahStart && current.ayahNo <= passage.ayahEnd;
};

const onOpenPassage = () => {};
</script>

<style scoped>
.theme-detail-container {
  max-width: 900px;
  margin: auto;
  padding-bottom: 60px;
}

.header-sheet {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-secondary), 0.05));
}

.arabic-name {
  font-family: "Amiri Quran", serif;
  font-size: 2rem;
  direction: rtl;
}

.display-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 2px 0;
}

.alternate-names {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.section-sheet {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-hint {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 10px;
}

.definition-text,
.description-text {
  font-size: 1rem;
  line-height: 1.7;
}

.sources-list,
.status-notes-list {
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.6;
  padding-inline-start: 18px;
}
</style>
