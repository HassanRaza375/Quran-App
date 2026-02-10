<template>
  <v-container class="pb-10">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card rounded="xl" elevation="10" class="calendar-header pa-5">
          <div class="text-overline">Islamic Calendar</div>
          <div class="text-h5 font-weight-bold">
            📅 {{ currentMonthName }} {{ currentYear }}
          </div>
          <div class="text-caption opacity-80">
            Hijri Month: {{ hijriMonthName }}
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
            </div>
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

            <v-chip
              v-if="selectedDay.isRamadan"
              color="deep-purple"
              variant="tonal"
            >
              🌙 Ramadan {{ selectedDay.hijriDay }}
            </v-chip>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const prayer = usePrayerStore();

const currentMonth = ref(new Date().getMonth() + 1);
const currentYear = ref(new Date().getFullYear());

const calendarDays = ref([]);
const selectedDay = ref(null);
const loading = ref(true);

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

async function fetchCalendar() {
  loading.value = false;

  const waitForLocation = () =>
    new Promise((resolve) => {
      const check = setInterval(() => {
        if (prayer.latitude && prayer.longitude) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

  await waitForLocation();

  const cacheKey = `calendar_${prayer.latitude}_${prayer.longitude}_${currentMonth.value}_${currentYear.value}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    calendarDays.value = JSON.parse(cached);
    return;
  }

  const res = await $fetch("https://api.aladhan.com/v1/calendar", {
    params: {
      latitude: prayer.latitude,
      longitude: prayer.longitude,
      method: 2,
      month: currentMonth.value,
      year: currentYear.value,
    },
  });

  calendarDays.value = res.data.map((d) => ({
    day: Number(d.date.gregorian.day),
    readable: d.date.readable,
    hijriDay: d.date.hijri.day,
    hijriMonth: d.date.hijri.month.number,
    hijriMonthName: d.date.hijri.month.en,
    isRamadan: d.date.hijri.month.number === 9,
    timings: d.timings,
  }));

  localStorage.setItem(cacheKey, JSON.stringify(calendarDays.value));
}

/* ---------- INIT ---------- */

onMounted(() => {
  if (!prayer.latitude || !prayer.longitude) {
    prayer.init();
  }

  fetchCalendar();
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
