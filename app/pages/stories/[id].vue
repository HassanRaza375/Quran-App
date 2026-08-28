<template>
  <v-container v-if="story" class="story-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/stories">Back to directory</v-btn>
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
          <div class="arabic-title mt-4">{{ story.arabicTitle }}</div>
          <h1 class="display-title">{{ story.title }}</h1>
          <div v-if="story.alternateTitles?.length" class="alternate-titles">
            Also known as: {{ story.alternateTitles.join(", ") }}
          </div>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ typeLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ narrativeStatusLabel }}</v-chip>
        </div>
      </div>
    </v-sheet>

    <!-- 2. Overview -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <p class="overview-text">{{ story.shortDescription }}</p>
      <v-expansion-panels v-if="story.detailedDescription" variant="accordion" class="mt-3">
        <v-expansion-panel title="More detail">
          <v-expansion-panel-text>{{ story.detailedDescription }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-if="story.themes?.length" class="themes mt-3">
        <v-chip v-for="theme in story.themes" :key="theme" size="small" variant="tonal" class="mr-2 mb-2">
          {{ theme }}
        </v-chip>
      </div>
      <p v-if="story.outcome" class="outcome-text mt-3"><strong>Outcome:</strong> {{ story.outcome }}</p>
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
      <p class="section-hint">Primary passages are the fullest tellings; supporting passages are shorter parallel retellings elsewhere in the Qur'an.</p>

      <div class="passage-group mb-4">
        <div class="passage-group-title">Primary</div>
        <div class="d-flex flex-column ga-2 mt-2">
          <RelatedPassageCard
            v-for="p in story.primaryPassages"
            :key="p.id"
            :passage="p"
            :is-this-passage-playing="isThisPassagePlaying(p)"
            @play="playSinglePassage"
            @open="onOpenPassage"
          />
        </div>
      </div>

      <div v-if="story.supportingPassages?.length" class="passage-group mb-4">
        <div class="passage-group-title">Supporting / Parallel Retellings</div>
        <div class="d-flex flex-column ga-2 mt-2">
          <RelatedPassageCard
            v-for="p in story.supportingPassages"
            :key="p.id"
            :passage="p"
            :is-this-passage-playing="isThisPassagePlaying(p)"
            @play="playSinglePassage"
            @open="onOpenPassage"
          />
        </div>
      </div>
    </v-sheet>

    <!-- 4. Story / Episodes -->
    <v-sheet v-if="story.episodes?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Episodes</h2>
      <p class="section-hint">The narrative broken into its meaningful sequence.</p>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="(ep, i) in story.episodes" :key="ep.id">
          <v-expansion-panel-title>
            <span class="episode-title">{{ i + 1 }}. {{ ep.title }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="episode-summary">{{ ep.summary }}</p>
            <div class="d-flex flex-column ga-2 mt-2">
              <RelatedPassageCard
                v-for="p in ep.passages"
                :key="p.id"
                :passage="p"
                :is-this-passage-playing="isThisPassagePlaying(p)"
                @play="playSinglePassage"
                @open="onOpenPassage"
              />
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-sheet>

    <!-- 5. People -->
    <v-sheet v-if="story.personIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">People</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in story.personIds" :key="pid" :to="resolvePerson(pid).href ?? undefined" variant="outlined">
          {{ resolvePerson(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6. Peoples & Nations -->
    <v-sheet v-if="story.communityIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Peoples &amp; Nations</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="cid in story.communityIds" :key="cid" :to="resolveCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveCommunity(cid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Places -->
    <v-sheet v-if="story.placeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Places</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="plid in story.placeIds" :key="plid" :to="resolvePlace(plid).href ?? undefined" variant="outlined">
          {{ resolvePlace(plid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Lessons -->
    <v-sheet v-if="story.lessons?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Lessons</h2>
      <v-list density="compact">
        <v-list-item v-for="(lesson, i) in story.lessons" :key="i" class="lesson-item">
          <template #prepend><v-icon size="18" color="primary">mdi-lightbulb-on-outline</v-icon></template>
          <v-list-item-title class="lesson-text">{{ lesson.text }}</v-list-item-title>
          <v-list-item-subtitle class="lesson-basis">
            <v-chip size="x-small" variant="tonal" class="mr-1">{{ lessonBasisLabel(lesson.basis) }}</v-chip>
            <span v-if="lesson.quranReferences?.length">
              {{ lesson.quranReferences.map((r) => `${surahLabel(r.surahNumber)}:${r.ayahNumber}`).join(", ") }}
            </span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-sheet>

    <!-- 9. Related Stories -->
    <v-sheet v-if="story.relatedStoryIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Stories</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="sid in story.relatedStoryIds" :key="sid" :to="resolveStory(sid).href ?? undefined" variant="outlined">
          {{ resolveStory(sid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 10. Scholarly / Source Notes -->
    <v-sheet v-if="story.sources?.length || story.statusNotes?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Scholarly &amp; Source Notes</h2>
      <ul v-if="story.sources?.length" class="sources-list">
        <li v-for="(s, i) in story.sources" :key="i">
          <v-chip size="x-small" variant="outlined" class="mr-2">{{ sourceTypeLabel(s.type) }}</v-chip>{{ s.citation }}
        </li>
      </ul>
      <ul v-if="story.statusNotes?.length" class="status-notes-list mt-2">
        <li v-for="(note, i) in story.statusNotes" :key="i">{{ note }}</li>
      </ul>
    </v-sheet>
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-book-remove-outline</v-icon>
    <p>Story not found.</p>
    <v-btn to="/stories" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import RelatedPassageCard from "~/components/persons/RelatedPassageCard.vue";
import { STORY_TYPE_FILTERS } from "~/utils/storiesSearch";

const route = useRoute();
const { getStoryById, resolvePerson, resolveCommunity, resolvePlace, resolveStory } = useStories();
const { playPassages, isQueuePlaying, queue, queueIndex } = useStoryPassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const story = computed(() => getStoryById(String(route.params.id)));

useHead(() => ({
  title: story.value ? `${story.value.title} — Stories of the Qur'an` : "Story not found",
}));

onMounted(() => loadBookmarks());

/* ---------------- Bookmark ---------------- */
const bookmarkKey = computed(() => (story.value ? `story:${story.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const typeLabel = computed(() => {
  if (!story.value) return "";
  return STORY_TYPE_FILTERS.find((t) => t.value === story.value.storyType)?.label ?? story.value.storyType;
});

const narrativeStatusLabels = {
  quran_complete: "Fully told in the Qur'an",
  quran_primary_traditional_expansion: "Qur'an core, traditionally expanded",
  quran_fragmentary: "Pieced together across surahs",
};
const narrativeStatusLabel = computed(() =>
  story.value ? narrativeStatusLabels[story.value.narrativeStatus] ?? story.value.narrativeStatus : ""
);

const lessonBasisLabels = {
  quran_explicit: "Qur'an explicit",
  derived_thematic: "Derived theme",
  traditional_interpretation: "Traditional interpretation",
};
const lessonBasisLabel = (basis) => lessonBasisLabels[basis] ?? basis;

const sourceTypeLabel = (type) =>
  ({ quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" })[type] ?? type;

/* ---------------- Playback ---------------- */
const allPassages = computed(() => {
  if (!story.value) return [];
  return [
    ...story.value.primaryPassages,
    ...(story.value.supportingPassages ?? []),
    ...(story.value.episodes ?? []).flatMap((e) => e.passages),
  ];
});

const onPlayAll = () => {
  if (!story.value) return;
  playPassages(story.value.title, allPassages.value);
};
const playSinglePassage = (passage) => {
  if (!story.value) return;
  playPassages(story.value.title, [passage]);
};
const isThisPassagePlaying = (passage) => {
  if (!isQueuePlaying.value) return false;
  const current = queue.value[queueIndex.value];
  return !!current && current.surahNo === passage.surahNumber && current.ayahNo >= passage.ayahStart && current.ayahNo <= passage.ayahEnd;
};

const onOpenPassage = () => {};
</script>

<style scoped>
.story-detail-container {
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
  font-size: 2rem;
  direction: rtl;
}

.display-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 2px 0;
}

.alternate-titles {
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

.overview-text,
.outcome-text {
  font-size: 1rem;
  line-height: 1.7;
}

.passage-group-title,
.episode-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.episode-summary {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 4px;
}

.lesson-item {
  padding-block: 6px;
}

.lesson-text {
  white-space: normal;
}

.lesson-basis {
  font-size: 0.75rem;
}

.sources-list,
.status-notes-list {
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.6;
  padding-inline-start: 18px;
}
</style>
