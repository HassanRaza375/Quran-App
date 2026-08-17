<template>
  <v-container class="pb-10">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="calendar-header pa-5">
          <div class="d-flex align-center justify-space-between">
            <v-btn icon="mdi-chevron-left" variant="text" @click="changeMonth(-1)" />
            <div class="text-center">
              <div class="text-overline">Islamic Calendar</div>
              <div class="text-h5 font-weight-bold">
                📅 {{ currentMonthName }} {{ currentYear }}
              </div>
              <div class="text-caption opacity-80">
                Hijri Month: {{ hijriMonthName }}
              </div>
            </div>
            <v-btn icon="mdi-chevron-right" variant="text" @click="changeMonth(1)" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Calendar Grid -->
    <v-row>
      <v-col cols="12">
        <v-card rounded="xl" elevation="8" class="calendar-card pa-4">
          <v-skeleton-loader
            v-if="calendarDays.length === 0"
            type="table"
            height="300"
          />

          <!-- Week Days -->
          <div class="weekdays">
            <div v-for="d in weekDays" :key="d" class="weekday">
              {{ d }}
            </div>
          </div>

          <!-- Days -->
          <div class="days-grid">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              class="day-cell"
              :class="{
                today: day.isToday,
                ramadan: day.isRamadan,
                active: selectedDay?.date === day.date,
              }"
              @click="selectDay(day)"
            >
              <div class="gregorian">{{ day.day }}</div>
              <div class="hijri">{{ day.hijriDay }}</div>
              <div v-if="day.event" class="event-dot" :title="day.event.name" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Events this month -->
    <v-row v-if="eventsThisMonth.length" class="mt-6">
      <v-col cols="12">
        <div class="text-h6 font-weight-bold mb-3">Events This Month</div>
        <v-card v-for="e in eventsThisMonth" :key="e.date" rounded="lg" class="pa-3 mb-2 d-flex align-center ga-3">
          <v-icon color="amber">{{ e.event.icon }}</v-icon>
          <div>
            <div class="font-weight-medium">{{ e.event.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ e.readable }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Day Details -->
    <v-row v-if="selectedDay" class="mt-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="day-details pa-5">
          <div class="d-flex justify-space-between mb-4">
            <div>
              <div class="text-overline">Selected Day</div>
              <div class="text-h6 font-weight-bold">
                {{ selectedDay.readable }}
              </div>
            </div>

            <div class="d-flex flex-column ga-1 align-end">
              <v-chip
                v-if="selectedDay.isRamadan"
                color="deep-purple"
                variant="tonal"
              >
                🌙 Ramadan {{ selectedDay.hijriDay }}
              </v-chip>
              <v-chip v-if="selectedDay.event" color="amber" variant="tonal">
                {{ selectedDay.event.name }}
              </v-chip>
            </div>
          </div>

          <v-row dense>
            <v-col cols="6">
              <v-card class="glass pa-3 text-center" rounded="lg">
                <v-icon color="teal">mdi-weather-night</v-icon>
                <div class="text-caption">Suhoor Ends</div>
                <div class="text-h6 font-weight-bold">
                  {{ format12h(selectedDay.timings.Fajr) }}
                </div>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card class="glass pa-3 text-center" rounded="lg">
                <v-icon color="orange">mdi-weather-sunset-down</v-icon>
                <div class="text-caption">Iftar</div>
                <div class="text-h6 font-weight-bold">
                  {{ format12h(selectedDay.timings.Maghrib) }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-btn
            block
            variant="tonal"
            class="mt-4"
            prepend-icon="mdi-bell-plus-outline"
            @click="openReminderFor(selectedDay)"
          >
            Add reminder for this day
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Personal Reminders -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card rounded="xl" elevation="6" class="pa-5">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-h6 font-weight-bold">Personal Reminders</div>
            <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="reminderDialog = true">
              Add
            </v-btn>
          </div>

          <div v-if="!upcomingReminders.length && !overdueReminders.length" class="text-caption text-medium-emphasis">
            No reminders yet — fasting days, study goals, or anything else worth a nudge.
          </div>

          <v-list v-if="overdueReminders.length || upcomingReminders.length" density="compact">
            <v-list-item v-for="r in [...overdueReminders, ...upcomingReminders]" :key="r.id">
              <template #prepend>
                <v-checkbox-btn :model-value="r.done" @update:model-value="toggleDone(r.id)" />
              </template>
              <v-list-item-title>{{ r.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ r.date }}<span v-if="r.date < todayKey()"> · overdue</span>
              </v-list-item-subtitle>
              <template #append>
                <v-btn icon="mdi-delete-outline" size="small" variant="text" @click="deleteReminder(r.id)" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="reminderDialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title>New Reminder</v-card-title>
        <v-card-text>
          <v-text-field label="Title" v-model="reminderTitle" autofocus class="mb-2" />
          <v-text-field type="date" label="Date" v-model="reminderDate" class="mb-2" />
          <v-textarea label="Note (optional)" v-model="reminderNote" rows="2" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="reminderDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!reminderTitle || !reminderDate" @click="submitReminder">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const prayer = usePrayerStore();

const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());

const calendarDays = ref([]);
const selectedDay = ref(null);

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ---------- HEADER COMPUTED ---------- */

const currentMonthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value - 1)
    .toLocaleString("default", { month: "long" });
});

const hijriMonthName = computed(() => {
  if (!calendarDays.value.length) return "";
  return calendarDays.value[0].hijriMonthName;
});

/* ---------- SELECT DAY ---------- */

function selectDay(day) {
  selectedDay.value = day;
}

/* ---------- FETCH CALENDAR ---------- */

let locationCheckInterval = null;

const waitForLocation = () =>
  new Promise((resolve) => {
    locationCheckInterval = setInterval(() => {
      if (prayer.latitude && prayer.longitude) {
        clearInterval(locationCheckInterval);
        locationCheckInterval = null;
        resolve();
      }
    }, 100);
  });

async function fetchCalendar() {
  await waitForLocation();

  const cacheKey = `calendar_${prayer.latitude}_${prayer.longitude}_${prayer.fiqh}_${currentMonth.value}_${currentYear.value}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    calendarDays.value = JSON.parse(cached);
    return;
  }

  const res = await $fetch("https://api.aladhan.com/v1/calendar", {
    params: {
      latitude: prayer.latitude,
      longitude: prayer.longitude,
      month: currentMonth.value,
      year: currentYear.value,
      ...FIQH_PARAMS[prayer.fiqh],
    },
  });

  calendarDays.value = res.data.map((d) => ({
    date: d.date.gregorian.date, // "DD-MM-YYYY" — stable per-day identity, was missing entirely before
    day: Number(d.date.gregorian.day),
    readable: d.date.readable,
    hijriDay: d.date.hijri.day,
    hijriMonth: d.date.hijri.month.number,
    hijriMonthName: d.date.hijri.month.en,
    isRamadan: d.date.hijri.month.number === 9,
    isToday: d.date.gregorian.day === todayDDMMYYYY().day && d.date.gregorian.month.number === todayDDMMYYYY().month && d.date.gregorian.year === todayDDMMYYYY().year,
    event: getIslamicEvent(d.date.hijri.month.number, Number(d.date.hijri.day)),
    timings: d.timings,
  }));

  localStorage.setItem(cacheKey, JSON.stringify(calendarDays.value));
}

const todayDDMMYYYY = () => {
  const t = new Date();
  return { day: String(t.getDate()), month: t.getMonth() + 1, year: String(t.getFullYear()) };
};

const eventsThisMonth = computed(() =>
  calendarDays.value.filter((d) => d.event).map((d) => ({ date: d.date, readable: d.readable, event: d.event }))
);

function changeMonth(delta) {
  selectedDay.value = null;
  let m = currentMonth.value + delta;
  let y = currentYear.value;
  if (m > 12) {
    m = 1;
    y += 1;
  } else if (m < 1) {
    m = 12;
    y -= 1;
  }
  currentMonth.value = m;
  currentYear.value = y;
  calendarDays.value = [];
  fetchCalendar();
}

/* ---------- Personal reminders ---------- */
const { upcoming: upcomingReminders, overdue: overdueReminders, load: loadReminders, createReminder, toggleDone, deleteReminder, todayKey } =
  useReminders();

const reminderDialog = ref(false);
const reminderTitle = ref("");
const reminderDate = ref("");
const reminderNote = ref("");

function openReminderFor(day) {
  const [d, m, y] = day.date.split("-");
  reminderDate.value = `${y}-${m}-${d}`;
  reminderTitle.value = day.event?.name ?? "";
  reminderDialog.value = true;
}

function submitReminder() {
  createReminder({ title: reminderTitle.value, date: reminderDate.value, note: reminderNote.value });
  reminderDialog.value = false;
  reminderTitle.value = "";
  reminderDate.value = "";
  reminderNote.value = "";
}

/* ---------- INIT ---------- */

onMounted(() => {
  if (!prayer.latitude || !prayer.longitude) {
    prayer.init();
  }

  fetchCalendar();
  loadReminders();
});

onBeforeUnmount(() => {
  if (locationCheckInterval) clearInterval(locationCheckInterval);
});
</script>


<style scoped>
.calendar-header {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.calendar-card {
  background: rgba(255, 255, 255, 0.04);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: 600;
  opacity: 0.7;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-cell {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}

.day-cell:hover {
  transform: scale(1.05);
}

.day-cell.today {
  outline: 2px solid #00f5a0;
}

.day-cell.ramadan {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
}

.day-cell.active {
  box-shadow: 0 0 0 2px #00f5a0;
}

.day-cell {
  position: relative;
}

.event-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffc107;
}

.gregorian {
  font-size: 16px;
  font-weight: bold;
}

.hijri {
  font-size: 12px;
  opacity: 0.8;
}

.day-details {
  background: linear-gradient(135deg, #1a2a3a, #203a43);
  color: white;
}
</style>
