<template>
  <v-container class="stories-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Stories of the Qur'an</h1>
      <p class="hero-subtitle">
        Explore the Qur'an's major narratives — who, what happened, where, and the lessons drawn —
        cross-linked to People, Peoples &amp; Nations, and Places.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="7">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by title, Arabic title, theme, or reference (e.g. 12:4)"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setQuery($event ?? '')"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="personFilter"
          :items="personFilterOptions"
          item-title="title"
          item-value="value"
          label="Filter by person"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center justify-md-end ga-2">
        <v-chip
          role="button"
          :aria-pressed="savedOnly ? 'true' : 'false'"
          :color="savedOnly ? 'amber' : undefined"
          :variant="savedOnly ? 'flat' : 'outlined'"
          :prepend-icon="savedOnly ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
          @click="savedOnly = !savedOnly"
        >
          Saved
        </v-chip>
      </v-col>
    </v-row>

    <div class="type-filters mt-2 mb-6">
      <v-chip
        v-for="t in STORY_TYPE_FILTERS"
        :key="t.value"
        role="button"
        :aria-pressed="storyType === t.value ? 'true' : 'false'"
        :color="storyType === t.value ? 'primary' : undefined"
        :variant="storyType === t.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setStoryType(t.value)"
      >
        {{ t.label }}
      </v-chip>
      <v-btn v-if="query || storyType !== 'all' || savedOnly || personFilter" variant="text" prepend-icon="mdi-close" @click="resetAll">
        Reset
      </v-btn>
    </div>

    <v-row v-if="visibleStories.length" dense>
      <v-col v-for="story in visibleStories" :key="story.id" cols="12" sm="6" md="4" lg="3">
        <StoryCard :story="story" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-book-open-page-variant-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any stories yet.</p>
      <p v-else>No Qur'anic stories found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetAll">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { STORY_TYPE_FILTERS, filterByPersonId } from "~/utils/storiesSearch";
import StoryCard from "~/components/stories/StoryCard.vue";

useHead({ title: "Stories of the Qur'an" });
useSeoMeta({
  description: "Browse 21 narrative accounts from the Qur'an, prophet by prophet, with episodes, lessons, and cross-links to the people and places involved.",
  ogTitle: "Stories of the Qur'an",
  ogDescription: "Browse 21 narrative accounts from the Qur'an, prophet by prophet.",
  ogType: "website",
});

const { query, storyType, filteredStories, stories, setQuery, setStoryType, resetFilters, resolvePerson } = useStories();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => loadBookmarks());

const savedOnly = ref(false);
const personFilter = ref(null);

const personFilterOptions = computed(() => {
  const ids = new Set(stories.flatMap((s) => s.personIds ?? []));
  return Array.from(ids)
    .map((id) => ({ value: id, title: resolvePerson(id).name }))
    .sort((a, b) => a.title.localeCompare(b.title));
});

const resetAll = () => {
  resetFilters();
  savedOnly.value = false;
  personFilter.value = null;
};

const visibleStories = computed(() => {
  let list = filteredStories.value;
  if (personFilter.value) list = filterByPersonId(list, personFilter.value);
  if (savedOnly.value) list = list.filter((s) => has(`story:${s.id}`));
  return list;
});
</script>

<style scoped>
.stories-container {
  max-width: 1200px;
  margin: auto;
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

.type-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
