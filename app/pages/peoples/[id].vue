<template>
  <v-container v-if="community" class="community-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/peoples">Back to directory</v-btn>
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
          <div class="arabic-name mt-4">{{ community.arabicName }}</div>
          <h1 class="display-name">{{ community.name }}</h1>
          <div v-if="community.alternateNames?.length" class="alternate-names">
            Also known as: {{ community.alternateNames.join(", ") }}
          </div>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ typeLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ identificationLabel }}</v-chip>
        </div>
      </div>

      <div class="meta-row mt-3">
        <v-chip size="small" variant="outlined" prepend-icon="mdi-book-open-variant">
          {{ community.directMentions.length }} direct mentions
        </v-chip>
        <v-chip size="small" variant="outlined" prepend-icon="mdi-book-open-page-variant">
          {{ community.relatedPassages.length }} related passages
        </v-chip>
      </div>
    </v-sheet>

    <!-- 2. Overview -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <p class="overview-text">{{ community.shortDescription }}</p>

      <v-expansion-panels v-if="community.detailedDescription" variant="accordion" class="mt-3">
        <v-expansion-panel title="More detail">
          <v-expansion-panel-text>{{ community.detailedDescription }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="community.themes?.length" class="themes mt-3">
        <v-chip v-for="theme in community.themes" :key="theme" size="small" variant="tonal" class="mr-2 mb-2">
          {{ theme }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 3. Outcome -->
    <v-sheet v-if="community.outcome" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Outcome</h2>
      <p class="outcome-text">{{ community.outcome }}</p>
    </v-sheet>

    <!-- 4. Direct Mentions -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Direct Mentions</h2>
      <p class="section-hint">
        Ayahs where {{ community.name }} is explicitly named or designated. This module's citations are
        curated, not necessarily an exhaustive per-ayah count — see the dataset's own notes for this entry.
      </p>
      <SurahReferenceGroup v-if="directMentionGroups.length" :groups="directMentionGroups" @open="onOpenReference" />
      <p v-else class="text-medium-emphasis">No direct name mentions are catalogued for this entity yet.</p>
    </v-sheet>

    <!-- 5. Related Passages -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <h2 class="section-title mb-0">Related Passages</h2>
        <v-btn
          v-if="community.relatedPassages.length"
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
        Curated passages relevant to {{ community.name }}'s narrative, including verses where the name
        isn't repeated.
      </p>
      <template v-if="community.relatedPassages.length">
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
      <p v-else class="text-medium-emphasis">No related passages are catalogued for this entity yet.</p>
    </v-sheet>

    <!-- 6. Associated prophets/people -->
    <v-sheet v-if="community.relationships?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Associated Prophets &amp; People</h2>
      <p class="section-hint">
        People directly connected to this entity in the Qur'an — linked to their own full profile where
        one exists in Prophets &amp; People.
      </p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="rel in community.relationships" :key="rel.personId" :to="resolveAssociatedPerson(rel.personId).href ?? undefined" variant="outlined">
          {{ resolveAssociatedPerson(rel.personId).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6b. Related Places (Phase 3 — structured links, distinct from the free-text Associated Places below) -->
    <v-sheet v-if="community.relatedPlaceIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Places</h2>
      <p class="section-hint">Places module (Phase 3) entries with a documented, structured connection to this entity.</p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in community.relatedPlaceIds" :key="pid" :to="resolveRelatedPlace(pid).href ?? undefined" variant="outlined" prepend-icon="mdi-map-marker-outline">
          {{ resolveRelatedPlace(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Associated places (free text, kept where no structured Place entity was created — see quranPeoples.ts's own Phase 3 migration notes) -->
    <v-sheet v-if="community.associatedPlaces?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Associated Places</h2>
      <p class="section-hint">
        Place names commonly associated with this entity — see this entity's own notes below for whether
        each is Qur'an-stated or a later traditional/geographic identification.
      </p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="place in community.associatedPlaces" :key="place" variant="tonal" prepend-icon="mdi-map-marker-outline">
          {{ place }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Scholarly / Traditional Notes -->
    <v-sheet v-if="community.sources?.length || community.statusNotes?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Scholarly &amp; Traditional Notes</h2>
      <ul v-if="community.sources?.length" class="sources-list">
        <li v-for="(s, i) in community.sources" :key="i">
          <v-chip size="x-small" variant="outlined" class="mr-2">{{ sourceTypeLabel(s.type) }}</v-chip>{{ s.citation }}
        </li>
      </ul>
      <ul v-if="community.statusNotes?.length" class="status-notes-list mt-2">
        <li v-for="(note, i) in community.statusNotes" :key="i">{{ note }}</li>
      </ul>
    </v-sheet>

    <RelatedEntitiesSection
      :entity-ref="{ module: 'peoples', id: community.id }"
      :exclude-modules="['persons', 'places']"
    />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-map-marker-question-outline</v-icon>
    <p>Entity not found.</p>
    <v-btn to="/peoples" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import SurahReferenceGroup from "~/components/persons/SurahReferenceGroup.vue";
import RelatedPassageCard from "~/components/persons/RelatedPassageCard.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { COMMUNITY_TYPE_FILTERS } from "~/utils/peoplesSearch";
import { getPlaceById } from "~/data/quranPlaces";

const route = useRoute();
const { getCommunityById, groupDirectMentionsBySurah, groupRelatedPassagesBySurah, resolveAssociatedPerson } =
  usePeoples();

/** Added in Phase 3 — resolves a community's `relatedPlaceIds` against the
 * Places module. A small, direct lookup here (not a full `usePlaces()`
 * import) since this is the only Places-related thing this page needs. */
const resolveRelatedPlace = (placeId) => {
  const target = getPlaceById(placeId);
  if (target) return { name: target.name, href: `/places/${target.id}` };
  return { name: placeId, href: null };
};
const { playPassages, isQueuePlaying, queue, queueIndex } = useCommunityPassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const community = computed(() => getCommunityById(String(route.params.id)));

useHead(() => ({
  title: community.value ? `${community.value.name} — Peoples & Nations of the Qur'an` : "Entity not found",
}));

onMounted(() => loadBookmarks());

/* ---------------- Bookmark ---------------- */
const bookmarkKey = computed(() => (community.value ? `community:${community.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const typeLabel = computed(() => {
  if (!community.value) return "";
  return COMMUNITY_TYPE_FILTERS.find((t) => t.value === community.value.communityType)?.label ?? community.value.communityType;
});

const identificationLabels = {
  quran_explicit: "Explicitly identified in the Qur'an",
  quran_context: "Identified through Qur'anic context",
  traditional: "Traditional identification",
  disputed: "Disputed identification",
};
const identificationLabel = computed(() =>
  community.value ? identificationLabels[community.value.identificationBasis] ?? community.value.identificationBasis : ""
);

const sourceTypeLabel = (type) =>
  ({ quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" })[type] ?? type;

const directMentionGroups = computed(() => (community.value ? groupDirectMentionsBySurah(community.value) : []));
const relatedPassageGroups = computed(() => (community.value ? groupRelatedPassagesBySurah(community.value) : []));

/* ---------------- Playback (mirrors persons/[id].vue's pattern) ---------------- */
const onPlayAll = () => {
  if (!community.value) return;
  playPassages(community.value.name, community.value.relatedPassages);
};

const playSinglePassage = (passage) => {
  if (!community.value) return;
  playPassages(community.value.name, [passage]);
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
.community-detail-container {
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

.overview-text,
.outcome-text {
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
