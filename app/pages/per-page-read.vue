<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-autocomplete v-model="page" label="Pages" :items="pages" item-title="title" item-value="value"
          variant="outlined"></v-autocomplete>
      </v-col>
    </v-row>
    <!-- Verses -->
    <v-row>
      <v-col cols="12">
        <!-- mode="manual" -->
        <v-infinite-scroll color="secondary" :key="page"  @load="loadMore">

          <!-- YOUR LIST -->
          <div v-for="(item, index) in ayahs" :key="index" class="verse-block">
            <section :id="`ayah-${item.numberInSurah}`" class="verse-text">
              <span class="ayah-number">
                ﴿{{ item.surah.name }}﴾
              </span>
              {{ item.text }}
              <span class="ayah-number">
                ﴿{{ item.numberInSurah }}﴾
              </span>
            </section>
          </div>
          <template #empty>
            <div class="text-center pa-6 text-grey">
              End of Mushaf
            </div>
          </template>
        </v-infinite-scroll>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
const { getPage } = usePage()

// Page selected from autocomplete
const page = ref(1)

// Internal page pointer for infinite loading
const currentPage = ref(1)

// Data
const ayahs = ref([])
const hasMore = ref(true)

// Load next page
const loadMore = async ({ done }) => {
  if (!hasMore.value) {
    done('empty')
    return
  }

  try {
    const res = await getPage(currentPage.value)
    const newAyahs = res?.data?.ayahs || []

    if (!newAyahs.length || currentPage.value >= 604) {
      hasMore.value = false
      done('empty')
      return
    }

    ayahs.value.push(...newAyahs)
    currentPage.value++

    done('ok')
  } catch (e) {
    console.error(e)
    done('error')
  }
}


// Initial load
onMounted(() => {
  currentPage.value = page.value
  loadMore()
})

// Reset when user jumps to a page
watch(page, async (newPage) => {
  ayahs.value = []
  hasMore.value = true
  currentPage.value = newPage
  await loadMore()

  // optional: scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Autocomplete items
const pages = Array.from({ length: 604 }, (_, i) => ({
  title: `Page - ${i + 1}`,
  value: i + 1,
}))
</script>


<style scoped>
/* Surah title */
.arabic-title {
  font-family: "Amiri Quran", serif;
  font-size: 3rem;
  line-height: 1.5;
}

/* Verse container */
.verses-sheet {
  background: transparent;
}

/* Verse block spacing */
.verse-block {
  margin-bottom: 2.5rem;
}

/* Arabic verse */
.verse-text {
  font-family: "Amiri Quran", serif;
  font-size: 2.1rem;
  line-height: 2.4;
  direction: rtl;
  text-align: right;
  color: #1b1b1b;
}

/* Ayah number */
.ayah-number {
  font-size: 1rem;
  margin-inline-start: 8px;
  color: #777;
}
</style>
