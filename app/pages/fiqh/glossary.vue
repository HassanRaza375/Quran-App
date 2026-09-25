<template>
  <v-container class="fiqh-container">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/fiqh" class="mb-2">Daily Fiqh</v-btn>
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-4">
      <h1 class="hero-title">Glossary</h1>
      <p class="hero-subtitle">
        Terms used in this module. Definitions are quoted from the glossary of al-Sistani's
        <em>Islamic Laws</em> (4th edition); the Arabic and Urdu spellings are the app's own labels.
      </p>
    </v-sheet>

    <v-text-field
      v-model="query"
      append-inner-icon="mdi-magnify"
      label="Filter terms (English, اردو, عربی)"
      variant="outlined"
      clearable
      hide-details
      class="mb-4"
    />

    <v-sheet v-if="!filtered.length" rounded="lg" class="pa-6 text-center empty-state">No terms match "{{ query }}".</v-sheet>

    <v-row v-else>
      <v-col v-for="g in filtered" :id="g.id" :key="g.id" cols="12" md="6">
        <v-card variant="outlined" rounded="lg" class="h-100">
          <v-card-item>
            <v-card-title class="term-title">{{ g.term }}</v-card-title>
            <v-card-subtitle>
              <span v-if="g.arabic" class="arabic-small" lang="ar" dir="rtl">{{ g.arabic }}</span>
              <span v-if="g.urdu" class="urdu-inline ms-3" lang="ur" dir="rtl">{{ g.urdu }}</span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="pt-0">
            <p class="mb-2">{{ g.definition.en }}</p>
            <div v-if="g.source" class="text-caption text-medium-emphasis">
              <v-icon size="14" aria-hidden="true">mdi-book-open-page-variant-outline</v-icon>
              <a :href="g.source.url" target="_blank" rel="noopener noreferrer">{{ g.source.title }}</a>, {{ g.source.reference }}
            </div>
            <div v-else class="text-caption text-medium-emphasis">Explanation written by the app</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { normalizeWajibatText } from "~/utils/wajibatSearch";

useHead({ title: "Glossary — Daily Fiqh" });
useSeoMeta({ description: "Terms used in the Daily Fiqh (Wajibat) module, with sourced definitions." });

useUrduFont();
const { glossary } = useWajibat();
const query = ref("");
const filtered = computed(() => {
  const q = normalizeWajibatText(query.value ?? "");
  const sorted = [...glossary].sort((a, b) => normalizeWajibatText(a.term).localeCompare(normalizeWajibatText(b.term)));
  if (!q) return sorted;
  return sorted.filter((g) =>
    [g.term, g.arabic, g.urdu, g.definition.en].some((f) => f && normalizeWajibatText(f).includes(q))
  );
});

onMounted(async () => {
  const route = useRoute();
  if (route.hash) {
    await nextTick();
    document.querySelector(route.hash)?.scrollIntoView({ block: "start" });
  }
});
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
.term-title {
  white-space: normal;
}
.arabic-small {
  font-family: "Amiri Quran", serif;
  font-size: 1.05rem;
}
.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
