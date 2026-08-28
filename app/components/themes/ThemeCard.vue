<template>
  <v-card class="theme-card" elevation="1" rounded="lg" hover>
    <v-btn
      icon
      size="small"
      variant="text"
      class="bookmark-btn"
      :aria-label="isBookmarked ? `Remove ${theme.name} from saved` : `Save ${theme.name}`"
      @click.stop="toggleBookmark"
    >
      <v-icon :color="isBookmarked ? 'amber' : 'grey'">
        {{ isBookmarked ? "mdi-bookmark" : "mdi-bookmark-outline" }}
      </v-icon>
    </v-btn>

    <NuxtLink :to="`/themes/${theme.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="arabic-name">{{ theme.arabicName }}</div>

        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <div class="display-name">{{ theme.name }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="category-chip">
            {{ categoryLabel }}
          </v-chip>
        </div>

        <p class="definition-text mt-2">{{ theme.definition }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ theme.representativePassages.length }} passages
          </v-chip>
          <v-chip v-if="linkedCount" size="x-small" variant="outlined" prepend-icon="mdi-link-variant">
            {{ linkedCount }} linked entries
          </v-chip>
        </div>
      </v-card-text>
    </NuxtLink>
  </v-card>
</template>

<script setup>
import { THEME_CATEGORY_FILTERS } from "~/utils/themesSearch";

const props = defineProps({
  theme: { type: Object, required: true },
});

const { has, toggle } = useBookmarks();
const bookmarkKey = computed(() => `theme:${props.theme.id}`);
const isBookmarked = computed(() => has(bookmarkKey.value));
const toggleBookmark = () => toggle(bookmarkKey.value);

const categoryLabel = computed(
  () => THEME_CATEGORY_FILTERS.find((c) => c.value === props.theme.category)?.label ?? props.theme.category
);

const linkedCount = computed(() =>
  (props.theme.storyIds?.length ?? 0) +
  (props.theme.personIds?.length ?? 0) +
  (props.theme.communityIds?.length ?? 0) +
  (props.theme.placeIds?.length ?? 0)
);
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.theme-card {
  height: 100%;
  position: relative;
}

.bookmark-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
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

.category-chip {
  flex: 0 0 auto;
}

.definition-text {
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
