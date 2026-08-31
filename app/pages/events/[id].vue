<template>
  <v-container v-if="event" class="event-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/events">Back to directory</v-btn>
      <v-btn
        variant="tonal"
        :color="isBookmarked ? 'amber' : undefined"
        :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
        @click="toggleBookmark"
      >
        {{ isBookmarked ? "Saved" : "Save" }}
      </v-btn>
    </div>

    <!-- Header -->
    <v-sheet elevation="1" rounded="lg" class="pa-4 mb-6 header-sheet">
      <div class="d-flex justify-space-between align-start flex-wrap ga-3">
        <div>
          <div class="arabic-title mt-4">{{ event.arabicTitle }}</div>
          <h1 class="display-title">{{ event.title }}</h1>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ categoryLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ sourceBasisLabel }}</v-chip>
        </div>
      </div>
    </v-sheet>

    <!-- 1. Overview -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Overview</h2>
      <p class="body-text">{{ event.description }}</p>
    </v-sheet>

    <!-- 2. Qur'anic Account -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <h2 class="section-title mb-0">Qur'anic Account</h2>
        <v-btn
          v-if="primaryAyahs.length > 1"
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
        {{ surahLabel(event.passage.surahNumber) }} : {{ event.passage.ayahStart }}{{ event.passage.ayahEnd !== event.passage.ayahStart ? `-${event.passage.ayahEnd}` : "" }}
        — Arabic text, translation, audio, and tafsir below are the app's existing Qur'an reader
        data. Each ayah has its own play button; use "Play all passages" above for the full passage
        in sequence.
      </p>
      <div class="d-flex flex-column ga-3">
        <AyahReferenceCard
          v-for="ayahNo in primaryAyahs"
          :key="`${event.passage.surahNumber}:${ayahNo}`"
          :surah-no="event.passage.surahNumber"
          :ayah-no="ayahNo"
        />
      </div>
    </v-sheet>

    <!-- 3. Qur'anic Sources -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Qur'anic Sources</h2>
      <p class="body-text">{{ sourceBasisExplanation }}</p>

      <template v-if="event.parallelPassages?.length">
        <h3 class="parallel-title mt-4">Also Occurs At</h3>
        <div v-for="p in event.parallelPassages" :key="p.id" class="d-flex flex-column ga-3 mb-2">
          <AyahReferenceCard
            v-for="ayahNo in ayahRange(p.ayahStart, p.ayahEnd)"
            :key="`${p.surahNumber}:${ayahNo}`"
            :surah-no="p.surahNumber"
            :ayah-no="ayahNo"
          />
        </div>
      </template>

      <template v-if="event.statusNotes?.length">
        <h3 class="parallel-title mt-4">Notes</h3>
        <ul class="status-notes-list">
          <li v-for="(note, i) in event.statusNotes" :key="i">{{ note }}</li>
        </ul>
      </template>
    </v-sheet>

    <!-- 4. Chronology -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Chronology</h2>
      <p class="body-text">{{ chronologyStatusExplanation }}</p>
      <ul v-if="chronologyRelations.length" class="status-notes-list mt-2">
        <li v-for="(rel, i) in chronologyRelations" :key="i">{{ rel }}</li>
      </ul>
    </v-sheet>

    <!-- 5. People Involved -->
    <v-sheet v-if="event.personIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">People Involved</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in event.personIds" :key="pid" :to="resolvePerson(pid).href ?? undefined" variant="outlined">
          {{ resolvePerson(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6. Peoples & Nations -->
    <v-sheet v-if="event.communityIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Peoples &amp; Nations</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="cid in event.communityIds" :key="cid" :to="resolveCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveCommunity(cid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Places -->
    <v-sheet v-if="event.placeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Places</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="plid in event.placeIds" :key="plid" :to="resolvePlace(plid).href ?? undefined" variant="outlined">
          {{ resolvePlace(plid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Related Story -->
    <v-sheet v-if="event.storyIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Story</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="sid in event.storyIds" :key="sid" :to="resolveStory(sid).href ?? undefined" variant="outlined">
          {{ resolveStory(sid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 9. Themes -->
    <v-sheet v-if="event.themeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Themes</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="tid in event.themeIds" :key="tid" :to="resolveTheme(tid).href ?? undefined" variant="outlined">
          {{ resolveTheme(tid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 10. Related Duas -->
    <v-sheet v-if="event.duaIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Duas</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="did in event.duaIds" :key="did" :to="resolveDua(did).href ?? undefined" variant="outlined" prepend-icon="mdi-hands-pray">
          {{ resolveDua(did).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 11. Related Events -->
    <v-sheet v-if="event.relatedEventIds?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Related Events</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="eid in event.relatedEventIds" :key="eid" :to="resolveEvent(eid).href ?? undefined" variant="outlined">
          {{ resolveEvent(eid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <RelatedEntitiesSection
      :entity-ref="{ module: 'events', id: event.id }"
      :exclude-modules="['persons', 'peoples', 'places', 'stories', 'themes', 'duas', 'events']"
    />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-timeline-clock-outline</v-icon>
    <p>Event not found.</p>
    <v-btn to="/events" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import AyahReferenceCard from "~/components/persons/AyahReferenceCard.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { EVENT_CATEGORY_FILTERS } from "~/utils/eventsSearch";

const route = useRoute();
const {
  getEventById, resolvePerson, resolveCommunity, resolvePlace, resolveStory, resolveTheme, resolveDua, resolveEvent,
} = useEvents();
const { playPassages, isQueuePlaying } = useEventPassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const event = computed(() => getEventById(String(route.params.id)));

useHead(() => ({
  title: event.value ? `${event.value.title} — Events of the Qur'an` : "Event not found",
}));

onMounted(() => loadBookmarks());

const bookmarkKey = computed(() => (event.value ? `event:${event.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const categoryLabel = computed(() => {
  if (!event.value) return "";
  return EVENT_CATEGORY_FILTERS.find((c) => c.value === event.value.category)?.label ?? event.value.category;
});

const SOURCE_BASIS_LABELS = {
  quran_explicit: "Qur'an states this directly",
  quran_context: "Established by Qur'anic narrative context",
  traditional: "Traditional identification",
  disputed: "Disputed interpretation",
};
const SOURCE_BASIS_EXPLANATIONS = {
  quran_explicit: "The Qur'an directly describes this occurrence in the passage(s) below.",
  quran_context: "The Qur'an's own surrounding narrative establishes this occurrence, even where no single ayah states it outright.",
  traditional: "The core occurrence is Qur'anic, but part of how this event is identified (a name, a site, or a specific detail) comes from tafsir/seerah tradition rather than the Qur'an text itself — see the notes below for exactly which part.",
  disputed: "Scholars differ on aspects of this event, and the Qur'an does not itself settle the disagreement.",
};
const sourceBasisLabel = computed(() => (event.value ? SOURCE_BASIS_LABELS[event.value.sourceBasis] ?? event.value.sourceBasis : ""));
const sourceBasisExplanation = computed(() => (event.value ? SOURCE_BASIS_EXPLANATIONS[event.value.sourceBasis] ?? "" : ""));

const CHRONOLOGY_STATUS_EXPLANATIONS = {
  strong: "This event's placement in sequence is well-established.",
  traditional: "This event's placement in sequence relies on traditional (not Qur'an-stated) chronology — the Qur'an does not itself give a date or sequence position.",
  uncertain: "This event's placement in sequence is uncertain — the Qur'an describes the occurrence without establishing when it happened relative to others.",
  unknown: "No chronology is established for this event in the Qur'an or in reliable tradition.",
};
const chronologyStatusExplanation = computed(() =>
  event.value ? CHRONOLOGY_STATUS_EXPLANATIONS[event.value.chronologyStatus] ?? "" : ""
);

const chronologyRelations = computed(() => {
  if (!event.value?.relativeChronology) return [];
  const rc = event.value.relativeChronology;
  const lines = [];
  if (rc.duringPersonId) lines.push(`During the lifetime of ${resolvePerson(rc.duringPersonId).name}.`);
  if (rc.afterEventId) lines.push(`After: ${resolveEvent(rc.afterEventId).name}.`);
  if (rc.beforeEventId) lines.push(`Before: ${resolveEvent(rc.beforeEventId).name}.`);
  return lines;
});

const ayahRange = (start, end) => {
  const arr = [];
  for (let n = start; n <= end; n++) arr.push(n);
  return arr;
};
const primaryAyahs = computed(() => (event.value ? ayahRange(event.value.passage.ayahStart, event.value.passage.ayahEnd) : []));

const onPlayAll = () => {
  if (!event.value) return;
  playPassages(event.value.title, [event.value.passage]);
};
</script>

<style scoped>
.event-detail-container {
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

.status-notes-list {
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.6;
  padding-inline-start: 18px;
}
</style>
