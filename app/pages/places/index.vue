<template>
  <v-container class="places-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Places of the Qur'an</h1>
      <p class="hero-subtitle">
        Explore the cities, mountains, valleys, and sanctuaries named or described in the Qur'an —
        with careful separation between what the text states and later geographic identification.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="9">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by name, Arabic name, theme, or reference (e.g. 3:96)"
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
        <v-btn v-if="query || placeType !== 'all' || savedOnly" variant="text" prepend-icon="mdi-close" @click="resetFilters(); savedOnly = false">
          Reset
        </v-btn>
      </v-col>
    </v-row>

    <div class="type-filters mt-2 mb-6">
      <v-chip
        v-for="t in PLACE_TYPE_FILTERS"
        :key="t.value"
        role="button"
        :aria-pressed="placeType === t.value ? 'true' : 'false'"
        :color="placeType === t.value ? 'primary' : undefined"
        :variant="placeType === t.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setPlaceType(t.value)"
      >
        {{ t.label }}
      </v-chip>
    </div>

    <v-row v-if="visiblePlaces.length" dense>
      <v-col v-for="place in visiblePlaces" :key="place.id" cols="12" sm="6" md="4" lg="3">
        <PlaceCard :place="place" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-map-search-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any places yet.</p>
      <p v-else>No Qur'anic places found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetFilters(); savedOnly = false">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { PLACE_TYPE_FILTERS } from "~/utils/placesSearch";
import PlaceCard from "~/components/places/PlaceCard.vue";

const { query, placeType, filteredPlaces, setQuery, setPlaceType, resetFilters } = usePlaces();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => loadBookmarks());

const savedOnly = ref(false);
const visiblePlaces = computed(() =>
  savedOnly.value ? filteredPlaces.value.filter((p) => has(`place:${p.id}`)) : filteredPlaces.value
);
</script>

<style scoped>
.places-container {
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
}

.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
