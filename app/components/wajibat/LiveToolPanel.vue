<!-- Live data from Module 5 (Prayer Times & Qibla) on a fiqh topic page. Shows the
     prayer store's own timings as they are; nothing is recomputed here (spec §6.3). -->
<template>
  <v-card variant="tonal" color="primary" rounded="lg" class="live-tool">
    <v-card-text>
      <template v-if="tool === 'prayertimes'">
        <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
          <div class="font-weight-bold">
            <v-icon size="18" class="me-1" aria-hidden="true">mdi-clock-outline</v-icon>
            Today's prayer times
          </div>
          <v-btn size="small" variant="outlined" to="/prayerTime" append-icon="mdi-arrow-right">Prayer Times</v-btn>
        </div>
        <div v-if="mounted && timings" class="times-grid" role="list" aria-label="Today's prayer times">
          <div v-for="k in KEYS" :key="k" class="time-cell" role="listitem">
            <span class="time-label">{{ LABELS[k] }}</span>
            <span class="time-value">{{ timings[k] ?? "—" }}</span>
          </div>
        </div>
        <p v-else class="text-body-2 mb-0">Open Prayer Times to load today's times for your location.</p>
        <p v-if="mounted && !isJafari" class="text-caption mt-2 mb-0">
          <v-icon size="14" aria-hidden="true">mdi-information-outline</v-icon>
          These times use your current calculation method (Sunni). For Ja'fari times, switch the method in Settings.
        </p>
        <p class="text-caption mt-1 mb-0">From the app's Prayer Times feature (AlAdhan). The rulings below set out when each prayer may be performed.</p>
      </template>

      <template v-else-if="tool === 'sawm'">
        <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
          <div class="font-weight-bold">
            <v-icon size="18" class="me-1" aria-hidden="true">mdi-weather-night</v-icon>
            Today's dawn and maghrib
          </div>
          <div class="d-flex flex-wrap ga-2">
            <v-btn size="small" variant="outlined" to="/prayerTime" append-icon="mdi-arrow-right">Prayer Times</v-btn>
            <v-btn size="small" variant="outlined" to="/ramadan" append-icon="mdi-arrow-right">Ramadan fasting log</v-btn>
          </div>
        </div>
        <div v-if="mounted && timings" class="times-grid" role="list" aria-label="Today's dawn and maghrib times">
          <div v-for="k in SAWM_KEYS" :key="k" class="time-cell" role="listitem">
            <span class="time-label">{{ SAWM_LABELS[k] }}</span>
            <span class="time-value">{{ timings[k] ?? "—" }}</span>
          </div>
        </div>
        <p v-else class="text-body-2 mb-0">Open Prayer Times to load today's times for your location.</p>
        <p v-if="mounted && !isJafari" class="text-caption mt-2 mb-0">
          <v-icon size="14" aria-hidden="true">mdi-information-outline</v-icon>
          These times use your current calculation method (Sunni). For Ja'fari times, switch the method in Settings.
        </p>
        <p class="text-caption mt-1 mb-0">
          From the app's Prayer Times feature (AlAdhan), shown as they are. The rulings below say when the fast begins and ends; this panel does not decide it.
          Your fasts are logged in the Ramadan page, not here.
        </p>
      </template>

      <template v-else-if="tool === 'qibla'">
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div class="font-weight-bold">
            <v-icon size="18" class="me-1" aria-hidden="true">mdi-compass-outline</v-icon>
            Find the qibla from your location
          </div>
          <v-btn size="small" variant="outlined" to="/qibla-direction" append-icon="mdi-arrow-right">Qibla tool</v-btn>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { usePrayerStore } from "~/stores/prayer";

defineProps({
  tool: { type: String, required: true },
});

const KEYS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha", "Midnight"];
const LABELS = { Fajr: "Ṣubḥ (Fajr)", Sunrise: "Sunrise", Dhuhr: "Ẓuhr", Asr: "ʿAṣr", Maghrib: "Maghrib", Isha: "ʿIshāʾ", Midnight: "Midnight" };
const SAWM_KEYS = ["Fajr", "Maghrib"];
const SAWM_LABELS = { Fajr: "Dawn (Ṣubḥ / Fajr)", Maghrib: "Maghrib" };

const prayer = usePrayerStore();
// The store is filled on the client by the default layout; read it after mount (no hydration mismatch).
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const timings = computed(() => prayer.data?.data?.timings ?? null);
const isJafari = computed(() => prayer.fiqh === "jafari");
</script>

<style scoped>
.times-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
}
.time-cell {
  display: flex;
  flex-direction: column;
}
.time-label {
  font-size: 0.75rem;
  opacity: 0.8;
}
.time-value {
  font-weight: 700;
  font-size: 1rem;
}
</style>
