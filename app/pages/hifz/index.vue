<template>
  <v-container class="hifz-container">
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 hifz-header">
          <div class="text-overline text-grey-lighten-1 mb-1">Memorization</div>
          <div class="text-h4 font-weight-bold gradient-text mb-1">📗 Hifz Mode</div>
          <div class="text-subtitle-2 text-grey-lighten-1">
            Learn → Practice → Recall → Test → Review — every day
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Today's Hifz -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="pa-5 today-card">
          <template v-if="resumeAvailable">
            <div class="text-overline">In progress</div>
            <div class="text-h6 font-weight-bold mb-3">{{ progress.done }} / {{ progress.total }} completed</div>
            <v-btn block rounded="xl" size="large" color="primary" to="/hifz/session">Resume Session</v-btn>
          </template>
          <template v-else-if="todayItemCount > 0">
            <div class="text-overline">Today's Hifz</div>
            <div class="text-h5 font-weight-bold mb-1">{{ todayItemCount }} items to practice</div>
            <div class="text-caption text-grey-lighten-1 mb-4">~{{ todayEstimateMinutes }} minutes</div>
            <v-btn block rounded="xl" size="large" color="primary" @click="startToday">Start Today's Hifz</v-btn>
          </template>
          <template v-else-if="activeTargets.length">
            <div class="text-h6 font-weight-bold mb-3">You're caught up</div>
            <v-btn block rounded="xl" size="large" variant="tonal" color="primary" @click="quickTestOpen = true">
              Quick Test
            </v-btn>
          </template>
          <template v-else>
            <div class="text-h6 font-weight-bold mb-1">No active targets yet</div>
            <div class="text-caption text-grey-lighten-1">Create one below to start memorizing.</div>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Weak areas -->
    <v-row v-if="weakAyahs.length || weakTransitions.length" class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-h6 font-weight-bold">Weak Areas — {{ weakAyahs.length + weakTransitions.length }}</div>
            <v-btn size="small" color="error" variant="tonal" @click="practiceAllWeak">Practice All</v-btn>
          </div>
          <div v-for="a in weakAyahs" :key="a.key" class="text-body-2 mb-1">
            {{ targetLabel(a.targetId) }} — Ayah {{ a.ayahNo }}
          </div>
          <div v-for="t in weakTransitions" :key="t.key" class="text-body-2 mb-1">
            {{ targetLabel(t.targetId) }} — Transition {{ t.fromAyah }} → {{ t.toAyah }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Targets / Mastery -->
    <v-row v-if="targets.length" class="mb-6">
      <v-col cols="12">
        <div class="text-h6 font-weight-bold mb-3">Targets</div>
        <v-card v-for="t in targets" :key="t.id" rounded="xl" elevation="6" class="pa-4 mb-3">
          <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
            <div>
              <div class="font-weight-bold">{{ t.surahName }} {{ t.startAyah }}–{{ t.endAyah }}</div>
              <div class="text-caption text-medium-emphasis">
                Coverage {{ coverage(t.id).introduced }}/{{ coverage(t.id).total }}
                <span v-if="t.status === 'paused'"> · paused</span>
              </div>
            </div>
            <div class="d-flex ga-1">
              <v-btn size="small" variant="text" @click="setStatus(t.id, t.status === 'active' ? 'paused' : 'active')">
                {{ t.status === "active" ? "Pause" : "Resume" }}
              </v-btn>
              <v-btn size="small" variant="text" color="error" icon="mdi-delete-outline" @click="confirmDeleteId = t.id" />
            </div>
          </div>

          <v-row dense class="mb-2">
            <v-col cols="3"><div class="text-caption text-medium-emphasis">Strong</div><div class="font-weight-bold">{{ coverage(t.id).strong }}</div></v-col>
            <v-col cols="3"><div class="text-caption text-medium-emphasis">Memorized</div><div class="font-weight-bold">{{ coverage(t.id).memorized }}</div></v-col>
            <v-col cols="3"><div class="text-caption text-medium-emphasis">Learning</div><div class="font-weight-bold">{{ coverage(t.id).learning }}</div></v-col>
            <v-col cols="3"><div class="text-caption text-medium-emphasis">Weak</div><div class="font-weight-bold text-error">{{ coverage(t.id).weak }}</div></v-col>
          </v-row>

          <div class="d-flex align-center ga-2 mb-2">
            <v-progress-linear :model-value="health(t.id).score" height="8" rounded color="teal" class="flex-grow-1" />
            <span class="text-caption font-weight-bold">{{ health(t.id).score }}</span>
          </div>
          <div class="text-caption text-medium-emphasis mb-3">
            Coverage {{ health(t.id).signals.coverage }}% · Recall {{ health(t.id).signals.recall }}% · Consistency {{ health(t.id).signals.consistency }}%
          </div>

          <div v-if="weakestAyah(t.id)" class="text-caption text-error mb-2">
            Weakest: Ayah {{ weakestAyah(t.id).ayahNo }} — {{ whyWeak(t.id, weakestAyah(t.id).ayahNo)?.reason }}
          </div>

          <div class="d-flex ga-2 flex-wrap">
            <v-btn v-if="weakestAyah(t.id)" size="small" variant="tonal" color="error" @click="practiceWeakest(t.id)">
              Practice Weakest
            </v-btn>
            <v-btn size="small" variant="tonal" :disabled="coverage(t.id).introduced === 0" @click="fullRangeTest(t.id)">
              Full Range Test
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- New target -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-btn v-if="!wizardOpen" block variant="tonal" prepend-icon="mdi-plus" @click="wizardOpen = true">
          New Memorization Target
        </v-btn>
        <HifzTargetWizard v-else @created="onTargetCreated" />
      </v-col>
    </v-row>

    <!-- Activity -->
    <v-row v-if="activity.length" class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="text-h6 font-weight-bold mb-3">Activity</div>

          <div class="heatmap mb-4">
            <div
              v-for="d in heatmapDays"
              :key="d.date"
              class="heatmap-cell"
              :class="d.level"
              :title="`${d.date}: ${d.total} activity`"
            />
          </div>

          <div class="text-caption text-medium-emphasis mb-2">This month</div>
          <div class="text-body-2 mb-3">
            New: {{ monthStats.newAyahs }} · Revision: {{ monthStats.revisions }} ·
            Weak recovered: {{ monthStats.recoveredAyahs }} · Transitions recovered: {{ monthStats.recoveredTransitions }} ·
            Assessments: {{ monthStats.assessments }}
          </div>

          <div v-for="d in recentActivity" :key="d.date" class="text-caption mb-1">
            {{ d.date }} — {{ d.newAyahs }} new · {{ d.revisions }} revision
            <span v-if="d.recoveredAyahs">· {{ d.recoveredAyahs }} weak recovered</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Test -->
    <v-dialog v-model="quickTestOpen" max-width="420">
      <v-card rounded="lg">
        <v-card-title>Quick Test</v-card-title>
        <v-card-text>
          <div class="text-caption text-medium-emphasis mb-2">Duration</div>
          <div class="d-flex ga-2 flex-wrap mb-4">
            <v-chip v-for="n in [2, 5, 10]" :key="n" :color="quickMinutes === n ? 'primary' : undefined" @click="quickMinutes = n">
              {{ n }} min
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="quickTestOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="launchQuickTest">Start</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog :model-value="!!confirmDeleteId" max-width="360" @update:model-value="(v) => { if (!v) confirmDeleteId = null }">
      <v-card rounded="lg">
        <v-card-title>Delete this target?</v-card-title>
        <v-card-text>This removes the target and all of its ayah/transition progress. This can't be undone.</v-card-text>
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
useHead({ title: "Hifz Mode — Quran App" });
useSeoMeta({ robots: "noindex, follow" });

const {
  targets,
  activeTargets,
  activity,
  load: loadHifz,
  deleteTarget,
  updateTarget,
  weakAyahs,
  weakTransitions,
  targetCoverage,
  weakestAyah: weakestAyahFn,
  targetHealth,
  whyWeak: whyWeakFn,
} = useHifz();

const {
  session,
  loadSession,
  resumeAvailable,
  progress,
  buildDailyItems,
  startDailySession,
  startWeakSession,
  startQuickTest,
  startAssessment,
} = useHifzSession();

const router = useRouter();

onMounted(() => {
  loadHifz();
  loadSession();
});

const todayItemCount = computed(() => buildDailyItems().length);
const todayEstimateMinutes = computed(() => estimateSessionMinutes(todayItemCount.value));

const startToday = () => {
  startDailySession();
  router.push("/hifz/session");
};

const practiceAllWeak = () => {
  startWeakSession();
  router.push("/hifz/session");
};

const practiceWeakest = (targetId) => {
  startWeakSession([targetId]);
  router.push("/hifz/session");
};

const fullRangeTest = (targetId) => {
  startAssessment(targetId);
  router.push("/hifz/session");
};

const targetLabel = (targetId) => {
  const t = targets.value.find((x) => x.id === targetId);
  return t ? `${t.surahName} ${t.startAyah}-${t.endAyah}` : "Target";
};

const coverage = (targetId) => targetCoverage(targetId);
const health = (targetId) => targetHealth(targetId);
const weakestAyah = (targetId) => weakestAyahFn(targetId);
const whyWeak = (targetId, ayahNo) => whyWeakFn(targetId, ayahNo);

const setStatus = (id, status) => updateTarget(id, { status });

const wizardOpen = ref(false);
const onTargetCreated = () => {
  wizardOpen.value = false;
};

/* Quick Test */
const quickTestOpen = ref(false);
const quickMinutes = ref(5);
const launchQuickTest = () => {
  startQuickTest(quickMinutes.value);
  quickTestOpen.value = false;
  router.push("/hifz/session");
};

/* Delete */
const confirmDeleteId = ref(null);
const doDelete = () => {
  deleteTarget(confirmDeleteId.value);
  confirmDeleteId.value = null;
};

/* Activity / heatmap */
const recentActivity = computed(() => [...activity.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10));

const heatmapDays = computed(() => {
  const days = [];
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const entry = activity.value.find((a) => a.date === key);
    const total = entry ? entry.newAyahs + entry.revisions + entry.recoveredAyahs + entry.recoveredTransitions : 0;
    days.push({ date: key, total, level: total === 0 ? "none" : total < 5 ? "light" : "strong" });
  }
  return days;
});

const monthStats = computed(() => {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthEntries = activity.value.filter((a) => a.date.startsWith(prefix));
  return monthEntries.reduce(
    (acc, a) => ({
      newAyahs: acc.newAyahs + a.newAyahs,
      revisions: acc.revisions + a.revisions,
      recoveredAyahs: acc.recoveredAyahs + a.recoveredAyahs,
      recoveredTransitions: acc.recoveredTransitions + a.recoveredTransitions,
      assessments: acc.assessments + a.assessments,
    }),
    { newAyahs: 0, revisions: 0, recoveredAyahs: 0, recoveredTransitions: 0, assessments: 0 }
  );
});
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

.today-card {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 4px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 3px;
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.heatmap-cell.light {
  background: #ffd54f;
}

.heatmap-cell.strong {
  background: #00c853;
}
</style>
