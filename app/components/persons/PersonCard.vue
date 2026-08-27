<template>
  <v-card class="person-card" elevation="1" rounded="lg" hover>
    <NuxtLink :to="`/persons/${person.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="d-flex justify-space-between align-start ga-2">
          <div class="arabic-name">{{ person.arabicName }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="category-chip">
            {{ categoryLabel }}
          </v-chip>
        </div>

        <div class="display-name mt-1">
          {{ person.name }}
          <span v-if="person.honorific?.short" class="honorific">({{ person.honorific.short }})</span>
        </div>

        <p class="short-description mt-2">{{ person.shortDescription }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ person.directMentions.length }} direct mentions
          </v-chip>
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-page-variant">
            {{ person.relatedPassages.length }} related passages
          </v-chip>
        </div>

        <div v-if="chronologyText" class="chronology mt-2">
          <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>{{ chronologyText }}
        </div>

        <div v-if="person.themes?.length" class="themes mt-3">
          <v-chip
            v-for="theme in person.themes.slice(0, 4)"
            :key="theme"
            size="x-small"
            variant="text"
            class="theme-chip"
          >
            {{ theme }}
          </v-chip>
        </div>
      </v-card-text>
    </NuxtLink>
  </v-card>
</template>

<script setup>
import { CATEGORY_FILTERS } from "~/utils/personsSearch";

const props = defineProps({
  person: { type: Object, required: true },
});

const categoryLabel = computed(
  () => CATEGORY_FILTERS.find((c) => c.value === props.person.primaryCategory)?.label ?? props.person.primaryCategory
);

const chronologyStatusLabel = {
  strong: null, // established enough to not need a qualifier badge
  traditional: "Traditional chronology",
  uncertain: "Chronology uncertain",
  unknown: "Chronology unknown",
};

const chronologyText = computed(() => {
  const chronology = props.person.chronology;
  if (!chronology) return "";
  if (chronology.label && chronology.status === "strong") return chronology.label;
  const statusLabel = chronologyStatusLabel[chronology.status];
  if (chronology.label && statusLabel) return `${chronology.label} — ${statusLabel}`;
  return statusLabel ?? chronology.label ?? "";
});
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.person-card {
  height: 100%;
}

.arabic-name {
  font-family: "Amiri Quran", serif;
  font-size: 1.6rem;
  direction: rtl;
}

.display-name {
  font-weight: 600;
  font-size: 1.05rem;
}

.honorific {
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.short-description {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-row,
.themes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chronology {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.theme-chip {
  opacity: 0.8;
}
</style>
