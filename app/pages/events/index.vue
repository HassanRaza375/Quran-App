<template>
  <v-container class="events-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Events of the Qur'an</h1>
      <p class="hero-subtitle">
        Discrete, significant occurrences described in the Qur'an — turning points, confrontations,
        rescues, and revelations — cross-linked to the people, places, and stories they belong to.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="8">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by title, description, or reference (e.g. 20:83)"
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

    <div class="category-filters mt-2 mb-6">
      <v-chip
        v-for="c in EVENT_CATEGORY_FILTERS"
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
      <v-btn v-if="query || category !== 'all' || savedOnly || personFilter" variant="text" prepend-icon="mdi-close" @click="resetAll">
        Reset
      </v-btn>
    </div>

    <v-row v-if="visibleEvents.length" dense>
      <v-col v-for="event in visibleEvents" :key="event.id" cols="12" sm="6" md="4" lg="3">
        <EventCard :event="event" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-timeline-clock-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any events yet.</p>
      <p v-else>No Qur'anic events found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetAll">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { EVENT_CATEGORY_FILTERS } from "~/utils/eventsSearch";
import EventCard from "~/components/events/EventCard.vue";

useHead({ title: "Events of the Qur'an" });
useSeoMeta({
  description: "Browse 40 discrete events and turning points described in the Qur'an, cross-linked to the people, places, and stories they belong to.",
  ogTitle: "Events of the Qur'an",
  ogDescription: "Browse 40 discrete events and turning points described in the Qur'an.",
  ogType: "website",
});

const route = useRoute();
const { query, category, personFilter, filteredEvents, events, setQuery, setCategory, setPersonFilter, resetFilters, resolvePerson } = useEvents();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => {
  loadBookmarks();
  const presetPerson = route.query.person;
  if (typeof presetPerson === "string" && presetPerson) setPersonFilter(presetPerson);
});

const savedOnly = ref(false);

const personFilterOptions = computed(() => {
  const ids = new Set();
  for (const e of events) for (const pid of e.personIds ?? []) ids.add(pid);
  return Array.from(ids)
    .map((id) => ({ value: id, title: resolvePerson(id).name }))
    .sort((a, b) => a.title.localeCompare(b.title));
});

const resetAll = () => {
  resetFilters();
  savedOnly.value = false;
};

const visibleEvents = computed(() =>
  savedOnly.value ? filteredEvents.value.filter((e) => has(`event:${e.id}`)) : filteredEvents.value
);
</script>

<style scoped>
.events-container {
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
