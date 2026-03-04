<template>
  <v-container>
    <!-- Search -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchText"
          append-inner-icon="mdi-magnify"
          label="Search Surah"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="youtube-embed-container">
          <iframe
            :src="videoSrc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <!-- Surah cards -->
      <v-col
        v-for="name in filteredNames"
        :key="name.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-lazy
          :min-height="137"
          :options="{ threshold: 0.5 }"
          transition="fade-transition"
        >
          <v-card class="surah-card" elevation="1" rounded="lg">
            <!-- Favorite button -->
            <v-btn
              icon
              size="small"
              variant="text"
              class="fav-btn"
              @click.stop="toggleName(name.id)"
            >
              <v-icon :color="isNameBookmarked(name.id) ? 'amber' : 'grey'">
                {{
                  isNameBookmarked(name.id) ? "mdi-star" : "mdi-star-outline"
                }}
              </v-icon>
            </v-btn>

            <v-card-text class="pt-8">
              <div class="arabic-name">
                {{ name.arabic }}
              </div>

              <div class="english-name">
                {{ name.english }}
              </div>

              <div class="meta mt-3">
                <v-chip size="x-small" variant="tonal"> #{{ name.id }} </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { isNameBookmarked, toggleName, removeName } = useBookmarks();

const { names, search, setSort, selectedSort } = useAsma();
const searchText = ref("");
const filteredNames = computed(() => {
  if (!searchText.value) return names.value;
  return search(searchText.value);
});
/* Favorites */
const videoId = "ta_tTZrarE0"; // Set your video ID dynamically if needed.
const videoSrc = `https://www.youtube.com/embed/${videoId}?si=gv5AX6IPEI7pfMYo`;
</script>
<style scoped>
.surah-card {
  position: relative;
}

.fav-btn {
  position: absolute;
  top: -1px;
  right: 6px;
  z-index: 2;
}

.arabic-name {
  font-family: "Amiri Quran", serif;
  font-size: 2rem;
  text-align: right;
  direction: rtl;
}

.english-name {
  font-size: 0.9rem;
  color: #666;
}

.meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.youtube-embed-container {
  position: relative;
  padding-bottom: 20%; /* Aspect Ratio 16:9 */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  background: #000;
}

.youtube-embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
