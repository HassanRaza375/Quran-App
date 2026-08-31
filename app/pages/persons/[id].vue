<template>
  <v-container v-if="person" class="person-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/persons">Back to directory</v-btn>
      <v-btn
        variant="tonal"
        :color="isBookmarked ? 'amber' : undefined"
        :prepend-icon="isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
        @click="toggleBookmark"
      >
        {{ isBookmarked ? "Saved" : "Save" }}
      </v-btn>
    </div>

    <v-alert
      v-if="resumeTarget"
      type="info"
      variant="tonal"
      density="comfortable"
      icon="mdi-history"
      closable
      class="mb-4"
      @click:close="dismissResume"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <span>Resume where you left off — {{ resumeTarget.label }}</span>
        <v-btn size="small" variant="flat" color="primary" @click="jumpToResume">Resume</v-btn>
      </div>
    </v-alert>

    <!-- 1. Header / identity -->
    <v-sheet elevation="1" rounded="lg" class="pa-4 mb-6 header-sheet">
      <div class="d-flex justify-space-between align-start flex-wrap ga-3">
        <div>
          <div class="arabic-name mt-4">{{ person.arabicName }}</div>
          <h1 class="display-name">
            {{ person.name }}
            <span v-if="person.honorific?.arabic" class="honorific-arabic">{{ person.honorific.arabic }}</span>
          </h1>
          <div v-if="person.alternateNames?.length" class="alternate-names">
            Also known as: {{ person.alternateNames.join(", ") }}
          </div>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip color="primary" variant="tonal">{{ categoryLabel }}</v-chip>
          <v-chip v-if="person.entityType === 'group'" size="small" variant="outlined" prepend-icon="mdi-account-group">Group — not individually named</v-chip>
          <v-chip v-if="propheticStatusLabel" size="small" variant="outlined">{{ propheticStatusLabel }}</v-chip>
        </div>
      </div>

      <div class="meta-row mt-3">
        <v-chip size="small" variant="outlined" prepend-icon="mdi-book-open-variant">
          {{ person.directMentions.length }} direct mentions
        </v-chip>
        <v-chip size="small" variant="outlined" prepend-icon="mdi-book-open-page-variant">
          {{ person.relatedPassages.length }} related passages
        </v-chip>
        <v-chip v-if="chronologyLabel" size="small" variant="outlined" prepend-icon="mdi-clock-outline">
          {{ chronologyLabel }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 2. Overview + 3. Expandable detail -->
    <v-sheet id="section-overview" ref="sectionOverview" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <p class="overview-text">{{ person.shortDescription }}</p>

      <v-expansion-panels v-if="person.detailedDescription" variant="accordion" class="mt-3">
        <v-expansion-panel title="More detail">
          <v-expansion-panel-text>{{ person.detailedDescription }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="person.themes?.length" class="themes mt-3">
        <v-chip v-for="theme in person.themes" :key="theme" size="small" variant="tonal" class="mr-2 mb-2">
          {{ theme }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 4. Key Lessons -->
    <v-sheet
      v-if="person.keyLessons?.length"
      id="section-key-lessons"
      ref="sectionKeyLessons"
      elevation="0"
      rounded="lg"
      class="pa-4 mb-6 section-sheet"
    >
      <h2 class="section-title">Key Lessons</h2>
      <v-list density="compact">
        <v-list-item v-for="(lesson, i) in person.keyLessons" :key="i" class="lesson-item">
          <template #prepend><v-icon size="18" color="primary">mdi-lightbulb-on-outline</v-icon></template>
          <v-list-item-title class="lesson-text">{{ lesson.text }}</v-list-item-title>
          <v-list-item-subtitle v-if="lesson.quranReferences?.length" class="lesson-refs">
            {{ lesson.quranReferences.map((r) => `${surahLabel(r.surahNumber)}:${r.ayahNumber}`).join(", ") }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-sheet>

    <!-- 5. Direct Mentions -->
    <v-sheet id="section-direct-mentions" ref="sectionDirectMentions" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Direct Mentions</h2>
      <p class="section-hint">
        Every ayah where {{ person.name }}'s name or title is explicitly mentioned, verified against
        this app's Qur'an data — not a curated sample.
      </p>
      <SurahReferenceGroup v-if="directMentionGroups.length" :groups="directMentionGroups" @open="onOpenReference" />
      <p v-else class="text-medium-emphasis">No direct name mentions are catalogued for this person yet.</p>
    </v-sheet>

    <!-- 6. Related Passages -->
    <v-sheet id="section-related-passages" ref="sectionRelatedPassages" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
        <h2 class="section-title mb-0">Related Passages</h2>
        <div class="d-flex align-center flex-wrap ga-2">
          <v-btn-toggle v-model="passageView" density="compact" mandatory color="primary" variant="outlined">
            <v-btn value="surah" size="small">Grouped by Surah</v-btn>
            <v-btn value="story" size="small">Story View</v-btn>
          </v-btn-toggle>
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
      </div>

      <p class="section-hint">
        Manually curated passages relevant to {{ person.name }}'s story, including verses where the name isn't
        repeated. Story View presents them as a study sequence, not one continuous revealed passage.
      </p>

      <template v-if="person.relatedPassages.length">
        <template v-if="passageView === 'surah'">
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
        <template v-else>
          <div class="d-flex flex-column ga-2 mt-3">
            <RelatedPassageCard
              v-for="p in storyOrderedPassages"
              :key="p.id"
              :passage="p"
              :is-this-passage-playing="isThisPassagePlaying(p)"
              @play="playSinglePassage"
              @open="onOpenPassage"
            />
          </div>
        </template>
      </template>
      <p v-else class="text-medium-emphasis">No related passages are catalogued for this person yet.</p>
    </v-sheet>

    <!-- 7. Family & Relationships -->
    <v-sheet
      v-if="person.relationships?.length"
      id="section-family"
      ref="sectionFamily"
      elevation="0"
      rounded="lg"
      class="pa-4 mb-6 section-sheet"
    >
      <h2 class="section-title">Family &amp; Relationships</h2>
      <p class="section-hint">
        Relationship type and source/status are shown for each entry — a name in tradition, not the Qur'an, is
        never presented with the same weight as a direct Qur'anic relationship.
      </p>
      <FamilyTree :person="person" />
    </v-sheet>

    <!-- 8. Scholarly / Traditional Notes -->
    <v-sheet
      v-if="person.sources?.length || person.statusNotes?.length"
      id="section-notes"
      ref="sectionNotes"
      elevation="0"
      rounded="lg"
      class="pa-4 mb-10 section-sheet"
    >
      <h2 class="section-title">Scholarly &amp; Traditional Notes</h2>
      <ul v-if="person.sources?.length" class="sources-list">
        <li v-for="(s, i) in person.sources" :key="i">
          <v-chip size="x-small" variant="outlined" class="mr-2">{{ sourceTypeLabel(s.type) }}</v-chip>{{ s.citation }}
        </li>
      </ul>
      <ul v-if="person.statusNotes?.length" class="status-notes-list mt-2">
        <li v-for="(note, i) in person.statusNotes" :key="i">{{ note }}</li>
      </ul>
    </v-sheet>

    <RelatedEntitiesSection :entity-ref="{ module: 'persons', id: person.id }" :exclude-modules="['persons']" />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-account-question-outline</v-icon>
    <p>Person not found.</p>
    <v-btn to="/persons" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import SurahReferenceGroup from "~/components/persons/SurahReferenceGroup.vue";
import RelatedPassageCard from "~/components/persons/RelatedPassageCard.vue";
import FamilyTree from "~/components/persons/FamilyTree.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { SECTION_LABELS } from "~/utils/personStudy";
import { chronologyText } from "~/utils/personsChronology";

const route = useRoute();
const { getPersonById, groupDirectMentionsBySurah, groupRelatedPassagesBySurah, sortRelatedPassagesForStoryView } =
  usePersons();
const { playAllPassages, isQueuePlaying, queue, queueIndex } = usePersonPassageQueue();
const { load: loadBookmarks, isPersonBookmarked, togglePerson } = useBookmarks();
const { load: loadStudy, getFor, recordSection, recordPassageView, recordReference } = usePersonStudy();

const person = computed(() => getPersonById(String(route.params.id)));

useHead(() => ({
  title: person.value ? `${person.value.name} — Prophets & People of the Qur'an` : "Person not found",
}));
useSeoMeta({
  description: () => person.value?.shortDescription,
  ogTitle: () => (person.value ? `${person.value.name} — Prophets & People of the Qur'an` : undefined),
  ogDescription: () => person.value?.shortDescription,
  ogType: "website",
});

onMounted(() => {
  loadBookmarks();
  loadStudy();
});

/* ---------------- Bookmark ---------------- */
const isBookmarked = computed(() => (person.value ? isPersonBookmarked(person.value.id) : false));
const toggleBookmark = () => {
  if (person.value) togglePerson(person.value.id);
};

const categoryLabel = computed(() => {
  if (!person.value) return "";
  return CATEGORY_FILTERS.find((c) => c.value === person.value.primaryCategory)?.label ?? person.value.primaryCategory;
});

const propheticStatusLabels = {
  prophet: "Prophet",
  messenger: "Messenger",
  prophet_and_messenger: "Prophet · Messenger",
};
const propheticStatusLabel = computed(() => person.value ? propheticStatusLabels[person.value.personType] ?? null : null);

const chronologyLabel = computed(() => chronologyText(person.value?.chronology));

const sourceTypeLabel = (type) =>
  ({ quran: "Qur'an", authentic_hadith: "Authentic Hadith", traditional_account: "Traditional account" })[type] ?? type;

const directMentionGroups = computed(() => (person.value ? groupDirectMentionsBySurah(person.value) : []));
const relatedPassageGroups = computed(() => (person.value ? groupRelatedPassagesBySurah(person.value) : []));
const storyOrderedPassages = computed(() => (person.value ? sortRelatedPassagesForStoryView(person.value) : []));

/* ---------------- Related Passages view mode (persisted per-person) ---------------- */
const passageView = ref("surah");
watch(
  person,
  (p) => {
    if (!p) return;
    passageView.value = getFor(p.id)?.passageView ?? "surah";
  },
  { immediate: true }
);
watch(passageView, (view) => {
  if (person.value) recordPassageView(person.value.id, view);
});

const onPlayAll = () => {
  if (!person.value) return;
  playAllPassages(person.value.name, person.value.relatedPassages);
};

const playSinglePassage = (passage) => {
  if (!person.value) return;
  playAllPassages(person.value.name, [passage]);
};

const isThisPassagePlaying = (passage) => {
  if (!isQueuePlaying.value) return false;
  const current = queue.value[queueIndex.value];
  return !!current && current.surahNo === passage.surahNumber && current.ayahNo >= passage.ayahStart && current.ayahNo <= passage.ayahEnd;
};

/* ---------------- Last-viewed reference tracking ---------------- */
const onOpenReference = ({ surahNo, ayahNo }) => {
  if (person.value) recordReference(person.value.id, surahNo, ayahNo);
};
const onOpenPassage = (passage) => {
  if (person.value) recordReference(person.value.id, passage.surahNumber, passage.ayahStart);
};

/* ---------------- Section-visibility tracking (resume study state) ---------------- */
const sectionOverview = ref(null);
const sectionKeyLessons = ref(null);
const sectionDirectMentions = ref(null);
const sectionRelatedPassages = ref(null);
const sectionFamily = ref(null);
const sectionNotes = ref(null);

let observer = null;

const unwrapEl = (r) => r?.value?.$el ?? r?.value ?? null;

const setupObserver = () => {
  observer?.disconnect();
  if (!import.meta.client || !person.value) return;

  const sections = [
    ["overview", sectionOverview],
    ["key-lessons", sectionKeyLessons],
    ["direct-mentions", sectionDirectMentions],
    ["related-passages", sectionRelatedPassages],
    ["family", sectionFamily],
    ["notes", sectionNotes],
  ];

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((e) => e.isIntersecting);
      if (!visible || !person.value) return;
      const match = sections.find(([, r]) => unwrapEl(r) === visible.target);
      if (match) recordSection(person.value.id, match[0]);
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  );

  for (const [, r] of sections) {
    const el = unwrapEl(r);
    if (el) observer.observe(el);
  }
};

onMounted(() => nextTick(setupObserver));
watch(person, () => nextTick(setupObserver));
onBeforeUnmount(() => observer?.disconnect());

/* ---------------- Resume banner ---------------- */
const resumeDismissed = ref(false);
watch(person, () => (resumeDismissed.value = false));

const studyState = computed(() => (person.value ? getFor(person.value.id) : null));

const resumeTarget = computed(() => {
  if (resumeDismissed.value || !isBookmarked.value || !studyState.value) return null;
  const s = studyState.value;
  if (s.lastSection === "overview" && !s.lastSurahNo) return null; // nothing meaningful to resume yet
  const sectionLabel = SECTION_LABELS[s.lastSection] ?? s.lastSection;
  return {
    section: s.lastSection,
    label: s.lastSurahNo ? `${sectionLabel} — ${surahLabel(s.lastSurahNo)}:${s.lastAyahNo}` : sectionLabel,
  };
});

const sectionRefMap = {
  overview: sectionOverview,
  "key-lessons": sectionKeyLessons,
  "direct-mentions": sectionDirectMentions,
  "related-passages": sectionRelatedPassages,
  family: sectionFamily,
  notes: sectionNotes,
};

const jumpToResume = () => {
  if (!resumeTarget.value) return;
  const el = unwrapEl(sectionRefMap[resumeTarget.value.section]);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  resumeDismissed.value = true;
};

const dismissResume = () => {
  resumeDismissed.value = true;
};
</script>

<style scoped>
.person-detail-container {
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

.honorific-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.7);
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
  scroll-margin-top: 76px;
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

.lesson-item {
  padding-block: 6px;
}

.lesson-text {
  white-space: normal;
}

.lesson-refs {
  font-size: 0.75rem;
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
