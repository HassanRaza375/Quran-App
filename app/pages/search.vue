<template>
  <v-container>
    <!-- Search Input -->
    <v-text-field v-model="query" label="Search Quran (translations only)" prepend-inner-icon="mdi-magnify"
      variant="outlined" clearable hide-details />

    <!-- Filters -->
    <v-row class="mt-3" dense>
      <v-col cols="12" sm="6">
        <v-select v-model="edition" :items="editions" label="Translation" variant="outlined" hide-details />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select v-model="surah" :items="surahOptions" label="Surah" variant="outlined" hide-details />
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-progress-linear v-if="pending" indeterminate class="mt-4" />

    <!-- Results -->
    <v-list v-if="results.length" class="mt-4">
      <v-list-item v-for="ayah in results" :key="ayah.number" @click="gotoAyah(ayah)">
        <v-list-item-title>
          {{ ayah.text }}
        </v-list-item-title>

        <v-list-item-subtitle>
          {{ ayah.surah.englishName }} •
          {{ ayah.surah.number }}:{{ ayah.numberInSurah }}
        </v-list-item-subtitle>

        <template #append>
          <v-chip size="x-small">
            {{ ayah.edition.name }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <!-- Empty -->
    <v-alert v-if="!pending && query && !results.length" type="info" variant="tonal" class="mt-4">
      No results found
    </v-alert>
  </v-container>
</template>
<script setup>
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()

/* ------------------ state ------------------ */
const query = ref('')
const surah = ref('all')
const edition = ref('en.pickthall') // default single edition (important)

const results = ref([])
const totalCount = ref(0)
const pending = ref(false)
const error = ref(null)

/* ------------------ constants ------------------ */
const MIN_QUERY_LENGTH = 3
const MAX_RESULTS = 40

/* ------------------ options ------------------ */
const editions = [
  { title: 'Pickthall', value: 'en.pickthall' },
  { title: 'Yusuf Ali', value: 'en.yusufali' },
  { title: 'Muhammad Asad', value: 'en.asad' },
]

const surahOptions = [
  { title: 'All Surahs', value: 'all' },
  ...Array.from({ length: 114 }, (_, i) => ({
    title: `Surah ${i + 1}`,
    value: i + 1,
  })),
]

/* ------------------ cache ------------------ */
const cache = new Map()

/* ------------------ search ------------------ */
const search = useDebounceFn(async () => {
  error.value = null

  if (!query.value || query.value.length < MIN_QUERY_LENGTH) {
    results.value = []
    totalCount.value = 0
    return
  }

  const key = `${query.value}-${surah.value}-${edition.value}`

  if (cache.has(key)) {
    const cached = cache.get(key)
    results.value = cached.results
    totalCount.value = cached.totalCount
    return
  }

  pending.value = true

  try {
    const res = await $fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(
        query.value
      )}/${surah.value}/${edition.value}`
    )

    totalCount.value = res.data.count
    results.value = res.data.matches.slice(0, MAX_RESULTS)

    cache.set(key, {
      results: results.value,
      totalCount: totalCount.value,
    })
  } catch (err) {
    error.value = 'Search failed. Please try again.'
    results.value = []
    totalCount.value = 0
  } finally {
    pending.value = false
  }
}, 400)

/* ------------------ watchers ------------------ */
watch([query, surah, edition], search)

/* ------------------ navigation ------------------ */
const gotoAyah = (ayah) => {
  router.push(
    `/surah/${ayah.surah.number}#ayah-${ayah.numberInSurah}`
  )
}
</script>
