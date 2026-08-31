<template>
  <v-container class="signs-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Signs & Miracles of the Qur'an</h1>
      <p class="hero-subtitle">
        Specific occurrences the Qur'an itself frames as signs, miracles, divine aid, or
        punishment-signs — each linked back to the Person, Story, or Event it belongs to.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="8">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by title, description, or reference (e.g. 21:68)"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setQuery($event ?? '')"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          :model-value="personFilter"
          :items="personFilterOptions"
          item-title="title"
          item-value="value"
          label="Filter by person"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="setPersonFilter($event ?? null)"
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

    <div class="classification-filters mt-2 mb-6">
      <v-chip
        v-for="c in SIGN_CLASSIFICATION_FILTERS"
        :key="c.value"
        role="button"
        :aria-pressed="classification === c.value ? 'true' : 'false'"
        :color="classification === c.value ? 'primary' : undefined"
        :variant="classification === c.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setClassification(c.value)"
      >
        {{ c.label }}
      </v-chip>
      <v-btn v-if="query || classification !== 'all' || savedOnly || personFilter" variant="text" prepend-icon="mdi-close" @click="resetAll">
        Reset
      </v-btn>
    </div>

    <v-row v-if="visibleSigns.length" dense>
      <v-col v-for="sign in visibleSigns" :key="sign.id" cols="12" sm="6" md="4" lg="3">
        <SignCard :sign="sign" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-star-four-points-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any signs yet.</p>
      <p v-else>No signs or miracles found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetAll">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { SIGN_CLASSIFICATION_FILTERS } from "~/utils/signsSearch";
import SignCard from "~/components/signs/SignCard.vue";

useHead({ title: "Signs & Miracles of the Qur'an" });
useSeoMeta({
  description: "Browse 14 signs and miracles the Qur'an itself describes — from Musa's staff to the Table from Heaven — each linked to its source verses.",
  ogTitle: "Signs & Miracles of the Qur'an",
  ogDescription: "Browse 14 signs and miracles the Qur'an itself describes.",
  ogType: "website",
});

const route = useRoute();
const { query, classification, personFilter, filteredSigns, signs, setQuery, setClassification, setPersonFilter, resetFilters, resolvePerson } = useSigns();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => {
  loadBookmarks();
  const presetPerson = route.query.person;
  if (typeof presetPerson === "string" && presetPerson) setPersonFilter(presetPerson);
});

const savedOnly = ref(false);

const personFilterOptions = computed(() => {
  const ids = new Set();
  for (const s of signs) for (const pid of s.personIds ?? []) ids.add(pid);
  return Array.from(ids)
    .map((id) => ({ value: id, title: resolvePerson(id).name }))
    .sort((a, b) => a.title.localeCompare(b.title));
});

const resetAll = () => {
  resetFilters();
  savedOnly.value = false;
};

const visibleSigns = computed(() =>
  savedOnly.value ? filteredSigns.value.filter((s) => has(`sign:${s.id}`)) : filteredSigns.value
);
</script>

<style scoped>
.signs-container {
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

.classification-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
