<template>
  <v-container v-if="sign" class="sign-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/signs">Back to directory</v-btn>
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
          <div class="arabic-title mt-4">{{ sign.arabicTitle }}</div>
          <h1 class="display-title">{{ sign.title }}</h1>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ classificationLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ sourceBasisLabel }}</v-chip>
        </div>
      </div>
    </v-sheet>

    <!-- 1. Overview -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Overview</h2>
      <p class="body-text">{{ sign.description }}</p>
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
        {{ surahLabel(sign.passage.surahNumber) }} : {{ sign.passage.ayahStart }}{{ sign.passage.ayahEnd !== sign.passage.ayahStart ? `-${sign.passage.ayahEnd}` : "" }}
        — Arabic text, translation, audio, and tafsir below are the app's existing Qur'an reader
        data. Each ayah has its own play button; use "Play all passages" above for the full passage
        in sequence.
      </p>
      <div class="d-flex flex-column ga-3">
        <AyahReferenceCard
          v-for="ayahNo in primaryAyahs"
          :key="`${sign.passage.surahNumber}:${ayahNo}`"
          :surah-no="sign.passage.surahNumber"
          :ayah-no="ayahNo"
        />
      </div>
    </v-sheet>

    <!-- 3. Qur'anic Sources -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Qur'anic Sources</h2>
      <p class="body-text">{{ sourceBasisExplanation }}</p>

      <template v-if="sign.parallelPassages?.length">
        <h3 class="parallel-title mt-4">Also Occurs At</h3>
        <div v-for="p in sign.parallelPassages" :key="p.id" class="d-flex flex-column ga-3 mb-2">
          <AyahReferenceCard
            v-for="ayahNo in ayahRange(p.ayahStart, p.ayahEnd)"
            :key="`${p.surahNumber}:${ayahNo}`"
            :surah-no="p.surahNumber"
            :ayah-no="ayahNo"
          />
        </div>
      </template>

      <template v-if="sign.statusNotes?.length">
        <h3 class="parallel-title mt-4">Notes</h3>
        <ul class="status-notes-list">
          <li v-for="(note, i) in sign.statusNotes" :key="i">{{ note }}</li>
        </ul>
      </template>
    </v-sheet>

    <!-- 4. People Involved -->
    <v-sheet v-if="sign.personIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">People Involved</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in sign.personIds" :key="pid" :to="resolvePerson(pid).href ?? undefined" variant="outlined">
          {{ resolvePerson(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 5. Peoples & Nations -->
    <v-sheet v-if="sign.communityIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Peoples &amp; Nations</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="cid in sign.communityIds" :key="cid" :to="resolveCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveCommunity(cid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6. Places -->
    <v-sheet v-if="sign.placeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Places</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="plid in sign.placeIds" :key="plid" :to="resolvePlace(plid).href ?? undefined" variant="outlined">
          {{ resolvePlace(plid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Related Story -->
    <v-sheet v-if="sign.storyIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Story</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="sid in sign.storyIds" :key="sid" :to="resolveStory(sid).href ?? undefined" variant="outlined">
          {{ resolveStory(sid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Themes -->
    <v-sheet v-if="sign.themeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Themes</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="tid in sign.themeIds" :key="tid" :to="resolveTheme(tid).href ?? undefined" variant="outlined">
          {{ resolveTheme(tid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 9. Related Duas -->
    <v-sheet v-if="sign.duaIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Duas</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="did in sign.duaIds" :key="did" :to="resolveDua(did).href ?? undefined" variant="outlined" prepend-icon="mdi-hands-pray">
          {{ resolveDua(did).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 10. Related Events (also where this Sign's chronology, if any, can be found) -->
    <v-sheet v-if="sign.eventIds?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Related Events</h2>
      <p class="section-hint">
        This sign's place in the narrative sequence is carried by the Event(s) below, not
        duplicated here.
      </p>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="eid in sign.eventIds" :key="eid" :to="resolveEvent(eid).href ?? undefined" variant="outlined" prepend-icon="mdi-timeline-clock-outline">
          {{ resolveEvent(eid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <RelatedEntitiesSection
      :entity-ref="{ module: 'signs', id: sign.id }"
      :exclude-modules="['persons', 'peoples', 'places', 'stories', 'themes', 'duas', 'events']"
    />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-star-four-points-outline</v-icon>
    <p>Sign not found.</p>
    <v-btn to="/signs" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import AyahReferenceCard from "~/components/persons/AyahReferenceCard.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { SIGN_CLASSIFICATION_FILTERS } from "~/utils/signsSearch";

const route = useRoute();
const {
  getSignById, resolvePerson, resolveCommunity, resolvePlace, resolveStory, resolveTheme, resolveDua, resolveEvent,
} = useSigns();
const { playPassages, isQueuePlaying } = useSignPassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const sign = computed(() => getSignById(String(route.params.id)));

useHead(() => ({
  title: sign.value ? `${sign.value.title} — Signs & Miracles` : "Sign not found",
}));
useSeoMeta({
  description: () => sign.value?.description,
  ogTitle: () => (sign.value ? `${sign.value.title} — Signs & Miracles` : undefined),
  ogDescription: () => sign.value?.description,
  ogType: "website",
});

onMounted(() => loadBookmarks());

const bookmarkKey = computed(() => (sign.value ? `sign:${sign.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const classificationLabel = computed(() => {
  if (!sign.value) return "";
  return SIGN_CLASSIFICATION_FILTERS.find((c) => c.value === sign.value.classification)?.label ?? sign.value.classification;
});

const SOURCE_BASIS_LABELS = {
  quran_explicit: "Qur'an states this directly",
  quran_context: "Established by Qur'anic narrative context",
  traditional: "Traditional identification",
  modern_identification: "Modern/proposed identification",
  disputed: "Disputed interpretation",
};
const SOURCE_BASIS_EXPLANATIONS = {
  quran_explicit: "The Qur'an directly describes this sign or miracle in the passage(s) below.",
  quran_context: "The Qur'an's own surrounding narrative establishes this occurrence, even where no single ayah states it outright.",
  traditional: "Part of how this is identified relies on tafsir/seerah tradition rather than the Qur'an text itself — see the notes below for exactly which part.",
  modern_identification: "This reflects a proposed present-day identification rather than a claim stated in the Qur'an text itself.",
  disputed: "Scholars differ on aspects of this, and the Qur'an does not itself settle the disagreement.",
};
const sourceBasisLabel = computed(() => (sign.value ? SOURCE_BASIS_LABELS[sign.value.sourceBasis] ?? sign.value.sourceBasis : ""));
const sourceBasisExplanation = computed(() => (sign.value ? SOURCE_BASIS_EXPLANATIONS[sign.value.sourceBasis] ?? "" : ""));

const ayahRange = (start, end) => {
  const arr = [];
  for (let n = start; n <= end; n++) arr.push(n);
  return arr;
};
const primaryAyahs = computed(() => (sign.value ? ayahRange(sign.value.passage.ayahStart, sign.value.passage.ayahEnd) : []));

const onPlayAll = () => {
  if (!sign.value) return;
  playPassages(sign.value.title, [sign.value.passage]);
};
</script>

<style scoped>
.sign-detail-container {
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
