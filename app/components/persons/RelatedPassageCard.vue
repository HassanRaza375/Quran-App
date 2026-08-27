<template>
  <v-sheet rounded="lg" elevation="0" class="passage-card pa-3">
    <div class="d-flex justify-space-between align-start ga-2">
      <div>
        <div class="passage-title">{{ passage.title || surahLabel(passage.surahNumber) }}</div>
        <div class="passage-ref text-medium-emphasis">
          {{ surahLabel(passage.surahNumber) }} · {{ passage.ayahStart }}–{{ passage.ayahEnd }}
        </div>
      </div>
      <v-chip size="x-small" variant="outlined">{{ passage.ayahEnd - passage.ayahStart + 1 }} ayahs</v-chip>
    </div>

    <p v-if="passage.description" class="passage-description mt-2">{{ passage.description }}</p>

    <div class="actions-row mt-2">
      <v-btn
        size="small"
        variant="text"
        :prepend-icon="isThisPassagePlaying ? 'mdi-pause' : 'mdi-play'"
        @click="$emit('play', passage)"
      >
        {{ isThisPassagePlaying ? "Playing…" : "Play" }}
      </v-btn>
      <v-spacer />
      <v-btn
        size="small"
        variant="tonal"
        color="primary"
        append-icon="mdi-arrow-right"
        :to="`/surah/${passage.surahNumber}#ayah-${passage.ayahStart}`"
      >
        Read Passage
      </v-btn>
    </div>
  </v-sheet>
</template>

<script setup>
defineProps({
  passage: { type: Object, required: true },
  isThisPassagePlaying: { type: Boolean, default: false },
});
defineEmits(["play"]);
</script>

<style scoped>
.passage-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.passage-title {
  font-weight: 600;
}

.passage-ref {
  font-size: 0.8rem;
}

.passage-description {
  font-size: 0.85rem;
  line-height: 1.5;
}

.actions-row {
  display: flex;
  align-items: center;
}
</style>
