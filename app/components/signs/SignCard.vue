<template>
  <v-card class="sign-card" elevation="1" rounded="lg" hover>
    <v-btn
      icon
      size="small"
      variant="text"
      class="bookmark-btn"
      :aria-label="isBookmarked ? `Remove ${sign.title} from saved` : `Save ${sign.title}`"
      @click.stop="toggleBookmark"
    >
      <v-icon :color="isBookmarked ? 'amber' : 'grey'">
        {{ isBookmarked ? "mdi-bookmark" : "mdi-bookmark-outline" }}
      </v-icon>
    </v-btn>

    <NuxtLink :to="`/signs/${sign.id}`" class="card-link">
      <v-card-text class="pt-4">
        <div class="arabic-title">{{ sign.arabicTitle }}</div>

        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <div class="display-title">{{ sign.title }}</div>
          <v-chip size="x-small" variant="tonal" color="primary" class="classification-chip">
            {{ classificationLabel }}
          </v-chip>
        </div>

        <p class="description-text mt-2">{{ sign.description }}</p>

        <div class="meta-row mt-3">
          <v-chip size="x-small" variant="outlined" prepend-icon="mdi-book-open-variant">
            {{ surahLabel(sign.passage.surahNumber) }} : {{ sign.passage.ayahStart }}{{ sign.passage.ayahEnd !== sign.passage.ayahStart ? `-${sign.passage.ayahEnd}` : "" }}
          </v-chip>
        </div>
      </v-card-text>
    </NuxtLink>
  </v-card>
</template>

<script setup>
import { SIGN_CLASSIFICATION_FILTERS } from "~/utils/signsSearch";
import { surahLabel } from "~/composables/usePersons";

const props = defineProps({
  sign: { type: Object, required: true },
});

const { has, toggle } = useBookmarks();
const bookmarkKey = computed(() => `sign:${props.sign.id}`);
const isBookmarked = computed(() => has(bookmarkKey.value));
const toggleBookmark = () => toggle(bookmarkKey.value);

const classificationLabel = computed(
  () => SIGN_CLASSIFICATION_FILTERS.find((c) => c.value === props.sign.classification)?.label ?? props.sign.classification
);
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.sign-card {
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

.classification-chip {
  flex: 0 0 auto;
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
