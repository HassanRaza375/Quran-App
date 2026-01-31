<template>
  <v-container class="home-container">
    <!-- Prayer Summary -->
    <v-card rounded="xl" class="mb-4 prayer-summary" variant="tonal">
      <v-card-text class="text-center">

        <!-- Hijri Date -->
        <template v-if="!pending && data">
          <div class="hijri-date">
            {{ data.data.date.hijri.date }}
            · {{ data.data.date.hijri.month.en }}
          </div>

          <div class="current-prayer">
            Next Prayer: <strong>{{ nextPrayer }}</strong>
          </div>

          <div class="countdown">
            ⏳ {{ countdown }}
          </div>
        </template>

        <!-- Skeleton -->
        <template v-else>
          <v-skeleton-loader type="text" width="60%" class="mx-auto mb-2" />
          <v-skeleton-loader type="text" width="50%" class="mx-auto mb-2" />
          <v-skeleton-loader type="text" width="40%" class="mx-auto" />
        </template>

      </v-card-text>
    </v-card>

    <!-- Prayer Times -->
    <v-card rounded="xl" class="prayer-times-card">
      <v-card-title class="text-subtitle-1">
        Prayer Times
      </v-card-title>

      <v-card-text>
        <div class="prayer-scroll">

          <!-- Loaded -->
          <template v-if="!pending && data">
            <div v-for="prayer in prayerOrder" :key="prayer" class="prayer-pill"
              :class="{ active: prayer === nextPrayer }">
              <div class="prayer-name">
                {{ prayer }}
              </div>

              <div class="prayer-time">
                {{ format12h(data.data.timings[prayer]) }}
              </div>
            </div>
          </template>

          <!-- Skeleton -->
          <template v-else>
            <v-skeleton-loader v-for="n in 5" :key="n" type="card" width="90" height="60" class="mr-3" />
          </template>

        </div>
      </v-card-text>
    </v-card>

    <!-- Resume Reading -->
    <v-card class="resume-card" rounded="xl">
      <v-card-title>Continue Reading</v-card-title>
      <v-card-text>
        <div class="surah-name">Surah Al-Baqarah</div>
        <div class="ayah-info">Ayah 153</div>
        <v-progress-linear height="6" model-value="45" rounded />
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" rounded="lg">Continue</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Quick Actions -->
    <v-row class="quick-actions" dense>
      <v-col cols="6" v-for="i in 4" :key="i">
        <v-card class="action-card" rounded="lg">
          <v-icon size="32">mdi-book-open-page-variant</v-icon>
          <div class="action-label">Surahs</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ayah of the Day -->
    <v-card class="ayah-card" rounded="xl" variant="tonal">
      <v-card-title>Ayah of the Day</v-card-title>
      <v-card-text class="ayah-content">
        <div class="ayah-arabic">
          ﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾
        </div>
        <div class="ayah-translation">
          Indeed, with hardship comes ease.
        </div>
      </v-card-text>
      <v-card-actions class="ayah-actions">
        <v-btn icon="mdi-play-circle-outline" />
        <v-btn icon="mdi-share-variant-outline" />
      </v-card-actions>
    </v-card>

    <!-- Mini Audio Player -->
    <v-card class="audio-card" rounded="lg">
      <div class="audio-content">
        <v-btn icon="mdi-play" />
        <div class="audio-info">
          <div class="reciter">Mishary Al-Afasy</div>
          <v-progress-linear height="4" model-value="30" />
        </div>
        <v-btn icon="mdi-chevron-up" />
      </div>
    </v-card>

  </v-container>
</template>


<script setup>
/* ---------------- STATE ---------------- */

const data = ref(null)
const pending = ref(true)
const countdown = ref('')

const latitude = ref(null)
const longitude = ref(null)

const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

let countdownTimer

const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-')

/* ---------------- LIFECYCLE ---------------- */

onMounted(() => {
  getLocation()
  countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(countdownTimer)
})

/* ---------------- LOCATION ---------------- */

function getLocation() {
  if (!navigator.geolocation) {
    fallbackLocation()
    fetchPrayerTimes()
    return
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      latitude.value = pos.coords.latitude
      longitude.value = pos.coords.longitude
      fetchPrayerTimes()
    },
    () => {
      fallbackLocation()
      fetchPrayerTimes()
    }
  )
}

function fallbackLocation() {
  // Makkah fallback
  latitude.value = 21.4225
  longitude.value = 39.8262
}

/* ---------------- FETCH PRAYER TIMES ---------------- */

async function fetchPrayerTimes() {
  try {
    pending.value = true

    const cacheKey = `home_prayer_${latitude.value}_${longitude.value}_${today}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
      data.value = JSON.parse(cached)
      pending.value = false
      return
    }

    const response = await $fetch(
      `https://api.aladhan.com/v1/timings/${today}`,
      {
        params: {
          latitude: latitude.value,
          longitude: longitude.value,
          method: 2,
        },
      }
    )

    data.value = response
    localStorage.setItem(cacheKey, JSON.stringify(response))
  } catch (e) {
    console.error('Failed to fetch prayer times', e)
  } finally {
    pending.value = false
  }
}

/* ---------------- NEXT PRAYER ---------------- */

const nextPrayer = computed(() => {
  if (!data.value) return null

  const now = new Date()

  const upcoming = prayerOrder
    .map(prayer => {
      const [h, m] = data.value.data.timings[prayer].split(':').map(Number)
      const d = new Date()
      d.setHours(h, m, 0, 0)
      return { prayer, time: d }
    })
    .filter(p => p.time > now)
    .sort((a, b) => a.time - b.time)

  return upcoming[0]?.prayer || 'Fajr'
})

/* ---------------- COUNTDOWN ---------------- */

function updateCountdown() {
  if (!data.value || !nextPrayer.value) return

  const now = new Date()
  const [h, m] =
    data.value.data.timings[nextPrayer.value].split(':').map(Number)

  const target = new Date()
  target.setHours(h, m, 0, 0)

  if (target < now) target.setDate(target.getDate() + 1)

  const diff = target - now

  const hrs = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)

  countdown.value = `${hrs}h ${mins}m ${secs}s`
}

/* ---------------- FORMAT ---------------- */

function format12h(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)

  const d = new Date()
  d.setHours(h, m, 0, 0)

  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

</script>
<style scoped>
.v-skeleton-loader {
  border-radius: 14px;
}

.home-container {
  padding-bottom: 80px;
}

/* Resume Card */
.resume-card {
  margin-bottom: 20px;
}

.surah-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.ayah-info {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-bottom: 8px;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 20px;
}

.action-card {
  text-align: center;
  padding: 20px 0;
  cursor: pointer;
}

.action-label {
  margin-top: 6px;
  font-size: 0.9rem;
}

/* Ayah Card */
.ayah-card {
  margin-bottom: 20px;
}

.ayah-content {
  text-align: center;
}

.ayah-arabic {
  font-size: 1.6rem;
  line-height: 2.6rem;
  font-family: 'Amiri', serif;
}

.ayah-translation {
  margin-top: 10px;
  font-size: 0.9rem;
  opacity: 0.75;
}

.ayah-actions {
  justify-content: center;
}

/* Audio Player */
.audio-card {
  position: sticky;
  bottom: 70px;
}

.audio-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.audio-info {
  flex: 1;
}

.reciter {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

/* Summary Card */
.prayer-summary {
  padding: 12px;
}

.hijri-date {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 6px;
}

.current-prayer {
  font-size: 1rem;
  margin-bottom: 4px;
}

.countdown {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Prayer Times */
.prayer-times-card {
  margin-bottom: 20px;
}

.prayer-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.prayer-pill {
  min-width: 90px;
  padding: 10px;
  border-radius: 14px;
  text-align: center;
  background: rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.prayer-pill.active {
  background: linear-gradient(135deg, #1f7a63, #145a4a);
  color: #ffffff;
}

.prayer-name {
  font-size: 0.85rem;
  opacity: 0.8;
}

.prayer-time {
  font-size: 1rem;
  font-weight: 600;
}

.v-theme--dark .prayer-pill {
  background: rgba(255, 255, 255, 0.08);
}
</style>