<template>
  <v-container class="fiqh-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-4">
      <h1 class="hero-title">Daily Fiqh (Wajibat)</h1>
      <p class="hero-subtitle">
        The obligatory acts of Fiqh Ja'fari. Every ruling is quoted from your marja's own published
        book, with its issue or question number.
      </p>
      <p class="hero-subtitle urdu-text mt-1" lang="ur">روزمرہ کے فقہی احکام — فقہ جعفری</p>
    </v-sheet>

    <FiqhNotices class="mb-4" />

    <!-- First visit: choose a marja' before anything else (decision Q2). -->
    <v-card v-if="loaded && !marjaId" variant="outlined" rounded="lg" class="pa-4 mb-6">
      <h2 class="section-title">Choose your marja'</h2>
      <p class="text-body-2 text-medium-emphasis mb-3">
        You'll only see the rulings of the marja' you choose. You can change this at any time here or
        in Settings.
      </p>
      <MarjaPicker />
    </v-card>

    <div v-else-if="loaded" class="mb-4">
      <MarjaChip />
    </div>

    <v-text-field
      v-model="query"
      append-inner-icon="mdi-magnify"
      label="Search topics, rulings and terms (English, اردو, عربی)"
      variant="outlined"
      clearable
      hide-details
      class="mb-4"
    />

    <!-- Search results -->
    <template v-if="query && query.trim()">
      <v-sheet v-if="!resultCount" rounded="lg" class="pa-6 text-center empty-state mb-6">
        No topics, rulings or terms match "{{ query }}".
      </v-sheet>
      <v-list v-else lines="two" rounded="lg" class="mb-6" aria-label="Search results">
        <v-list-item
          v-for="t in results.topics"
          :key="`t-${t.id}`"
          :to="`/fiqh/${t.categoryId}/${t.id}`"
          prepend-icon="mdi-file-document-outline"
          :title="t.title.en"
          :subtitle="`Topic · ${categoryTitle(t.categoryId)}`"
        />
        <v-list-item
          v-for="r in results.rulings"
          :key="`r-${r.id}`"
          :to="rulingLink(r)"
          prepend-icon="mdi-gavel"
          :title="r.subject.en"
          :subtitle="`Ruling · ${topicTitle(r.topicId)}`"
        />
        <v-list-item
          v-for="g in results.glossary"
          :key="`g-${g.id}`"
          :to="{ path: '/fiqh/glossary', hash: `#${g.id}` }"
          prepend-icon="mdi-alphabetical-variant"
          :title="g.term"
          :subtitle="`Glossary · ${g.definition.en}`"
        />
      </v-list>
    </template>

    <!-- Categories -->
    <v-row>
      <v-col v-for="c in categories" :key="c.id" cols="12" sm="6" md="4">
        <v-card :to="`/fiqh/${c.id}`" rounded="lg" variant="outlined" class="h-100 category-card">
          <v-card-item>
            <template #prepend>
              <v-icon :icon="c.icon" color="primary" aria-hidden="true" />
            </template>
            <v-card-title class="category-title">{{ c.title.en }}</v-card-title>
            <v-card-subtitle>
              <span class="arabic-term" lang="ar" dir="rtl">{{ c.arabicTerm }}</span>
              <span v-if="c.title.ur" class="urdu-inline ms-2" lang="ur" dir="rtl">{{ c.title.ur }}</span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="pt-0">
            <p class="text-body-2 mb-2">{{ c.summary.text.en }}</p>
            <v-chip v-if="c.topicIds.length" size="x-small" variant="tonal" color="primary">
              {{ c.topicIds.length }} {{ c.topicIds.length === 1 ? "topic" : "topics" }}
            </v-chip>
            <v-chip v-else size="x-small" variant="outlined">Coming in phase {{ c.phase }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex flex-wrap ga-2 mt-6 mb-4">
      <v-btn variant="tonal" prepend-icon="mdi-alphabetical-variant" to="/fiqh/glossary">Glossary</v-btn>
      <v-btn variant="tonal" prepend-icon="mdi-clock-outline" to="/prayerTime">Prayer times</v-btn>
      <v-btn variant="tonal" prepend-icon="mdi-compass-outline" to="/qibla-direction">Qibla</v-btn>
    </div>

    <FiqhDisclaimer :marja="marja" />
  </v-container>
</template>

<script setup>
import FiqhNotices from "~/components/wajibat/FiqhNotices.vue";
import MarjaPicker from "~/components/wajibat/MarjaPicker.vue";
import MarjaChip from "~/components/wajibat/MarjaChip.vue";
import FiqhDisclaimer from "~/components/wajibat/FiqhDisclaimer.vue";

useHead({ title: "Daily Fiqh (Wajibat)" });
useSeoMeta({
  description: "Obligatory acts in Fiqh Ja'fari, quoted from the rulings of the marja' you follow, with their sources.",
});

useUrduFont();
const { categories, search, getCategoryById, getTopicById, getMarjaById } = useWajibat();
const { marjaId, loaded, load } = useFiqhPrefs();
onMounted(() => load());

const marja = computed(() => getMarjaById(marjaId.value));
const query = ref("");
const results = computed(() => search(query.value ?? ""));
const resultCount = computed(() => results.value.topics.length + results.value.rulings.length + results.value.glossary.length);

const categoryTitle = (id) => getCategoryById(id)?.title.en ?? id;
const topicTitle = (id) => getTopicById(id)?.title.en ?? id;
const rulingLink = (r) => {
  const topic = getTopicById(r.topicId);
  return topic ? { path: `/fiqh/${topic.categoryId}/${topic.id}`, hash: `#${r.id}` } : "/fiqh";
};
</script>

<style scoped>
.fiqh-container {
  max-width: 1100px;
  margin: auto;
  padding-bottom: 60px;
}
.hero {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.06), rgba(var(--v-theme-secondary), 0.06));
}
.hero-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.hero-subtitle {
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin: 0;
}
.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.category-title {
  white-space: normal;
}
.arabic-term {
  font-family: "Amiri Quran", serif;
  font-size: 1.05rem;
}
.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
