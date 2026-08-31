<template>
  <v-container v-if="place" class="place-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/places">Back to directory</v-btn>
      <v-btn
        variant="tonal"
        :color="isBookmarked ? 'amber' : undefined"
        :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
        @click="toggleBookmark"
      >
        {{ isBookmarked ? "Saved" : "Save" }}
      </v-btn>
    </div>

    <!-- 1. Header / identity -->
    <v-sheet elevation="1" rounded="lg" class="pa-4 mb-6 header-sheet">
      <div class="d-flex justify-space-between align-start flex-wrap ga-3">
        <div>
          <div class="arabic-name mt-4">{{ place.arabicName }}</div>
          <h1 class="display-name">{{ place.name }}</h1>
          <div v-if="place.alternateNames?.length" class="alternate-names">
            Also known as: {{ place.alternateNames.join(", ") }}
          </div>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ typeLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ identificationLabel }}</v-chip>
        </div>
      </div>

      <div class="meta-row mt-3">
        <v-chip size="small" variant="outlined" prepend-icon="mdi-book-open-variant">
          {{ place.directMentions.length }} direct mentions
        </v-chip>
        <v-chip size="small" variant="outlined" prepend-icon="mdi-book-open-page-variant">
          {{ place.relatedPassages.length }} related passages
        </v-chip>
      </div>
    </v-sheet>

    <!-- 2. Overview -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <p class="overview-text">{{ place.shortDescription }}</p>

      <v-expansion-panels v-if="place.detailedDescription" variant="accordion" class="mt-3">
        <v-expansion-panel title="More detail">
          <v-expansion-panel-text>{{ place.detailedDescription }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="place.themes?.length" class="themes mt-3">
        <v-chip v-for="theme in place.themes" :key="theme" size="small" variant="tonal" class="mr-2 mb-2">
          {{ theme }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 3. Direct Mentions -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Direct Mentions</h2>
      <p class="section-hint">
        Ayahs where {{ place.name }} is explicitly named or designated. This module's citations are
        curated, not necessarily an exhaustive per-ayah count — see this entry's own notes below.
      </p>
      <SurahReferenceGroup v-if="directMentionGroups.length" :groups="directMentionGroups" @open="onOpenReference" />
      <p v-else class="text-medium-emphasis">No direct name mentions are catalogued for this place yet.</p>
    </v-sheet>

    <!-- 4. Related Passages -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <h2 class="section-title mb-0">Related Passages</h2>
        <v-btn
          v-if="place.relatedPassages.length"
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
        Curated passages relevant to {{ place.name }}'s narrative, including verses where the name
        isn't repeated.
      </p>
      <template v-if="place.relatedPassages.length">
        <div v-for="group in relatedPassageGroups" :key="group.surahNumber" class="passage-group mb-4">
          <div class="passage-group-title">{{ surahLabel(group.surahNumber) }}</div>
          <div class="d-flex flex-column ga-2 mt-2">
            <RelatedPassageCard
              v-for="p in group.references"
              :key="p.id"
              :passage="p"
              :is-this-passage-playing="isThisPassagePlaying(p)"
              @play="playSinglePassage"
              @open="onOpenPassage"
            />
          </div>
        </div>
      </template>
      <p v-else class="text-medium-emphasis">No related passages are catalogued for this place yet.</p>
    </v-sheet>

    <!-- 5. People -->
    <v-sheet v-if="place.relationships?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">People</h2>
      <p class="section-hint">People directly connected to this place in the Qur'an.</p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="rel in place.relationships" :key="rel.personId" :to="resolveAssociatedPerson(rel.personId).href ?? undefined" variant="outlined">
          {{ resolveAssociatedPerson(rel.personId).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6. Peoples & Nations -->
    <v-sheet v-if="place.associatedCommunityIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Peoples &amp; Nations</h2>
      <p class="section-hint">Peoples/nations associated with this place.</p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="cid in place.associatedCommunityIds" :key="cid" :to="resolveAssociatedCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveAssociatedCommunity(cid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Related Places -->
    <v-sheet v-if="place.relatedPlaceIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Places</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in place.relatedPlaceIds" :key="pid" :to="resolveRelatedPlace(pid).href ?? undefined" variant="outlined">
          {{ resolveRelatedPlace(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Identification / Geographic Notes -->
    <v-sheet v-if="place.sources?.length || place.statusNotes?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Identification &amp; Geographic Notes</h2>
      <ul v-if="place.sources?.length" class="sources-list">
        <li v-for="(s, i) in place.sources" :key="i">
          <v-chip size="x-small" variant="outlined" class="mr-2">{{ sourceTypeLabel(s.type) }}</v-chip>{{ s.citation }}
        </li>
      </ul>
      <ul v-if="place.statusNotes?.length" class="status-notes-list mt-2">
        <li v-for="(note, i) in place.statusNotes" :key="i">{{ note }}</li>
      </ul>
    </v-sheet>

    <RelatedEntitiesSection
      :entity-ref="{ module: 'places', id: place.id }"
      :exclude-modules="['persons', 'peoples', 'places']"
    />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-map-marker-question-outline</v-icon>
    <p>Place not found.</p>
    <v-btn to="/places" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import SurahReferenceGroup from "~/components/persons/SurahReferenceGroup.vue";
import RelatedPassageCard from "~/components/persons/RelatedPassageCard.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { PLACE_TYPE_FILTERS } from "~/utils/placesSearch";

const route = useRoute();
const {
  getPlaceById,
  groupDirectMentionsBySurah,
  groupRelatedPassagesBySurah,
  resolveAssociatedPerson,
  resolveAssociatedCommunity,
  resolveRelatedPlace,
} = usePlaces();
const { playPassages, isQueuePlaying, queue, queueIndex } = usePlacePassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const place = computed(() => getPlaceById(String(route.params.id)));

useHead(() => ({
  title: place.value ? `${place.value.name} — Places of the Qur'an` : "Place not found",
}));
useSeoMeta({
  description: () => place.value?.shortDescription,
  ogTitle: () => (place.value ? `${place.value.name} — Places of the Qur'an` : undefined),
  ogDescription: () => place.value?.shortDescription,
  ogType: "website",
});

onMounted(() => loadBookmarks());

/* ---------------- Bookmark ---------------- */
const bookmarkKey = computed(() => (place.value ? `place:${place.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const typeLabel = computed(() => {
  if (!place.value) return "";
  return PLACE_TYPE_FILTERS.find((t) => t.value === place.value.placeType)?.label ?? place.value.placeType;
});

const identificationLabels = {
  quran_explicit: "Explicitly identified in the Qur'an",
  quran_context: "Identified through Qur'anic context",
  traditional: "Traditional identification",
  modern_identification: "Modern/historical proposed identification",
  disputed: "Disputed identification",
};
const identificationLabel = computed(() =>
  place.value ? identificationLabels[place.value.identificationBasis] ?? place.value.identificationBasis : ""
);

const sourceTypeLabel = (type) =>
  ({ quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" })[type] ?? type;

const directMentionGroups = computed(() => (place.value ? groupDirectMentionsBySurah(place.value) : []));
const relatedPassageGroups = computed(() => (place.value ? groupRelatedPassagesBySurah(place.value) : []));

/* ---------------- Playback ---------------- */
const onPlayAll = () => {
  if (!place.value) return;
  playPassages(place.value.name, place.value.relatedPassages);
};
const playSinglePassage = (passage) => {
  if (!place.value) return;
  playPassages(place.value.name, [passage]);
};
const isThisPassagePlaying = (passage) => {
  if (!isQueuePlaying.value) return false;
  const current = queue.value[queueIndex.value];
  return !!current && current.surahNo === passage.surahNumber && current.ayahNo >= passage.ayahStart && current.ayahNo <= passage.ayahEnd;
};

const onOpenReference = () => {};
const onOpenPassage = () => {};
</script>

<style scoped>
.place-detail-container {
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

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

.overview-text {
  font-size: 1rem;
  line-height: 1.7;
}

.passage-group-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.sources-list,
.status-notes-list {
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.6;
  padding-inline-start: 18px;
}
</style>
