<template>
  <v-container class="search-container">
    <v-text-field
      v-model="query"
      label="Search the Quran"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      hide-details
      autofocus
    />

    <!-- Suggested / recent searches (only shown before typing) -->
    <div v-if="!query">
      <div v-if="history.length" class="mt-4">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-caption text-medium-emphasis">Recent searches</span>
          <v-btn size="x-small" variant="text" @click="clearHistory">Clear all</v-btn>
        </div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="h in history"
            :key="h"
            size="small"
            closable
            @click="query = h"
            @click:close="removeFromHistory(h)"
          >
            {{ h }}
          </v-chip>
        </div>
      </div>

      <div class="mt-4">
        <div class="text-caption text-medium-emphasis mb-2">Suggested</div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="s in suggestedSearches"
            :key="s"
            size="small"
            variant="outlined"
            @click="query = s"
          >
            {{ s }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <v-row class="mt-4" dense>
      <v-col cols="12" sm="6">
        <v-select
          v-model="editionGroup"
          :items="editionGroups"
          label="Search in"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="edition"
          :items="editionsInGroup"
          item-title="title"
          item-value="id"
          label="Edition"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="6">
        <v-select v-model="surah" :items="surahOptions" label="Surah" variant="outlined" hide-details />
      </v-col>
      <v-col cols="6">
        <v-select v-model="juz" :items="juzOptions" label="Juz" variant="outlined" hide-details />
      </v-col>
    </v-row>

    <v-switch
      v-model="bookmarkedOnly"
      label="Bookmarked ayahs only"
      inset
      density="compact"
      color="primary"
      hide-details
      class="mt-1"
    />

    <div v-if="editionGroup === 'tafsir'" class="text-caption text-medium-emphasis mt-1">
      Sunni tafsir sources, Arabic only — matches the tafsir feature on the Surah page.
    </div>

    <!-- Loading / error -->
    <v-progress-linear v-if="pending" indeterminate class="mt-4" />
    <v-alert v-if="error" type="error" variant="tonal" class="mt-4">{{ error }}</v-alert>

    <div
      v-if="!pending && query.trim().length >= 3 && !error"
      class="text-caption text-medium-emphasis mt-4"
    >
      {{ filteredResults.length }} result{{ filteredResults.length === 1 ? "" : "s" }}
      <span v-if="totalCount > results.length">
        (API returned {{ totalCount }} total, showing first {{ results.length }})
      </span>
    </div>

    <!-- Results -->
    <v-list v-if="filteredResults.length" class="mt-2">
      <v-list-item
        v-for="ayah in filteredResults"
        :key="ayah.id"
        class="search-result-item"
        @click="gotoAyah(ayah)"
      >
        <div class="d-flex justify-space-between align-center mb-1 flex-wrap ga-1">
          <span class="text-caption font-weight-bold">
            {{ ayah.surahNameEnglish }} • {{ ayah.surahNo }}:{{ ayah.ayahNo }}
          </span>
          <v-chip size="x-small">{{ ayah.editionName }}</v-chip>
        </div>
        <div
          class="search-result-text"
          :class="{ 'search-result-text--rtl': editionGroup === 'arabic' || editionGroup === 'tafsir' || editionGroup === 'urdu' }"
          v-html="highlightMatch(ayah.text, query)"
        />
      </v-list-item>
    </v-list>

    <v-alert
      v-else-if="!pending && query.trim().length >= 3 && !error"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      No results found
    </v-alert>

    <v-alert
      v-else-if="query.trim().length > 0 && query.trim().length < 3"
      type="info"
      variant="tonal"
      density="compact"
      class="mt-4"
    >
      Keep typing — search starts at 3 characters.
    </v-alert>
  </v-container>
</template>

<script setup>
import { useDebounceFn } from "@vueuse/core"

const router = useRouter()
const route = useRoute()

const { results, totalCount, pending, error, search: runSearch } = useSearch()
const { history, load: loadHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()
const { isAyahBookmarked, load: loadBookmarks } = useBookmarks()
const { getJuz } = useJuz()

/* ---------------- State (seeded from the URL so results are shareable) ---------------- */
const query = ref(String(route.query.q || ""))
const editionGroup = ref(String(route.query.g || "english"))
const edition = ref(String(route.query.e || "en.pickthall"))
const surah = ref(route.query.s ? Number(route.query.s) : "all")
const juz = ref(route.query.j ? Number(route.query.j) : "all")
const bookmarkedOnly = ref(route.query.b === "1")

const suggestedSearches = ["patience", "mercy", "forgiveness", "gratitude", "prayer", "fasting", "charity", "guidance"]

const editionGroups = [
  { title: "English", value: "english" },
  { title: "Urdu", value: "urdu" },
  { title: "Arabic (Quran text)", value: "arabic" },
  { title: "Arabic Tafsir", value: "tafsir" },
]

const editionsInGroup = computed(() => SEARCH_EDITIONS.filter((e) => e.group === editionGroup.value))

watch(editionGroup, (group) => {
  const first = SEARCH_EDITIONS.find((e) => e.group === group)
  if (first) edition.value = first.id
})

const surahOptions = [
  { title: "All Surahs", value: "all" },
  ...Array.from({ length: 114 }, (_, i) => ({ title: `Surah ${i + 1}`, value: i + 1 })),
]
const juzOptions = [
  { title: "All Juz", value: "all" },
  ...Array.from({ length: 30 }, (_, i) => ({ title: `Juz ${i + 1}`, value: i + 1 })),
]

/* ---------------- Juz membership (client-side filter, no server-side juz scope on this API) ---------------- */
const juzAyahSet = ref(null)
watch(
  juz,
  async (j) => {
    if (j === "all") {
      juzAyahSet.value = null
      return
    }
    try {
      const data = await getJuz(j)
      const set = new Set()
      Object.values(data.surahs).forEach(({ surah: s, ayahs }) => {
        ayahs.forEach((a) => set.add(`${s.number}:${a.numberInSurah}`))
      })
      juzAyahSet.value = set
    } catch {
      juzAyahSet.value = null
    }
  },
  { immediate: true }
)

const filteredResults = computed(() => {
  let list = results.value
  if (juzAyahSet.value) {
    list = list.filter((r) => juzAyahSet.value.has(`${r.surahNo}:${r.ayahNo}`))
  }
  if (bookmarkedOnly.value) {
    list = list.filter((r) => isAyahBookmarked(r.surahNo, r.ayahNo))
  }
  return list
})

/* ---------------- Search + URL sync (one debounced handler for both) ---------------- */
const syncAndSearch = useDebounceFn(async () => {
  router.replace({
    query: {
      q: query.value || undefined,
      g: editionGroup.value,
      e: edition.value,
      s: surah.value !== "all" ? surah.value : undefined,
      j: juz.value !== "all" ? juz.value : undefined,
      b: bookmarkedOnly.value ? "1" : undefined,
    },
  })

  if (query.value.trim().length >= 3) {
    await runSearch(query.value, edition.value, surah.value)
    addToHistory(query.value)
  }
}, 400)

watch([query, editionGroup, edition, surah, juz, bookmarkedOnly], syncAndSearch)

onMounted(() => {
  loadHistory()
  loadBookmarks()
  if (query.value.trim().length >= 3) {
    runSearch(query.value, edition.value, surah.value)
  }
})

const gotoAyah = (ayah) => {
  router.push(ayah.to)
}
</script>

<style scoped>
.search-container {
  padding-bottom: 80px;
}

.search-result-item {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  padding-top: 12px;
  padding-bottom: 12px;
}

.search-result-text {
  font-size: 0.95rem;
  line-height: 1.6;
}

.search-result-text--rtl {
  direction: rtl;
  text-align: right;
  font-family: "Amiri Quran", serif;
  font-size: 1.15rem;
  line-height: 2;
}

.search-result-text :deep(mark) {
  background: rgba(var(--v-theme-primary), 0.35);
  color: inherit;
  border-radius: 3px;
  padding: 0 2px;
}
</style>
