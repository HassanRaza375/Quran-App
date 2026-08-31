<template>
  <v-container class="commands-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Commands & Prohibitions of the Qur'an</h1>
      <p class="hero-subtitle">
        A focused catalog of the Qur'an's own direct commands and prohibitions — what is
        commanded or forbidden, its audience, and how directly the Qur'an itself establishes it.
      </p>
    </v-sheet>

    <v-row align="center">
      <v-col cols="12" md="8">
        <v-text-field
          :model-value="query"
          append-inner-icon="mdi-magnify"
          label="Search by title, description, or reference (e.g. 17:32)"
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

    <div class="type-filters mt-2 mb-6">
      <v-chip
        v-for="t in COMMAND_TYPE_FILTERS"
        :key="t.value"
        role="button"
        :aria-pressed="type === t.value ? 'true' : 'false'"
        :color="type === t.value ? 'primary' : undefined"
        :variant="type === t.value ? 'flat' : 'outlined'"
        class="mr-2 mb-2"
        @click="setType(t.value)"
      >
        {{ t.label }}
      </v-chip>
      <v-btn v-if="query || type !== 'all' || savedOnly || personFilter" variant="text" prepend-icon="mdi-close" @click="resetAll">
        Reset
      </v-btn>
    </div>

    <v-row v-if="visibleCommands.length" dense>
      <v-col v-for="command in visibleCommands" :key="command.id" cols="12" sm="6" md="4" lg="3">
        <CommandCard :command="command" />
      </v-col>
    </v-row>

    <v-sheet v-else elevation="0" rounded="lg" class="pa-8 text-center empty-state">
      <v-icon size="36" class="mb-2">mdi-gavel</v-icon>
      <p v-if="savedOnly">You haven't saved any commands or prohibitions yet.</p>
      <p v-else>No commands or prohibitions found{{ query ? ` for "${query}"` : "" }}.</p>
      <v-btn variant="tonal" color="primary" class="mt-2" @click="resetAll">
        Reset search &amp; filters
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { COMMAND_TYPE_FILTERS } from "~/utils/commandsSearch";
import CommandCard from "~/components/commands/CommandCard.vue";

useHead({ title: "Commands & Prohibitions of the Qur'an" });
useSeoMeta({
  description: "Browse 18 direct commands and prohibitions from the Qur'an's own text — Prayer, Zakah, Shirk, Riba, and more — with their audience and source.",
  ogTitle: "Commands & Prohibitions of the Qur'an",
  ogDescription: "Browse 18 direct commands and prohibitions from the Qur'an's own text.",
  ogType: "website",
});

const route = useRoute();
const { query, type, personFilter, filteredCommands, commands, setQuery, setType, setPersonFilter, resetFilters, resolvePerson } = useCommands();

const { load: loadBookmarks, has } = useBookmarks();
onMounted(() => {
  loadBookmarks();
  const presetPerson = route.query.person;
  if (typeof presetPerson === "string" && presetPerson) setPersonFilter(presetPerson);
});

const savedOnly = ref(false);

const personFilterOptions = computed(() => {
  const ids = new Set();
  for (const c of commands) for (const pid of c.personIds ?? []) ids.add(pid);
  return Array.from(ids)
    .map((id) => ({ value: id, title: resolvePerson(id).name }))
    .sort((a, b) => a.title.localeCompare(b.title));
});

const resetAll = () => {
  resetFilters();
  savedOnly.value = false;
};

const visibleCommands = computed(() =>
  savedOnly.value ? filteredCommands.value.filter((c) => has(`command:${c.id}`)) : filteredCommands.value
);
</script>

<style scoped>
.commands-container {
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
