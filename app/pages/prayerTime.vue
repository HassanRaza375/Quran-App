<template>
    <v-container>
        <!-- Header -->
        <v-row>
            <v-col cols="12" class="text-center mb-4">
                <h1 class="text-h4 font-weight-bold">Prayer Times</h1>
                <p class="text-subtitle-1">Find accurate prayer times for your location</p>

                <!-- Hijri Date -->
                <v-alert color="info" variant="tonal" class="mb-2 text-center">
                    🕌 {{ data?.data?.date?.hijri?.date }}
                    — {{ data?.data?.date?.hijri?.month?.en }}
                </v-alert>

                <!-- Countdown -->
                <v-alert color="success" variant="tonal" class="mb-2 text-center">
                    ⏳ Next prayer in: <strong>{{ countdown }}</strong>
                </v-alert>

                <!-- Qibla -->
                <v-alert color="deep-purple" variant="tonal" class="mb-2 text-center">
                    🧭 Qibla Direction: <strong>{{ qibla?.toFixed(1) }}°</strong>
                </v-alert>
            </v-col>
        </v-row>

        <!-- Loading -->
        <v-row v-if="pending">
            <v-col v-for="n in 5" :key="n" cols="12" sm="6" md="4">
                <v-skeleton-loader type="card" />
            </v-col>
        </v-row>

        <!-- Error -->
        <v-row v-if="error">
            <v-col cols="12">
                <v-alert type="error" variant="tonal">{{ error }}</v-alert>
            </v-col>
        </v-row>

        <!-- Prayer Cards -->
        <v-row dense v-if="data">
            <v-col v-for="prayer in prayerOrder" :key="prayer" cols="12" sm="6" md="4">
                <v-card :elevation="3" :class="{
                    'bg-primary text-white': prayer === nextPrayer,
                    hoverable: prayer !== nextPrayer
                }" class="pa-4 d-flex flex-column align-center justify-center">
                    <v-icon size="36" class="mb-2">
                        {{ icons[prayer] || 'mdi-clock-outline' }}
                    </v-icon>

                    <div class="text-h6 font-weight-bold">
                        {{ prayer }}
                        <span v-if="prayer === nextPrayer" class="text-caption">
                            (Next)
                        </span>
                    </div>

                    <div class="text-h5">
                        {{ format12h(data.data.timings[prayer]) }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Refresh -->
        <v-row class="mt-4">
            <v-col cols="12" class="text-center">
                <v-btn color="primary" @click="fetchPrayerTimes">
                    Refresh Prayer Times
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const latitude = ref(null)
const longitude = ref(null)

const data = ref(null)
const pending = ref(true)
const error = ref(null)
const countdown = ref('')
const qibla = ref(null)

const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

const icons = {
    Fajr: 'mdi-weather-sunset-up',
    Dhuhr: 'mdi-weather-sunny',
    Asr: 'mdi-weather-partly-cloudy',
    Maghrib: 'mdi-weather-sunset-down',
    Isha: 'mdi-weather-night'
}

let countdownTimer
let autoRefreshTimer

onMounted(() => {
    getLocation()
    countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
    clearInterval(countdownTimer)
    clearTimeout(autoRefreshTimer)
})

/* ---------------- LOCATION ---------------- */

function getLocation() {
    if (!navigator.geolocation) {
        fallbackLocation()
        return
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            latitude.value = pos.coords.latitude
            longitude.value = pos.coords.longitude
            calculateQibla(latitude.value, longitude.value)
            fetchPrayerTimes()
        },
        () => {
            fallbackLocation()
            fetchPrayerTimes()
        }
    )
}

function fallbackLocation() {
    latitude.value = 21.4225
    longitude.value = 39.8262
}

/* ---------------- FETCH + CACHE ---------------- */

const cacheKey = computed(() =>
    `prayer_${latitude.value}_${longitude.value}_${today}`
)

async function fetchPrayerTimes() {
    try {
        pending.value = true
        error.value = null

        const cached = localStorage.getItem(cacheKey.value)
        if (cached) {
            data.value = JSON.parse(cached)
            pending.value = false
            scheduleAutoRefresh()
            return
        }

        data.value = await $fetch(
            `https://api.aladhan.com/v1/timings/${today}`,
            {
                params: {
                    latitude: latitude.value,
                    longitude: longitude.value,
                    method: 2
                }
            }
        )

        localStorage.setItem(cacheKey.value, JSON.stringify(data.value))

        scheduleAutoRefresh()
    } catch (err) {
        error.value = 'Failed to load prayer times'
        console.error(err)
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

/* ---------------- AUTO REFRESH ---------------- */

function scheduleAutoRefresh() {
    if (!data.value || !nextPrayer.value) return

    const now = new Date()
    const [h, m] =
        data.value.data.timings[nextPrayer.value].split(':').map(Number)

    const nextTime = new Date()
    nextTime.setHours(h, m, 5, 0)

    if (nextTime < now) nextTime.setDate(nextTime.getDate() + 1)

    clearTimeout(autoRefreshTimer)
    autoRefreshTimer = setTimeout(fetchPrayerTimes, nextTime - now)
}

/* ---------------- QIBLA ---------------- */

function calculateQibla(lat, lng) {
    const kaabaLat = (21.4225 * Math.PI) / 180
    const kaabaLng = (39.8262 * Math.PI) / 180

    lat = (lat * Math.PI) / 180
    lng = (lng * Math.PI) / 180

    const y = Math.sin(kaabaLng - lng)
    const x =
        Math.cos(lat) * Math.tan(kaabaLat) -
        Math.sin(lat) * Math.cos(kaabaLng - lng)

    let angle = (Math.atan2(y, x) * 180) / Math.PI
    qibla.value = (angle + 360) % 360
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
        hour12: true
    })
}
</script>

<style scoped>
.hoverable:hover {
    transform: scale(1.05);
    transition: 0.2s ease-in-out;
}
</style>
