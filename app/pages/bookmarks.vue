<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h1 class="text-h4 font-weight-bold">Bookmarks</h1>

          <!-- Count depends on active tab -->
          <v-chip variant="tonal">
            {{ currentCount }} saved
          </v-chip>
        </div>

        <v-tabs v-model="tab" grow>
          <v-tab v-for="c in categories" :key="c.value">
            {{ c.label }}
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
          <v-window-item v-for="c in categories" :key="c.value">
            <!-- SURAH TAB -->
            <template v-if="c.value === 'surah'">
              <v-row>
                <v-col
                  v-for="item in surahBookmarks"
                  :key="item.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card rounded="lg" hover>
                    <v-card-title class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-bold">
                          {{ item.arabicName }}
                        </div>
                        <div class="font-weight-bold">
                          {{ item.title }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          #{{ item.surahNo }} • {{ item.revelationPlace }} •
                          {{ item.totalAyah }} Ayahs
                        </div>
                      </div>

                      <v-btn
                        class="align-self-start"
                        icon="mdi-bookmark-remove"
                        variant="text"
                        color="error"
                        size="small"
                        @click.stop="removeBookmark(item)"
                      />
                    </v-card-title>

                    <v-card-actions>
                      <NuxtLink :to="item.to" class="text-decoration-none">
                        <v-btn variant="tonal">Open</v-btn>
                      </NuxtLink>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="!surahBookmarks.length">
                  <v-alert type="info" variant="tonal">
                    No surah bookmarks yet
                  </v-alert>
                </v-col>
              </v-row>
            </template>

            <!-- AYAH TAB -->
            <template v-else-if="c.value === 'ayah'">
              <v-row>
                <v-col
                  v-for="item in ayahBookmarks"
                  :key="item.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card rounded="lg" hover>
                    <v-card-title class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-bold">
                          {{ item.title }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ item.subtitle }}
                        </div>
                      </div>

                      <v-btn
                        class="align-self-start"
                        icon="mdi-bookmark-remove"
                        variant="text"
                        color="error"
                        size="small"
                        @click.stop="removeBookmark(item)"
                      />
                    </v-card-title>

                    <v-card-actions>
                      <NuxtLink :to="item.to" class="text-decoration-none">
                        <v-btn variant="tonal">Open</v-btn>
                      </NuxtLink>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="!ayahBookmarks.length">
                  <v-alert type="info" variant="tonal">
                    No ayah bookmarks yet
                  </v-alert>
                </v-col>
              </v-row>
            </template>

            <!-- OTHER TABS -->
            <template v-else>
              <v-alert type="info" variant="tonal">
                {{ c.label }} bookmarks will appear here once you implement them.
              </v-alert>
            </template>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const tab = ref(0)

const categories = [
  { label: "Surahs", value: "surah" },
  { label: "Ayahs", value: "ayah" },
  { label: "Audios", value: "audio" },
  { label: "Sajdas", value: "sajda" },
  { label: "Pages", value: "page" },
  { label: "Juz", value: "juz" },
]

const tabValue = computed(() => categories[tab.value]?.value || "surah")

/* ---------------- Bookmarks storage ---------------- */
const { list, load, removeAyah, removeSurah } = useBookmarks()
onMounted(() => load())

/* ---------------- Surah data for names ---------------- */
const { getAll } = useSurahs()
const { data: surahData } = useAsyncData("surahs", () => getAll())

const surahsWithNumber = computed(() => {
  if (!surahData.value) return []
  return surahData.value.map((s, i) => ({ ...s, surahNo: i + 1 }))
})

const surahMap = computed(() => {
  return new Map(surahsWithNumber.value.map((s) => [s.surahNo, s]))
})

function parseKey(k) {
  const parts = String(k).split(":")
  return { type: parts[0], parts }
}

/* ---------------- Ayah bookmarks ---------------- */
const ayahBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("ayah:"))
    .map((k) => {
      const { parts } = parseKey(k)
      const surahNo = Number(parts[1])
      const ayahNo = Number(parts[2])

      const s = surahMap.value.get(surahNo)
      const surahName =
        s?.surahNameArabicLong || s?.surahName || `Surah ${surahNo}`

      return {
        id: k,
        type: "ayah",
        surahNo,
        ayahNo,
        title: `${surahName} • Ayah ${ayahNo}`,
        subtitle: `Surah #${surahNo}`,
        to: `/surah/${surahNo}#ayah-${ayahNo}`,
      }
    })
    .sort((a, b) => a.surahNo - b.surahNo || a.ayahNo - b.ayahNo)
})

/* ---------------- Surah bookmarks ---------------- */
const surahBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("surah:"))
    .map((k) => {
      const { parts } = parseKey(k)
      const surahNo = Number(parts[1])
      const s = surahMap.value.get(surahNo)

      const title =
        s?.surahNameTranslation || s?.surahName || `Surah ${surahNo}`

      return {
        id: k,
        type: "surah",
        surahNo,
        title,
        arabicName: s?.surahNameArabicLong || s?.surahNameArabic || "",
        revelationPlace: s?.revelationPlace || "",
        totalAyah: s?.totalAyah || "",
        to: `/surah/${surahNo}`,
      }
    })
    .sort((a, b) => a.surahNo - b.surahNo)
})

/* ---------------- Top chip count ---------------- */
const currentCount = computed(() => {
  if (tabValue.value === "surah") return surahBookmarks.value.length
  if (tabValue.value === "ayah") return ayahBookmarks.value.length
  return 0
})

/* ---------------- Remove logic ---------------- */
const removeBookmark = (item) => {
  if (item.type === "ayah") removeAyah(item.surahNo, item.ayahNo)
  if (item.type === "surah") removeSurah(item.surahNo)
}
</script>
