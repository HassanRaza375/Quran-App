<template>
  <v-card class="event-card" elevation="1" rounded="lg" hover>
    <v-btn
      icon
      size="small"
      variant="text"
      class="bookmark-btn"
      :aria-label="isBookmarked ? `Remove ${event.title} from saved` : `Save ${event.title}`"
      @click.stop="toggleBookmark"
    >
      <v-icon :color="isBookmarked ? 'amber' : 'grey'">
        {{ isBookmarked ? "mdi-bookmark" : "mdi-bookmark-outline" }}
      </v-icon>
    </v-btn>

    <NuxtLink :to="`/events/${event.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="arabic-title">{{ event.arabicTitle }}</div>

        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <div class="display-title">{{ event.title }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="category-chip">
            {{ categoryLabel }}
          </v-chip>
        </div>

        <div class="chronology-line mt-1">
          <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>{{ chronologyLabel }}
        </div>

        <p class="description-text mt-2">{{ event.description }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ surahLabel(event.passage.surahNumber) }} : {{ event.passage.ayahStart }}{{ event.passage.ayahEnd !== event.passage.ayahStart ? `-${event.passage.ayahEnd}` : "" }}
          </v-chip>
        </div>
      </v-card-text>
    </NuxtLink>
  </v-card>
</template>

<script setup>
import { EVENT_CATEGORY_FILTERS } from "~/utils/eventsSearch";
import { surahLabel } from "~/composables/usePersons";

const props = defineProps({
  event: { type: Object, required: true },
});

const { has, toggle } = useBookmarks();
const bookmarkKey = computed(() => `event:${props.event.id}`);
const isBookmarked = computed(() => has(bookmarkKey.value));
const toggleBookmark = () => toggle(bookmarkKey.value);

const categoryLabel = computed(
  () => EVENT_CATEGORY_FILTERS.find((c) => c.value === props.event.category)?.label ?? props.event.category
);

const CHRONOLOGY_LABELS = {
  strong: "Strong chronology",
  traditional: "Traditional chronology",
  uncertain: "Uncertain chronology",
  unknown: "Chronology not established",
};
const chronologyLabel = computed(() => CHRONOLOGY_LABELS[props.event.chronologyStatus] ?? props.event.chronologyStatus);
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.event-card {
  height: 100%;
  position: relative;
}

.bookmark-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
}

.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 1.4rem;
  direction: rtl;
}

.display-title {
  font-weight: 600;
  font-size: 1.02rem;
}

.category-chip {
  flex: 0 0 auto;
}

.chronology-line {
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: flex;
  align-items: center;
}

.description-text {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
