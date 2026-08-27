<template>
  <v-container class="persons-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Prophets &amp; People of the Qur'an</h1>
      <p class="hero-subtitle">
        Explore the prophets and people mentioned in the Qur'an, their references, stories, and relationships.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="9">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by name, Arabic name, theme, or reference (e.g. 11:25)"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setQuery($event ?? '')"
        />
      </v-col>
      <v-col cols="12" md="3" class="d-flex align-center justify-md-end ga-2">
        <v-chip
          :color="savedOnly ? 'amber' : undefined"
          :variant="savedOnly ? 'flat' : 'outlined'"
          :prepend-icon="savedOnly ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
          @click="savedOnly = !savedOnly"
        >
          Saved
        </v-chip>
        <v-btn v-if="query || category !== 'all' || savedOnly" variant="text" prepend-icon="mdi-close" @click="resetFilters(); savedOnly = false">
          Reset
        </v-btn>
      </v-col>
    </v-row>

    <div class="category-filters mt-2 mb-6">
      <v-chip
        v-for="c in CATEGORY_FILTERS"
        :key="c.value"
        :color="category === c.value ? 'primary' : undefined"
        :variant="category === c.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setCategory(c.value)"
      >
        {{ c.label }}
      </v-chip>
    </div>

    <v-row v-if="visiblePersons.length" dense>
      <v-col v-for="person in visiblePersons" :key="person.id" cols="12" sm="6" md="4" lg="3">
        <PersonCard :person="person" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-book-search-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any persons yet.</p>
      <p v-else>No Qur'anic persons found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetFilters(); savedOnly = false">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { CATEGORY_FILTERS } from "~/utils/personsSearch";
import PersonCard from "~/components/persons/PersonCard.vue";

const { query, category, filteredPersons, setQuery, setCategory, resetFilters } = usePersons();

const { load: loadBookmarks, isPersonBookmarked } = useBookmarks();
onMounted(() => loadBookmarks());

const savedOnly = ref(false);
const visiblePersons = computed(() =>
  savedOnly.value ? filteredPersons.value.filter((p) => isPersonBookmarked(p.id)) : filteredPersons.value
);
</script>

<style scoped>
.persons-container {
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
}

.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
