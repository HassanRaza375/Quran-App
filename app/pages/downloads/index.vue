<template>
  <v-container class="downloads-container">
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 downloads-header">
          <div class="text-overline text-grey-lighten-1 mb-1">Offline</div>
          <div class="text-h4 font-weight-bold gradient-text mb-1">⬇️ Downloads</div>
          <div class="text-subtitle-2 text-grey-lighten-1">
            <template v-if="isOnline">Make surahs available without a connection</template>
            <template v-else>You're offline — downloaded surahs still work</template>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Storage meter -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="d-flex justify-space-between align-center mb-2">
            <div class="text-subtitle-1 font-weight-bold">Storage used</div>
            <div class="text-caption text-medium-emphasis">
              {{ formatBytes(usage) }} of {{ formatBytes(quota) }}
            </div>
          </div>
          <v-progress-linear :model-value="usagePercent" height="10" rounded color="teal" />

          <v-btn class="mt-4" variant="text" color="error" prepend-icon="mdi-broom" @click="clearTempDialog = true">
            Clear temporary cache
          </v-btn>
          <div class="text-caption text-medium-emphasis mt-1">
            Frees space from browsing history — doesn't remove anything you've explicitly downloaded below.
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Download form -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="text-h6 font-weight-bold mb-3">Download a Surah</div>

          <v-autocomplete
            v-model="selectedSurahNo"
            :items="surahOptions"
            item-title="label"
            item-value="value"
            label="Choose a surah"
            class="mb-2"
          />

          <v-switch
            v-model="includeTafsir"
            label="Include Tafsir (all 3 authors, every ayah)"
            inset
            color="primary"
            hide-details
          />
          <div v-if="includeTafsir" class="text-caption text-warning mb-2">
            Fetches one request per ayah — can take a while for long surahs.
          </div>

          <v-select
            v-model="selectedReciter"
            :items="reciters"
            item-title="reciter"
            item-value="id"
            label="Include audio (optional)"
            clearable
            class="mt-2"
          />

          <v-alert v-if="downloadError" type="error" variant="tonal" density="compact" class="mt-2">
            {{ downloadError }}
          </v-alert>

          <v-alert v-if="alreadyDownloaded" type="info" variant="tonal" density="compact" class="mt-2">
            Already downloaded — downloading again will refresh it with the options above.
          </v-alert>

          <v-btn
            block
            rounded="xl"
            size="large"
            color="teal"
            class="mt-4"
            :loading="!!downloadingSurah"
            :disabled="!selectedSurahNo"
            @click="startDownload"
          >
            <template v-if="downloadingSurah === selectedSurahNo && downloadProgress.total">
              Downloading tafsir… {{ downloadProgress.done }} / {{ downloadProgress.total }}
            </template>
            <template v-else>Download for Offline</template>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Downloaded list -->
    <v-row>
      <v-col cols="12">
        <div class="text-h6 font-weight-bold mb-3">Downloaded ({{ manifest.length }})</div>

        <v-alert v-if="!manifest.length" type="info" variant="tonal">
          Nothing downloaded yet — surahs you download for offline reading will show up here.
        </v-alert>

        <v-card v-for="d in manifest" :key="d.surahNo" rounded="lg" class="pa-4 mb-3">
          <div class="d-flex align-center justify-space-between flex-wrap ga-2">
            <div>
              <div class="font-weight-bold">{{ d.surahName }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ formatBytes(d.sizeBytesEstimate) }}
                <span v-if="d.hasTafsir"> · Tafsir included</span>
                <span v-if="d.reciterName"> · {{ d.reciterName }} audio</span>
              </div>
            </div>
            <div class="d-flex ga-2">
              <NuxtLink :to="`/surah/${d.surahNo}`" class="text-decoration-none">
                <v-btn size="small" variant="tonal" color="primary">Open</v-btn>
              </NuxtLink>
              <v-btn
                size="small"
                variant="text"
                color="error"
                icon="mdi-delete-outline"
                @click="confirmRemoveId = d.surahNo"
              />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirm clear temp cache -->
    <v-dialog v-model="clearTempDialog" max-width="360">
      <v-card rounded="lg">
        <v-card-title>Clear temporary cache?</v-card-title>
        <v-card-text>
          Frees up space from pages/audio you've browsed. Your downloaded surahs below are not affected.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="clearTempDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="doClearTemp">Clear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm remove download -->
    <v-dialog
      :model-value="!!confirmRemoveId"
      max-width="360"
      @update:model-value="(v) => { if (!v) confirmRemoveId = null }"
    >
      <v-card rounded="lg">
        <v-card-title>Remove this download?</v-card-title>
        <v-card-text>This surah will need to re-download next time you're offline and open it.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmRemoveId = null">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="doRemove">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
useHead({ title: "Downloads — Quran App" });
useSeoMeta({ robots: "noindex, follow" });

const {
  manifest,
  downloadingSurah,
  downloadProgress,
  downloadError,
  load,
  isDownloaded,
  estimateQuota,
  downloadSurah,
  removeDownload,
  clearTemporaryCache,
} = useDownloads()
const { isOnline, init: initOnlineStatus } = useOnlineStatus()
const { rawSurahs } = useSurahs()
const { reciters } = useReciters()

const usage = ref(0)
const quota = ref(0)
const usagePercent = computed(() => (quota.value ? Math.min(100, Math.round((usage.value / quota.value) * 100)) : 0))

const refreshStorage = async () => {
  const est = await estimateQuota()
  usage.value = est.usage
  quota.value = est.quota
}

onMounted(async () => {
  load()
  initOnlineStatus()
  await refreshStorage()
})

const formatBytes = (bytes) => {
  if (!bytes) return "0 MB"
  const mb = bytes / (1024 * 1024)
  if (mb < 1) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

/* ---------------- Download form ---------------- */
const selectedSurahNo = ref(null)
const includeTafsir = ref(false)
const selectedReciter = ref(null)

const surahOptions = computed(() => {
  const list = rawSurahs.value || []
  return list.map((s, i) => ({
    value: s.surahNo || i + 1,
    label: `${s.surahNo || i + 1}. ${s.surahNameTranslation || s.surahName} — ${s.surahNameArabicLong || ""}`,
  }))
})

const alreadyDownloaded = computed(() => selectedSurahNo.value && isDownloaded(selectedSurahNo.value))

const startDownload = async () => {
  if (!selectedSurahNo.value) return
  await downloadSurah(selectedSurahNo.value, {
    includeTafsir: includeTafsir.value,
    reciterKey: selectedReciter.value || null,
  })
  await refreshStorage()
}

/* ---------------- Remove / clear ---------------- */
const confirmRemoveId = ref(null)
const doRemove = async () => {
  await removeDownload(confirmRemoveId.value)
  confirmRemoveId.value = null
  await refreshStorage()
}

const clearTempDialog = ref(false)
const doClearTemp = async () => {
  await clearTemporaryCache()
  clearTempDialog.value = false
  await refreshStorage()
}
</script>

<style scoped>
.downloads-container {
  padding-bottom: 80px;
}

.downloads-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.gradient-text {
  background: linear-gradient(45deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
