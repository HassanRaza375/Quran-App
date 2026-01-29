<template>
    <v-container>
        <!-- Header -->
        <v-row>
            <v-col cols="12" class="text-center mb-4">
                <h1 class="text-h4 font-weight-bold">Prayer Times</h1>
                <p class="text-subtitle-1">Find accurate prayer times for your location</p>
            </v-col>
        </v-row>

        <!-- Loading / Error -->
        <v-row>
            <template v-if="pending">
                <v-col v-for="n in 11" :key="n" cols="12" sm="6" md="4" lg="3" xl="2">
                    <v-skeleton-loader type="card" />
                </v-col>
            </template>
            <v-col cols="12" v-if="error">
                <v-alert type="error" variant="tonal">{{ error }}</v-alert>
            </v-col>
        </v-row>

        <!-- Prayer Cards -->
        <v-row dense>
            <v-col v-for="(time, prayer) in data?.data?.timings" :key="prayer" cols="12" sm="6" md="4">
                <v-card :elevation="3" :class="{
                    'bg-primary text-white': prayer === nextPrayer,
                    'hoverable': prayer !== nextPrayer
                }" class="pa-4 d-flex flex-column align-center justify-center">
                    <v-icon size="36" class="mb-2">
                        {{ icons[prayer] || 'mdi-clock-outline' }}
                    </v-icon>
                    <div class="text-h6 font-weight-bold text-center">{{ prayer }}<span v-if="!prayer === nextPrayer"
                            class="text-caption mt-2">Next Prayer</span></div>
                    <div class="text-h5">{{ time }}</div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Refresh Button -->
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
import { tr } from 'vuetify/locale'

const latitude = ref(null)
const longitude = ref(null)

const data = ref(null)
const pending = ref(true)
const error = ref(null)

const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-')

// Prayer icons (Material Design)
const icons = {
    Fajr: 'mdi-weather-sunset-up',
    Dhuhr: 'mdi-weather-sunny',
    Asr: 'mdi-weather-partly-cloudy',
    Maghrib: 'mdi-weather-sunset-down',
    Isha: 'mdi-weather-night',
}

// Get geolocation
onMounted(() => getLocation())

function getLocation() {
    if (!navigator.geolocation) {
        error.value = 'Geolocation not supported'
        fallbackLocation()
        return
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
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
    latitude.value = 21.4225
    longitude.value = 39.8262
}

// Fetch prayer times
async function fetchPrayerTimes() {
    try {
        pending.value = true
        error.value = null

        data.value = await $fetch(`https://api.aladhan.com/v1/timings/${today}`, {
            params: {
                latitude: latitude.value,
                longitude: longitude.value,
                method: 2,
            },
        })
    } catch (err) {
        console.error(err)
        error.value = 'Failed to load prayer times'
    } finally {
        pending.value = false
    }
}

// Compute next prayer
const nextPrayer = computed(() => {
    if (!data.value) return null
    const now = new Date()
    const timings = data.value.data.timings

    // Convert HH:mm string to Date object
    const upcoming = Object.entries(timings)
        .map(([prayer, time]) => {
            const [hours, minutes] = time.split(':').map(Number)
            const d = new Date()
            d.setHours(hours, minutes, 0, 0)
            return { prayer, time: d }
        })
        .filter(p => p.time > now)
        .sort((a, b) => a.time - b.time)

    return upcoming[0]?.prayer || 'Fajr' // if all passed, next is Fajr tomorrow
})
</script>



<style scoped>
.hoverable:hover {
    transform: scale(1.05);
    transition: 0.2s ease-in-out;
}
</style>
