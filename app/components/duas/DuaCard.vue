<template>
  <v-card class="dua-card" elevation="1" rounded="lg" hover>
    <v-btn
      icon
      size="small"
      variant="text"
      class="bookmark-btn"
      :aria-label="isBookmarked ? `Remove ${dua.title} from saved` : `Save ${dua.title}`"
      @click.stop="toggleBookmark"
    >
      <v-icon :color="isBookmarked ? 'amber' : 'grey'">
        {{ isBookmarked ? "mdi-bookmark" : "mdi-bookmark-outline" }}
      </v-icon>
    </v-btn>

    <NuxtLink :to="`/duas/${dua.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="arabic-title">{{ dua.arabicTitle }}</div>

        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <div class="display-title">{{ dua.title }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="category-chip">
            {{ categoryLabel }}
          </v-chip>
        </div>

        <div class="speaker-line mt-1">
          <v-icon size="14" class="mr-1">mdi-account-voice</v-icon>{{ speaker.name }}
        </div>

        <p class="context-text mt-2">{{ dua.context }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ surahLabel(dua.passage.surahNumber) }} : {{ dua.passage.ayahStart }}{{ dua.passage.ayahEnd !== dua.passage.ayahStart ? `-${dua.passage.ayahEnd}` : "" }}
          </v-chip>
        </div>
      </v-card-text>
    </NuxtLink>
  </v-card>
</template>

<script setup>
import { DUA_CATEGORY_FILTERS } from "~/utils/duasSearch";
import { surahLabel } from "~/composables/usePersons";

const props = defineProps({
  dua: { type: Object, required: true },
});

const { has, toggle } = useBookmarks();
const bookmarkKey = computed(() => `dua:${props.dua.id}`);
const isBookmarked = computed(() => has(bookmarkKey.value));
const toggleBookmark = () => toggle(bookmarkKey.value);

const { speakerDisplay } = useDuas();
const speaker = computed(() => speakerDisplay(props.dua));

const categoryLabel = computed(
  () => DUA_CATEGORY_FILTERS.find((c) => c.value === props.dua.category)?.label ?? props.dua.category
);
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.dua-card {
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

.speaker-line {
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: flex;
  align-items: center;
}

.context-text {
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
