<template>
  <v-container class="hifz-container">
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 hifz-header">
          <div class="text-overline text-grey-lighten-1 mb-1">Memorization</div>
          <div class="text-h4 font-weight-bold gradient-text mb-1">📗 Hifz Mode</div>
          <div class="text-subtitle-2 text-grey-lighten-1">
            Build a memorization plan and review it before you forget
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats -->
    <v-row dense class="mb-6">
      <v-col cols="4">
        <v-card class="glass pa-3 text-center" rounded="lg">
          <div class="text-h5 font-weight-bold">{{ stats.dueToday }}</div>
          <div class="text-caption">Due today</div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="glass pa-3 text-center" rounded="lg">
          <div class="text-h5 font-weight-bold">{{ stats.memorized }}</div>
          <div class="text-caption">Memorized</div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="glass pa-3 text-center" rounded="lg">
          <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
          <div class="text-caption">Total plans</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Review queue -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-h6 font-weight-bold mb-3">Review Queue</div>

        <v-alert v-if="!dueQueue.length" type="success" variant="tonal" density="comfortable">
          Nothing due right now — nice work staying on top of it.
        </v-alert>

        <v-card
          v-for="plan in dueQueue"
          :key="plan.id"
          rounded="xl"
          elevation="6"
          class="pa-4 mb-3"
        >
          <div class="d-flex align-center justify-space-between mb-2 flex-wrap ga-2">
            <div>
              <div class="font-weight-bold">{{ plan.title }}</div>
              <v-chip size="small" :color="overdueDays(plan) > 0 ? 'error' : 'warning'" variant="tonal">
                {{ overdueDays(plan) > 0 ? `Overdue by ${overdueDays(plan)}d` : "Due today" }}
              </v-chip>
            </div>
            <v-btn size="small" variant="text" @click="toggleExpand(plan.id)">
              {{ expanded === plan.id ? "Hide" : "Review" }}
            </v-btn>
          </div>

          <v-expand-transition>
            <div v-if="expanded === plan.id">
              <v-divider class="mb-3" />

              <div class="d-flex ga-2 mb-3 flex-wrap">
                <v-chip size="small" :color="showArabic ? 'primary' : undefined" @click="showArabic = !showArabic">
                  {{ showArabic ? "Hide" : "Show" }} Arabic
                </v-chip>
                <v-chip
                  size="small"
                  :color="showTranslation ? 'primary' : undefined"
                  @click="showTranslation = !showTranslation"
                >
                  {{ showTranslation ? "Hide" : "Show" }} Translation
                </v-chip>
                <v-chip size="small" :color="loopRange ? 'primary' : undefined" @click="loopRange = !loopRange">
                  <v-icon start size="16">mdi-repeat</v-icon> Loop range
                </v-chip>
              </div>

              <div v-if="rangeLoading" class="text-center py-4">
                <v-progress-circular indeterminate size="28" />
              </div>
              <template v-else>
                <div v-for="(ayahNo, i) in ayahNumbers(plan)" :key="ayahNo" class="hifz-ayah mb-3">
                  <div class="d-flex align-start ga-2">
                    <v-btn
                      icon="mdi-volume-high"
                      size="small"
                      variant="text"
                      :loading="playingAyahKey === `${plan.surahNo}:${ayahNo}`"
                      @click="playRangeAyah(plan, ayahNo)"
                    />
                    <div class="flex-grow-1">
                      <div v-if="showArabic" class="hifz-arabic">{{ rangeText.arabic[i] }}</div>
                      <div v-if="showTranslation" class="text-caption text-medium-emphasis mt-1">
                        {{ rangeText.english[i] }}
                      </div>
                      <div v-if="!showArabic && !showTranslation" class="text-caption text-medium-emphasis">
                        Ayah {{ ayahNo }} — hidden for recall practice
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <v-textarea
                :model-value="plan.mistakeNotes"
                label="Mistake notes"
                rows="2"
                auto-grow
                density="compact"
                class="mt-2"
                @update:model-value="onNotesInput(plan.id, $event)"
              />

              <div class="d-flex ga-2 mt-2 flex-wrap">
                <v-btn color="error" variant="tonal" @click="reviewPlan(plan.id, 'again')">Needs Review</v-btn>
                <v-btn color="primary" variant="tonal" @click="reviewPlan(plan.id, 'good')">Good</v-btn>
                <v-btn color="success" variant="tonal" @click="reviewPlan(plan.id, 'easy')">Easy</v-btn>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- New plan -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="text-h6 font-weight-bold mb-1">New Memorization Plan</div>
          <div class="text-caption text-medium-emphasis mb-4">Pick a Surah and ayah range</div>

          <v-select
            label="Surah"
            :items="surahOptions"
            item-title="label"
            item-value="surahNo"
            v-model="wizardSurahNo"
            class="mb-2"
          />
          <v-row dense>
            <v-col cols="6">
              <v-text-field type="number" label="Start ayah" v-model.number="wizardStart" :min="1" :max="wizardMaxAyah" />
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" label="End ayah" v-model.number="wizardEnd" :min="1" :max="wizardMaxAyah" />
            </v-col>
          </v-row>
          <v-text-field label="Title (optional)" v-model="wizardTitle" class="mb-2" />

          <v-alert v-if="wizardError" type="warning" variant="tonal" density="compact" class="mb-2">
            {{ wizardError }}
          </v-alert>

          <v-btn block rounded="xl" color="primary" size="large" :disabled="!canCreate" @click="submitWizard">
            Create Plan
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- All plans -->
    <v-row v-if="plans.length">
      <v-col cols="12">
        <div class="text-h6 font-weight-bold mb-3">All Plans</div>
        <v-card v-for="p in sortedPlans" :key="p.id" rounded="lg" class="pa-4 mb-3">
          <div class="d-flex align-center justify-space-between flex-wrap ga-2">
            <div>
              <div class="font-weight-bold">{{ p.title }}</div>
              <div class="text-caption text-medium-emphasis">
                <v-chip size="x-small" :color="p.status === 'memorized' ? 'success' : 'info'" variant="tonal">
                  {{ p.status }}
                </v-chip>
                <span class="ml-1">Next review {{ p.nextReviewAt }}</span>
                <span v-if="p.planStatus === 'paused'"> · paused</span>
              </div>
            </div>
            <div class="d-flex ga-1">
              <v-btn
                v-if="p.status !== 'memorized'"
                size="small"
                variant="text"
                @click="markMemorized(p.id)"
              >
                Mark memorized
              </v-btn>
              <v-btn v-else size="small" variant="text" @click="resetToLearning(p.id)">Needs review</v-btn>
              <v-btn
                size="small"
                variant="text"
                @click="setPlanStatus(p.id, p.planStatus === 'active' ? 'paused' : 'active')"
              >
                {{ p.planStatus === "active" ? "Pause" : "Resume" }}
              </v-btn>
              <v-btn size="small" variant="text" color="error" icon="mdi-delete-outline" @click="confirmDeleteId = p.id" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog :model-value="!!confirmDeleteId" max-width="360" @update:model-value="(v) => { if (!v) confirmDeleteId = null }">
      <v-card rounded="lg">
        <v-card-title>Delete this plan?</v-card-title>
        <v-card-text>This removes the plan and its review history. This can't be undone.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDeleteId = null">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="doDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import surahList from "~/assets/data/surah.json";

const {
  plans,
  dueQueue,
  stats,
  load,
  createPlan,
  deletePlan,
  setPlanStatus,
  setMistakeNotes,
  markMemorized,
  resetToLearning,
  reviewPlan: reviewPlanAction,
  overdueDays,
} = useHifz();

const { getChapter } = useChapters();
const { getVerse } = useVerse();
const { play, playing, currentUrl, progress, duration } = useAudioPlayer();

onMounted(() => {
  load();
});

const sortedPlans = computed(() => [...plans.value].sort((a, b) => b.createdAt - a.createdAt));

/* ---------- Review expand/collapse ---------- */
const expanded = ref(null);
const showArabic = ref(true);
const showTranslation = ref(true);
const loopRange = ref(false);
const rangeLoading = ref(false);
const rangeText = reactive({ arabic: [], english: [] });

const ayahNumbers = (plan) =>
  Array.from({ length: plan.endAyah - plan.startAyah + 1 }, (_, i) => plan.startAyah + i);

const toggleExpand = async (planId) => {
  if (expanded.value === planId) {
    expanded.value = null;
    return;
  }
  expanded.value = planId;
  const plan = plans.value.find((p) => p.id === planId);
  if (!plan) return;

  rangeLoading.value = true;
  try {
    const chapter = await getChapter(plan.surahNo);
    rangeText.arabic = ayahNumbers(plan).map((n) => chapter.arabic1?.[n - 1] ?? "");
    rangeText.english = ayahNumbers(plan).map((n) => chapter.english?.[n - 1] ?? "");
  } finally {
    rangeLoading.value = false;
  }
};

const reviewPlan = (id, grade) => {
  reviewPlanAction(id, grade);
  expanded.value = null;
};

/* ---------- Per-ayah repeat audio + optional range loop ---------- */
const playingAyahKey = ref(null);
let expectedNextAyah = null;
let expectedPlan = null;

const playRangeAyah = async (plan, ayahNo, chain = false) => {
  const verse = await getVerse(plan.surahNo, ayahNo);
  const audioUrl = verse.audio?.["1"]?.url;
  if (!audioUrl) return;

  playingAyahKey.value = `${plan.surahNo}:${ayahNo}`;
  const isLast = ayahNo >= plan.endAyah;
  expectedNextAyah = !isLast ? ayahNo + 1 : loopRange.value ? plan.startAyah : null;
  expectedPlan = expectedNextAyah ? plan : null;

  await play(audioUrl, {
    type: "ayah",
    surahNo: plan.surahNo,
    title: `${plan.title} — Ayah ${ayahNo}`,
    subtitle: "Hifz review",
  });
};

watch(playing, (isPlaying) => {
  if (isPlaying || !playingAyahKey.value) return;
  // Only auto-advance if the track actually finished (near full duration),
  // not if the user paused partway through.
  const finished = duration.value > 0 && progress.value >= duration.value - 0.4;
  playingAyahKey.value = null;
  if (finished && expectedPlan && expectedNextAyah) {
    playRangeAyah(expectedPlan, expectedNextAyah, true);
  } else {
    expectedPlan = null;
    expectedNextAyah = null;
  }
});

/* ---------- Notes (debounced) ---------- */
let notesTimeout;
const onNotesInput = (planId, value) => {
  clearTimeout(notesTimeout);
  notesTimeout = setTimeout(() => setMistakeNotes(planId, value), 500);
};

/* ---------- New plan wizard ---------- */
const surahOptions = surahList.map((s) => ({
  surahNo: s.surahNo,
  label: `${s.surahNo}. ${s.surahNameTranslation} (${s.totalAyah} ayahs)`,
  totalAyah: s.totalAyah,
}));

const wizardSurahNo = ref(1);
const wizardStart = ref(1);
const wizardEnd = ref(5);
const wizardTitle = ref("");

const wizardMaxAyah = computed(
  () => surahOptions.find((s) => s.surahNo === wizardSurahNo.value)?.totalAyah ?? 286
);

const wizardError = computed(() => {
  if (!wizardStart.value || !wizardEnd.value) return "";
  if (wizardStart.value > wizardEnd.value) return "Start ayah must come before end ayah.";
  if (wizardEnd.value > wizardMaxAyah.value) return `This Surah only has ${wizardMaxAyah.value} ayahs.`;
  return "";
});

const canCreate = computed(
  () => wizardStart.value > 0 && wizardEnd.value >= wizardStart.value && !wizardError.value
);

const submitWizard = () => {
  createPlan({
    surahNo: wizardSurahNo.value,
    startAyah: wizardStart.value,
    endAyah: wizardEnd.value,
    title: wizardTitle.value,
  });
  wizardTitle.value = "";
};

/* ---------- Delete ---------- */
const confirmDeleteId = ref(null);
const doDelete = () => {
  deletePlan(confirmDeleteId.value);
  confirmDeleteId.value = null;
};
</script>

<style scoped>
.hifz-container {
  padding-bottom: 100px;
}

.hifz-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.gradient-text {
  background: linear-gradient(45deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.hifz-arabic {
  font-family: "Amiri Quran", serif;
  font-size: 1.6rem;
  line-height: 2.2;
  direction: rtl;
  text-align: right;
}

.hifz-ayah {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  padding-bottom: 8px;
}
</style>
