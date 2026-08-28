<template>
  <v-container class="peoples-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Peoples &amp; Nations of the Qur'an</h1>
      <p class="hero-subtitle">
        Explore the tribes, nations, and communities described in the Qur'an — their prophets, their
        conduct, and their outcomes.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="9">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by name, Arabic name, theme, or reference (e.g. 11:50)"
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
        <v-btn v-if="query || communityType !== 'all' || savedOnly" variant="text" prepend-icon="mdi-close" @click="resetFilters(); savedOnly = false">
          Reset
        </v-btn>
      </v-col>
    </v-row>

    <div class="type-filters mt-2 mb-6">
      <v-chip
        v-for="t in COMMUNITY_TYPE_FILTERS"
        :key="t.value"
        role="button"
        :aria-pressed="communityType === t.value ? 'true' : 'false'"
        :color="communityType === t.value ? 'primary' : undefined"
        :variant="communityType === t.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setCommunityType(t.value)"
      >
        {{ t.label }}
      </v-chip>
    </div>

    <v-row v-if="visibleCommunities.length" dense>
      <v-col v-for="community in visibleCommunities" :key="community.id" cols="12" sm="6" md="4" lg="3">
        <CommunityCard :community="community" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-map-marker-radius-outline</v-icon>
      <p v-if="savedOnly">You haven't saved any peoples yet.</p>
      <p v-else>No Qur'anic peoples found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetFilters(); savedOnly = false">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { COMMUNITY_TYPE_FILTERS } from "~/utils/peoplesSearch";
import CommunityCard from "~/components/peoples/CommunityCard.vue";

const { query, communityType, filteredCommunities, setQuery, setCommunityType, resetFilters } = usePeoples();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => loadBookmarks());

const savedOnly = ref(false);
const visibleCommunities = computed(() =>
  savedOnly.value ? filteredCommunities.value.filter((c) => has(`community:${c.id}`)) : filteredCommunities.value
);
</script>

<style scoped>
.peoples-container {
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
