<template>
  <v-container class="ramadan-container">
    <v-row justify="center" class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" rounded="xl" class="pa-6 ramadan-header">
          <div class="text-overline text-grey-lighten-1 mb-1">Ramadan</div>
          <div class="text-h4 font-weight-bold gradient-text mb-1">🌙 Ramadan Mode</div>
          <div class="text-subtitle-2 text-grey-lighten-1">
            Fasting, Suhoor/Iftar, a daily Khatmah target, and reflection — in one place
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Not currently in Ramadan -->
    <v-row v-if="!isRamadanActive" class="mb-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="text-h6 font-weight-bold mb-2">It isn't Ramadan right now</div>
          <div class="text-body-2 text-medium-emphasis mb-2">
            This is detected automatically from the calculated Hijri calendar
            ({{ prayer.fiqh === "jafari" ? "Ja'fari" : "Sunni" }} method) — it'll switch on by itself once Hijri
            month 9 begins.
          </div>
          <div class="text-body-2 text-medium-emphasis">
            If your local mosque or authority has already announced a different start date, you can turn it on
            manually below.
          </div>
        </v-card>
      </v-col>
    </v-row>

    <template v-else>
      <!-- Day counter hero -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card rounded="xl" elevation="10" class="pa-5 ramadan-hero-card">
            <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
              <div>
                <div class="text-overline">Ramadan</div>
                <div class="text-h5 font-weight-bold">🌙 Day {{ ramadanDay ?? "—" }}</div>
              </div>
              <v-chip color="deep-purple" variant="tonal">
                {{ isOverrideActive ? "Manually set" : "Blessed Month" }}
              </v-chip>
            </div>

            <v-row dense>
              <v-col cols="4">
                <v-card class="glass pa-3 text-center" rounded="lg">
                  <v-icon size="24" color="indigo">mdi-weather-night-partly-cloudy</v-icon>
                  <div class="text-caption mt-1">Imsak</div>
                  <div class="text-subtitle-1 font-weight-bold">{{ format12h(prayer.imsakTime) || "—" }}</div>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="glass pa-3 text-center" rounded="lg">
                  <v-icon size="24" color="teal">mdi-weather-night</v-icon>
                  <div class="text-caption mt-1">Suhoor Ends</div>
                  <div class="text-subtitle-1 font-weight-bold">{{ format12h(prayer.suhoorTime) || "—" }}</div>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card class="glass pa-3 text-center" rounded="lg">
                  <v-icon size="24" color="orange">mdi-weather-sunset-down</v-icon>
                  <div class="text-caption mt-1">Iftar</div>
                  <div class="text-subtitle-1 font-weight-bold">{{ format12h(prayer.iftarTime) || "—" }}</div>
                </v-card>
              </v-col>
            </v-row>

            <div class="text-center mt-4" v-if="!isOverrideActive">
              <div class="text-caption">Iftar In</div>
              <div class="text-h5 font-weight-bold gradient-text">{{ prayer.iftarCountdown }}</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Fasting tracker -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card rounded="xl" elevation="6" class="pa-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-h6 font-weight-bold">Fasting Tracker</div>
              <v-icon v-if="fastingStreak > 0" color="orange">mdi-fire</v-icon>
              <span v-if="fastingStreak > 0" class="text-caption ml-n2">{{ fastingStreak }} day streak</span>
            </div>

            <div class="d-flex justify-space-between ga-1 mb-3">
              <div
                v-for="day in recentDays"
                :key="day"
                class="fasting-day text-center"
                :class="{ 'fasting-day--today': day === todayKey() }"
                @click="cycleFastingStatus(day)"
              >
                <div class="text-caption">{{ formatDay(day) }}</div>
                <v-icon :color="statusColor(getFastingStatus(day))" size="26">
                  {{ statusIcon(getFastingStatus(day)) }}
                </v-icon>
              </div>
            </div>

            <div class="text-caption text-medium-emphasis mb-3">
              Tap a day to mark it — fasted, missed, then clear. {{ fastingStats.fasted }} fasted ·
              {{ fastingStats.missed }} missed so far this Ramadan. Kept private, stored only on this device.
            </div>

            <v-btn
              variant="tonal"
              size="small"
              :color="getFastingStatus(addDays(todayKey(), 1)) === 'planned' ? 'teal' : undefined"
              @click="togglePlanTomorrow"
            >
              {{ getFastingStatus(addDays(todayKey(), 1)) === "planned" ? "Tomorrow: planned ✓" : "Plan tomorrow's fast" }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <!-- Ramadan Khatmah -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card rounded="xl" elevation="6" class="pa-5">
            <div class="text-h6 font-weight-bold mb-3">Ramadan Khatmah</div>

            <template v-if="ramadanGoal">
              <div class="d-flex align-center ga-4">
                <v-progress-circular :model-value="goalProgressPercent" size="64" width="7" color="teal">
                  <span class="text-caption font-weight-bold">{{ goalProgressPercent }}%</span>
                </v-progress-circular>
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ goalTodayCount }} / {{ goalDailyTarget }} ayahs today
                  </div>
                  <div class="text-caption text-medium-emphasis" :class="{ 'text-warning': goalIsBehindPace }">
                    <template v-if="goalIsBehindPace">Behind pace — today's target includes catch-up</template>
                    <template v-else-if="goalProjectedFinish">On pace to finish {{ goalProjectedFinish }}</template>
                  </div>
                </div>
              </div>
              <v-btn block rounded="xl" class="mt-4" color="teal" @click="router.push('/goals')">
                Open in Reading Goals
              </v-btn>
            </template>
            <template v-else>
              <div class="text-body-2 text-medium-emphasis mb-3">
                Create a goal to finish the Quran by the estimated end of Ramadan
                <template v-if="estimatedEndDateKey">({{ formatDay(estimatedEndDateKey) }}, estimated)</template>.
              </div>
              <v-btn block rounded="xl" color="teal" :loading="creatingGoal" @click="startKhatmah">
                Start a Ramadan Khatmah
              </v-btn>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <!-- Daily Dua & Ayah -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card rounded="xl" elevation="6" class="pa-5 dua-card">
            <div class="text-overline text-grey-lighten-1 mb-2">Today's Dua</div>
            <div class="dua-arabic mb-3">{{ todaysDua.arabic }}</div>
            <div class="text-body-2 mb-1">{{ todaysDua.translation }}</div>
            <div class="text-caption text-grey-lighten-1">{{ todaysDua.reference }}</div>
          </v-card>
        </v-col>
      </v-row>

      <lazy-services-ayah-of-day />

      <!-- Laylat al-Qadr -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card rounded="xl" elevation="6" class="pa-5" :class="{ 'qadr-highlight': isPossibleQadrNight }">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon color="amber">mdi-star-four-points-outline</v-icon>
              <div class="text-h6 font-weight-bold">Laylat al-Qadr</div>
              <v-chip v-if="isPossibleQadrNight" color="amber" variant="flat" size="small">
                Tonight is one of the nights
              </v-chip>
            </div>
            <div class="text-body-2 text-medium-emphasis mb-2">{{ laylatAlQadrNote }}</div>
            <div class="d-flex ga-2 flex-wrap">
              <v-chip
                v-for="night in laylatAlQadrNights"
                :key="night"
                size="small"
                :color="ramadanDay === night ? 'amber' : undefined"
                :variant="ramadanDay === night ? 'flat' : 'outlined'"
              >
                Night {{ night }}
              </v-chip>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-4">
        <v-col cols="12">
          <v-btn block rounded="xl" variant="tonal" prepend-icon="mdi-calendar-month" @click="router.push('/calender')">
            View Full Ramadan Calendar
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <!-- Start date override -->
    <v-row>
      <v-col cols="12">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel title="Ramadan start date">
            <template #text>
              <div class="text-body-2 text-medium-emphasis mb-3">
                By default this is detected from the calculated Hijri calendar. If your local mosque announced a
                different date, set it here — it overrides detection for 30 days.
              </div>
              <v-text-field
                type="date"
                label="Ramadan started on"
                v-model="overrideInput"
                density="comfortable"
                class="mb-2"
              />
              <div class="d-flex ga-2">
                <v-btn color="teal" variant="flat" :disabled="!overrideInput" @click="applyOverride">
                  Set start date
                </v-btn>
                <v-btn variant="text" :disabled="!startOverride" @click="clearOverride">
                  Use calculated date
                </v-btn>
              </div>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { RAMADAN_DUAS, LAYLAT_AL_QADR_NIGHTS, LAYLAT_AL_QADR_NOTE, RAMADAN_GOAL_LABEL } from "~/utils/ramadanContent";

useSeoMeta({
  title: "Ramadan Mode",
  description: "Fasting times, Ramadan duas, Laylatul Qadr guidance, and a daily Ramadan reading tracker.",
  ogTitle: "Ramadan Mode",
  ogType: "website",
});

const prayer = usePrayerStore();
const router = useRouter();

const {
  startOverride,
  isRamadanActive,
  isOverrideActive,
  ramadanDay,
  estimatedEndDateKey,
  getFastingStatus,
  setFastingStatus,
  cycleFastingStatus,
  fastingStats,
  fastingStreak,
  recentDays,
  createRamadanKhatmah,
  todayKey,
  addDays,
  formatDay,
  load: loadRamadan,
  setStartOverride,
} = useRamadan();

const { goals, todayCount: goalTodayCount, streak: goalStreak, load: loadGoals, useGoalStats } = useReadingGoals();

onMounted(() => {
  prayer.init();
  loadRamadan();
  loadGoals();
});

const ramadanGoal = computed(
  () => goals.value.find((g) => g.label === RAMADAN_GOAL_LABEL && g.status === "active") ?? null
);

const {
  progressPercent: goalProgressPercent,
  adjustedDailyTarget: goalDailyTarget,
  isBehindPace: goalIsBehindPace,
  projectedFinishDate: goalProjectedFinish,
} = useGoalStats(ramadanGoal);

const creatingGoal = ref(false);
const startKhatmah = async () => {
  creatingGoal.value = true;
  try {
    await createRamadanKhatmah();
  } finally {
    creatingGoal.value = false;
  }
};

const togglePlanTomorrow = () => {
  const tomorrow = addDays(todayKey(), 1);
  setFastingStatus(tomorrow, getFastingStatus(tomorrow) === "planned" ? null : "planned");
};

const statusColor = (status) => (status === "fasted" ? "teal" : status === "missed" ? "error" : status === "planned" ? "amber" : "grey");
const statusIcon = (status) =>
  status === "fasted" ? "mdi-check-circle" : status === "missed" ? "mdi-close-circle" : status === "planned" ? "mdi-clock-outline" : "mdi-circle-outline";

const laylatAlQadrNights = LAYLAT_AL_QADR_NIGHTS;
const laylatAlQadrNote = LAYLAT_AL_QADR_NOTE;
const isPossibleQadrNight = computed(() => LAYLAT_AL_QADR_NIGHTS.includes(ramadanDay.value));

const todaysDua = computed(() => {
  const idx = Math.max(0, (ramadanDay.value ?? 1) - 1) % RAMADAN_DUAS.length;
  return RAMADAN_DUAS[idx];
});

const overrideInput = ref("");
const applyOverride = () => {
  if (!overrideInput.value) return;
  setStartOverride(overrideInput.value);
};
const clearOverride = () => {
  overrideInput.value = "";
  setStartOverride(null);
};
</script>

<style scoped>
.ramadan-container {
  padding-bottom: 80px;
}

.ramadan-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.gradient-text {
  background: linear-gradient(45deg, #00f5a0, #00d9f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ramadan-hero-card {
  background: linear-gradient(135deg, #1a2a3a, #203a43, #2c5364);
  color: white;
  position: relative;
  overflow: hidden;
}

.fasting-day {
  flex: 1;
  cursor: pointer;
  padding: 6px 2px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.fasting-day:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.fasting-day--today {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: -2px;
}

.dua-card {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.dua-arabic {
  font-family: "Amiri", "Scheherazade New", serif;
  font-size: 22px;
  line-height: 2;
  text-align: center;
  direction: rtl;
}

.qadr-highlight {
  border: 1px solid rgba(255, 193, 7, 0.5);
  box-shadow: 0 0 0 1px rgba(255, 193, 7, 0.2) inset;
}
</style>
