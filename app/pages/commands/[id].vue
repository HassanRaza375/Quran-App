<template>
  <v-container v-if="command" class="command-detail-container">
    <div class="d-flex justify-space-between align-center flex-wrap ga-2 mb-3">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/commands">Back to directory</v-btn>
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
          <div class="arabic-title mt-4">{{ command.arabicTitle }}</div>
          <h1 class="display-title">{{ command.title }}</h1>
        </div>
        <div class="d-flex flex-column align-end ga-1">
          <v-chip :color="command.type === 'command' ? 'primary' : 'error'" variant="tonal">{{ typeLabel }}</v-chip>
          <v-chip size="small" variant="outlined">{{ sourceBasisLabel }}</v-chip>
        </div>
      </div>
    </v-sheet>

    <!-- 1. Overview -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Overview</h2>
      <p class="body-text">{{ command.description }}</p>
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
        {{ surahLabel(command.passage.surahNumber) }} : {{ command.passage.ayahStart }}{{ command.passage.ayahEnd !== command.passage.ayahStart ? `-${command.passage.ayahEnd}` : "" }}
        — Arabic text, translation, audio, and tafsir below are the app's existing Qur'an reader
        data. Each ayah has its own play button; use "Play all passages" above for the full passage
        in sequence.
      </p>
      <div class="d-flex flex-column ga-3">
        <AyahReferenceCard
          v-for="ayahNo in primaryAyahs"
          :key="`${command.passage.surahNumber}:${ayahNo}`"
          :surah-no="command.passage.surahNumber"
          :ayah-no="ayahNo"
        />
      </div>
    </v-sheet>

    <!-- 3. Qur'anic Sources -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Qur'anic Sources</h2>
      <p class="body-text">{{ sourceBasisExplanation }}</p>

      <template v-if="command.parallelPassages?.length">
        <h3 class="parallel-title mt-4">Also Occurs At</h3>
        <div v-for="p in command.parallelPassages" :key="p.id" class="d-flex flex-column ga-3 mb-2">
          <AyahReferenceCard
            v-for="ayahNo in ayahRange(p.ayahStart, p.ayahEnd)"
            :key="`${p.surahNumber}:${ayahNo}`"
            :surah-no="p.surahNumber"
            :ayah-no="ayahNo"
          />
        </div>
      </template>

      <template v-if="command.statusNotes?.length">
        <h3 class="parallel-title mt-4">Notes</h3>
        <ul class="status-notes-list">
          <li v-for="(note, i) in command.statusNotes" :key="i">{{ note }}</li>
        </ul>
      </template>
    </v-sheet>

    <!-- 4. Audience / Source Qualification -->
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Audience</h2>
      <p class="body-text">{{ command.audience }}</p>
    </v-sheet>

    <!-- 5. People Involved -->
    <v-sheet v-if="command.personIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">People</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="pid in command.personIds" :key="pid" :to="resolvePerson(pid).href ?? undefined" variant="outlined">
          {{ resolvePerson(pid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 6. Peoples & Nations -->
    <v-sheet v-if="command.communityIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Peoples &amp; Nations</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="cid in command.communityIds" :key="cid" :to="resolveCommunity(cid).href ?? undefined" variant="outlined">
          {{ resolveCommunity(cid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 7. Places -->
    <v-sheet v-if="command.placeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Places</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="plid in command.placeIds" :key="plid" :to="resolvePlace(plid).href ?? undefined" variant="outlined">
          {{ resolvePlace(plid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 8. Related Story -->
    <v-sheet v-if="command.storyIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Story</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="sid in command.storyIds" :key="sid" :to="resolveStory(sid).href ?? undefined" variant="outlined">
          {{ resolveStory(sid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 9. Themes -->
    <v-sheet v-if="command.themeIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Themes</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="tid in command.themeIds" :key="tid" :to="resolveTheme(tid).href ?? undefined" variant="outlined">
          {{ resolveTheme(tid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 10. Related Events -->
    <v-sheet v-if="command.eventIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Events</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="eid in command.eventIds" :key="eid" :to="resolveEvent(eid).href ?? undefined" variant="outlined" prepend-icon="mdi-timeline-clock-outline">
          {{ resolveEvent(eid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 11. Related Signs -->
    <v-sheet v-if="command.signIds?.length" elevation="0" rounded="lg" class="pa-4 mb-6 section-sheet">
      <h2 class="section-title">Related Signs &amp; Miracles</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="sgid in command.signIds" :key="sgid" :to="resolveSign(sgid).href ?? undefined" variant="outlined" prepend-icon="mdi-star-four-points-outline">
          {{ resolveSign(sgid).name }}
        </v-chip>
      </div>
    </v-sheet>

    <!-- 12. Related Duas -->
    <v-sheet v-if="command.duaIds?.length" elevation="0" rounded="lg" class="pa-4 mb-10 section-sheet">
      <h2 class="section-title">Related Duas</h2>
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="did in command.duaIds" :key="did" :to="resolveDua(did).href ?? undefined" variant="outlined" prepend-icon="mdi-hands-pray">
          {{ resolveDua(did).name }}
        </v-chip>
      </div>
    </v-sheet>

    <RelatedEntitiesSection
      :entity-ref="{ module: 'commands', id: command.id }"
      :exclude-modules="['persons', 'peoples', 'places', 'stories', 'themes', 'duas', 'events', 'signs']"
    />
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-icon size="40" class="mb-2">mdi-gavel</v-icon>
    <p>Command or prohibition not found.</p>
    <v-btn to="/commands" variant="tonal" color="primary">Back to directory</v-btn>
  </v-container>
</template>

<script setup>
import AyahReferenceCard from "~/components/persons/AyahReferenceCard.vue";
import RelatedEntitiesSection from "~/components/knowledge/RelatedEntitiesSection.vue";
import { COMMAND_TYPE_FILTERS } from "~/utils/commandsSearch";

const route = useRoute();
const {
  getCommandById, resolvePerson, resolveCommunity, resolvePlace, resolveStory, resolveTheme, resolveDua, resolveEvent, resolveSign,
} = useCommands();
const { playPassages, isQueuePlaying } = useCommandPassageQueue();
const { load: loadBookmarks, has, toggle } = useBookmarks();

const command = computed(() => getCommandById(String(route.params.id)));

useHead(() => ({
  title: command.value ? `${command.value.title} — Commands & Prohibitions` : "Not found",
}));

onMounted(() => loadBookmarks());

const bookmarkKey = computed(() => (command.value ? `command:${command.value.id}` : null));
const isBookmarked = computed(() => (bookmarkKey.value ? has(bookmarkKey.value) : false));
const toggleBookmark = () => {
  if (bookmarkKey.value) toggle(bookmarkKey.value);
};

const typeLabel = computed(() => {
  if (!command.value) return "";
  return COMMAND_TYPE_FILTERS.find((t) => t.value === command.value.type)?.label ?? command.value.type;
});

const SOURCE_BASIS_LABELS = {
  quran_explicit: "Direct Qur'anic command/prohibition",
  quran_inferred: "Inferred principle",
  derived_ruling: "Derived legal ruling",
  scholarly_interpretation: "Scholarly interpretation",
};
const SOURCE_BASIS_EXPLANATIONS = {
  quran_explicit: "The Qur'an directly commands or prohibits this in the passage(s) below.",
  quran_inferred: "This principle is drawn from the Qur'an's own surrounding context, not stated as a single direct imperative.",
  derived_ruling: "This is a specific ruling reached through legal derivation from the Qur'anic text, not itself Qur'anic wording.",
  scholarly_interpretation: "This reflects a scholarly reading of what the text means or how far it extends, not a claim stated directly in the Qur'an.",
};
const sourceBasisLabel = computed(() => (command.value ? SOURCE_BASIS_LABELS[command.value.sourceBasis] ?? command.value.sourceBasis : ""));
const sourceBasisExplanation = computed(() => (command.value ? SOURCE_BASIS_EXPLANATIONS[command.value.sourceBasis] ?? "" : ""));

const ayahRange = (start, end) => {
  const arr = [];
  for (let n = start; n <= end; n++) arr.push(n);
  return arr;
};
const primaryAyahs = computed(() => (command.value ? ayahRange(command.value.passage.ayahStart, command.value.passage.ayahEnd) : []));

const onPlayAll = () => {
  if (!command.value) return;
  playPassages(command.value.title, [command.value.passage]);
};
</script>

<style scoped>
.command-detail-container {
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
