<template>
  <v-card class="community-card" elevation="1" rounded="lg" hover>
    <v-btn
      icon
      size="small"
      variant="text"
      class="bookmark-btn"
      :aria-label="isBookmarked ? `Remove ${community.name} from saved` : `Save ${community.name}`"
      @click.stop="toggleBookmark"
    >
      <v-icon :color="isBookmarked ? 'amber' : 'grey'">
        {{ isBookmarked ? "mdi-bookmark" : "mdi-bookmark-outline" }}
      </v-icon>
    </v-btn>

    <NuxtLink :to="`/peoples/${community.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="arabic-name">{{ community.arabicName }}</div>

        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <div class="display-name">{{ community.name }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="type-chip">
            {{ typeLabel }}
          </v-chip>
        </div>

        <p class="short-description mt-2">{{ community.shortDescription }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ community.directMentions.length }} direct mentions
          </v-chip>
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-page-variant">
            {{ community.relatedPassages.length }} related passages
          </v-chip>
        </div>

        <div v-if="community.themes?.length" class="themes mt-3">
          <v-chip
            v-for="theme in community.themes.slice(0, 4)"
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
import { COMMUNITY_TYPE_FILTERS } from "~/utils/peoplesSearch";

const props = defineProps({
  community: { type: Object, required: true },
});

const { has, toggle } = useBookmarks();
const bookmarkKey = computed(() => `community:${props.community.id}`);
const isBookmarked = computed(() => has(bookmarkKey.value));
const toggleBookmark = () => toggle(bookmarkKey.value);

const typeLabel = computed(
  () => COMMUNITY_TYPE_FILTERS.find((t) => t.value === props.community.communityType)?.label ?? props.community.communityType
);
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.community-card {
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
