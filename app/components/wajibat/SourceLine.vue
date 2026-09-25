<template>
  <div class="source-line" :class="{ 'is-urdu': urdu }">
    <v-icon size="16" class="me-1" aria-hidden="true">mdi-book-open-page-variant-outline</v-icon>
    <span v-if="urdu" class="urdu-inline" lang="ur" dir="rtl">{{ source.title }} — {{ source.reference }}</span>
    <span v-else>According to {{ marjaName }} — <em>{{ source.title }}</em>, {{ source.reference }}</span>
    <a
      :href="source.url"
      target="_blank"
      rel="noopener noreferrer"
      class="ms-2 source-link"
      :aria-label="`Open ${source.title}, ${source.reference} on the official website (opens in a new tab)`"
    >
      official text <v-icon size="14" aria-hidden="true">mdi-open-in-new</v-icon>
    </a>
    <v-chip
      v-if="verification"
      size="x-small"
      variant="tonal"
      class="ms-2"
      :color="level.color"
      :prepend-icon="level.icon"
    >
      {{ level.label }}
    </v-chip>
  </div>
</template>

<script setup>
import { VERIFICATION_META } from "~/utils/wajibatLabels";

const props = defineProps({
  source: { type: Object, required: true },
  marjaName: { type: String, required: true },
  verification: { type: String, default: null },
  urdu: { type: Boolean, default: false },
});

const level = computed(() => VERIFICATION_META[props.verification] ?? {});
</script>

<style scoped>
.source-line {
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 4px;
}
.source-link {
  color: rgb(var(--v-theme-primary));
  white-space: nowrap;
}
</style>
