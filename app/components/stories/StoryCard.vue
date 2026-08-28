<template>
  <v-card class="story-card" elevation="1" rounded="lg" hover>
    <v-btn
      icon
      size="small"
      variant="text"
      class="bookmark-btn"
      :aria-label="isBookmarked ? `Remove ${story.title} from saved` : `Save ${story.title}`"
      @click.stop="toggleBookmark"
    >
      <v-icon :color="isBookmarked ? 'amber' : 'grey'">
        {{ isBookmarked ? "mdi-bookmark" : "mdi-bookmark-outline" }}
      </v-icon>
    </v-btn>

    <NuxtLink :to="`/stories/${story.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="arabic-title">{{ story.arabicTitle }}</div>

        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <div class="display-title">{{ story.title }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="type-chip">
            {{ typeLabel }}
          </v-chip>
        </div>

        <p class="short-description mt-2">{{ story.shortDescription }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ story.primaryPassages.length }} primary passages
          </v-chip>
          <v-chip v-if="story.episodes?.length" size="x-small" variant="outlined" prepend-icon="mdi-format-list-numbered">
            {{ story.episodes.length }} episodes
          </v-chip>
        </div>

        <div v-if="story.themes?.length" class="themes mt-3">
          <v-chip
            v-for="theme in story.themes.slice(0, 4)"
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
import { STORY_TYPE_FILTERS } from "~/utils/storiesSearch";

const props = defineProps({
  story: { type: Object, required: true },
});

const { has, toggle } = useBookmarks();
const bookmarkKey = computed(() => `story:${props.story.id}`);
const isBookmarked = computed(() => has(bookmarkKey.value));
const toggleBookmark = () => toggle(bookmarkKey.value);

const typeLabel = computed(
  () => STORY_TYPE_FILTERS.find((t) => t.value === props.story.storyType)?.label ?? props.story.storyType
);
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.story-card {
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
  font-size: 1.6rem;
  direction: rtl;
}

.display-title {
  font-weight: 600;
  font-size: 1.05rem;
}

.type-chip {
  flex: 0 0 auto;
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

.theme-chip {
  opacity: 0.8;
}
</style>
