<template>
  <v-container class="session-container">
    <template v-if="!session">
      <v-alert type="info" variant="tonal">No active Hifz session. Start one from the Hifz hub.</v-alert>
      <v-btn class="mt-4" variant="tonal" to="/hifz">Back to Hifz</v-btn>
    </template>

    <template v-else-if="session.status === 'in-progress' && currentItem">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-caption text-medium-emphasis">{{ progress.done }} / {{ progress.total }}</div>
        <v-btn size="small" variant="text" color="error" @click="confirmAbandon = true">End Session</v-btn>
      </div>
      <v-progress-linear :model-value="(progress.done / Math.max(1, progress.total)) * 100" height="6" rounded class="mb-5" />

      <v-card rounded="xl" elevation="8" class="pa-5">
        <div v-if="loadingChapter" class="text-center py-8">
          <v-progress-circular indeterminate size="32" />
        </div>
        <v-alert v-else-if="!currentChapter" type="warning" variant="tonal">
          This passage isn't available offline yet. Connect once to load it.
        </v-alert>
        <template v-else>
          <HifzPractice
            v-if="phase === 'practice'"
            :item="currentItem"
            :chapter="currentChapter"
            :target="currentTarget"
            @ready="onPracticeReady"
          />
          <HifzTest
            v-else
            :item="currentItem"
            :chapter="currentChapter"
            :surah-name="currentTarget?.surahName"
            @grade="onGrade"
            @skip="skipCurrent"
            @listen="onListen"
          />
        </template>
      </v-card>
    </template>

    <template v-else-if="session.status === 'completed'">
      <v-card rounded="xl" elevation="8" class="pa-5">
        <div class="text-h5 font-weight-bold mb-4">Session Complete</div>
        <v-row dense class="mb-4">
          <v-col cols="6" sm="3">
            <div class="text-h5 font-weight-bold">{{ summary.revisionCount }}</div>
            <div class="text-caption text-medium-emphasis">Reviewed</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-h5 font-weight-bold">{{ summary.newCount }}</div>
            <div class="text-caption text-medium-emphasis">New ayahs</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-h5 font-weight-bold">{{ summary.mistakes }}</div>
            <div class="text-caption text-medium-emphasis">Mistakes</div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="text-h5 font-weight-bold">{{ summary.hints }}</div>
            <div class="text-caption text-medium-emphasis">Hints used</div>
          </v-col>
        </v-row>

        <template v-if="summary.needsAttention.length">
          <v-divider class="mb-3" />
          <div class="text-subtitle-2 font-weight-bold mb-2">Needs attention</div>
          <div v-for="i in summary.needsAttention" :key="i.id" class="text-body-2 mb-1">
            {{ targetLabel(i.targetId) }} — {{ i.fromAyah ? `${i.fromAyah} → ${i.toAyah}` : `Ayah ${i.ayahNo}` }}
          </div>
          <v-btn class="mt-3" color="error" variant="tonal" prepend-icon="mdi-target" @click="practiceWeak">
            Practice Weak Areas
          </v-btn>
        </template>

        <v-btn block rounded="xl" color="primary" size="large" class="mt-5" to="/hifz">Done</v-btn>
      </v-card>
    </template>

    <v-dialog v-model="confirmAbandon" max-width="360">
      <v-card rounded="lg">
        <v-card-title>End this session?</v-card-title>
        <v-card-text>Progress already graded is kept; the rest of the queue is discarded.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmAbandon = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="doAbandon">End Session</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
useHead({ title: "Hifz Session — Quran App" });
useSeoMeta({ robots: "noindex, follow" });

const {
  session,
  loadSession,
  currentItem,
  progress,
  sessionSummary: summary,
  gradeCurrent,
  skipCurrent,
  abandonSession,
  startWeakSession,
} = useHifzSession();
const { targets, load: loadHifz } = useHifz();
const { getChapter } = useChapters();
const { getVerse } = useVerse();
const { play } = useAudioPlayer();
const router = useRouter();

onMounted(() => {
  loadHifz();
  loadSession();
});

const phase = ref("test"); // 'practice' | 'test' — flips to 'practice' when a new item loads
watch(
  () => currentItem.value?.id,
  (id) => {
    if (!id) return;
    phase.value = currentItem.value.isNew ? "practice" : "test";
  },
  { immediate: true }
);

const currentTarget = computed(() => targets.value.find((t) => t.id === currentItem.value?.targetId) ?? null);

const chapterCache = reactive({});
const loadingChapter = ref(false);
const currentChapter = computed(() => (currentTarget.value ? chapterCache[currentTarget.value.surahNo] : null));

watch(
  () => currentTarget.value?.surahNo,
  async (surahNo) => {
    if (!surahNo || chapterCache[surahNo]) return;
    loadingChapter.value = true;
    try {
      chapterCache[surahNo] = await getChapter(surahNo);
    } catch {
      chapterCache[surahNo] = null;
    } finally {
      loadingChapter.value = false;
    }
  },
  { immediate: true }
);

const onPracticeReady = () => {
  if (currentItem.value?.gradedTest) {
    phase.value = "test";
  } else {
    // Free-practice item — nothing to grade, just move on.
    useHifzSession().completeUngraded();
  }
};

const onGrade = (grade, hintLevel) => {
  gradeCurrent(grade, hintLevel);
};

const onListen = async () => {
  const item = currentItem.value;
  const target = currentTarget.value;
  if (!item || !target) return;
  const ayahNo = item.testMode === "transition" ? item.toAyah : item.ayahNo;
  try {
    const verse = await getVerse(target.surahNo, ayahNo);
    const url = verse.audio?.["1"]?.url;
    if (url) await play(url, { type: "ayah", surahNo: target.surahNo, title: `Hifz — Ayah ${ayahNo}`, subtitle: "Test" });
  } catch {
    /* audio best-effort */
  }
};

const targetLabel = (targetId) => targets.value.find((t) => t.id === targetId)?.surahName ?? "Target";

const practiceWeak = () => {
  startWeakSession();
  router.push("/hifz/session");
};

const confirmAbandon = ref(false);
const doAbandon = () => {
  abandonSession();
  confirmAbandon.value = false;
  router.push("/hifz");
};
</script>

<style scoped>
.session-container {
  padding-bottom: 100px;
  max-width: 640px;
}
</style>
