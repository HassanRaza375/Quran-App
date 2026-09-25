<template>
  <v-container v-if="category" class="fiqh-container">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/fiqh" class="mb-2">Daily Fiqh</v-btn>

    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-4">
      <div class="arabic-term" lang="ar" dir="rtl">{{ category.arabicTerm }}</div>
      <h1 class="hero-title">
        {{ category.title.en }}
        <span v-if="category.title.ur" class="urdu-inline ms-2 text-medium-emphasis" lang="ur" dir="rtl">{{ category.title.ur }}</span>
      </h1>
      <p class="hero-subtitle">{{ category.summary.text.en }}</p>
    </v-sheet>

    <FiqhNotices class="mb-4" />
    <div class="mb-4"><MarjaChip v-if="loaded" /></div>

    <v-sheet v-if="!topics.length" rounded="lg" class="pa-6 text-center empty-state">
      <v-icon size="36" class="mb-2" aria-hidden="true">mdi-progress-clock</v-icon>
      <p class="mb-0">
        This section is scheduled for phase {{ category.phase }}. Its rulings are added one topic at a
        time, and only once each is sourced from the marja's own book.
      </p>
    </v-sheet>

    <v-row v-else>
      <v-col v-for="t in topics" :key="t.id" cols="12" md="6">
        <v-card :to="`/fiqh/${category.id}/${t.id}`" rounded="lg" variant="outlined" class="h-100">
          <v-card-item>
            <v-card-title class="topic-title">{{ t.title.en }}</v-card-title>
            <v-card-subtitle>
              <span v-if="t.arabicTerm" class="arabic-small" lang="ar" dir="rtl">{{ t.arabicTerm }}</span>
              <span v-if="t.title.ur" class="urdu-inline ms-2" lang="ur" dir="rtl">{{ t.title.ur }}</span>
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="pt-0">
            <p class="text-body-2 mb-2">{{ t.summary.text.en }}</p>
            <v-chip size="x-small" variant="tonal" color="primary" prepend-icon="mdi-gavel">
              {{ t.rulingIds.length }} {{ t.rulingIds.length === 1 ? "ruling" : "rulings" }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else class="fiqh-container">
    <v-alert type="warning" variant="tonal">This section doesn't exist.</v-alert>
    <v-btn class="mt-4" variant="tonal" to="/fiqh" prepend-icon="mdi-arrow-left">Back to Daily Fiqh</v-btn>
  </v-container>
</template>

<script setup>
import FiqhNotices from "~/components/wajibat/FiqhNotices.vue";
import MarjaChip from "~/components/wajibat/MarjaChip.vue";

const route = useRoute();
useUrduFont();
const { getCategoryById, topicsFor } = useWajibat();
const { loaded, load } = useFiqhPrefs();
onMounted(() => load());

const category = computed(() => getCategoryById(String(route.params.category)));
const topics = computed(() => (category.value ? topicsFor(category.value.id) : []));

useHead(() => ({ title: category.value ? `${category.value.title.en} — Daily Fiqh` : "Not found" }));
useSeoMeta({ description: () => category.value?.summary.text.en });
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
.arabic-term {
  font-family: "Amiri Quran", serif;
  font-size: 1.5rem;
}
.arabic-small {
  font-family: "Amiri Quran", serif;
}
.topic-title {
  white-space: normal;
}
.empty-state {
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.15);
}
</style>
