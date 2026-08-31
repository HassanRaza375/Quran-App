<template>
  <v-container class="duas-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Duas of the Qur'an</h1>
      <p class="hero-subtitle">
        Supplications grounded directly in the Qur'an — who made each one, in what situation, and
        what it asks for.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="7">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by title, context, speaker, or reference (e.g. 21:87)"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setQuery($event ?? '')"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          :model-value="speakerFilter"
          :items="speakerFilterOptions"
          item-title="title"
          item-value="value"
          label="Filter by speaker"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setSpeakerFilter($event ?? null)"
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

    <div class="category-filters mt-2 mb-6">
      <v-chip
        v-for="c in DUA_CATEGORY_FILTERS"
        :key="c.value"
        role="button"
        :aria-pressed="category === c.value ? 'true' : 'false'"
        :color="category === c.value ? 'primary' : undefined"
        :variant="category === c.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setCategory(c.value)"
      >
        {{ c.label }}
      </v-chip>
      <v-btn v-if="query || category !== 'all' || savedOnly || speakerFilter" variant="text" prepend-icon="mdi-close" @click="resetAll">
        Reset
      </v-btn>
    </div>

    <v-row v-if="visibleDuas.length" dense>
      <v-col v-for="dua in visibleDuas" :key="dua.id" cols="12" sm="6" md="4" lg="3">
        <DuaCard :dua="dua" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-hands-pray</v-icon>
      <p v-if="savedOnly">You haven't saved any duas yet.</p>
      <p v-else>No Qur'anic duas found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetAll">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { DUA_CATEGORY_FILTERS } from "~/utils/duasSearch";
import DuaCard from "~/components/duas/DuaCard.vue";

useHead({ title: "Duas of the Qur'an" });
useSeoMeta({
  description: "Browse 38 supplications made by name in the Qur'an's own text, who made each one, and what it asks for.",
  ogTitle: "Duas of the Qur'an",
  ogDescription: "Browse 38 supplications made by name in the Qur'an's own text.",
  ogType: "website",
});

const { query, category, speakerFilter, filteredDuas, duas, setQuery, setCategory, setSpeakerFilter, resetFilters, resolvePerson } = useDuas();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => loadBookmarks());

const savedOnly = ref(false);

const speakerFilterOptions = computed(() => {
  const ids = new Set(duas.filter((d) => d.speakerType === "person" && d.personId).map((d) => d.personId));
  return Array.from(ids)
    .map((id) => ({ value: id, title: resolvePerson(id).name }))
    .sort((a, b) => a.title.localeCompare(b.title));
});

const resetAll = () => {
  resetFilters();
  savedOnly.value = false;
};

const visibleDuas = computed(() =>
  savedOnly.value ? filteredDuas.value.filter((d) => has(`dua:${d.id}`)) : filteredDuas.value
);
</script>

<style scoped>
.duas-container {
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

.category-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
