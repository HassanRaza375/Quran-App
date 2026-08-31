<template>
  <v-container class="persons-container">
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-6">
      <h1 class="hero-title">Prophets &amp; People of the Qur'an</h1>
      <p class="hero-subtitle">
        Explore the prophets and people mentioned in the Qur'an, their references, stories, and relationships.
      </p>
    </v-sheet>

    <div class="d-flex justify-center mb-8">
      <v-btn-toggle color="primary" variant="outlined" divided :model-value="'timeline'">
        <v-btn value="browse" to="/persons">Browse People</v-btn>
        <v-btn value="timeline" to="/persons/timeline">Timeline</v-btn>
      </v-btn-toggle>
    </div>

    <PropheticTimeline />
  </v-container>
</template>

<script setup>
import PropheticTimeline from "~/components/persons/PropheticTimeline.vue";

useHead({ title: "Timeline — Prophets & People of the Qur'an" });
useSeoMeta({
  description: "A chronological timeline of the prophets and key figures mentioned in the Qur'an, with their relationships to one another.",
  ogTitle: "Timeline — Prophets & People of the Qur'an",
  ogType: "website",
});
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
</style>
