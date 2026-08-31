<template>
  <v-container class="themes-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Themes of the Qur'an</h1>
      <p class="hero-subtitle">
        Explore recurring Qur'anic concepts — where each appears, and which people, stories, peoples,
        and places illustrate it.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="9">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by name, Arabic name, or reference (e.g. 2:153)"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setQuery($event ?? '')"
        />
      </v-col>
      <v-col cols="12" md="3" class="d-flex align-center justify-md-end ga-2">
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
        <v-btn v-if="query || category !== 'all' || savedOnly" variant="text" prepend-icon="mdi-close" @click="resetAll">
          Reset
        </v-btn>
      </v-col>
    </v-row>

    <div class="category-filters mt-2 mb-6">
      <v-chip
        v-for="c in THEME_CATEGORY_FILTERS"
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
    </div>

    <v-row v-if="visibleThemes.length" dense>
      <v-col v-for="theme in visibleThemes" :key="theme.id" cols="12" sm="6" md="4" lg="3">
        <ThemeCard :theme="theme" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-lightbulb-on-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any themes yet.</p>
      <p v-else>No Qur'anic themes found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetAll">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { THEME_CATEGORY_FILTERS } from "~/utils/themesSearch";
import ThemeCard from "~/components/themes/ThemeCard.vue";

useHead({ title: "Themes of the Qur'an" });
useSeoMeta({
  description: "Browse 42 recurring doctrinal and moral concepts across the Qur'an — Tawhid, Justice, Patience, and more — with representative passages.",
  ogTitle: "Themes of the Qur'an",
  ogDescription: "Browse 42 recurring doctrinal and moral concepts across the Qur'an.",
  ogType: "website",
});

const { query, category, filteredThemes, setQuery, setCategory, resetFilters } = useThemes();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => loadBookmarks());

const savedOnly = ref(false);

const resetAll = () => {
  resetFilters();
  savedOnly.value = false;
};

const visibleThemes = computed(() =>
  savedOnly.value ? filteredThemes.value.filter((t) => has(`theme:${t.id}`)) : filteredThemes.value
);
</script>

<style scoped>
.themes-container {
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
