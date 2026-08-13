<template>
  <v-container class="goals-container">
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 goals-header">
          <div class="text-overline text-grey-lighten-1 mb-1">Reading Goals</div>
          <div class="text-h4 font-weight-bold gradient-text mb-1">📖 Khatmah Planner</div>
          <div class="text-subtitle-2 text-grey-lighten-1">Turn reading into a daily habit</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Active goal -->
    <v-row v-if="activeGoal" class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="pa-5 active-goal-card">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <div class="text-overline text-grey-lighten-1">Active Goal</div>
              <div class="text-h6 font-weight-bold">{{ activeGoal.label }}</div>
            </div>

            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="menuProps" />
              </template>
              <v-list density="compact">
                <v-list-item @click="updateGoalStatus(activeGoal.id, 'paused')">
                  <v-list-item-title>Pause goal</v-list-item-title>
                </v-list-item>
                <v-list-item @click="confirmDeleteId = activeGoal.id">
                  <v-list-item-title class="text-error">Delete goal</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div class="d-flex align-center ga-6 flex-wrap">
            <v-progress-circular :model-value="progressPercent" size="110" width="10" color="teal">
              <span class="text-h6 font-weight-bold">{{ progressPercent }}%</span>
            </v-progress-circular>

            <div class="flex-grow-1" style="min-width: 200px">
              <div class="text-caption text-grey-lighten-1">Today</div>
              <div class="text-h5 font-weight-bold mb-1">
                {{ todayCount }} / {{ adjustedDailyTarget }} ayahs
              </div>
              <v-progress-linear
                :model-value="Math.min(100, (todayCount / Math.max(1, adjustedDailyTarget)) * 100)"
                height="8"
                rounded
                color="teal"
                class="mb-2"
              />
              <div class="text-caption" :class="isBehindPace ? 'text-warning' : 'text-grey-lighten-1'">
                <template v-if="isBehindPace">
                  Behind pace — today's target includes catch-up
                </template>
                <template v-else-if="projectedFinishDate">
                  On pace to finish {{ projectedFinishDate }}
                </template>
              </div>
            </div>
          </div>

          <v-row dense class="mt-4">
            <v-col cols="6">
              <v-card class="glass pa-3 text-center" rounded="lg">
                <v-icon color="orange">mdi-fire</v-icon>
                <div class="text-caption mt-1">Streak</div>
                <div class="text-h6 font-weight-bold">{{ streak }} day{{ streak === 1 ? "" : "s" }}</div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="glass pa-3 text-center" rounded="lg">
                <v-icon color="teal">mdi-book-open-variant</v-icon>
                <div class="text-caption mt-1">Read so far</div>
                <div class="text-h6 font-weight-bold">{{ readSinceStart }} ayahs</div>
              </v-card>
            </v-col>
          </v-row>

          <v-btn block rounded="xl" size="large" color="teal" class="mt-4" @click="continueReading">
            Continue Reading
          </v-btn>
          <v-btn block variant="text" class="mt-2" prepend-icon="mdi-plus" @click="manualDialog = true">
            Log reading manually
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Wizard -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="text-h6 font-weight-bold mb-1">
            {{ activeGoal ? "Create Another Goal" : "Create Your First Goal" }}
          </div>
          <div class="text-caption text-medium-emphasis mb-4">Takes under a minute</div>

          <div class="text-caption text-medium-emphasis mb-2">Goal type</div>
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="opt in goalTypeOptions"
              :key="opt.value"
              :color="wizardType === opt.value ? 'primary' : undefined"
              :variant="wizardType === opt.value ? 'flat' : 'outlined'"
              @click="wizardType = opt.value"
            >
              {{ opt.title }}
            </v-chip>
          </div>

          <v-text-field
            v-if="wizardType === 'finish-by-date'"
            type="date"
            label="Target completion date"
            v-model="wizardTargetDate"
            :min="minDateStr"
            class="mb-2"
          />
          <v-text-field
            v-else
            type="number"
            :label="dailyAmountLabel"
            v-model.number="wizardDailyAmount"
            min="1"
            class="mb-2"
          />

          <div class="text-caption text-medium-emphasis mb-2">Preferred reading days</div>
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="(d, i) in weekDayLabels"
              :key="i"
              size="small"
              :color="wizardPreferredDays.includes(i) ? 'primary' : undefined"
              :variant="wizardPreferredDays.includes(i) ? 'flat' : 'outlined'"
              @click="toggleDay(i)"
            >
              {{ d }}
            </v-chip>
          </div>

          <v-btn block rounded="xl" color="primary" size="large" :disabled="!canCreate" @click="submitWizard">
            Create Goal
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Other goals -->
    <v-row v-if="otherGoals.length">
      <v-col cols="12">
        <div class="text-h6 font-weight-bold mb-3">Other Goals</div>
        <v-card
          v-for="g in otherGoals"
          :key="g.id"
          rounded="lg"
          class="pa-4 mb-3 d-flex align-center justify-space-between flex-wrap ga-2"
        >
          <div>
            <div class="font-weight-bold">{{ g.label }}</div>
            <div class="text-caption text-medium-emphasis text-capitalize">{{ g.status }}</div>
          </div>
          <div class="d-flex ga-2">
            <v-btn
              v-if="g.status === 'paused'"
              size="small"
              variant="tonal"
              color="primary"
              @click="resumeGoal(g.id)"
            >
              Resume
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              color="error"
              icon="mdi-delete-outline"
              @click="confirmDeleteId = g.id"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Manual log dialog -->
    <v-dialog v-model="manualDialog" max-width="360">
      <v-card rounded="lg">
        <v-card-title>Log reading manually</v-card-title>
        <v-card-text>
          <div class="text-caption text-medium-emphasis mb-3">
            For reading offline, e.g. from a physical mushaf.
          </div>
          <v-text-field type="number" label="Ayahs read" v-model.number="manualAmount" min="1" autofocus />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="manualDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="submitManual">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete confirm -->
    <v-dialog :model-value="!!confirmDeleteId" max-width="360" @update:model-value="(v) => { if (!v) confirmDeleteId = null }">
      <v-card rounded="lg">
        <v-card-title>Delete this goal?</v-card-title>
        <v-card-text>This removes the goal and its progress. This can't be undone.</v-card-text>
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
const router = useRouter();
const {
  goals,
  activeGoal,
  todayCount,
  streak,
  load,
  createGoal,
  setActiveGoal,
  updateGoalStatus,
  deleteGoal,
  recordManualAyahs,
  useGoalStats,
} = useReadingGoals();
const { progress, load: loadReadingProgress } = useReadingProgress();

onMounted(() => {
  load();
  loadReadingProgress();
});

const { progressPercent, adjustedDailyTarget, isBehindPace, projectedFinishDate, readSinceStart } =
  useGoalStats(activeGoal);

const otherGoals = computed(() =>
  goals.value.filter((g) => g.id !== activeGoal.value?.id).sort((a, b) => b.createdAt - a.createdAt)
);

const continueReading = () => {
  if (progress.value) {
    router.push(`/surah/${progress.value.surahNo}#ayah-${progress.value.ayahNo}`);
  } else {
    router.push("/surah/1");
  }
};

/* ---------- Wizard ---------- */
const goalTypeOptions = [
  { value: "finish-by-date", title: "Finish by date" },
  { value: "ayahs-per-day", title: "Ayahs/day" },
  { value: "pages-per-day", title: "Pages/day" },
  { value: "juz-per-week", title: "Juz/week" },
  { value: "custom", title: "Custom" },
];

const wizardType = ref("ayahs-per-day");
const wizardDailyAmount = ref(10);
const wizardTargetDate = ref("");
const wizardPreferredDays = ref([0, 1, 2, 3, 4, 5, 6]);

const minDateStr = computed(() => new Date().toISOString().slice(0, 10));

const dailyAmountLabel = computed(() => {
  if (wizardType.value === "pages-per-day") return "Pages per day";
  if (wizardType.value === "juz-per-week") return "Juz per week";
  return "Ayahs per day";
});

const toggleDay = (i) => {
  wizardPreferredDays.value = wizardPreferredDays.value.includes(i)
    ? wizardPreferredDays.value.filter((d) => d !== i)
    : [...wizardPreferredDays.value, i].sort();
};

const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const canCreate = computed(() => {
  if (wizardType.value === "finish-by-date") return !!wizardTargetDate.value;
  return wizardDailyAmount.value > 0;
});

const submitWizard = async () => {
  await createGoal({
    type: wizardType.value,
    dailyAmount: wizardDailyAmount.value,
    targetDate: wizardType.value === "finish-by-date" ? wizardTargetDate.value : null,
    preferredDays: wizardPreferredDays.value,
    currentSurahNo: progress.value?.surahNo,
    currentAyahNo: progress.value?.ayahNo,
  });
};

const resumeGoal = (id) => {
  updateGoalStatus(id, "active");
  setActiveGoal(id);
};

/* ---------- Manual log ---------- */
const manualDialog = ref(false);
const manualAmount = ref(5);

const submitManual = () => {
  recordManualAyahs(manualAmount.value);
  manualDialog.value = false;
};

/* ---------- Delete ---------- */
const confirmDeleteId = ref(null);
const doDelete = () => {
  deleteGoal(confirmDeleteId.value);
  confirmDeleteId.value = null;
};
</script>

<style scoped>
.goals-container {
  padding-bottom: 80px;
}

.goals-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.gradient-text {
  background: linear-gradient(45deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.active-goal-card {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
