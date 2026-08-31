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

        <!-- Search / sort / new collection -->
        <v-row dense class="mb-2">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search saved items"
              clearable
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="7" md="4">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              item-title="title"
              item-value="value"
              label="Sort by"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="5" md="2">
            <v-btn block variant="tonal" prepend-icon="mdi-folder-plus-outline" @click="newCollectionDialog = true">
              New
            </v-btn>
          </v-col>
        </v-row>

        <!-- Collections filter -->
        <div v-if="collections.length" class="d-flex flex-wrap ga-2 align-center mb-4">
          <span class="text-caption text-medium-emphasis mr-1">Collections:</span>
          <v-chip
            v-for="c in collections"
            :key="c.id"
            size="small"
            :color="collectionFilter === c.id ? 'primary' : undefined"
            :variant="collectionFilter === c.id ? 'flat' : 'outlined'"
            closable
            @click="collectionFilter = collectionFilter === c.id ? null : c.id"
            @click:close="deleteCollectionId = c.id"
          >
            {{ c.name }}
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
                  v-for="item in applyFilters(surahBookmarks)"
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

                    <v-card-text class="pt-0">
                      <LibraryBookmarkMetaChips :item-key="item.id" />
                    </v-card-text>

                    <v-card-actions>
                      <NuxtLink :to="item.to" class="text-decoration-none">
                        <v-btn variant="tonal">Open</v-btn>
                      </NuxtLink>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="!applyFilters(surahBookmarks).length">
                  <v-alert type="info" variant="tonal">
                    {{ surahBookmarks.length ? "No matches" : "No surah bookmarks yet" }}
                  </v-alert>
                </v-col>
              </v-row>
            </template>

            <!-- AYAH TAB -->
            <template v-else-if="c.value === 'ayah'">
              <v-row>
                <v-col
                  v-for="item in applyFilters(ayahBookmarks)"
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

                    <v-card-text v-if="item.textLoading" class="pt-0">
                      <v-skeleton-loader type="text@2" />
                    </v-card-text>
                    <v-card-text v-else-if="item.arabic || item.urdu" class="pt-0">
                      <div v-if="item.arabic" class="bm-arabic mb-2">
                        {{ item.arabic }}
                      </div>
                      <div v-if="item.urdu" class="bm-urdu">
                        {{ item.urdu }}
                      </div>
                    </v-card-text>

                    <v-card-text class="pt-0">
                      <LibraryBookmarkMetaChips :item-key="item.id" />
                    </v-card-text>

                    <v-card-actions>
                      <NuxtLink :to="item.to" class="text-decoration-none">
                        <v-btn variant="tonal">Open</v-btn>
                      </NuxtLink>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="!applyFilters(ayahBookmarks).length">
                  <v-alert type="info" variant="tonal">
                    {{ ayahBookmarks.length ? "No matches" : "No ayah bookmarks yet" }}
                  </v-alert>
                </v-col>
              </v-row>
            </template>

            <!-- AUDIO / SAJDA / PAGE / JUZ TABS -->
            <template v-else>
              <v-row>
                <v-col
                  v-for="item in applyFilters(categoryItems[c.value])"
                  :key="item.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card rounded="lg" hover>
                    <v-card-title class="d-flex justify-space-between align-center">
                      <div>
                        <div v-if="item.arabicName" class="bm-person-arabic">{{ item.arabicName }}</div>
                        <div class="font-weight-bold">
                          {{ item.title }}
                        </div>
                        <div v-if="item.subtitle" class="text-caption text-medium-emphasis">
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

                    <v-card-text class="pt-0">
                      <LibraryBookmarkMetaChips :item-key="item.id" />
                    </v-card-text>

                    <v-card-actions>
                      <NuxtLink :to="item.to" class="text-decoration-none">
                        <v-btn variant="tonal">Open</v-btn>
                      </NuxtLink>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" v-if="!applyFilters(categoryItems[c.value]).length">
                  <v-alert type="info" variant="tonal">
                    {{ categoryItems[c.value]?.length ? "No matches" : `No ${c.label.toLowerCase()} bookmarks yet` }}
                  </v-alert>
                </v-col>
              </v-row>
            </template>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <!-- New collection dialog -->
    <v-dialog v-model="newCollectionDialog" max-width="360">
      <v-card rounded="lg">
        <v-card-title>New Collection</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newCollectionName"
            label="Name"
            placeholder="e.g. Dua, Patience, Ramadan"
            autofocus
            @keyup.enter="submitNewCollection"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="newCollectionDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!newCollectionName.trim()" @click="submitNewCollection">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete collection confirm -->
    <v-dialog
      :model-value="!!deleteCollectionId"
      max-width="360"
      @update:model-value="(v) => { if (!v) deleteCollectionId = null }"
    >
      <v-card rounded="lg">
        <v-card-title>Delete this collection?</v-card-title>
        <v-card-text>
          Saved items stay bookmarked — this only removes the collection and un-assigns items from it.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteCollectionId = null">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeleteCollection">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { SECTION_LABELS } from "~/utils/personStudy"

useHead({ title: "Bookmarks — Quran App" });
useSeoMeta({ robots: "noindex, follow" });

const tab = ref(0)

const categories = [
  { label: "Surahs", value: "surah" },
  { label: "Ayahs", value: "ayah" },
  { label: "People", value: "person" },
  { label: "Audios", value: "audio" },
  { label: "Sajdas", value: "sajda" },
  { label: "Pages", value: "page" },
  { label: "Juz", value: "juz" },
]

const tabValue = computed(() => categories[tab.value]?.value || "surah")

/* ---------------- Bookmarks storage ---------------- */
const {
  list,
  addedAt,
  load,
  removeAyah,
  removeSurah,
  removeSajda,
  removeAudio,
  removeJuz,
  removePage,
  removePerson,
} = useBookmarks()
onMounted(() => load())

/* ---------------- Persons (Prophets & Qur'anic Persons) ---------------- */
const { getPersonById } = usePersons()
const { load: loadPersonStudy, getFor: getPersonStudy } = usePersonStudy()
onMounted(() => loadPersonStudy())

/* ---------------- Library: collections + notes/tags ---------------- */
const { collections, getMeta, removeItemMeta, createCollection, deleteCollection, load: loadLibrary } = useLibrary()
onMounted(() => loadLibrary())

const searchQuery = ref("")
const sortBy = ref("surah")
const collectionFilter = ref(null)
const sortOptions = [
  { title: "Surah order", value: "surah" },
  { title: "Recently saved", value: "recent" },
  { title: "Tag", value: "tag" },
  { title: "Collection", value: "collection" },
]

const collectionName = (id) => collections.value.find((c) => c.id === id)?.name || ""

const applyFilters = (rawItems) => {
  let items = rawItems || []

  if (collectionFilter.value) {
    items = items.filter((item) => getMeta(item.id).collectionIds.includes(collectionFilter.value))
  }

  if (searchQuery.value?.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    items = items.filter((item) => {
      const meta = getMeta(item.id)
      const haystack = [item.title, item.subtitle, item.arabicName, meta.note, ...meta.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }

  if (sortBy.value === "recent") {
    items = [...items].sort((a, b) => (addedAt.value[b.id] || 0) - (addedAt.value[a.id] || 0))
  } else if (sortBy.value === "tag") {
    items = [...items].sort((a, b) => {
      const at = getMeta(a.id).tags[0] || "￿"
      const bt = getMeta(b.id).tags[0] || "￿"
      return at.localeCompare(bt)
    })
  } else if (sortBy.value === "collection") {
    items = [...items].sort((a, b) => {
      const ac = collectionName(getMeta(a.id).collectionIds[0]) || "￿"
      const bc = collectionName(getMeta(b.id).collectionIds[0]) || "￿"
      return ac.localeCompare(bc)
    })
  }
  // sortBy === "surah": items already come pre-sorted by surah/ayah number

  return items
}

/* ---------------- New / delete collection ---------------- */
const newCollectionDialog = ref(false)
const newCollectionName = ref("")
const submitNewCollection = () => {
  createCollection(newCollectionName.value)
  newCollectionName.value = ""
  newCollectionDialog.value = false
}

const deleteCollectionId = ref(null)
const confirmDeleteCollection = () => {
  if (collectionFilter.value === deleteCollectionId.value) collectionFilter.value = null
  deleteCollection(deleteCollectionId.value)
  deleteCollectionId.value = null
}

/* ---------------- Surah data for names ---------------- */
const { rawSurahs } = useSurahs()

const surahsWithNumber = computed(() => {
  if (!rawSurahs.value?.length) return []
  return rawSurahs.value.map((s, i) => ({ ...s, surahNo: i + 1 }))
})

const surahMap = computed(() => {
  return new Map(surahsWithNumber.value.map((s) => [s.surahNo, s]))
})

function parseKey(k) {
  const parts = String(k).split(":")
  return { type: parts[0], parts }
}

/* ---------------- Ayah text (Arabic + Urdu) ---------------- */
const { getVerse } = useVerse()
const verseTexts = ref({}) // "surahNo:ayahNo" -> { arabic, urdu, loading }

async function loadVerseText(surahNo, ayahNo) {
  const key = `${surahNo}:${ayahNo}`
  if (verseTexts.value[key]) return

  verseTexts.value[key] = { arabic: "", urdu: "", loading: true }
  try {
    const verse = await getVerse(surahNo, ayahNo)
    verseTexts.value[key] = {
      arabic: verse?.arabic1 || "",
      urdu: verse?.urdu || "",
      loading: false,
    }
  } catch {
    verseTexts.value[key] = { arabic: "", urdu: "", loading: false }
  }
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

      const text = verseTexts.value[`${surahNo}:${ayahNo}`]

      return {
        id: k,
        type: "ayah",
        surahNo,
        ayahNo,
        title: `${surahName} • Ayah ${ayahNo}`,
        subtitle: `Surah #${surahNo}`,
        to: `/surah/${surahNo}#ayah-${ayahNo}`,
        arabic: text?.arabic || "",
        urdu: text?.urdu || "",
        textLoading: text?.loading ?? true,
      }
    })
    .sort((a, b) => a.surahNo - b.surahNo || a.ayahNo - b.ayahNo)
})

watch(
  ayahBookmarks,
  (items) => {
    items.forEach((item) => loadVerseText(item.surahNo, item.ayahNo))
  },
  { immediate: true }
)

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

/* ---------------- Sajda bookmarks ---------------- */
const sajdaBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("sajda:"))
    .map((k) => {
      const { parts } = parseKey(k)
      const surahNo = Number(parts[1])
      const ayahNo = Number(parts[2])
      const s = surahMap.value.get(surahNo)
      const surahName =
        s?.surahNameArabicLong || s?.surahName || `Surah ${surahNo}`

      return {
        id: k,
        type: "sajda",
        surahNo,
        ayahNo,
        title: `${surahName} • Ayah ${ayahNo}`,
        subtitle: "Sajda verse",
        to: `/surah/${surahNo}#ayah-${ayahNo}`,
      }
    })
    .sort((a, b) => a.surahNo - b.surahNo || a.ayahNo - b.ayahNo)
})

/* ---------------- Audio bookmarks (per-surah reciters) ---------------- */
const audioBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("audio:"))
    .map((k) => {
      const { parts } = parseKey(k)
      const surahNo = Number(parts[1])
      const s = surahMap.value.get(surahNo)
      const title = s?.surahNameTranslation || s?.surahName || `Surah ${surahNo}`

      return {
        id: k,
        type: "audio",
        surahNo,
        title,
        subtitle: `Reciters • Surah #${surahNo}`,
        to: `/surah-audios/${surahNo}`,
      }
    })
    .sort((a, b) => a.surahNo - b.surahNo)
})

/* ---------------- Juz bookmarks ---------------- */
const juzBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("juz:"))
    .map((k) => {
      const { parts } = parseKey(k)
      const juzNo = Number(parts[1])

      return {
        id: k,
        type: "juz",
        juzNo,
        title: `Juz ${juzNo}`,
        subtitle: "",
        to: `/juz/${juzNo}`,
      }
    })
    .sort((a, b) => a.juzNo - b.juzNo)
})

/* ---------------- Page (mushaf) bookmarks ---------------- */
const pageBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("page:"))
    .map((k) => {
      const { parts } = parseKey(k)
      const pageNo = Number(parts[1])

      return {
        id: k,
        type: "page",
        pageNo,
        title: `Page ${pageNo}`,
        subtitle: "",
        to: `/per-page-read?page=${pageNo}`,
      }
    })
    .sort((a, b) => a.pageNo - b.pageNo)
})

/* ---------------- Person bookmarks (Module 17) ---------------- */
const personBookmarks = computed(() => {
  return list.value
    .filter((k) => String(k).startsWith("person:"))
    .map((k) => {
      const personId = String(k).split(":")[1]
      const person = getPersonById(personId)
      const study = getPersonStudy(personId)
      const resumeHint = study?.lastSection && study.lastSection !== "overview"
        ? `Resume: ${SECTION_LABELS[study.lastSection] ?? study.lastSection}`
        : "Prophets & People of the Qur'an"

      return {
        id: k,
        type: "person",
        personId,
        title: person ? `${person.name}${person.honorific?.short ? ` (${person.honorific.short})` : ""}` : personId,
        subtitle: resumeHint,
        arabicName: person?.arabicName || "",
        to: `/persons/${personId}`,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
})

/* ---------------- Category lookup + top chip count ---------------- */
const categoryItems = computed(() => ({
  surah: surahBookmarks.value,
  ayah: ayahBookmarks.value,
  person: personBookmarks.value,
  audio: audioBookmarks.value,
  sajda: sajdaBookmarks.value,
  page: pageBookmarks.value,
  juz: juzBookmarks.value,
}))

const currentCount = computed(
  () => applyFilters(categoryItems.value[tabValue.value]).length || 0
)

/* ---------------- Remove logic ---------------- */
const removeBookmark = (item) => {
  if (item.type === "ayah") removeAyah(item.surahNo, item.ayahNo)
  if (item.type === "surah") removeSurah(item.surahNo)
  if (item.type === "sajda") removeSajda(item.surahNo, item.ayahNo)
  if (item.type === "audio") removeAudio(item.surahNo)
  if (item.type === "juz") removeJuz(item.juzNo)
  if (item.type === "page") removePage(item.pageNo)
  if (item.type === "person") removePerson(item.personId)
  removeItemMeta(item.id)
}
</script>

<style scoped>
.bm-arabic {
  direction: rtl;
  text-align: right;
  font-family: "Amiri Quran", serif;
  font-size: 1.35rem;
  line-height: 2;
}

.bm-urdu {
  direction: rtl;
  text-align: right;
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.8;
}

.bm-person-arabic {
  direction: rtl;
  text-align: right;
  font-family: "Amiri Quran", serif;
  font-size: 1.15rem;
  line-height: 1.4;
}
</style>
