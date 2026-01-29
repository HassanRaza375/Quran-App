<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Bookmarks</h1>

        <v-tabs v-model="tab" grow>
          <v-tab v-for="c in categories" :key="c.value">
            {{ c.label }}
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
          <v-window-item v-for="c in categories" :key="c.value">
            <v-row>
              <v-col v-for="item in filteredBookmarks(c.value)" :key="item.id" cols="12" md="6" lg="4">
                <v-card rounded="lg">
                  <v-card-title class="d-flex justify-space-between">
                    <span class="font-weight-bold">
                      {{ item.title }}
                    </span>

                    <!-- Remove bookmark -->
                    <v-btn icon="mdi-bookmark-remove" variant="text" color="error" size="small"
                      @click.stop="removeBookmark(item.id)" />
                  </v-card-title>

                  <v-card-text>
                    <div class="text-medium-emphasis">
                      {{ item.subtitle }}
                    </div>

                    <div class="text-caption text-grey">
                      Saved {{ formatDate(item.createdAt) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Empty state -->
              <v-col cols="12" v-if="!filteredBookmarks(c.value).length">
                <v-alert type="info" variant="tonal">
                  No {{ c.label.toLowerCase() }} bookmarks yet
                </v-alert>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const tab = ref(0)

const categories = [
  { label: 'Surahs', value: 'surah' },
  { label: 'Ayahs', value: 'ayah' },
  { label: 'Audios', value: 'audio' },
  { label: 'Sajdas', value: 'sajda' },
  { label: 'Pages', value: 'page' },
  { label: 'Juz', value: 'juz' },
]

const bookmarks = ref([
  {
    id: 1,
    type: 'ayah',
    title: 'Al-Baqarah • Ayah 255',
    subtitle: 'Page 42',
    createdAt: '2025-01-26',
  },
  {
    id: 2,
    type: 'audio',
    title: 'Al-Fātiḥah Recitation',
    subtitle: 'Mishary Alafasy',
    createdAt: '2025-01-25',
  },
])

const filteredBookmarks = (type) =>
  bookmarks.value.filter(b => b.type === type)

const removeBookmark = (id) => {
  bookmarks.value = bookmarks.value.filter(b => b.id !== id)
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString()
let r = {
  id: 'uuid',
  type: 'ayah' | 'surah' | 'audio' | 'sajda' | 'page' | 'juz',
  ref: {
    surah: 2,
    ayah: 255,
    page: 42,
    juz: 3
  },
  title: 'Al-Baqarah • Ayah 255',
  subtitle: 'Page 42',
  createdAt: Date.now()
}

</script>
